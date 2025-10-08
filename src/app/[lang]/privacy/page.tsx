import { Locale } from '@/i18n.config'
import { getDictionary } from '@/lib/dictionaries'

export default async function PrivacyPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang)

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <article className="prose dark:prose-invert">
        <h1>{dict.footer.privacy}</h1>
        <p>
          This is a placeholder for your Privacy Policy. You should replace this with your own policy.
        </p>
        <p>
          A privacy policy is a statement or a legal document that discloses some or all of the ways a party gathers, uses, discloses, and manages a customer or client's data. It fulfills a legal requirement to protect a customer or client's privacy.
        </p>
        <h2>Information We Collect</h2>
        <p>
          Our Privacy Policy page will help you understand what information we collect, why we collect it, and what we do with it.
        </p>
        <h2>How We Use Your Information</h2>
        <p>
          We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect our company and our users.
        </p>
      </article>
    </div>
  )
}
