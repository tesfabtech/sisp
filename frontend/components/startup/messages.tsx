'use client'

import { useEffect, useState, useRef } from 'react'
import axios from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

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
  sender: 'mentor' | 'startup'
  content: string
  created_at: string
}

type Props = {
  startup: Startup
  mentor: Mentor
}

export default function Messages({ startup, mentor }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)

  /* -------------------------------
   * Load messages whenever startup or mentor changes + polling
   * ------------------------------- */
  useEffect(() => {
    if (!startup || !mentor) return

    fetchMessages(true) // initial load: replace all and scroll

    const interval = setInterval(() => fetchMessages(false), 3000) // append new messages
    return () => clearInterval(interval)
  }, [startup, mentor])

  /* -------------------------------
   * Fetch messages from backend
   * ------------------------------- */
  const fetchMessages = async (replaceAll = false) => {
    if (!startup?.id || !mentor?.id) return
    try {
      const res = await axios.get('/messages', {
        params: { startup_id: startup.id, mentor_id: mentor.id },
      })
      const newMessages: Message[] = res.data

      setMessages((prev) => {
        if (replaceAll) {
          scrollToBottom()
          return newMessages
        }

        const existingIds = new Set(prev.map((m) => m.id))
        const filtered = newMessages.filter((m) => !existingIds.has(m.id))
        if (filtered.length === 0) return prev

        const scrollContainer = scrollRef.current
        const nearBottom =
          scrollContainer &&
          scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < 100

        const updated = [...prev, ...filtered]

        if (nearBottom) setTimeout(() => scrollToBottom(), 50)

        return updated
      })
    } catch {
      alert('Failed to load messages')
    }
  }

  /* -------------------------------
   * Scroll helper
   * ------------------------------- */
  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }

  /* -------------------------------
   * Send new message
   * ------------------------------- */
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !mentor?.id || !startup?.id) return
    try {
      await axios.post('/messages', {
        startup_id: startup.id,
        mentor_id: mentor.id,
        sender: 'startup',
        content: newMessage,
      })
      setNewMessage('')
      fetchMessages()
    } catch {
      alert('Failed to send message')
    }
  }

  /* -------------------------------
   * Delete individual message
   * ------------------------------- */
  const handleDeleteMessage = async (messageId: number) => {
    if (!confirm('Delete this message?')) return
    try {
      await axios.delete(`/messages/${messageId}`)
      setMessages(messages.filter((msg) => msg.id !== messageId))
    } catch {
      alert('Failed to delete message')
    }
  }

  /* -------------------------------
   * Clear all messages
   * ------------------------------- */
  const handleClearHistory = async () => {
    if (!startup || !mentor) return
    if (!confirm('Are you sure you want to delete all messages with this mentor?')) return
    try {
      await axios.delete(`/messages?startup_id=${startup.id}&mentor_id=${mentor.id}`)
      setMessages([])
    } catch {
      alert('Failed to clear messages')
    }
  }

  /* -------------------------------
   * UI
   * ------------------------------- */
  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">

      {/* Chat header */}
      <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-100 dark:bg-gray-800">
        <div>
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            {startup.name}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-300">
            Mentor: {mentor?.name ?? 'No mentor assigned'}
          </div>
        </div>

        {/* Clear History */}
        {mentor && (
          <Button
            variant="destructive"
            size="sm"
            className="text-xs"
            onClick={handleClearHistory}
          >
            Clear History
          </Button>
        )}
      </div>

      {/* Chat messages */}
      <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'mentor' ? 'justify-start' : 'justify-end'}`}
          >
            <div className="relative">
              <div
                className={`px-3 py-2 rounded-lg max-w-xs wrap-break-word ${
                  msg.sender === 'mentor'
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    : 'bg-blue-600 text-white'
                }`}
              >
                {msg.content}
                <div className="text-[10px] text-gray-400 mt-1 text-right">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              {/* Delete individual message */}
              <button
                onClick={() => handleDeleteMessage(msg.id)}
                className="absolute -top-2 -right-2 p-1 rounded-full hover:bg-red-200 dark:hover:bg-red-700 transition"
                title="Delete message"
              >
                <Trash2 className="h-3 w-3 text-red-600 dark:text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex gap-2 bg-gray-50 dark:bg-gray-800">
        <input
          type="text"
          placeholder={`Message ${mentor?.name ?? 'mentor'}...`}
          className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          disabled={!mentor}
        />
        <Button
          onClick={handleSendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4"
          disabled={!mentor}
        >
          Send
        </Button>
      </div>
    </div>
  )
}
