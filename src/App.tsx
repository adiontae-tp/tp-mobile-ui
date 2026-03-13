import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DemoShell } from "@/demo/DemoShell";
import { PreviewShell } from "@/demo/PreviewShell";
import { Toaster } from "@/components/ui/toast";

// Docs pages
import { HomePage } from "@/demo/pages/HomePage";
import { ButtonDemo } from "@/demo/pages/ButtonDemo";
import { TextDemo } from "@/demo/pages/TextDemo";
import { InputDemo } from "@/demo/pages/InputDemo";
import { CardDemo } from "@/demo/pages/CardDemo";
import { BadgeDemo } from "@/demo/pages/BadgeDemo";
import { AvatarDemo } from "@/demo/pages/AvatarDemo";
import { SeparatorDemo } from "@/demo/pages/SeparatorDemo";
import { SwitchDemo } from "@/demo/pages/SwitchDemo";
import { CheckboxDemo } from "@/demo/pages/CheckboxDemo";
import { TabsDemo } from "@/demo/pages/TabsDemo";
import { HeaderDemo } from "@/demo/pages/HeaderDemo";
import { BottomSheetDemo } from "@/demo/pages/BottomSheetDemo";
import { ActionSheetDemo } from "@/demo/pages/ActionSheetDemo";
import { ToastDemo } from "@/demo/pages/ToastDemo";
import { BottomTabsDemo } from "@/demo/pages/BottomTabsDemo";
import { NavigationDemo } from "@/demo/pages/NavigationDemo";
import { ViewSwitcherDemo } from "@/demo/pages/ViewSwitcherDemo";
import { ToolbarSheetDemo } from "@/demo/pages/ToolbarSheetDemo";
import { DrawerDemo } from "@/demo/pages/DrawerDemo";
import { ListDemo } from "@/demo/pages/ListDemo";
import { WeekCalendarDemo } from "@/demo/pages/WeekCalendarDemo";
import { FooterButtonsDemo } from "@/demo/pages/FooterButtonsDemo";
import { ChatDemo } from "@/demo/pages/ChatDemo";
import { CalendarDemo } from "@/demo/pages/CalendarDemo";
import { DatePickerDemo } from "@/demo/pages/DatePickerDemo";

// Mobile previews
import { PreviewIndex } from "@/demo/pages/PreviewIndex";
import { ButtonPreview } from "@/demo/previews/ButtonPreview";
import { TextPreview } from "@/demo/previews/TextPreview";
import { InputPreview } from "@/demo/previews/InputPreview";
import { CardPreview } from "@/demo/previews/CardPreview";
import { BadgePreview } from "@/demo/previews/BadgePreview";
import { AvatarPreview } from "@/demo/previews/AvatarPreview";
import { SeparatorPreview } from "@/demo/previews/SeparatorPreview";
import { SwitchPreview } from "@/demo/previews/SwitchPreview";
import { CheckboxPreview } from "@/demo/previews/CheckboxPreview";
import { TabsPreview } from "@/demo/previews/TabsPreview";
import { HeaderPreview } from "@/demo/previews/HeaderPreview";
import { BottomSheetPreview } from "@/demo/previews/BottomSheetPreview";
import { ActionSheetPreview } from "@/demo/previews/ActionSheetPreview";
import { ToastPreview } from "@/demo/previews/ToastPreview";
import { BottomTabsPreview } from "@/demo/previews/BottomTabsPreview";
import { NavigationPreview } from "@/demo/previews/NavigationPreview";
import { ViewSwitcherPreview } from "@/demo/previews/ViewSwitcherPreview";
import { ToolbarSheetPreview } from "@/demo/previews/ToolbarSheetPreview";
import { DrawerPreview } from "@/demo/previews/DrawerPreview";
import { ListPreview } from "@/demo/previews/ListPreview";
import { WeekCalendarPreview } from "@/demo/previews/WeekCalendarPreview";
import { FooterButtonsPreview } from "@/demo/previews/FooterButtonsPreview";
import { ChatPreview } from "@/demo/previews/ChatPreview";
import { CalendarPreview } from "@/demo/previews/CalendarPreview";
import { DatePickerPreview } from "@/demo/previews/DatePickerPreview";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Docs site (desktop) */}
        <Route element={<DemoShell />}>
          <Route index element={<HomePage />} />
          <Route path="button" element={<ButtonDemo />} />
          <Route path="text" element={<TextDemo />} />
          <Route path="input" element={<InputDemo />} />
          <Route path="card" element={<CardDemo />} />
          <Route path="badge" element={<BadgeDemo />} />
          <Route path="avatar" element={<AvatarDemo />} />
          <Route path="separator" element={<SeparatorDemo />} />
          <Route path="switch" element={<SwitchDemo />} />
          <Route path="checkbox" element={<CheckboxDemo />} />
          <Route path="tabs" element={<TabsDemo />} />
          <Route path="header" element={<HeaderDemo />} />
          <Route path="bottom-sheet" element={<BottomSheetDemo />} />
          <Route path="action-sheet" element={<ActionSheetDemo />} />
          <Route path="toast" element={<ToastDemo />} />
          <Route path="bottom-tabs" element={<BottomTabsDemo />} />
          <Route path="navigation" element={<NavigationDemo />} />
          <Route path="view-switcher" element={<ViewSwitcherDemo />} />
          <Route path="toolbar-sheet" element={<ToolbarSheetDemo />} />
          <Route path="drawer" element={<DrawerDemo />} />
          <Route path="list" element={<ListDemo />} />
          <Route path="week-calendar" element={<WeekCalendarDemo />} />
          <Route path="footer-buttons" element={<FooterButtonsDemo />} />
          <Route path="chat" element={<ChatDemo />} />
          <Route path="calendar" element={<CalendarDemo />} />
          <Route path="date-picker" element={<DatePickerDemo />} />
        </Route>

        {/* Mobile previews (full-screen, for phone testing) */}
        <Route path="preview" element={<PreviewShell />}>
          <Route index element={<PreviewIndex />} />
          <Route path="button" element={<ButtonPreview />} />
          <Route path="text" element={<TextPreview />} />
          <Route path="input" element={<InputPreview />} />
          <Route path="card" element={<CardPreview />} />
          <Route path="badge" element={<BadgePreview />} />
          <Route path="avatar" element={<AvatarPreview />} />
          <Route path="separator" element={<SeparatorPreview />} />
          <Route path="switch" element={<SwitchPreview />} />
          <Route path="checkbox" element={<CheckboxPreview />} />
          <Route path="tabs" element={<TabsPreview />} />
          <Route path="header" element={<HeaderPreview />} />
          <Route path="bottom-sheet" element={<BottomSheetPreview />} />
          <Route path="action-sheet" element={<ActionSheetPreview />} />
          <Route path="toast" element={<ToastPreview />} />
          <Route path="bottom-tabs" element={<BottomTabsPreview />} />
          <Route path="navigation" element={<NavigationPreview />} />
          <Route path="view-switcher" element={<ViewSwitcherPreview />} />
          <Route path="toolbar-sheet" element={<ToolbarSheetPreview />} />
          <Route path="drawer" element={<DrawerPreview />} />
          <Route path="list" element={<ListPreview />} />
          <Route path="week-calendar" element={<WeekCalendarPreview />} />
          <Route path="footer-buttons" element={<FooterButtonsPreview />} />
          <Route path="chat" element={<ChatPreview />} />
          <Route path="calendar" element={<CalendarPreview />} />
          <Route path="date-picker" element={<DatePickerPreview />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
