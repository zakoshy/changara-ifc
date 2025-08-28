'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Sparkles, LoaderCircle, Save } from 'lucide-react';
import { generateEventIdeas, GenerateEventIdeasOutput } from '@/ai/flows/event-idea-flow';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { saveEventIdea } from '@/actions/ai-creations';
import { useToast } from '@/hooks/use-toast';

function SaveButton({ idea }: { idea: { title: string; description: string; } }) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const handleSave = () => {
    startTransition(async () => {
      const result = await saveEventIdea(idea);
      if (result.success) {
        toast({ title: 'Success!', description: result.message });
      } else {
        toast({ variant: 'destructive', title: 'Error', description: result.message });
      }
    });
  };

  return (
    <Button size="sm" variant="secondary" onClick={handleSave} disabled={isPending}>
      {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
      Save Idea
    </Button>
  );
}

export function EventIdeaGenerator() {
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [ideas, setIdeas] = useState<GenerateEventIdeasOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!keywords) return;

    setLoading(true);
    setError(null);
    setIdeas(null);

    try {
      const result = await generateEventIdeas({ keywords });
      setIdeas(result);
    } catch (e) {
      setError('An error occurred while generating ideas. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle className="font-headline">Event Idea Generator</CardTitle>
          <CardDescription>
            Enter a few keywords (e.g., &quot;youth outreach&quot;, &quot;community fundraiser&quot;) to brainstorm some event ideas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              placeholder="e.g., summer, youth, music"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              disabled={loading}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Generate Ideas
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

      {ideas && (
        <div className="p-6 pt-0">
          <h3 className="font-headline text-lg mb-4">Generated Ideas</h3>
          <div className="space-y-4">
            {ideas.eventIdeas.map((idea, index) => (
              <Card key={index} className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-base">{idea.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{idea.description}</p>
                </CardContent>
                <CardFooter>
                    <SaveButton idea={idea} />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
