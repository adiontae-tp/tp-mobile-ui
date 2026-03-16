import {
  List,
  ListSearch,
  ListSection,
  ListItem,
  ListItemIcon,
  ListItemContent,
  ListItemTitle,
  ListItemSubtitle,
  ListItemAction,
} from "@/components/ui/list";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Page, PageContent, ScrollView } from "@/components/ui/page";
import {
  Wifi, Bluetooth, Bell, Shield, Globe, Moon,
  Image, Music, Film, Gamepad2,
  CalendarDays, LayoutTemplate, FolderOpen, Tag, BarChart3, Lock,
} from "lucide-react";
import { useState, useMemo } from "react";

const mediaItems = [
  { icon: Image, label: "Photos", sub: "1,284 items", color: "bg-orange-500" },
  { icon: Music, label: "Music", sub: "342 songs", color: "bg-pink-500" },
  { icon: Film, label: "Videos", sub: "28 clips", color: "bg-purple-500" },
  { icon: Gamepad2, label: "Games", sub: "12 installed", color: "bg-emerald-500" },
];

export function ListPreview() {
  const [wifiOn, setWifiOn] = useState(true);
  const [btOn, setBtOn] = useState(false);
  const [search, setSearch] = useState("");

  const settingsItems = useMemo(() => {
    const items = [
      { icon: Bell, label: "Notifications", sub: undefined, color: "bg-red-500", badge: "3" },
      { icon: Shield, label: "Privacy & Security", sub: undefined, color: "bg-green-600" },
      { icon: Globe, label: "Language & Region", sub: "English (US)", color: "bg-blue-600" },
      { icon: Moon, label: "Appearance", sub: "System default", color: "bg-indigo-500" },
    ];
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter((i) => i.label.toLowerCase().includes(q));
  }, [search]);

  return (
    <Page>
      <PageContent>
        <ScrollView>
          <div className="flex flex-col gap-2 pb-8">
            {/* Search */}
            <ListSearch value={search} onValueChange={setSearch} />

            {/* Grouped section with label + footer */}
            <ListSection label="Connectivity">
              <List inset>
                <ListItem pressable chevron>
                  <ListItemIcon>
                    <Wifi className="h-4 w-4" />
                  </ListItemIcon>
                  <ListItemContent>
                    <ListItemTitle>Wi-Fi</ListItemTitle>
                    <ListItemSubtitle>Home Network</ListItemSubtitle>
                  </ListItemContent>
                  <ListItemAction>
                    <Switch checked={wifiOn} onCheckedChange={setWifiOn} />
                  </ListItemAction>
                </ListItem>
                <ListItem pressable chevron>
                  <ListItemIcon className="bg-blue-500">
                    <Bluetooth className="h-4 w-4" />
                  </ListItemIcon>
                  <ListItemContent>
                    <ListItemTitle>Bluetooth</ListItemTitle>
                    <ListItemSubtitle>Off</ListItemSubtitle>
                  </ListItemContent>
                  <ListItemAction>
                    <Switch checked={btOn} onCheckedChange={setBtOn} />
                  </ListItemAction>
                </ListItem>
              </List>
            </ListSection>

            {/* Searchable section */}
            <ListSection label="General" footer="Customize the look and feel of your app.">
              <List inset>
                {settingsItems.length > 0 ? (
                  settingsItems.map((item) => (
                    <ListItem key={item.label} pressable chevron>
                      <ListItemIcon className={item.color}>
                        <item.icon className="h-4 w-4" />
                      </ListItemIcon>
                      <ListItemContent>
                        <ListItemTitle>{item.label}</ListItemTitle>
                        {item.sub && <ListItemSubtitle>{item.sub}</ListItemSubtitle>}
                      </ListItemContent>
                      {item.badge && (
                        <ListItemAction>
                          <Badge variant="secondary">{item.badge}</Badge>
                        </ListItemAction>
                      )}
                    </ListItem>
                  ))
                ) : (
                  <div className="flex min-h-touch items-center justify-center px-4 text-sm text-muted-foreground">
                    No results
                  </div>
                )}
              </List>
            </ListSection>

            {/* Card variant (vertical, single column) */}
            <ListSection label="Media">
              <List variant="card">
                {mediaItems.map((item) => (
                  <ListItem key={item.label} pressable>
                    <ListItemIcon className={item.color}>
                      <item.icon className="h-4 w-4" />
                    </ListItemIcon>
                    <ListItemContent>
                      <ListItemTitle>{item.label}</ListItemTitle>
                      <ListItemSubtitle>{item.sub}</ListItemSubtitle>
                    </ListItemContent>
                  </ListItem>
                ))}
              </List>
            </ListSection>

            {/* Card grid variant (2-column) */}
            <ListSection label="Quick Access">
              <List variant="card-grid">
                {mediaItems.map((item) => (
                  <ListItem key={item.label} pressable>
                    <ListItemIcon className={item.color}>
                      <item.icon className="h-4 w-4" />
                    </ListItemIcon>
                    <ListItemContent>
                      <ListItemTitle>{item.label}</ListItemTitle>
                      <ListItemSubtitle>{item.sub}</ListItemSubtitle>
                    </ListItemContent>
                  </ListItem>
                ))}
              </List>
            </ListSection>

            {/* Menu variant — card items with sections */}
            <List variant="menu">
              <ListSection label="Planning">
                <ListItem pressable chevron>
                  <ListItemIcon>
                    <CalendarDays className="h-4 w-4" />
                  </ListItemIcon>
                  <ListItemContent>
                    <ListItemTitle>Periods</ListItemTitle>
                    <ListItemSubtitle>Reusable drills and activities</ListItemSubtitle>
                  </ListItemContent>
                </ListItem>
                <ListItem pressable chevron>
                  <ListItemIcon>
                    <LayoutTemplate className="h-4 w-4" />
                  </ListItemIcon>
                  <ListItemContent>
                    <ListItemTitle>Practice Templates</ListItemTitle>
                    <ListItemSubtitle>Save complete practice plans</ListItemSubtitle>
                  </ListItemContent>
                </ListItem>
              </ListSection>

              <ListSection label="Management">
                <ListItem pressable chevron>
                  <ListItemIcon>
                    <FolderOpen className="h-4 w-4" />
                  </ListItemIcon>
                  <ListItemContent>
                    <ListItemTitle>Files</ListItemTitle>
                    <ListItemSubtitle>Store and organize documents</ListItemSubtitle>
                  </ListItemContent>
                </ListItem>
                <ListItem pressable chevron>
                  <ListItemIcon>
                    <Tag className="h-4 w-4" />
                  </ListItemIcon>
                  <ListItemContent>
                    <ListItemTitle>Tags</ListItemTitle>
                    <ListItemSubtitle>Track time by category</ListItemSubtitle>
                  </ListItemContent>
                </ListItem>
                <ListItem pressable chevron>
                  <ListItemIcon>
                    <BarChart3 className="h-4 w-4" />
                  </ListItemIcon>
                  <ListItemContent>
                    <ListItemTitle>
                      Reports <Lock className="inline h-3 w-3 ml-1 text-muted-foreground" />
                    </ListItemTitle>
                    <ListItemSubtitle>View practice time distribution</ListItemSubtitle>
                  </ListItemContent>
                </ListItem>
              </ListSection>
            </List>
          </div>
        </ScrollView>
      </PageContent>
    </Page>
  );
}
