import { EventIdeaGenerator } from "@/components/pastor/event-idea-generator";

export default function AiAssistantPage() {

  return (
    <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline">AI Assistant</h2>
        <p className="text-muted-foreground mb-4">Use generative AI to help with church management tasks.</p>
        <EventIdeaGenerator />
    </div>
  );
}
