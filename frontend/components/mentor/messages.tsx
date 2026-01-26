'use client'

import { useEffect, useState, useRef } from 'react'
import axios from '@/lib/axios'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'

type Startup = {
  id: number
  name: string
  owner: {
    name: string
  }
}

type Message = {
  id: number
  sender: 'mentor' | 'startup'
  content: string
  created_at: string
}

export default function MentorMessages() {
  const [startups, setStartups] = useState<Startup[]>([])
  const [activeStartup, setActiveStartup] = useState<Startup | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  /* -------------------------------
   * Initial Load: fetch startups the mentor is assigned to
   * ------------------------------- */
  useEffect(() => {
    fetchStartups()
  }, [])

/* -------------------------------
 * Load messages whenever activeStartup changes + polling
 * ------------------------------- */
useEffect(() => {
  if (!activeStartup) return

  fetchMessages(true) // true = replace all for first load

  const interval = setInterval(() => fetchMessages(false), 3000) // false = append new messages only
  return () => clearInterval(interval)
}, [activeStartup])

/* -------------------------------
 * Fetch messages from backend
 * ------------------------------- */
const fetchMessages = async (replaceAll = false) => {
  if (!activeStartup) return
  try {
    const res = await axios.get('/messages', {
      params: { startup_id: activeStartup.id, sender: 'mentor' },
    })
    const newMessages: Message[] = res.data

    if (replaceAll) {
      setMessages(newMessages)
      scrollToBottom()
    } else {
      // Append only messages that are not already in state
      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id))
        const filtered = newMessages.filter((m) => !existingIds.has(m.id))
        if (filtered.length === 0) return prev

        // If user is near bottom, scroll after appending
        const scrollContainer = scrollRef.current
        const nearBottom =
          scrollContainer &&
          scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < 100

        const updated = [...prev, ...filtered]

        if (nearBottom) {
          // Wait for next render
          setTimeout(() => scrollToBottom(), 50)
        }

        return updated
      })
    }
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
   * API: fetch startups with approved mentorship
   * ------------------------------- */
  const fetchStartups = async () => {
    try {
      const res = await axios.get('/mentor/my-accepted-startups')
      setStartups(res.data)
      setActiveStartup(res.data[0] ?? null)
    } catch {
      alert('Failed to load startups')
    } finally {
      setLoading(false)
    }
  }


  /* -------------------------------
   * Send new message
   * ------------------------------- */
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeStartup) return
    try {
      await axios.post('/messages', {
        startup_id: activeStartup.id,
        sender: 'mentor',
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
   * Clear all messages for the active startup
   * ------------------------------- */
  const handleClearHistory = async () => {
    if (!activeStartup) return
    if (!confirm('Are you sure you want to delete all messages for this startup?')) return
    try {
      await axios.delete(`/messages?startup_id=${activeStartup.id}`)
      setMessages([])
    } catch {
      alert('Failed to clear messages')
    }
  }

  /* -------------------------------
   * UI
   * ------------------------------- */
  return (
    <div className="flex flex-1 overflow-hidden bg-white dark:bg-gray-900">

      {/* Sidebar */}
      <aside className="w-72 border-r border-gray-200 dark:border-gray-700 p-3">
        <h2 className="text-sm font-semibold mb-2 text-gray-800 dark:text-gray-100">
          Your Startups
        </h2>

        {loading && <p className="text-xs text-gray-500">Loading...</p>}
        {!loading && !startups.length && <p className="text-xs text-gray-500">No approved startups</p>}

        <div className="space-y-1">
          {startups.map((startup) => (
            <button
              key={startup.id}
              onClick={() => setActiveStartup(startup)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition
                ${
                  activeStartup?.id === startup.id
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
            >
              {startup.name}
            </button>
          ))}
        </div>
      </aside>

      {/* Chat Area */}
      <section className="flex-1 flex flex-col">

        {/* Chat Header */}
        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-100 dark:bg-gray-800">
          <div>
            {activeStartup ? (
              <>
                <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                  {activeStartup.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-300">
                  Owner: {activeStartup.owner.name}
                </div>
              </>
            ) : (
              <div className="text-sm text-gray-500">
                Select a startup to start chatting
              </div>
            )}
          </div>

          {/* Clear History Button */}
          {activeStartup && (
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

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'mentor' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="relative">
                <div
                  className={`px-3 py-2 rounded-lg  max-w-xs break-words ${
                    msg.sender === 'mentor'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
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
            placeholder={`Message ${activeStartup?.name ?? ''}...`}
            className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-900 dark:text-white"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={!activeStartup}
          />
          <Button
            onClick={handleSendMessage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4"
            disabled={!activeStartup}
          >
            Send
          </Button>
        </div>
      </section>
    </div>
  )
}
