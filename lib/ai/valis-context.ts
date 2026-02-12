import { prisma } from '@/lib/prisma'
import { VALIS_SYSTEM_PROMPT, getValisContextPrompt } from './valis-prompt'

export interface ValisContext {
  systemPrompt: string
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
}

/**
 * Assemble context for VALIS conversation
 * Includes system prompt, user profile, active services, and conversation history
 */
export async function assembleValisContext(
  userId: string,
  conversationId: string,
  maxHistoryMessages = 10
): Promise<ValisContext> {
  // Fetch user profile
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      company: true,
      industry: true,
      subscriptions: {
        where: { status: 'ACTIVE' },
        select: {
          plan: {
            select: { name: true },
          },
        },
      },
      projects: {
        where: {
          status: { in: ['IN_PROGRESS', 'REVIEW'] },
        },
        select: {
          title: true,
          status: true,
        },
        take: 5,
        orderBy: { updatedAt: 'desc' },
      },
    },
  })

  // Fetch conversation history
  const messages = await prisma.message.findMany({
    where: {
      conversationId,
      deletedAt: null,
    },
    orderBy: { createdAt: 'desc' },
    take: maxHistoryMessages,
    select: {
      senderType: true,
      content: true,
    },
  })

  // Reverse to get chronological order
  const conversationHistory = messages
    .reverse()
    .map((msg) => ({
      role: (msg.senderType === 'USER' || msg.senderType === 'ADMIN'
        ? 'user'
        : 'assistant') as 'user' | 'assistant',
      content: msg.content,
    }))
    // Exclude the last message if it's from user (it will be added by the API endpoint)
    .slice(0, -1)

  // Build context-specific prompt additions
  const contextPrompt = getValisContextPrompt({
    userName: user?.name || undefined,
    userCompany: user?.company || undefined,
    userIndustry: user?.industry || undefined,
    activeServices:
      user?.subscriptions.map((sub) => sub.plan.name) || [],
    recentProjects:
      user?.projects.map((p) => ({
        title: p.title,
        status: p.status,
      })) || [],
  })

  const systemPrompt = VALIS_SYSTEM_PROMPT + contextPrompt

  return {
    systemPrompt,
    conversationHistory,
  }
}

/**
 * Get or create a VALIS conversation for a user
 */
export async function getOrCreateValisConversation(
  userId: string
): Promise<string> {
  // Look for existing active VALIS conversation
  const existing = await prisma.conversation.findFirst({
    where: {
      userId,
      type: 'VALIS_CHAT',
      archived: false,
    },
    orderBy: { lastMessageAt: 'desc' },
  })

  if (existing) {
    return existing.id
  }

  // Create new conversation
  const conversation = await prisma.conversation.create({
    data: {
      userId,
      type: 'VALIS_CHAT',
      title: 'Chat with VALIS',
      participants: [userId],
    },
  })

  return conversation.id
}
