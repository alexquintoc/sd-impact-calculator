"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Update } from "../../lib/updates";

export function AnnouncementBar({ update }: { update: Update | null }) {
  const [dismissed, setDismissed] = useState(false);
  const storageKey = update ? `sd-standard:announcement:${update.slug}` : "";

  useEffect(() => {
    if (!storageKey) return;
    setDismissed(window.localStorage.getItem(storageKey) === "dismissed");
  }, [storageKey]);

  if (!update || dismissed) return null;
  return (
    <aside className="announcement-bar" aria-label="Announcement">
      <div className="announcement-inner">
        <p>{update.announcementText || update.title} <Link href={`/updates/${update.slug}`}>{update.announcementLinkLabel || "Learn more"}</Link></p>
        <button type="button" aria-label="Dismiss announcement" onClick={() => { window.localStorage.setItem(storageKey, "dismissed"); setDismissed(true); }}>
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </aside>
  );
}
