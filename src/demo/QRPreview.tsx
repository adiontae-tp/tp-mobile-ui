import { QRCodeSVG } from "qrcode.react";
import { useState, useEffect } from "react";

interface QRPreviewProps {
  path: string;
}

function getPreviewUrl(path: string): string {
  // In dev, use the network URL so phones on the same WiFi can access it.
  // In production, use the current origin.
  return `${window.location.origin}/preview${path}`;
}

export function QRPreview({ path }: QRPreviewProps) {
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(getPreviewUrl(path));
  }, [path]);

  if (!url) return null;

  return (
    <div className="flex flex-col items-center gap-4 rounded-lg border bg-muted/30 p-6">
      <div className="rounded-xl bg-white p-3">
        <QRCodeSVG value={url} size={160} level="M" />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium">Preview on your device</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Scan with your phone camera while on the same network
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block text-xs text-primary underline underline-offset-2"
        >
          {url}
        </a>
      </div>
    </div>
  );
}
