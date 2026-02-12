import { Metadata } from 'next'
import { ChatPanel } from '@/components/chat/ChatPanel'

export const metadata: Metadata = {
  title: 'Chat — Pink Beam Portal',
  description: 'Chat with VALIS and your AI employees',
}

export default function ChatPage() {
  return <ChatPanel defaultState="fullpage" />
}
