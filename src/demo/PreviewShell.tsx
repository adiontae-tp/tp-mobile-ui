import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/ui/header";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

function getTitle(pathname: string): string {
  const name = pathname.replace("/preview/", "").replace(/-/g, " ");
  return name.charAt(0).toUpperCase() + name.slice(1);
}

export function PreviewShell() {
  const navigate = useNavigate();
  const location = useLocation();
  const isIndex = location.pathname === "/preview";

  return (
    <div className="flex h-dvh flex-col bg-background text-foreground">
      <Header
        title={isIndex ? "TP Mobile UI" : getTitle(location.pathname)}
        leftAction={
          !isIndex ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => navigate("/preview")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : undefined
        }
      />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
