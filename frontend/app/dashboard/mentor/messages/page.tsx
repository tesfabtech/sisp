// app/dashboard/mentor/messages/page.tsx

import MentorHeader from '@/components/mentor/header'
import MentorSidebar from '@/components/mentor/sidebar'
import MentorMessages from '@/components/mentor/messages'

export default function MentorMessagesPage() {
  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-[#020617]">
      <MentorSidebar />

      <div className="flex-1 flex flex-col">
        <MentorHeader />
        <MentorMessages />
      </div>
    </div>
  )
}
