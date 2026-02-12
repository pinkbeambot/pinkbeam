import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth/apiMiddleware'
import { sendClaudeMessage, selectClaudeModel, estimateCost } from '@/lib/ai/claude-client'
import { assembleValisContext, getOrCreateValisConversation } from '@/lib/ai/valis-context'

const sendMessageSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  conversationId: z.string().optional(),
})

// POST /api/chat/message - Send message to VALIS and get complete response
export const POST = withAuth(async (request, { auth }) => {
  try {
    const body = await request.json()
    const result = sendMessageSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    const { message, conversationId: providedConversationId } = result.data

    // Get or create conversation
    const conversationId =
      providedConversationId || (await getOrCreateValisConversation(auth.userId))

    // Save user message
    const userMessage = await prisma.message.create({
      data: {
        conversationId,
        senderId: auth.userId,
        senderType: 'USER',
        content: message,
        contentType: 'TEXT',
      },
    })

    // Assemble context (system prompt + conversation history)
    const context = await assembleValisContext(auth.userId, conversationId)

    // Select appropriate model based on query complexity
    const model = selectClaudeModel(message)

    // Get response from Claude
    const response = await sendClaudeMessage(
      [...context.conversationHistory, { role: 'user', content: message }],
      {
        model,
        systemPrompt: context.systemPrompt,
        maxTokens: 1000,
        temperature: 0.7,
      }
    )

    // Save VALIS response
    const valisMessage = await prisma.message.create({
      data: {
        conversationId,
        senderId: null, // VALIS has no senderId
        senderType: 'VALIS',
        content: response.content,
        contentType: 'TEXT',
        metadata: {
          model: response.model,
          inputTokens: response.usage.inputTokens,
          outputTokens: response.usage.outputTokens,
        },
      },
    })

    // Update conversation lastMessageAt
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    })

    // Track AI usage for cost monitoring
    const costUSD = estimateCost(
      response.usage.inputTokens,
      response.usage.outputTokens,
      model
    )

    await prisma.aIUsage.create({
      data: {
        userId: auth.userId,
        employeeType: 'VALIS',
        model: model.toUpperCase() as any,
        inputTokens: response.usage.inputTokens,
        outputTokens: response.usage.outputTokens,
        costUSD,
        conversationId,
        taskType: 'chat',
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        message: valisMessage,
        conversationId,
        usage: response.usage,
        model: response.model,
      },
    })
  } catch (error) {
    console.error('Chat message error:', error)

    // Return graceful fallback
    return NextResponse.json(
      {
        success: false,
        error:
          'I encountered an issue processing your message. Please try again or contact support if the problem persists.',
      },
      { status: 500 }
    )
  }
})
