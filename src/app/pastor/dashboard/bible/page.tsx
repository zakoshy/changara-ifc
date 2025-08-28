
'use client';

import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BookOpen } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { booksOfTheBible } from '@/lib/bibleBooks';

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
  const initialBook = searchParams.get('passage')?.split(' ')[0] || 'John';
  const initialChapter = searchParams.get('passage')?.split(' ')[1]?.split(':')[0] || '3';
  
  const [selectedBook, setSelectedBook] = useState(initialBook);
  const [selectedChapter, setSelectedChapter] = useState(initialChapter);
  const [chapters, setChapters] = useState(booksOfTheBible.find(b => b.englishName === selectedBook)?.chapters || 0);
  const [translation, setTranslation] = useState<'kjv' | 'ksw09'>('kjv');

  const [data, setData] = useState<BibleApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPassage = useCallback(async (bookIdentifier: string, chapter: string) => {
    if (!bookIdentifier || !chapter) return;
    setLoading(true);
    setError(null);
    setData(null);

    const bookDetails = booksOfTheBible.find(b => b.englishName === bookIdentifier);
    if (!bookDetails) {
        setError("Could not find book details.");
        setLoading(false);
        return;
    }

    const bookNameToFetch = translation === 'ksw09' ? bookDetails.swahiliName : bookDetails.englishName;

    try {
      const response = await fetch(`https://bible-api.com/${encodeURIComponent(`${bookNameToFetch} ${chapter}`)}?translation=${translation}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || 'Scripture not found. Please check the reference and try again.');
      }
      const result: BibleApiResponse = await response.json();
      setData(result);
    } catch (e: any) {
      setError(e.message || 'An error occurred while fetching the scripture.');
    } finally {
      setLoading(false);
    }
  }, [translation]);

  useEffect(() => {
    fetchPassage(selectedBook, selectedChapter);
  }, [selectedBook, selectedChapter, fetchPassage]);

  const handleBookChange = (bookEnglishName: string) => {
      const book = booksOfTheBible.find(b => b.englishName === bookEnglishName);
      if (book) {
          setSelectedBook(book.englishName);
          setChapters(book.chapters);
          setSelectedChapter('1'); // Reset to chapter 1 when book changes
      }
  }

  return (
    <div className="space-y-6">
       <Card>
            <CardHeader>
                <CardTitle className="font-headline text-2xl">Bible Reader</CardTitle>
                <CardDescription>Select a book and chapter to read. You can also switch between English and Swahili translations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="grid gap-1.5 flex-1">
                        <Label>Book</Label>
                        <Select value={selectedBook} onValueChange={handleBookChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a book" />
                            </SelectTrigger>
                            <SelectContent>
                                {booksOfTheBible.map(book => (
                                    <SelectItem key={book.englishName} value={book.englishName}>{book.englishName}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-1.5">
                        <Label>Chapter</Label>
                        <Select value={selectedChapter} onValueChange={setSelectedChapter} disabled={!selectedBook}>
                             <SelectTrigger className="w-[120px]">
                                <SelectValue placeholder="Ch." />
                            </SelectTrigger>
                            <SelectContent>
                                {Array.from({ length: chapters }, (_, i) => i + 1).map(chapterNum => (
                                    <SelectItem key={chapterNum} value={String(chapterNum)}>{chapterNum}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                 <div className="flex items-center space-x-2 pt-2">
                    <Label htmlFor="translation-switch">King James Version</Label>
                    <Switch
                        id="translation-switch"
                        checked={translation === 'ksw09'}
                        onCheckedChange={(checked) => setTranslation(checked ? 'ksw09' : 'kjv')}
                    />
                    <Label htmlFor="translation-switch">Kiswahili</Label>
                </div>
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
            <CardDescription>{data.translation_name} ({data.translation_id.toUpperCase()})</CardDescription>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none text-foreground leading-loose">
            <p>
              {data.verses.map(verse => (
                <span key={verse.verse}>
                  <sup className="font-bold text-primary text-sm pr-1">{verse.verse}</sup>
                  {verse.text.trim()}{' '}
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
