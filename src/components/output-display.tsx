"use client"

import { useState } from 'react'
import { Check, Clipboard } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { cn } from '@/lib/utils'

interface OutputDisplayProps {
  draft: string
  dict: {
    output_title: string
    copy_button: string
    copied_button: string
  }
}

export function OutputDisplay({ draft, dict }: OutputDisplayProps) {
  const [hasCopied, setHasCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(draft)
    setHasCopied(true)
    setTimeout(() => setHasCopied(false), 2000)
  }

  return (
    <Card className="w-full animate-in fade-in-50 duration-500">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <CardTitle className="font-headline text-2xl">{dict.output_title}</CardTitle>
        <Button onClick={copyToClipboard} variant="outline" size="sm" className="w-full sm:w-[140px]">
          {hasCopied ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-500" />
              {dict.copied_button}
            </>
          ) : (
            <>
              <Clipboard className="mr-2 h-4 w-4" />
              {dict.copy_button}
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            'min-h-[300px] w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-base ring-offset-background md:text-sm whitespace-pre-wrap'
          )}
        >
          {draft}
        </div>
      </CardContent>
    </Card>
  )
}
