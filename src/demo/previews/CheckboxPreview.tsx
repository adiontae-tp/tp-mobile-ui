import { Checkbox } from "@/components/ui/checkbox";

export function CheckboxPreview() {
  return (
    <div className="flex flex-col gap-4 p-4">
      {["Accept terms and conditions", "Send marketing emails", "Enable analytics"].map(
        (label) => (
          <label key={label} className="flex items-center gap-3">
            <Checkbox />
            <span className="text-sm">{label}</span>
          </label>
        )
      )}
      <label className="flex items-center gap-3 opacity-50">
        <Checkbox disabled />
        <span className="text-sm">Disabled option</span>
      </label>
    </div>
  );
}
