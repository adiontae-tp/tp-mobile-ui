import { cn } from "@/lib/utils";

interface PhonePreviewProps {
  children: React.ReactNode;
  className?: string;
}

export function PhonePreview({ children, className }: PhonePreviewProps) {
  return (
    <div className={cn("flex justify-center", className)}>
      <div className="relative w-[320px] shrink-0">
        {/* Phone frame */}
        <div className="overflow-hidden rounded-[2rem] border-[6px] border-neutral-800 bg-neutral-800 shadow-xl dark:border-neutral-600 dark:bg-neutral-600">
          {/* Status bar / notch area — simulates env(safe-area-inset-top) */}
          <div className="relative z-10 flex h-[52px] items-start justify-center bg-background">
            {/* Dynamic island */}
            <div className="mt-1.5 h-[22px] w-[100px] rounded-full bg-neutral-800 dark:bg-neutral-600" />
            {/* Status bar indicators */}
            <div className="absolute left-4 top-2 flex items-center gap-1">
              <span className="text-[10px] font-semibold">9:41</span>
            </div>
            <div className="absolute right-4 top-2 flex items-center gap-1">
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M2 17h2v5H2zm5-4h2v9H7zm5-4h2v13h-2zm5-4h2v17h-2z"/></svg>
              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/></svg>
              <svg className="h-3.5 w-4" viewBox="0 0 28 14" fill="currentColor"><rect x="0" y="1" width="22" height="12" rx="2.5" stroke="currentColor" strokeWidth="1" fill="none"/><rect x="23.5" y="4.5" width="2" height="5" rx="1" opacity="0.4"/><rect x="2" y="3" width="16" height="8" rx="1"/></svg>
            </div>
          </div>
          {/*
            Screen area — includes the home indicator zone so components
            can extend behind it (like real iOS safe areas).
            --safe-area-inset-bottom is read by BottomTabsBar, Header, etc.
          */}
          <div
            className="relative flex flex-col bg-background"
            style={{
              height: 572, /* 538 screen + 34 home indicator */
              ["--safe-area-inset-bottom" as string]: "34px",
              ["--safe-area-inset-top" as string]: "0px",
            }}
          >
            {/* Scrollable content area */}
            <div className="relative min-h-0 flex-1 overflow-y-auto">
              {children}
            </div>
            {/* Home indicator overlay — sits on top of content */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[34px] items-end justify-center pb-2">
              <div className="h-[5px] w-[134px] rounded-full bg-neutral-400 dark:bg-neutral-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
