"use client"

import { useMemo, useState } from 'react'
import { Check, X, Clipboard, Link2 } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Textarea } from './ui/textarea'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { cn } from '@/lib/utils'
import { SEO_TITLE_RANGE, SEO_META_DESCRIPTION_RANGE } from '@/lib/content-scenarios'

type LengthStatus = 'short' | 'good' | 'long'

function getLengthStatus(length: number, range: { min: number; max: number }): LengthStatus {
  if (length < range.min) return 'short'
  if (length > range.max) return 'long'
  return 'good'
}

function LengthIndicator({ length, range, shortLabel, goodLabel, longLabel }: {
  length: number
  range: { min: number; max: number }
  shortLabel: string
  goodLabel: string
  longLabel: string
}) {
  const status = getLengthStatus(length, range)
  const message =
    status === 'short'
      ? `${length}/${range.max} — ${shortLabel} (${range.min - length} more to reach the minimum of ${range.min})`
      : status === 'long'
      ? `${length}/${range.max} — ${longLabel} (${length - range.max} over the limit)`
      : `${length}/${range.max} — ${goodLabel}`

  return (
    <p
      className={cn(
        'text-xs mt-1 font-medium',
        status === 'good' && 'text-emerald-600 dark:text-emerald-400',
        status === 'short' && 'text-amber-600 dark:text-amber-400',
        status === 'long' && 'text-red-600 dark:text-red-400'
      )}
    >
      {message}
    </p>
  )
}

function KeywordCheckItem({ label, passed }: { label: string; passed: boolean }) {
  return (
    <li className="flex items-center gap-2 text-sm">
      {passed ? (
        <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
      ) : (
        <X className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
      )}
      <span className={passed ? 'text-foreground' : 'text-muted-foreground'}>{label}</span>
    </li>
  )
}

export type BlogOutputDict = {
  title_label: string
  title_options_label: string
  meta_description_label: string
  body_label: string
  keyword_checklist_title: string
  keyword_in_title: string
  keyword_in_meta: string
  keyword_in_intro: string
  keyword_in_heading: string
  placeholders_internal_links: string
  placeholders_sources: string
  copy_button: string
  copied_button: string
  length_short: string
  length_good: string
  length_long: string
}

interface BlogOutputDisplayProps {
  titleOptions: string[]
  metaDescription: string
  body: string
  targetKeyword: string
  dict: BlogOutputDict
}

export function BlogOutputDisplay({ titleOptions, metaDescription, body, targetKeyword, dict }: BlogOutputDisplayProps) {
  const [selectedTitle, setSelectedTitle] = useState(titleOptions[0] ?? '')
  const [meta, setMeta] = useState(metaDescription)
  const [articleBody, setArticleBody] = useState(body)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copy = (field: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const keywordChecks = useMemo(() => {
    const keyword = targetKeyword.trim().toLowerCase()
    if (!keyword) {
      return { inTitle: false, inMeta: false, inIntro: false, inHeading: false }
    }
    const introWords = articleBody.split(/\s+/).slice(0, 100).join(' ').toLowerCase()
    const headings = articleBody
      .split('\n')
      .filter((line) => /^#{2,3}\s/.test(line.trim()))
      .join(' ')
      .toLowerCase()

    return {
      inTitle: selectedTitle.toLowerCase().includes(keyword),
      inMeta: meta.toLowerCase().includes(keyword),
      inIntro: introWords.includes(keyword),
      inHeading: headings.includes(keyword),
    }
  }, [targetKeyword, selectedTitle, meta, articleBody])

  const placeholderCounts = useMemo(() => {
    const internalLinks = (articleBody.match(/\[Internal link:/g) || []).length
    const sources = (articleBody.match(/\[Source needed:/g) || []).length
    return { internalLinks, sources }
  }, [articleBody])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">{dict.title_label}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {titleOptions.length > 1 && (
            <RadioGroup value={selectedTitle} onValueChange={setSelectedTitle} className="space-y-2">
              {titleOptions.map((title, i) => (
                <div key={i} className="flex items-start gap-2">
                  <RadioGroupItem value={title} id={`title-${i}`} className="mt-1" />
                  <label htmlFor={`title-${i}`} className="text-sm cursor-pointer">{title}</label>
                </div>
              ))}
            </RadioGroup>
          )}
          <Textarea
            value={selectedTitle}
            onChange={(e) => setSelectedTitle(e.target.value)}
            className="resize-none"
            rows={2}
          />
          <LengthIndicator
            length={selectedTitle.length}
            range={SEO_TITLE_RANGE}
            shortLabel={dict.length_short}
            goodLabel={dict.length_good}
            longLabel={dict.length_long}
          />
          <Button variant="outline" size="sm" onClick={() => copy('title', selectedTitle)}>
            {copiedField === 'title' ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Clipboard className="mr-2 h-4 w-4" />}
            {copiedField === 'title' ? dict.copied_button : dict.copy_button}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">{dict.meta_description_label}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea value={meta} onChange={(e) => setMeta(e.target.value)} className="resize-none" rows={3} />
          <LengthIndicator
            length={meta.length}
            range={SEO_META_DESCRIPTION_RANGE}
            shortLabel={dict.length_short}
            goodLabel={dict.length_good}
            longLabel={dict.length_long}
          />
          <Button variant="outline" size="sm" onClick={() => copy('meta', meta)}>
            {copiedField === 'meta' ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Clipboard className="mr-2 h-4 w-4" />}
            {copiedField === 'meta' ? dict.copied_button : dict.copy_button}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">{dict.keyword_checklist_title}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <KeywordCheckItem label={dict.keyword_in_title} passed={keywordChecks.inTitle} />
            <KeywordCheckItem label={dict.keyword_in_meta} passed={keywordChecks.inMeta} />
            <KeywordCheckItem label={dict.keyword_in_intro} passed={keywordChecks.inIntro} />
            <KeywordCheckItem label={dict.keyword_in_heading} passed={keywordChecks.inHeading} />
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-xl">{dict.body_label}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {(placeholderCounts.internalLinks > 0 || placeholderCounts.sources > 0) && (
            <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {placeholderCounts.internalLinks > 0 && (
                <span className="flex items-center gap-1">
                  <Link2 className="h-3.5 w-3.5" /> {dict.placeholders_internal_links.replace('{count}', String(placeholderCounts.internalLinks))}
                </span>
              )}
              {placeholderCounts.sources > 0 && (
                <span className="flex items-center gap-1">
                  {dict.placeholders_sources.replace('{count}', String(placeholderCounts.sources))}
                </span>
              )}
            </p>
          )}
          <Textarea
            value={articleBody}
            onChange={(e) => setArticleBody(e.target.value)}
            className="min-h-[400px] font-mono text-sm resize-y"
          />
          <Button variant="outline" size="sm" onClick={() => copy('body', articleBody)}>
            {copiedField === 'body' ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Clipboard className="mr-2 h-4 w-4" />}
            {copiedField === 'body' ? dict.copied_button : dict.copy_button}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
