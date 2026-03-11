import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function CardPreview() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description text here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">This is the card content area.</p>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Action</Button>
        </CardFooter>
      </Card>
      <Card pressable>
        <CardHeader>
          <CardTitle>Pressable Card</CardTitle>
          <CardDescription>Tap to see press feedback.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
