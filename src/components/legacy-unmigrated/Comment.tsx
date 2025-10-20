// Copyright 2025 Zentrum für Digitale Souveränität der Öffentlichen Verwaltung (ZenDiS) GmbH.
// SPDX-License-Identifier: MIT

import {Comment} from '@prisma/client'
import {FunctionComponent, useEffect, useState} from 'react'
import Markdown from 'react-markdown'
import remarkGemoji from 'remark-gemoji'
import remarkGfm from 'remark-gfm'
import {Serialized} from '../../common'
import {Loader2} from 'lucide-react'
import MarkdownEditor from './MarkdownEditor'
import {Button} from '../ui/button'
import {ArrowUturnLeftIcon, PencilSquareIcon, XMarkIcon} from '@heroicons/react/24/solid'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog'
import {getCurrentUser} from '@/svc/authService'
import {t} from 'nextra/dist/types-BhjhW0gX'

function timeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

  const interval = Math.floor(seconds / 31536000)

  if (interval > 1) {
    return `vor ${interval} Jahren`
  }
  if (interval === 1) {
    return `vor ${interval} Jahr`
  }

  const months = Math.floor(seconds / 2628000)
  if (months > 1) {
    return `vor ${months} Monaten`
  }
  if (months === 1) {
    return `vor ${months} Monat`
  }

  const days = Math.floor(seconds / 86400)
  if (days > 1) {
    return `vor ${days} Tagen`
  }
  if (days === 1) {
    return `vor ${days} Tag`
  }

  const hours = Math.floor(seconds / 3600)
  if (hours > 1) {
    return `vor ${hours} Stunden`
  }
  if (hours === 1) {
    return `vor ${hours} Stunde`
  }

  const minutes = Math.floor(seconds / 60)
  if (minutes > 1) {
    return `vor ${minutes} Minuten`
  }
  if (minutes === 1) {
    return `vor ${minutes} Minute`
  }

  return `vor ${Math.max(1, Math.floor(seconds))} Sekunden`
}

const authorName = (name: string | null) => {
  if (name) {
    return name
  }
  return 'Anonym'
}

const NameAndDate = ({isReply, ...comment}: Serialized<Comment> & {isReply?: boolean}) => {
  return (
    <div className="flex flex-row items-center gap-2">
      {isReply && <ArrowUturnLeftIcon className="text-gray-500 h-4 w-4 rotate-180" />}
      <div className="">
        <strong>{authorName(comment.authorName)}</strong>
      </div>
    </div>
  )
}

const CommentItem: FunctionComponent<{
  comment: Serialized<Comment>
  projectUrl: string
  childComment: boolean
  onAnswer?: () => void
  onDelete: (commentId: string) => Promise<void>
  onSave: (commentId: string, content: string) => Promise<void>
  currentUserId?: string
}> = ({comment, projectUrl, childComment, onDelete, onSave, onAnswer, currentUserId}) => {
  const [edit, setEdit] = useState<boolean>(false)

  const [commentContent, setComment] = useState<string>(comment.content)
  const [alertOpen, setAlertOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleDelete = () => {
    setAlertOpen(false)
    onDelete(comment.id)
  }

  const handleSave = async () => {
    setLoading(true)
    if (commentContent === comment.content) {
      setEdit(false)
      return
    }

    try {
      await onSave(comment.id, commentContent)
      setEdit(false)
    } catch (error) {
      console.error('Error saving comment:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div id={comment.id} className={`${childComment ? 'ml-6 -mt-2' : ''} text-base bg-white basis-full`}>
      <AlertDialog open={alertOpen} onOpenChange={open => setAlertOpen(open)}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader></AlertDialogHeader>
          <AlertDialogTitle>Kommentar löschen</AlertDialogTitle>
          <AlertDialogDescription>
            Sind Sie sicher, dass Sie das Kommentar Löschen möchten?
            <br />
            Das Löschen eines Kommentar löscht den jeweiligen <strong>gesamten</strong> Diskussionsverlauf.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <Button onClick={() => setAlertOpen(false)} variant="outline">
              Zurück
            </Button>
            <Button onClick={handleDelete} variant="default">
              Löschen
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex flex-row gap-2">
        <div className="prose flex-1 rounded-sm border p-4">
          <div className="mb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="border-b border-gray-200 pb-2 pr-2">
              <NameAndDate {...comment} isReply={childComment} />
            </div>
            {!edit && !comment.authorId?.startsWith('gitlab') && !!currentUserId && (
              <div className="flex flex-row justify-end gap-0 pl-0 sm:pl-4 max-sm:py-2">
                {onAnswer && (
                  <Button variant={'ghost'} size={'icon'} onClick={onAnswer}>
                    <ArrowUturnLeftIcon className="size-16" />
                  </Button>
                )}
                {comment.authorId === currentUserId && (
                  <>
                    <Button
                      variant={'ghost'}
                      size={'icon'}
                      onClick={() => {
                        setEdit(true)
                      }}
                    >
                      <PencilSquareIcon className="size-16" />
                    </Button>
                    <Button size={'icon'} variant={'ghost'} onClick={() => setAlertOpen(true)}>
                      <XMarkIcon className="size-16" />
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
          {edit ? (
            <div>
              <MarkdownEditor placeholder="Schreibe ein Kommentar..." markdown={commentContent} onChange={setComment} />
              <div className="mt-4 flex flex-row justify-end gap-2">
                <Button variant="secondary" onClick={handleSave}>
                  {loading ? (
                    <span className="flex flex-row items-center gap-2">
                      <Loader2 size={16} className="animate-spin" />
                      Wird gespeichert
                    </span>
                  ) : (
                    'Speichern'
                  )}
                </Button>
                <Button variant="default" onClick={() => setEdit(false)}>
                  Abbrechen
                </Button>
              </div>
            </div>
          ) : (
            <>
              <Markdown remarkPlugins={[remarkGfm, remarkGemoji]}>{comment.content}</Markdown>
              <div>
                {comment.gitlabCommentId && (
                  <span className="flex flex-col items-end justify-end">
                    <span className="text-xs text-muted">{timeAgo(new Date(comment.createdAt))}</span>
                    <a
                      href={`${projectUrl}/-/issues/${comment.gitlabIssueId}#note_${comment.gitlabCommentId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-bund hover:text-bund/80 underline text-xs "
                    >
                      Kommentar auf openCode ansehen
                    </a>
                  </span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CommentItem
