import { Locale } from '@/i18n.config'
import { getDictionary } from '@/lib/dictionaries'

export default async function PrivacyPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang)

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <article className="prose dark:prose-invert">
        <h1 className="mb-8">{dict.footer.privacy}</h1>
        
        <p className="mb-4">
          This is a placeholder for your Privacy Policy. You should replace this with your own policy. A privacy policy is a statement or a legal document that discloses some or all of the ways a party gathers, uses, discloses, and manages a customer or client's data. It fulfills a legal requirement to protect a customer or client's privacy.
        </p>

        <h2 className="mb-4">Information We Collect</h2>
        <p className="mb-4">
          Our Privacy Policy page will help you understand what information we collect, why we collect it, and what we do with it. We collect information to provide better services to all our users.
        </p>

        <h2 className="mb-4">How We Use Your Information</h2>
        <p className="mb-4">
          We use the information we collect from all of our services to provide, maintain, protect and improve them, to develop new ones, and to protect our company and our users. We also use this information to offer you tailored content.
        </p>

        <h2 className="mb-4">Information We Share</h2>
        <p className="mb-4">
          We do not share personal information with companies, organizations and individuals outside of our company unless one of the following circumstances applies.
        </p>

        <h2 className="mb-4">Security</h2>
        <p className="mb-4">
          We work hard to protect our users from unauthorized access to or unauthorized alteration, disclosure or destruction of information we hold.
        p>
      </article>
    </div>
  )
}
