import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth/apiMiddleware'
import { streamClaudeMessage, selectClaudeModel, estimateCost } from '@/lib/ai/claude-client'
import { assembleValisContext, getOrCreateValisConversation } from '@/lib/ai/valis-context'
import type { AIModel } from '@prisma/client'

const sendMessageSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  conversationId: z.string().optional(),
})

// POST /api/chat/stream - Send message to VALIS and get streaming response
export const POST = withAuth(async (request, { auth }) => {
  try {
    const body = await request.json()
    const result = sendMessageSchema.safeParse(body)

    if (!result.success) {
      return new Response(
        JSON.stringify({ success: false, error: result.error.flatten() }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { message, conversationId: providedConversationId } = result.data

    // Get or create conversation
    const conversationId =
      providedConversationId || (await getOrCreateValisConversation(auth.userId))

    // Save user message
    await prisma.message.create({
      data: {
        conversationId,
        senderId: auth.userId,
        senderType: 'USER',
        content: message,
        contentType: 'TEXT',
      },
    })

    // Assemble context
    const context = await assembleValisContext(auth.userId, conversationId)

    // Select model
    const model = selectClaudeModel(message)

    // Create readable stream for SSE
    const encoder = new TextEncoder()
    let fullResponse = ''
    let inputTokens = 0
    let outputTokens = 0

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Send initial metadata
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'start',
                conversationId,
                model,
              })}\n\n`
            )
          )

          // Stream Claude response
          for await (const chunk of streamClaudeMessage(
            [...context.conversationHistory, { role: 'user', content: message }],
            {
              model,
              systemPrompt: context.systemPrompt,
              maxTokens: 1000,
              temperature: 0.7,
            }
          )) {
            fullResponse += chunk
            outputTokens += Math.ceil(chunk.length / 4) // Rough token estimate

            // Send chunk
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: 'chunk',
                  content: chunk,
                })}\n\n`
              )
            )
          }

          // Estimate input tokens (rough approximation)
          inputTokens = Math.ceil(
            (context.systemPrompt.length + message.length) / 4
          )

          // Save VALIS response to database
          const valisMessage = await prisma.message.create({
            data: {
              conversationId,
              senderId: null,
              senderType: 'VALIS',
              content: fullResponse,
              contentType: 'TEXT',
              metadata: {
                model: `claude-${model}`,
                inputTokens,
                outputTokens,
                streaming: true,
              },
            },
          })

          // Update conversation
          await prisma.conversation.update({
            where: { id: conversationId },
            data: { lastMessageAt: new Date() },
          })

          // Track usage
          const costUSD = estimateCost(inputTokens, outputTokens, model)

          await prisma.aIUsage.create({
            data: {
              userId: auth.userId,
              employeeType: 'VALIS',
              model: model.toUpperCase() as AIModel,
              inputTokens,
              outputTokens,
              costUSD,
              conversationId,
              taskType: 'chat',
            },
          })

          // Send completion event
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'done',
                messageId: valisMessage.id,
                usage: {
                  inputTokens,
                  outputTokens,
                },
              })}\n\n`
            )
          )

          controller.close()
        } catch (error) {
          console.error('Streaming error:', error)
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'error',
                message:
                  'Stream interrupted. Please try sending your message again.',
              })}\n\n`
            )
          )
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat stream error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to initiate streaming response',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
