import { ComponentPage } from "@/demo/ComponentPage";
import { NavigationPreview } from "@/demo/previews/NavigationPreview";

const usage = `import {
  StackNavigator,
  TabNavigator,
  ModalNavigator,
  SharedElement,
  useNavigation,
  useRoute,
} from "@/components/ui/navigation"

// Stack Navigator — push/pop screens with animated transitions
<StackNavigator initialRoute="home">
  <StackNavigator.Screen name="home" component={HomeScreen} />
  <StackNavigator.Screen name="detail" component={DetailScreen} />
</StackNavigator>

// Inside screens:
const { push, pop, goBack, canGoBack } = useNavigation()
const { name, params } = useRoute()

// Tab Navigator — composes existing BottomTabs
<TabNavigator initialTab="home">
  <TabNavigator.Tab name="home" icon={<Home />} label="Home">
    <StackNavigator initialRoute="feed">
      <StackNavigator.Screen name="feed" component={FeedScreen} />
    </StackNavigator>
  </TabNavigator.Tab>
  <TabNavigator.Tab name="search" icon={<Search />} label="Search">
    <SearchScreen />
  </TabNavigator.Tab>
</TabNavigator>

// Modal Navigator — slide-up card modals
<ModalNavigator>
  <ModalNavigator.Screen name="compose" component={ComposeModal} />
  <TabNavigator>...</TabNavigator>
</ModalNavigator>

// Shared Element — automatic morph animations
<SharedElement id={\`photo-\${id}\`}>
  <img src={thumbnail} />
</SharedElement>`;

export function NavigationDemo() {
  return (
    <ComponentPage
      title="Navigation"
      description="Complete mobile navigation system with stack push/pop, tab switching, modal presentation, and shared element transitions. Platform-detected animations — iOS slide + swipe-back, Android fade-up."
      usage={usage}
    >
      <NavigationPreview />
    </ComponentPage>
  );
}
