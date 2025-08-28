'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Sparkles, LoaderCircle, BookOpen, Save } from 'lucide-react';
import { generateSermonOutline, GenerateSermonOutlineOutput } from '@/ai/flows/sermon-outline-flow';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { saveSermonOutline } from '@/actions/ai-creations';
import { useToast } from '@/hooks/use-toast';


export function SermonOutlineGenerator() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateSermonOutlineOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!topic) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const sermonResult = await generateSermonOutline({ topic });
      setResult(sermonResult);
    } catch (e) {
      setError('An error occurred while generating the sermon outline. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    if (!result) return;
    startTransition(async () => {
      const res = await saveSermonOutline({ sermonTitle: result.sermonTitle, outline: result.outline });
      if (res.success) {
        toast({ title: 'Success!', description: res.message });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: res.message });
      }
    });
  };

  return (
    <Card className="max-w-2xl">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="font-headline">Sermon Outline Generator</CardTitle>
          <CardDescription>
            Provide a topic to generate a structured sermon outline with key scriptures.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="topic">Sermon Topic</Label>
            <Input
              id="topic"
              placeholder="e.g., The Power of Forgiveness"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={loading}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading || !topic}>
            {loading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate Outline
          </Button>
        </CardFooter>
      </form>
      
      {error && (
        <div className="p-6 pt-0">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      {result && (
        <div className="p-6 pt-0">
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-headline text-lg">Generated Outline: {result.sermonTitle}</h3>
                 <Button onClick={handleSave} disabled={isPending}>
                    {isPending ? <LoaderCircle className="animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Save Sermon
                </Button>
            </div>

          <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
            {result.outline.map((point, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-left font-semibold">{point.pointTitle}</AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <p className="text-sm text-muted-foreground whitespace-pre-line">{point.content}</p>
                  {point.supportingVerses.length > 0 && (
                    <div>
                        <h4 className="font-medium text-xs mb-2 flex items-center gap-2"><BookOpen className="h-4 w-4" /> Supporting Verses</h4>
                        <div className="flex flex-wrap gap-2">
                            {point.supportingVerses.map(verse => (
                                <Button key={verse} variant="secondary" size="sm" asChild className="h-auto px-2 py-1 text-xs">
                                  <Link href={`/pastor/dashboard/bible?passage=${encodeURIComponent(verse)}`}>
                                    {verse}
                                  </Link>
                                </Button>
                            ))}
                        </div>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </Card>
  );
}
