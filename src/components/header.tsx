import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'
import { LangSwitcher } from './lang-switcher'
import { Locale } from '@/i18n.config'

type HeaderProps = {
  lang: Locale
  dict: {
    title: string
    lang: string
  }
}

export function Header({ lang, dict }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href={`/${lang}`} className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:inline-block font-headline">{dict.title}</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <LangSwitcher lang={lang} dict={{ lang: dict.lang }} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
