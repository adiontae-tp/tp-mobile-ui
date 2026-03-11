import { Text } from "@/components/ui/text";

export function TextPreview() {
  return (
    <div className="flex flex-col gap-3 p-4">
      <Text variant="h1">Heading 1</Text>
      <Text variant="h2">Heading 2</Text>
      <Text variant="h3">Heading 3</Text>
      <Text variant="h4">Heading 4</Text>
      <Text variant="p">This is a body paragraph.</Text>
      <Text variant="lead">Lead text for intros.</Text>
      <Text variant="large">Large emphasized.</Text>
      <Text variant="small">Small helper text.</Text>
      <Text variant="muted">Muted secondary text.</Text>
      <Text variant="code">code snippet</Text>
    </div>
  );
}
