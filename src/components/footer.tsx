import Link from 'next/link'
import { Locale } from '@/i18n.config'

type FooterProps = {
  lang: Locale
  dict: {
    copyright: string
    privacy: string
    terms: string
  }
}

export function Footer({ lang, dict }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40">
      <div className="container flex flex-col items-center justify-between gap-4 py-6 md:h-20 md:flex-row md:py-0">
        <div className="text-center text-sm text-muted-foreground md:text-left">
          <p>&copy; {currentYear} {dict.copyright}</p>
        </div>
        <nav className="flex items-center gap-4 text-sm text-muted-foreground">
          <Link href={`/${lang}/terms-of-use`} className="transition-colors hover:text-foreground">
            {dict.terms}
          </Link>
          <Link href={`/${lang}/privacy`} className="transition-colors hover:text-foreground">
            {dict.privacy}
          </Link>
        </nav>
      </div>
    </footer>
  )
}
