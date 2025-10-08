import { Locale } from '@/i18n.config'
import { getDictionary } from '@/lib/dictionaries'

export default async function TermsPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang)

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <article className="prose dark:prose-invert">
        <h1 className="mb-8">{dict.footer.terms}</h1>
        
        <p className="mb-4">
          This is a placeholder for your Terms of Use. You should replace this with your own terms. Terms of use (also known as terms of service, terms and conditions, and disclaimer) are the legal agreements between a service provider and a person who wants to use that service.
        </p>

        <h2 className="mb-4">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing and using our service, you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
        </p>

        <h2 className="mb-4">2. Service Description</h2>
        <p className="mb-4">
          Our service provides AI-generated email drafts for various scenarios. The service is provided "as is" and we assume no responsibility for the timeliness, deletion, mis-delivery or failure to store any user communications or personalization settings.
        </p>

        <h2 className="mb-4">3. User Conduct</h2>
        <p className="mb-4">
          You agree to not use the service to create any material that is unlawful, harmful, threatening, abusive, harassing, tortious, defamatory, vulgar, obscene, libelous, invasive of another's privacy, hateful, or racially, ethnically or otherwise objectionable.
        </p>

        <h2 className="mb-4">4. Disclaimer of Warranties</h2>
        <p className="mb-4">
          You expressly understand and agree that your use of the service is at your sole risk. The service is provided on an "as is" and "as available" basis.
        </p>
      </article>
    </div>
  )
}
