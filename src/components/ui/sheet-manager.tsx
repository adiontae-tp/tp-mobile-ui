import * as React from "react";

/**
 * SheetManager ensures only one bottom-sheet-based overlay is visible at a time.
 *
 * Wrap your app with `<SheetManagerProvider>`. Any component that opens a sheet
 * calls `useSheetManager().request(id, closeFn)` before opening. The manager
 * will close the currently active sheet first, then mark the new one as active.
 */

interface SheetManagerContextValue {
  /** Call before opening a sheet. Returns true if you may proceed. */
  request: (id: string, closeFn: () => void) => void;
  /** Call when a sheet closes (so the manager clears its tracking). */
  release: (id: string) => void;
}

const SheetManagerContext = React.createContext<SheetManagerContextValue | null>(null);

function useSheetManager() {
  return React.useContext(SheetManagerContext);
}

function SheetManagerProvider({ children }: { children: React.ReactNode }) {
  const activeRef = React.useRef<{ id: string; close: () => void } | null>(null);

  const request = React.useCallback((id: string, closeFn: () => void) => {
    const current = activeRef.current;
    if (current && current.id !== id) {
      // Close the currently open sheet
      current.close();
    }
    activeRef.current = { id, close: closeFn };
  }, []);

  const release = React.useCallback((id: string) => {
    if (activeRef.current?.id === id) {
      activeRef.current = null;
    }
  }, []);

  const value = React.useMemo(() => ({ request, release }), [request, release]);

  return (
    <SheetManagerContext.Provider value={value}>
      {children}
    </SheetManagerContext.Provider>
  );
}
SheetManagerProvider.displayName = "SheetManagerProvider";

export { SheetManagerProvider, useSheetManager };
