"use client"

import { useState, useTransition } from 'react'
import { useForm, Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { generateContentDraftAction, ContentSuccessState } from '@/app/content-actions'
import { contentScenarios, ContentScenarioId, ContentScenario, ContentFormFields } from '@/lib/content-scenarios'
import { tones } from '@/lib/scenarios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Loader2 } from 'lucide-react'
import { BlogOutputDisplay, BlogOutputDict } from './blog-output-display'
import { SocialOutputDisplay, SocialOutputDict } from './social-output-display'
import { useToast } from '@/hooks/use-toast'

type Step = 'scenario' | 'form' | 'result'
type Dictionary = any;

const TEXTAREA_FIELDS = ['key_points']

const ScenarioSelector = ({ dict, onSelect }: { dict: Dictionary; onSelect: (scenario: ContentScenario) => void }) => (
  <Card>
    <CardHeader>
      <CardTitle className="font-headline text-2xl">{dict.content.scenario_select_title}</CardTitle>
      <CardDescription>{dict.content.scenario_select_subtitle}</CardDescription>
    </CardHeader>
    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.values(contentScenarios).map((scenario) => {
        const Icon = scenario.icon
        return (
          <button
            key={scenario.id}
            onClick={() => onSelect(scenario)}
            className="p-4 border rounded-lg text-left hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          >
            <div className="flex items-center gap-4">
              <Icon className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold text-lg">{dict.content.scenarios[scenario.i18n_key].title}</h3>
                <p className="text-sm text-muted-foreground">{dict.content.scenarios[scenario.i18n_key].description}</p>
              </div>
            </div>
          </button>
        )
      })}
    </CardContent>
  </Card>
)

const renderFormField = (field: any, fieldName: ContentFormFields, dict: Dictionary) => {
  const commonProps = {
    ...field,
    placeholder: dict.form_fields[fieldName].placeholder,
  }
  if (TEXTAREA_FIELDS.includes(fieldName)) {
    return <Textarea {...commonProps} />
  }
  return <Input {...commonProps} />
}

export function ContentForm({ dict, lang }: { dict: Dictionary; lang: string }) {
  const [step, setStep] = useState<Step>('scenario')
  const [selectedScenario, setSelectedScenario] = useState<ContentScenario | null>(null)
  const { toast } = useToast()
  const [result, setResult] = useState<ContentSuccessState | null>(null)
  const [submittedKeyword, setSubmittedKeyword] = useState('')
  const [isPending, startTransition] = useTransition()

  const getDefaultValues = (scenario: ContentScenario | null) => {
    if (!scenario) return { tone: 'formal' }
    const defaultValues = scenario.fields.reduce((acc, field) => {
      acc[field] = ''
      return acc
    }, {} as Record<string, string>)
    defaultValues.tone = 'formal'
    return defaultValues
  }

  const toneSchema = z.object({ tone: z.enum(tones) })
  const form = useForm<Record<string, string>>({
    resolver: zodResolver(
      selectedScenario ? selectedScenario.formSchema.extend(toneSchema.shape) : toneSchema
    ) as unknown as Resolver<Record<string, string>>,
    defaultValues: getDefaultValues(selectedScenario),
    mode: 'onChange',
  })

  const onSubmit = (values: Record<string, string>) => {
    if (!selectedScenario) return

    const formData = new FormData()
    formData.append('scenarioId', selectedScenario.id)
    formData.append('language', lang)
    formData.append('tone', values.tone)

    for (const field of selectedScenario.fields) {
      formData.append(field, values[field] || '')
    }

    setSubmittedKeyword(values.target_keyword || '')

    startTransition(async () => {
      const actionResult = await generateContentDraftAction(formData)
      if ('error' in actionResult) {
        toast({
          variant: 'destructive',
          title: dict.main.error_toast.title,
          description: actionResult.error,
        })
      } else {
        setResult(actionResult)
        setStep('result')
      }
    })
  }

  const handleScenarioSelect = (scenario: ContentScenario) => {
    setSelectedScenario(scenario)
    form.reset(getDefaultValues(scenario))
    setStep('form')
  }

  const handleStartOver = () => {
    setStep('scenario')
    setSelectedScenario(null)
    setResult(null)
    form.reset({})
  }

  if (step === 'scenario') {
    return <ScenarioSelector dict={dict} onSelect={handleScenarioSelect} />
  }

  if (step === 'result' && result && selectedScenario) {
    return (
      <div className="space-y-8">
        <h2 className="font-headline text-2xl font-bold">{dict.content.output_title}</h2>
        {result.type === 'blog' ? (
          <BlogOutputDisplay
            titleOptions={result.titleOptions}
            metaDescription={result.metaDescription}
            body={result.body}
            targetKeyword={submittedKeyword}
            dict={dict.content.blog_output as BlogOutputDict}
          />
        ) : (
          <SocialOutputDisplay
            scenarioId={selectedScenario.id}
            post={result.post}
            hashtags={result.hashtags}
            dict={dict.content.social_output as SocialOutputDict}
          />
        )}
        <div className="flex justify-start">
          <Button type="button" variant="outline" onClick={handleStartOver}>
            {dict.main.start_over_button}
          </Button>
        </div>
      </div>
    )
  }

  if (step === 'form' && selectedScenario) {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">{dict.content.form_title}</CardTitle>
              <CardDescription>{dict.content.scenarios[selectedScenario.i18n_key].title}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedScenario.fields.map((fieldName) => (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={fieldName}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dict.form_fields[fieldName].label}</FormLabel>
                      <FormControl>{renderFormField(field, fieldName, dict)}</FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">{dict.main.tone_title}</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="tone"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-wrap gap-4"
                        {...field}
                      >
                        {['formal', 'friendly', 'direct', 'humble'].map((tone) => (
                          <FormItem key={tone} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={tone} id={`content-${tone}`} />
                            </FormControl>
                            <FormLabel className="font-normal capitalize cursor-pointer" htmlFor={`content-${tone}`}>
                              {dict.main.tones[tone]}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-between items-center">
            <Button type="button" variant="ghost" onClick={handleStartOver}>
              {dict.main.back_button}
            </Button>
            <Button type="submit" disabled={isPending} size="lg">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {dict.main.generating_button}
                </>
              ) : (
                dict.content.generate_button
              )}
            </Button>
          </div>
        </form>
      </Form>
    )
  }

  return null
}
