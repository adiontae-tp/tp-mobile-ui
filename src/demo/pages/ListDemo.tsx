import { ComponentPage } from "@/demo/ComponentPage";
import { ListPreview } from "@/demo/previews/ListPreview";

const usage = `import {
  List, ListSearch, ListSection, ListItem,
  ListItemIcon, ListItemContent,
  ListItemTitle, ListItemSubtitle, ListItemAction
} from "@/components/ui/list"

// Search bar
const [search, setSearch] = useState("")
<ListSearch value={search} onValueChange={setSearch} />

// Section with label and footer
<ListSection label="Connectivity" footer="Helper text.">
  <List inset>
    <ListItem pressable chevron>
      <ListItemIcon><Wifi className="h-4 w-4" /></ListItemIcon>
      <ListItemContent>
        <ListItemTitle>Wi-Fi</ListItemTitle>
        <ListItemSubtitle>Home Network</ListItemSubtitle>
      </ListItemContent>
      <ListItemAction>
        <Switch checked={on} onCheckedChange={setOn} />
      </ListItemAction>
    </ListItem>
  </List>
</ListSection>

// Card variant (vertical, standalone cards)
<ListSection label="Media">
  <List variant="card">
    <ListItem pressable>
      <ListItemIcon><Image className="h-4 w-4" /></ListItemIcon>
      <ListItemContent>
        <ListItemTitle>Photos</ListItemTitle>
        <ListItemSubtitle>1,284 items</ListItemSubtitle>
      </ListItemContent>
    </ListItem>
  </List>
</ListSection>

// Card grid variant (2-column grid)
<ListSection label="Quick Access">
  <List variant="card-grid">
    <ListItem pressable>...</ListItem>
  </List>
</ListSection>`;

export function ListDemo() {
  return (
    <ComponentPage
      title="List"
      description="Composable list component for settings screens, menus, and content lists. Supports list and card variants, searchable sections, grouped inset style, icons, subtitles, trailing actions, and chevron indicators."
      usage={usage}
      props={[
        { name: "variant", type: '"list" | "card" | "card-grid"', default: '"list"', description: "Display as rows (list), vertical standalone cards (card), or a 2-column card grid (card-grid)." },
        { name: "inset", type: "boolean", default: "false", description: "Rounded grouped style with border and horizontal margin (list variant)." },
        { name: "pressable", type: "boolean", default: "false", description: "Adds tap feedback on ListItem." },
        { name: "chevron", type: "boolean", default: "false", description: "Shows a trailing chevron arrow on ListItem (list variant)." },
        { name: "value", type: "string", description: "Controlled search value for ListSearch." },
        { name: "onValueChange", type: "(value: string) => void", description: "Callback when search input changes." },
        { name: "label", type: "string", description: "Section header label for ListSection." },
        { name: "footer", type: "string", description: "Section footer text for ListSection." },
      ]}
    >
      <ListPreview />
    </ComponentPage>
  );
}
