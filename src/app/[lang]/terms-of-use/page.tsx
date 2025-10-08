import { Locale } from '@/i18n.config'
import { getDictionary } from '@/lib/dictionaries'

export default async function TermsPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang)

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <article className="prose dark:prose-invert">
        <h1>{dict.footer.terms}</h1>
        <p>
          This is a placeholder for your Terms of Use. You should replace this with your own terms.
        </p>
        <p>
          Terms of use (also known as terms of service, terms and conditions, and disclaimer) are the legal agreements between a service provider and a person who wants to use that service. The person must agree to abide by the terms of service in order to use the offered service.
        </p>
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using our service, you accept and agree to be bound by the terms and provision of this agreement.
        </p>
        <h2>2. Service Description</h2>
        <p>
          Our service provides AI-generated email drafts for various scenarios. The service is provided "as is" and we assume no responsibility for the timeliness, deletion, mis-delivery or failure to store any user communications or personalization settings.
        </p>
      </article>
    </div>
  )
}
