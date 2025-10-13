
"use client"

import { useState, useEffect, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { generateDraftAction } from '@/app/actions'
import { scenarios, ScenarioId, Scenario, FormFields } from '@/lib/scenarios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Loader2 } from 'lucide-react'
import { OutputDisplay } from './output-display'
import { useToast } from '@/hooks/use-toast'

type Step = 'scenario' | 'form' | 'result'
type Dictionary = any;

const ScenarioSelector = ({ dict, onSelect }: { dict: Dictionary, onSelect: (scenario: Scenario) => void }) => (
    <Card>
        <CardHeader>
            <CardTitle className="font-headline text-2xl">{dict.main.scenario_select_title}</CardTitle>
            <CardDescription>{dict.main.scenario_select_subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.values(scenarios).map((scenario) => {
                const Icon = scenario.icon;
                return (
                    <button
                        key={scenario.id}
                        onClick={() => onSelect(scenario)}
                        className="p-4 border rounded-lg text-left hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <Icon className="h-8 w-8 text-primary" />
                            <div>
                                <h3 className="font-semibold text-lg">{dict.scenarios[scenario.i18n_key].title}</h3>
                                <p className="text-sm text-muted-foreground">{dict.scenarios[scenario.i18n_key].description}</p>
                            </div>
                        </div>
                    </button>
                )
            })}
        </CardContent>
    </Card>
);

const renderFormField = (field: any, fieldName: FormFields, dict: Dictionary) => {
    const commonProps = {
        ...field,
        placeholder: dict.form_fields[fieldName].placeholder,
    }
    const useTextarea = ['key_achievements', 'progress_summary', 'blockers', 'next_steps', 'specific_questions', 'job_requirements', 'matching_skills'].includes(fieldName);

    if (useTextarea) {
        return <Textarea {...commonProps} />
    }
    return <Input {...commonProps} />
}


export function DraftForm({ dict, lang }: { dict: Dictionary; lang: string }) {
    const [step, setStep] = useState<Step>('scenario');
    const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
    const { toast } = useToast();
    const [draft, setDraft] = useState<string | undefined>(undefined);
    const [isPending, startTransition] = useTransition();
    
    const getDefaultValues = (scenario: Scenario | null) => {
        if (!scenario) return { tone: 'formal' };
        const defaultValues = scenario.fields.reduce((acc, field) => {
            acc[field] = '';
            return acc;
        }, {} as Record<string, string>);
        defaultValues.tone = 'formal';
        return defaultValues;
    }

    const form = useForm({
        resolver: zodResolver(selectedScenario?.formSchema || z.object({})),
        defaultValues: getDefaultValues(selectedScenario),
        mode: 'onChange'
    });

    const onSubmit = (values: z.infer<typeof selectedScenario.formSchema>) => {
      if (!selectedScenario) return;

      const formData = new FormData();
      formData.append('scenarioId', selectedScenario.id);
      formData.append('language', lang);
      formData.append('tone', values.tone);

      for (const field of selectedScenario.fields) {
          formData.append(field, values[field] || '');
      }
      
      startTransition(async () => {
          const result = await generateDraftAction(formData);
          if (result.error) {
              toast({
                  variant: "destructive",
                  title: dict.main.error_toast.title,
                  description: result.error,
              });
          } else if (result.draft) {
              setDraft(result.draft);
              setStep('result');
          }
      });
  };

    const handleScenarioSelect = (scenario: Scenario) => {
        setSelectedScenario(scenario);
        form.reset(getDefaultValues(scenario));
        setStep('form');
    };

    const handleStartOver = () => {
        setStep('scenario');
        setSelectedScenario(null);
        setDraft(undefined);
        form.reset({});
    }

    if (step === 'scenario') {
        return <ScenarioSelector dict={dict} onSelect={handleScenarioSelect} />;
    }

    if (step === 'result' && draft) {
        return (
            <div className="space-y-8">
                <OutputDisplay draft={draft} dict={dict.main} />
                 <div className="flex justify-start">
                    <Button type="button" variant="outline" onClick={handleStartOver}>
                        {dict.main.start_over_button}
                    </Button>
                </div>
            </div>
        );
    }
    
    if (step === 'form' && selectedScenario) {
        return (
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">{dict.main.form_title}</CardTitle>
                            <CardDescription>{dict.scenarios[selectedScenario.i18n_key].title}</CardDescription>
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
                                            <FormControl>
                                                {renderFormField(field, fieldName, dict)}
                                            </FormControl>
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
                                                            <RadioGroupItem value={tone} id={tone} />
                                                        </FormControl>
                                                        <FormLabel className="font-normal capitalize cursor-pointer" htmlFor={tone}>
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
                                dict.main.generate_button
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        )
    }

    return null;
}
