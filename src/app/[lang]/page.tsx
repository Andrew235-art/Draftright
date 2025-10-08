import { Locale } from '@/i18n.config'
import { getDictionary } from '@/lib/dictionaries'
import { DraftForm } from '@/components/draft-form'
import { HowItWorks } from '@/components/how-it-works'

export default async function Home({
  params: { lang },
}: {
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/60 bg-clip-text text-transparent mb-2">
          {dict.main.title}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {dict.main.subtitle}
        </p>
      </header>

      <HowItWorks dict={dict.how_it_works} />

      <DraftForm dict={dict} lang={lang} />
    </div>
  )
}
