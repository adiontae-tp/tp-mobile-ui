import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

/**
 * Derive smart mobile defaults from type/inputMode so the consumer
 * doesn't have to remember to set autoCapitalize="none" on every email field.
 */
function mobileDefaults(props: InputProps) {
  const attrs: React.InputHTMLAttributes<HTMLInputElement> = {};
  const { type, inputMode } = props;

  // Disable autocapitalize/autocorrect for common field types
  if (
    type === "email" ||
    type === "password" ||
    type === "url" ||
    inputMode === "email" ||
    inputMode === "url"
  ) {
    attrs.autoCapitalize = props.autoCapitalize ?? "none";
    attrs.autoCorrect = props.autoCorrect ?? "off";
  }

  // For password fields, disable autocomplete by default (user can override)
  if (type === "password") {
    attrs.autoComplete = props.autoComplete ?? "current-password";
  }

  return attrs;
}

const inputClasses =
  "flex h-11 min-h-touch w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&[type=number]]:[-moz-appearance:textfield]";

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, ...props }, ref) => {
    const mobile = mobileDefaults({ type, ...props });

    if (startIcon || endIcon) {
      return (
        <div className="relative flex items-center">
          {startIcon && (
            <div className="pointer-events-none absolute left-3 flex items-center text-muted-foreground">
              {startIcon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              inputClasses,
              startIcon && "pl-10",
              endIcon && "pr-10",
              className
            )}
            ref={ref}
            {...mobile}
            {...props}
          />
          {endIcon && (
            <div className="pointer-events-none absolute right-3 flex items-center text-muted-foreground">
              {endIcon}
            </div>
          )}
        </div>
      );
    }

    return (
      <input
        type={type}
        className={cn(inputClasses, className)}
        ref={ref}
        {...mobile}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
