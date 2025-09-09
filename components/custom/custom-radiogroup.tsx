import { useId } from "react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function CustomRadioGroup({
  items,
}: {
  items?: { value: string; label: string }[];
}) {
  const id = useId();
  if (!items) {
    items = [
      { value: "1", label: "United States" },
      { value: "2", label: "Canada" },
      { value: "3", label: "Germany" },
    ];
  }
  return (
    <fieldset className="space-y-4">
      <legend className="text-foreground text-sm leading-none font-medium">
        Server location
      </legend>
      <RadioGroup className="flex flex-wrap gap-2" defaultValue="1">
        {items.map((item) => (
          <div
            key={`${id}-${item.value}`}
            className="border-input has-data-[state=checked]:border-primary/50 relative flex flex-col items-start gap-4 rounded-md border p-3 shadow-xs outline-none"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem
                id={`${id}-${item.value}`}
                value={item.value}
                className="after:absolute after:inset-0"
              />
              <Label htmlFor={`${id}-${item.value}`}>{item.label}</Label>
            </div>
          </div>
        ))}
      </RadioGroup>
    </fieldset>
  );
}
