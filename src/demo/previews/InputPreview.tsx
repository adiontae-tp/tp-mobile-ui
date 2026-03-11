import { Input } from "@/components/ui/input";
import { Search, Mail, Eye, DollarSign } from "lucide-react";

export function InputPreview() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Default</p>
      <Input placeholder="Enter text..." />
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">With icons</p>
      <Input placeholder="Search..." startIcon={<Search className="h-4 w-4" />} inputMode="search" />
      <Input placeholder="Email" startIcon={<Mail className="h-4 w-4" />} inputMode="email" />
      <Input placeholder="Password" type="password" endIcon={<Eye className="h-4 w-4" />} />
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Keyboard types</p>
      <Input placeholder="Amount (decimal)" inputMode="decimal" startIcon={<DollarSign className="h-4 w-4" />} />
      <Input placeholder="Zip code (numeric)" inputMode="numeric" pattern="[0-9]*" />
      <Input placeholder="Phone (tel)" inputMode="tel" />
      <Input placeholder="Website (url)" inputMode="url" />
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Disabled</p>
      <Input placeholder="Disabled" disabled />
    </div>
  );
}
