
'use client';

import { useState, useEffect } from 'react';
import { deleteSavedEventIdea, deleteSavedSermon, getSavedEventIdeas, getSavedSermonOutlines } from '@/actions/ai-creations';
import { SavedEventIdea, SavedSermonOutline } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { LoaderCircle, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { EventForm } from '@/components/pastor/event-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

function DeleteButton({ id, type, name }: { id: string; type: 'idea' | 'sermon'; name: string }) {
    const [isPending, startTransition] = useState(false);
    const { toast } = useToast();

    const handleDelete = async () => {
        startTransition(true);
        const action = type === 'idea' ? deleteSavedEventIdea : deleteSavedSermon;
        const result = await action(id);
        if(result.success) {
            toast({ title: "Success", description: result.message });
        } else {
            toast({ variant: 'destructive', title: "Error", description: result.message });
        }
        startTransition(false);
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={isPending}>
                    {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                    Delete
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently delete the saved {type}: "{name}". This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isPending} className="bg-destructive hover:bg-destructive/90">
                        {isPending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function EventIdeasTab() {
    const [ideas, setIdeas] = useState<SavedEventIdea[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedIdea, setSelectedIdea] = useState<SavedEventIdea | null>(null);

    useEffect(() => {
        getSavedEventIdeas().then(data => {
            setIdeas(data);
            setLoading(false);
        });
    }, []);

    const handleUseIdea = (idea: SavedEventIdea) => {
        setSelectedIdea(idea);
        setIsFormOpen(true);
    };
    
    const closeForm = () => setIsFormOpen(false);

    if (loading) return <div className="flex justify-center items-center p-8"><LoaderCircle className="animate-spin" /></div>;

    return (
        <div className="space-y-4">
            {ideas.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {ideas.map(idea => (
                        <Card key={idea.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle>{idea.title}</CardTitle>
                                <CardDescription className="text-xs">Saved on {format(new Date(idea.createdAt), 'PPP')}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="text-sm text-muted-foreground">{idea.description}</p>
                            </CardContent>
                            <CardFooter className="gap-2">
                                <Button size="sm" onClick={() => handleUseIdea(idea)}><Edit className="mr-2 h-4 w-4" /> Use Idea</Button>
                                <DeleteButton id={idea.id} type="idea" name={idea.title} />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground text-center py-8">No saved event ideas yet. Go to the AI Assistant to generate some!</p>
            )}
            
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create New Event</DialogTitle>
                        <DialogDescription>Using your saved idea: "{selectedIdea?.title}"</DialogDescription>
                    </DialogHeader>
                    <EventForm
                        onFinished={closeForm}
                        event={{
                            id: '',
                            title: selectedIdea?.title || '',
                            description: selectedIdea?.description || '',
                            date: new Date().toISOString(),
                            time: '',
                            location: '',
                            imageUrl: ''
                        }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}

function SermonsTab() {
    const [sermons, setSermons] = useState<SavedSermonOutline[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedSermon, setSelectedSermon] = useState<SavedSermonOutline | null>(null);

    useEffect(() => {
        getSavedSermonOutlines().then(data => {
            setSermons(data);
            setLoading(false);
        });
    }, []);

    const handleCreateTeaching = (sermon: SavedSermonOutline) => {
        setSelectedSermon(sermon);
        setIsFormOpen(true);
    };

    const closeForm = () => setIsFormOpen(false);

    if (loading) return <div className="flex justify-center items-center p-8"><LoaderCircle className="animate-spin" /></div>;

    const formatSermonText = (sermon: SavedSermonOutline) => {
        let text = `Sermon: ${sermon.sermonTitle}\n\n`;
        sermon.outline.forEach(point => {
            text += `--- ${point.pointTitle.toUpperCase()} ---\n`;
            text += `${point.content}\n`;
            if (point.supportingVerses.length > 0) {
                text += `Key Verses: ${point.supportingVerses.join(', ')}\n`;
            }
            text += '\n';
        });
        return text;
    };


    return (
        <div className="space-y-4">
             {sermons.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                    {sermons.map(sermon => (
                         <Card key={sermon.id}>
                            <CardHeader>
                                <CardTitle>{sermon.sermonTitle}</CardTitle>
                                 <CardDescription className="text-xs">Saved on {format(new Date(sermon.createdAt), 'PPP')}</CardDescription>
                            </CardHeader>
                            <CardContent>
                               <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>View Outline</AccordionTrigger>
                                        <AccordionContent>
                                            {sermon.outline.map((point, index) => (
                                                <div key={index} className="mb-4 pb-2 border-b last:border-b-0">
                                                    <h4 className="font-semibold">{point.pointTitle}</h4>
                                                    <p className="text-sm text-muted-foreground whitespace-pre-line my-2">{point.content}</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {point.supportingVerses.map(verse => (
                                                            <Button key={verse} variant="outline" size="sm" asChild className="h-auto px-2 py-1 text-xs">
                                                                <Link href={`/pastor/dashboard/bible?passage=${encodeURIComponent(verse)}`}>
                                                                    <BookOpen className="mr-1 h-3 w-3" /> {verse}
                                                                </Link>
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                            <CardFooter className="gap-2">
                                <Button size="sm" onClick={() => handleCreateTeaching(sermon)}><Edit className="mr-2 h-4 w-4" /> Create Teaching</Button>
                                <DeleteButton id={sermon.id} type="sermon" name={sermon.sermonTitle} />
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-muted-foreground text-center py-8">No saved sermons yet. Go to the AI Assistant to generate some!</p>
            )}

            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Create New Teaching</DialogTitle>
                        <DialogDescription>Using your saved sermon: "{selectedSermon?.sermonTitle}"</DialogDescription>
                    </DialogHeader>
                    <EventForm
                        onFinished={closeForm}
                        teaching={{
                            id: '',
                            text: selectedSermon ? formatSermonText(selectedSermon) : '',
                            mediaType: 'photo',
                            mediaUrl: '',
                            createdAt: new Date().toISOString()
                        }}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}


export default function CreationsPage() {
  return (
    <div className="space-y-6">
        <div>
            <h1 className="text-2xl font-bold tracking-tight font-headline">Saved Creations</h1>
            <p className="text-muted-foreground">View, use, and manage the content you've saved from the AI Assistant.</p>
        </div>
         <Tabs defaultValue="ideas" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="ideas">Event Ideas</TabsTrigger>
                <TabsTrigger value="sermons">Sermons</TabsTrigger>
            </TabsList>
            <TabsContent value="ideas" className="mt-6">
                <EventIdeasTab />
            </TabsContent>
            <TabsContent value="sermons" className="mt-6">
                <SermonsTab />
            </TabsContent>
        </Tabs>
    </div>
  );
}
