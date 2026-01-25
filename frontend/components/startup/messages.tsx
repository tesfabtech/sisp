'use client'

import { useEffect, useState, useRef } from 'react'
import { Button } from '@/components/ui/button'

type Startup = {
  id: number
  name: string
}

type Mentor = {
  id: number
  name: string
  profile_image?: string
} | null

type Message = {
  id: number
  from: 'mentor' | 'startup'
  content: string
  timestamp: string
}

type Props = {
  startup: Startup
  mentor: Mentor
}

export default function Messages({ startup, mentor }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchMessages()
  }, [mentor])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages])

  const fetchMessages = async () => {
    // TODO: Replace with real API call for this startup + mentor
    setMessages([
      { id: 1, from: 'mentor', content: 'Hello, how can I help?', timestamp: '10:00 AM' },
      { id: 2, from: 'startup', content: 'I have a question about my project', timestamp: '10:02 AM' },
    ])
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    const msg: Message = {
      id: Date.now(),
      from: 'startup',
      content: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages((prev) => [...prev, msg])
    setNewMessage('')
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Chat header with startup + mentor */}
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-100 dark:bg-gray-800">
        <div>
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">{startup.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-300">
            Mentor: {mentor ? mentor.name : 'No mentor assigned'}
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2" ref={scrollRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.from === 'mentor' ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-xs wrap-break-word ${
                msg.from === 'mentor'
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                  : 'bg-blue-600 text-white'
              }`}
            >
              {msg.content}
              <div className="text-[10px] text-gray-500 mt-1 text-right">{msg.timestamp}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Message input */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex gap-2 bg-gray-50 dark:bg-gray-800">
        <input
          type="text"
          placeholder={`Message ${mentor?.name ?? 'mentor'}...`}
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <Button onClick={handleSendMessage} className="bg-blue-600 hover:bg-blue-700 text-white px-4">
          Send
        </Button>
      </div>
    </div>
  )
}
