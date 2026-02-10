const SLA_HOURS: Record<string, number> = {
  URGENT: 4,
  HIGH: 24,
  MEDIUM: 72,
  LOW: 168, // 1 week
}

export function calculateSlaDeadline(priority: string, from?: Date): Date {
  const hours = SLA_HOURS[priority] ?? SLA_HOURS.MEDIUM
  const start = from ?? new Date()
  return new Date(start.getTime() + hours * 60 * 60 * 1000)
}

export function isSlaBreached(deadline: Date | null): boolean {
  if (!deadline) return false
  return new Date() > deadline
}
