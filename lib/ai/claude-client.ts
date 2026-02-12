import Anthropic from '@anthropic-ai/sdk'

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
})

export type ClaudeModel = 'haiku' | 'sonnet' | 'opus'

const MODEL_MAP: Record<ClaudeModel, string> = {
  haiku: 'claude-3-5-haiku-20241022',
  sonnet: 'claude-3-5-sonnet-20241022',
  opus: 'claude-opus-4-20250514',
}

export interface ClaudeMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ClaudeOptions {
  model?: ClaudeModel
  maxTokens?: number
  temperature?: number
  systemPrompt?: string
}

/**
 * Send a message to Claude and get a complete response
 */
export async function sendClaudeMessage(
  messages: ClaudeMessage[],
  options: ClaudeOptions = {}
): Promise<{
  content: string
  model: string
  usage: {
    inputTokens: number
    outputTokens: number
  }
}> {
  const {
    model = 'haiku',
    maxTokens = 1000,
    temperature = 0.7,
    systemPrompt,
  } = options

  try {
    const response = await anthropic.messages.create({
      model: MODEL_MAP[model],
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude')
    }

    return {
      content: content.text,
      model: response.model,
      usage: {
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
      },
    }
  } catch (error) {
    console.error('Claude API error:', error)
    throw new Error('Failed to get response from Claude API')
  }
}

/**
 * Stream a message from Claude for real-time responses
 */
export async function* streamClaudeMessage(
  messages: ClaudeMessage[],
  options: ClaudeOptions = {}
): AsyncGenerator<string, void, unknown> {
  const {
    model = 'haiku',
    maxTokens = 1000,
    temperature = 0.7,
    systemPrompt,
  } = options

  try {
    const stream = await anthropic.messages.stream({
      model: MODEL_MAP[model],
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    })

    for await (const chunk of stream) {
      if (
        chunk.type === 'content_block_delta' &&
        chunk.delta.type === 'text_delta'
      ) {
        yield chunk.delta.text
      }
    }
  } catch (error) {
    console.error('Claude API streaming error:', error)
    throw new Error('Failed to stream response from Claude API')
  }
}

/**
 * Determine which Claude model to use based on query complexity
 * Simple heuristics: length, keywords indicating complex tasks
 */
export function selectClaudeModel(userMessage: string): ClaudeModel {
  const complexityIndicators = [
    'analyze',
    'strategy',
    'recommend',
    'compare',
    'evaluate',
    'architecture',
    'design system',
    'business plan',
    'roadmap',
    'technical specification',
  ]

  const isComplex =
    userMessage.length > 500 ||
    complexityIndicators.some((indicator) =>
      userMessage.toLowerCase().includes(indicator)
    )

  return isComplex ? 'sonnet' : 'haiku'
}

/**
 * Calculate cost estimate for Claude API usage
 * Pricing as of 2024 (approximate):
 * - Haiku: $0.25/MTok input, $1.25/MTok output
 * - Sonnet: $3/MTok input, $15/MTok output
 * - Opus: $15/MTok input, $75/MTok output
 */
export function estimateCost(
  inputTokens: number,
  outputTokens: number,
  model: ClaudeModel
): number {
  const pricing: Record<
    ClaudeModel,
    { input: number; output: number }
  > = {
    haiku: { input: 0.25, output: 1.25 },
    sonnet: { input: 3, output: 15 },
    opus: { input: 15, output: 75 },
  }

  const { input, output } = pricing[model]
  const costUSD =
    (inputTokens / 1_000_000) * input + (outputTokens / 1_000_000) * output

  return costUSD
}
