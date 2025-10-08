import { FileText, LayoutGrid, Sparkles } from 'lucide-react'

type HowItWorksProps = {
  dict: {
    title: string
    step1_title: string
    step1_description: string
    step2_title: string
    step2_description: string
    step3_title: string
    step3_description: string
  }
}

export function HowItWorks({ dict }: HowItWorksProps) {
  const steps = [
    {
      icon: LayoutGrid,
      title: dict.step1_title,
      description: dict.step1_description,
    },
    {
      icon: FileText,
      title: dict.step2_title,
      description: dict.step2_description,
    },
    {
      icon: Sparkles,
      title: dict.step3_title,
      description: dict.step3_description,
    },
  ]

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold text-center mb-10 font-headline">{dict.title}</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, index) => {
          const Icon = step.icon
          return (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-primary/10 text-primary p-4 rounded-full">
                  <Icon className="w-8 h-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
