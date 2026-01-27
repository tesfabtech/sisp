'use client'

import { useRef, useState } from 'react'
import axios from '@/lib/axios'
import { KnowledgeHub, KnowledgeType, KnowledgeStatus } from './types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  ImageIcon,
} from 'lucide-react'

type Props = {
  initialData?: Partial<KnowledgeHub>
  onSuccess?: () => void
}

const knowledgeTypes: KnowledgeType[] = [
  'technology',
  'business',
  'design',
  'marketing',
  'finance',
  'career',
  'other',
]

export default function KnowledgeCreateForm({
  initialData = {},
  onSuccess,
}: Props) {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('admin_token')
      : null

  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(
  initialData.image
    ? `http://localhost:8000/storage/${initialData.image}`
    : null
)


  const descriptionRef = useRef<HTMLDivElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    title: initialData.title ?? '',
    short_description: initialData.short_description ?? '',
    type: initialData.type ?? 'technology',
    max_read_time: initialData.max_read_time ?? 5,
    status: initialData.status ?? 'draft',
    file: null as File | null,
    image: null as File | null,
  })

  /* ───────── Description State (FIX) ───────── */
  const [description, setDescription] = useState(
    initialData.description || ''
  )

  /* ───────── Rich Text Actions ───────── */
  const exec = (cmd: string) => {
    document.execCommand(cmd)
    descriptionRef.current?.focus()
  }

 /* ───────── Submit ───────── */
const submit = async () => {
  if (!token) return
  setLoading(true)

  try {
    const data = new FormData()

    data.append('title', form.title)
    data.append('short_description', form.short_description)
    data.append('description', description)
    data.append('type', form.type)
    data.append('max_read_time', String(form.max_read_time))
    data.append('status', form.status)

    if (form.file) data.append('file', form.file)
    if (form.image) data.append('image', form.image)

    const isEdit = Boolean(initialData.id)

    const url = isEdit
      ? `/admin/knowledge/${initialData.id}`
      : '/admin/knowledge'

    await axios.post(url, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })

    onSuccess?.()
  } finally {
    setLoading(false)
  }
}




  return (
    <div className="space-y-6 max-w-3xl">

      {/* ───────── Image Banner Upload ───────── */}
      <div
        onClick={() => imageInputRef.current?.click()}
        className="relative h-48 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 cursor-pointer overflow-hidden bg-muted flex items-center justify-center"
      >
        {imagePreview ? (
          <img
            src={imagePreview}
            alt="Banner"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <ImageIcon size={32} />
            <p className="text-sm">
              Click to upload banner image
            </p>
          </div>
        )}

        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={e => {
            const file = e.target.files?.[0]
            if (!file) return
            setForm(p => ({ ...p, image: file }))
            setImagePreview(URL.createObjectURL(file))
          }}
        />
      </div>

      {/* ───────── Title ───────── */}
      <Input
        placeholder="Title"
        value={form.title}
        onChange={e =>
          setForm(p => ({ ...p, title: e.target.value }))
        }
      />

      {/* ───────── Short Description ───────── */}
      <Textarea
        placeholder="Short description"
        value={form.short_description}
        onChange={e =>
          setForm(p => ({
            ...p,
            short_description: e.target.value,
          }))
        }
      />

      {/* ───────── Rich Text Editor ───────── */}
      <div className="space-y-2">
        <label className="text-sm font-medium">
          Full Description
        </label>

        {/* Toolbar */}
        <div className="flex gap-1">
          <Button type="button" size="icon" variant="ghost" onClick={() => exec('bold')}>
            <Bold size={14} />
          </Button>
          <Button type="button" size="icon" variant="ghost" onClick={() => exec('italic')}>
            <Italic size={14} />
          </Button>
          <Button type="button" size="icon" variant="ghost" onClick={() => exec('insertUnorderedList')}>
            <List size={14} />
          </Button>
          <Button type="button" size="icon" variant="ghost" onClick={() => exec('insertOrderedList')}>
            <ListOrdered size={14} />
          </Button>
        </div>

        {/* Editor (FIXED & BIGGER) */}
        <div
          ref={descriptionRef}
          contentEditable
          suppressContentEditableWarning
          onInput={e =>
            setDescription((e.target as HTMLDivElement).innerHTML)
          }
          className="min-h-105 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-base leading-relaxed focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white dark:bg-gray-900"
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>

      {/* ───────── Type ───────── */}
      <Select
        value={form.type}
        onValueChange={(v: KnowledgeType) =>
          setForm(p => ({ ...p, type: v }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Type" />
        </SelectTrigger>

        <SelectContent>
          {knowledgeTypes.map(type => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* ───────── Read Time ───────── */}
      <Input
        type="number"
        min={1}
        placeholder="Max read time (minutes)"
        value={form.max_read_time}
        onChange={e =>
          setForm(p => ({
            ...p,
            max_read_time: Number(e.target.value),
          }))
        }
      />

      {/* ───────── Status ───────── */}
      <Select
        value={form.status}
        onValueChange={(v: KnowledgeStatus) =>
          setForm(p => ({ ...p, status: v }))
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="published">Published</SelectItem>
        </SelectContent>
      </Select>

      {/* ───────── PDF Upload ───────── */}
      <Input
        type="file"
        accept="application/pdf"
        onChange={e =>
          setForm(p => ({
            ...p,
            file: e.target.files?.[0] || null,
          }))
        }
      />

      {/* ───────── Submit ───────── */}
      <Button disabled={loading} onClick={submit} className="w-full">
        {loading ? 'Saving…' : 'Save Article'}
      </Button>
    </div>
  )
}
