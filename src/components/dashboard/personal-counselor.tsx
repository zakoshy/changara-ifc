'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Sparkles, LoaderCircle, HeartHandshake, BookOpen, ThumbsUp } from 'lucide-react';
import { generateCounselingResponse, GenerateCounselingResponseOutput } from '@/ai/flows/personal-counselor-flow';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export function PersonalCounselor() {
  const [problem, setProblem] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerateCounselingResponseOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!problem) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const counselingResult = await generateCounselingResponse({ problem });
      setResult(counselingResult);
    } catch (e) {
      setError('An error occurred while seeking guidance. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="counselor">
      <h2 className="text-2xl font-bold tracking-tight font-headline mb-4">Find Hope & Guidance</h2>
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Personal Counselor</CardTitle>
            <CardDescription>
              Share what's on your mind. Our AI assistant is here to offer a word of hope and encouragement based on scripture. This is a safe and private space.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="problem">What's on your heart?</Label>
              <Textarea
                id="problem"
                placeholder="e.g., I'm struggling with anxiety and fear about the future..."
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                disabled={loading}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading || !problem}>
              {loading ? (
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Seek Guidance
            </Button>
          </CardFooter>
        </form>

        {error && (
          <CardContent>
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
        )}

        {result && (
          <CardContent className="space-y-6 pt-4">
            <Separator />
            <div className="space-y-4">
                <h3 className="font-headline text-lg flex items-center gap-2"><HeartHandshake className="text-primary"/> A Message of Hope</h3>
                <p className="text-muted-foreground whitespace-pre-line">{result.hopefulMessage}</p>
            </div>
             <div className="space-y-4">
                <h3 className="font-headline text-lg flex items-center gap-2"><BookOpen className="text-primary"/> Relevant Scripture</h3>
                <div className="space-y-2">
                {result.relevantScriptures.map((verse, index) => (
                    <blockquote key={index} className="border-l-4 border-primary/50 pl-4 italic">
                        {verse}
                    </blockquote>
                ))}
                </div>
            </div>
             <div className="space-y-4">
                <h3 className="font-headline text-lg flex items-center gap-2"><ThumbsUp className="text-primary"/> Practical Advice</h3>
                <p className="text-muted-foreground whitespace-pre-line">{result.practicalAdvice}</p>
            </div>
          </CardContent>
        )}
      </Card>
    </section>
  );
}
