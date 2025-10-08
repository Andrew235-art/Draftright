
import { Locale } from '@/i18n.config'
import { getDictionary } from '@/lib/dictionaries'

export default async function PrivacyPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dict = await getDictionary(lang)

  return (
    <div className="container mx-auto max-w-4xl py-12">
      <article className="prose dark:prose-invert">
        <h1 className="mb-8">{dict.footer.privacy}</h1>
        
        <p className="mb-4">
          Your privacy is important to us. This Privacy Policy explains how DraftSense handles your information when you use our email generation service. Our core privacy principle is simple: we do not store your email drafts or the inputs you provide to create them.
        </p>

        <h2 className="mb-4">Information We Process</h2>
        <p className="mb-4">
          To provide our service, we need to process the information you enter into our forms. This includes the scenario you choose, the contextual details, and the desired tone. This information is processed solely for the purpose of generating your email draft.
        </p>
        <ul className="list-disc pl-5 mb-4">
          <li><strong>Input Data:</strong> The information you provide in the form fields is sent directly to our underlying generative model to create your email draft. We do not save, log, or store this information on our servers after the draft is generated and sent to you.</li>
          <li><strong>No User Accounts:</strong> We do not require you to create an account, so we do not collect personal information like your name, email address, or password.</li>
          <li><strong>Usage Data:</strong> We may collect anonymous data about how you interact with our service, such as which scenarios are most popular, to help us improve the application. This data is aggregated and cannot be used to identify you.</li>
        </ul>

        <h2 className="mb-4">How We Use Your Information</h2>
        <p className="mb-4">
          The data you provide is used exclusively to generate the email draft you requested. It is processed in real-time and is not used for any other purpose, such as training models or marketing. Because we do not store your data, we cannot share it with anyone.
        </p>

        <h2 className="mb-4">Third-Party Services</h2>
        <p className="mb-4">
          Our email generation is powered by Google's generative AI models. The input data you provide is sent to Google for processing. We encourage you to review Google's Privacy Policy to understand how they handle data.
        </p>
        
        <h2 className="mb-4">Security</h2>
        <p className="mb-4">
          We take reasonable measures to protect the information you provide during transit between your browser and our servers. However, since we do not store your data, the risk of a data breach from our systems is significantly minimized.
        </p>
      </article>
    </div>
  )
}
