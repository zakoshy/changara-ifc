
'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BookOpen, Search } from 'lucide-react';

interface BibleApiResponse {
    reference: string;
    verses: {
        book_id: string;
        book_name: string;
        chapter: number;
        verse: number;
        text: string;
    }[];
    text: string;
    translation_id: string;
    translation_name: string;
    translation_note: string;
}

function BibleReader() {
  const searchParams = useSearchParams();
  const initialPassage = searchParams.get('passage') || 'John 3:16';
  const [passage, setPassage] = useState(initialPassage);
  const [searchQuery, setSearchQuery] = useState(initialPassage);
  const [data, setData] = useState<BibleApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPassage = useCallback(async (query: string) => {
    if (!query) return;
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const response = await fetch(`https://bible-api.com/${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Scripture not found. Please check the reference and try again.');
      }
      const result: BibleApiResponse = await response.json();
      setData(result);
    } catch (e: any) {
      setError(e.message || 'An error occurred while fetching the scripture.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPassage(passage);
  }, [passage, fetchPassage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPassage(searchQuery);
  };

  return (
    <div className="space-y-6">
       <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Bible Reader</CardTitle>
                <CardDescription>Look up any scripture. Try "Genesis 1:1" or "Romans 8:28".</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <Input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Enter a scripture reference..."
                        className="flex-grow"
                    />
                    <Button type="submit" size="icon" aria-label="Search" disabled={loading}>
                        <Search className="h-4 w-4" />
                    </Button>
                </form>
            </CardContent>
        </Card>

      {loading && (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </CardContent>
        </Card>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {data && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-2xl flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              {data.reference}
            </CardTitle>
            <CardDescription>{data.translation_name}</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none text-foreground leading-loose">
            <p>
              {data.verses.map(verse => (
                <span key={verse.verse}>
                  <sup className="font-bold text-primary text-sm pr-1">{verse.verse}</sup>
                  {verse.text}
                </span>
              ))}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}


export default function BiblePage() {
    return (
        <Suspense fallback={<p>Loading Bible...</p>}>
            <BibleReader />
        </Suspense>
    )
}
