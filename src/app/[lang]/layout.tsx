import { Header } from '@/components/header'
import { getDictionary } from '@/lib/dictionaries'
import { Locale } from '@/i18n.config'

export async function generateMetadata({ params: { lang } }: { params: { lang: Locale }}) {
  const dict = await getDictionary(lang)
  return {
    title: {
      default: dict.main.title,
      template: `%s | ${dict.main.title}`
    },
    description: dict.main.subtitle,
    // Add hreflang tags
    alternates: {
      canonical: `/${lang}`,
      languages: {
        'en': '/en',
        'es': '/es',
        'fr': '/fr',
        'x-default': '/en'
      }
    }
  }
}

export default async function LangLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode
  params: { lang: Locale }
}) {
  const dict = await getDictionary(lang)
  return (
    <div className="relative flex min-h-screen flex-col">
      <Header lang={lang} dict={dict.header} />
      <div className="flex-1">{children}</div>
    </div>
  )
}
