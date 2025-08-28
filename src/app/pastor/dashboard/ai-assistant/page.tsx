import { EventIdeaGenerator } from "@/components/pastor/event-idea-generator";
import { SermonOutlineGenerator } from "@/components/pastor/sermon-outline-generator";
import { Separator } from "@/components/ui/separator";

export default function AiAssistantPage() {

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline">AI Assistant</h2>
        <p className="text-muted-foreground">Use generative AI to help with church management tasks.</p>
      </div>
      
      <EventIdeaGenerator />

      <Separator />

      <SermonOutlineGenerator />
    </div>
  );
}
