import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { withAuth } from '@/lib/auth/apiMiddleware'
import { sendClaudeMessage, estimateCost } from '@/lib/ai/claude-client'
import {
  parseMentions,
  checkEmployeeAccess,
  buildEmployeeContext,
  extractTaskStatus,
} from '@/lib/ai/task-delegation'
import { MessageSenderType } from '@prisma/client'

const delegateSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  conversationId: z.string().min(1, 'Conversation ID is required'),
})

// POST /api/chat/delegate - Parse @mentions and delegate tasks to AI employees
export const POST = withAuth(async (request, { auth }) => {
  try {
    const body = await request.json()
    const result = delegateSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error.flatten() },
        { status: 400 }
      )
    }

    const { message, conversationId } = result.data

    // Parse @mentions
    const mentions = parseMentions(message)

    if (mentions.length === 0) {
      return NextResponse.json({
        success: true,
        data: {
          tasksCreated: 0,
          message: 'No @mentions found in message',
        },
      })
    }

    // Verify conversation access
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      select: { userId: true, type: true },
    })

    if (!conversation || conversation.userId !== auth.userId) {
      return NextResponse.json(
        { success: false, error: 'Conversation not found or access denied' },
        { status: 404 }
      )
    }

    // Get user context
    const user = await prisma.user.findUnique({
      where: { id: auth.userId },
      select: { company: true, industry: true },
    })

    // Process each mention
    const results = []

    for (const mention of mentions) {
      try {
        // Check if user has access to this employee
        const hasAccess = await checkEmployeeAccess(auth.userId, mention.employeeType)

        if (!hasAccess) {
          // Send error message to conversation
          await prisma.message.create({
            data: {
              conversationId,
              senderId: null,
              senderType: 'SYSTEM',
              content: `❌ You don't have access to ${mention.employeeType}. Upgrade your plan to use this AI employee.`,
              contentType: 'TEXT',
            },
          })

          results.push({
            employee: mention.employeeType,
            status: 'access_denied',
          })
          continue
        }

        // Build employee context
        const employeeContext = buildEmployeeContext(
          mention.employeeType,
          mention.taskDescription,
          {
            company: user?.company || undefined,
            industry: user?.industry || undefined,
          }
        )

        // Execute task with Claude
        const response = await sendClaudeMessage(
          [
            {
              role: 'user',
              content: mention.taskDescription,
            },
          ],
          {
            model: 'sonnet', // Use Sonnet for employee tasks (higher quality)
            systemPrompt: employeeContext,
            maxTokens: 2000,
            temperature: 0.7,
          }
        )

        // Determine task status
        const taskStatus = extractTaskStatus(response.content)

        // Save employee response to conversation
        const employeeMessage = await prisma.message.create({
          data: {
            conversationId,
            senderId: null,
            senderType: 'AGENT' as MessageSenderType,
            agentType: mention.employeeType,
            content: response.content,
            contentType: 'TASK_RESULT',
            metadata: {
              taskDescription: mention.taskDescription,
              model: response.model,
              inputTokens: response.usage.inputTokens,
              outputTokens: response.usage.outputTokens,
              taskStatus: taskStatus.status,
            },
          },
        })

        // Update conversation
        await prisma.conversation.update({
          where: { id: conversationId },
          data: { lastMessageAt: new Date() },
        })

        // Track AI usage
        const costUSD = estimateCost(
          response.usage.inputTokens,
          response.usage.outputTokens,
          'sonnet'
        )

        await prisma.aIUsage.create({
          data: {
            userId: auth.userId,
            employeeType: mention.employeeType,
            model: 'SONNET',
            inputTokens: response.usage.inputTokens,
            outputTokens: response.usage.outputTokens,
            costUSD,
            conversationId,
            taskType: 'delegation',
            requestData: {
              task: mention.taskDescription,
            },
          },
        })

        results.push({
          employee: mention.employeeType,
          status: 'completed',
          messageId: employeeMessage.id,
          taskStatus: taskStatus.status,
        })
      } catch (error) {
        console.error(`Error delegating to ${mention.employeeType}:`, error)

        // Send error message to conversation
        await prisma.message.create({
          data: {
            conversationId,
            senderId: null,
            senderType: 'SYSTEM',
            content: `⚠️ ${mention.employeeType} encountered an error processing your task. Please try again.`,
            contentType: 'TEXT',
          },
        })

        results.push({
          employee: mention.employeeType,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        tasksCreated: mentions.length,
        results,
      },
    })
  } catch (error) {
    console.error('Task delegation error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process task delegation' },
      { status: 500 }
    )
  }
})
