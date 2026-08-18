"use client"

import { useState } from 'react'
import { Check, Clipboard } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Textarea } from './ui/textarea'
import { Badge } from './ui/badge'
import { cn } from '@/lib/utils'
import { PLATFORM_CHAR_LIMITS } from '@/lib/content-scenarios'

export type SocialOutputDict = {
  post_label: string
  hashtags_label: string
  copy_button: string
  copied_button: string
  char_limit_ok: string
  char_limit_exceeded: string
}

interface SocialOutputDisplayProps {
  scenarioId: string
  post: string
  hashtags: string[]
  dict: SocialOutputDict
}

export function SocialOutputDisplay({ scenarioId, post, hashtags, dict }: SocialOutputDisplayProps) {
  const [postText, setPostText] = useState(post)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copy = (field: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const limit = PLATFORM_CHAR_LIMITS[scenarioId]
  const overLimit = limit ? postText.length > limit : false

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle className="font-headline text-xl">{dict.post_label}</CardTitle>
          {limit && (
            <span className={cn('text-xs font-medium shrink-0', overLimit ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground')}>
              {postText.length}/{limit} {overLimit ? `— ${dict.char_limit_exceeded}` : `— ${dict.char_limit_ok}`}
            </span>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
            className={cn('min-h-[200px] resize-y', overLimit && 'border-red-500 focus-visible:ring-red-500')}
          />
          <Button variant="outline" size="sm" onClick={() => copy('post', postText)}>
            {copiedField === 'post' ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Clipboard className="mr-2 h-4 w-4" />}
            {copiedField === 'post' ? dict.copied_button : dict.copy_button}
          </Button>
        </CardContent>
      </Card>

      {hashtags.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl">{dict.hashtags_label}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {hashtags.map((tag, i) => (
                <Badge key={i} variant="secondary">#{tag}</Badge>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copy('hashtags', hashtags.map((t) => `#${t}`).join(' '))}
            >
              {copiedField === 'hashtags' ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Clipboard className="mr-2 h-4 w-4" />}
              {copiedField === 'hashtags' ? dict.copied_button : dict.copy_button}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
