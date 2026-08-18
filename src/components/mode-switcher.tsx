"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { DraftForm } from '@/components/draft-form'
import { ContentForm } from '@/components/content-form'

type Dictionary = any

export function ModeSwitcher({ dict, lang }: { dict: Dictionary; lang: string }) {
  return (
    <Tabs defaultValue="email" className="w-full">
      <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
        <TabsTrigger value="email">{dict.mode.email_label}</TabsTrigger>
        <TabsTrigger value="content">{dict.mode.content_label}</TabsTrigger>
      </TabsList>
      <TabsContent value="email">
        <DraftForm dict={dict} lang={lang} />
      </TabsContent>
      <TabsContent value="content">
        <ContentForm dict={dict} lang={lang} />
      </TabsContent>
    </Tabs>
  )
}
