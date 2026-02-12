import { EmployeeType, getEmployeePrompt } from './employee-prompts'

export interface ParsedMention {
  employeeType: EmployeeType
  taskDescription: string
  originalText: string
}

/**
 * Parse @mentions from a message
 * Returns array of mentions with employee types and task descriptions
 */
export function parseMentions(message: string): ParsedMention[] {
  const mentions: ParsedMention[] = []

  // Match @EmployeeName followed by text until next @mention or end
  const mentionRegex = /@(Mike|Sarah|Alex|Casey|LUMEN|Lumen|FLUX|Flux)([^@]*)/gi

  let match
  while ((match = mentionRegex.exec(message)) !== null) {
    const employeeName = match[1].toUpperCase() as EmployeeType
    const taskText = match[2].trim()

    // Skip if no task description
    if (!taskText) continue

    mentions.push({
      employeeType: employeeName,
      taskDescription: taskText,
      originalText: match[0],
    })
  }

  return mentions
}

/**
 * Check if user has access to an AI employee via subscription
 */
export async function checkEmployeeAccess(
  userId: string,
  employeeType: EmployeeType
): Promise<boolean> {
  // TODO: Implement actual subscription check when subscription system is complete
  // For now, allow all employees (development mode)
  return true

  /*
  // Example implementation:
  const { prisma } = await import('@/lib/prisma')

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: 'ACTIVE',
      plan: {
        // Check if plan includes this employee
        metadata: {
          path: ['employees'],
          array_contains: employeeType,
        },
      },
    },
  })

  return !!subscription
  */
}

/**
 * Build context for employee task execution
 */
export function buildEmployeeContext(
  employeeType: EmployeeType,
  taskDescription: string,
  userContext?: {
    company?: string
    industry?: string
    previousTasks?: Array<{ task: string; result: string }>
  }
): string {
  let context = getEmployeePrompt(employeeType)

  if (userContext) {
    context += '\n\n## Context About This Client\n'

    if (userContext.company) {
      context += `\nCompany: ${userContext.company}`
    }
    if (userContext.industry) {
      context += `\nIndustry: ${userContext.industry}`
    }

    if (userContext.previousTasks && userContext.previousTasks.length > 0) {
      context += '\n\n## Previous Tasks You\'ve Completed\n'
      userContext.previousTasks.slice(-3).forEach((task, index) => {
        context += `\n${index + 1}. Task: ${task.task}\n   Result: ${task.result.slice(0, 200)}...`
      })
    }
  }

  context += `\n\n## Current Task\n\n${taskDescription}\n\nProvide a complete, actionable deliverable for this task.`

  return context
}

/**
 * Extract task status from employee response
 * Look for keywords indicating completion, next steps, or blockers
 */
export function extractTaskStatus(response: string): {
  status: 'COMPLETED' | 'NEEDS_INPUT' | 'BLOCKED'
  reason?: string
} {
  const lowerResponse = response.toLowerCase()

  // Check for blockers
  if (
    lowerResponse.includes('i need more information') ||
    lowerResponse.includes('could you clarify') ||
    lowerResponse.includes('what is') ||
    lowerResponse.includes('please provide')
  ) {
    return {
      status: 'NEEDS_INPUT',
      reason: 'Employee needs more information to complete task',
    }
  }

  // Check for blockers
  if (
    lowerResponse.includes('unable to') ||
    lowerResponse.includes('cannot') ||
    lowerResponse.includes("don't have access")
  ) {
    return {
      status: 'BLOCKED',
      reason: 'Employee is blocked from completing task',
    }
  }

  // Default to completed
  return { status: 'COMPLETED' }
}

/**
 * Parse multiple @mentions and determine execution order
 * Returns tasks sorted by dependencies (if any)
 */
export function prioritizeTasks(mentions: ParsedMention[]): ParsedMention[] {
  // For now, return in order mentioned
  // Future: detect dependencies like "@Sarah research X, then @Casey write about it"
  return mentions
}
