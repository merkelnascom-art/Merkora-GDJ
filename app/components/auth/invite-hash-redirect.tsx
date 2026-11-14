"use client";

import { useEffect } from "react";

export function InviteHashRedirect() {
  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const type = hash.get("type");
    const accessToken = hash.get("access_token");
    if (type === "invite" && accessToken) {
      const destination = "/auth/accept-invite" + window.location.search + window.location.hash;
      window.location.replace(destination);
    }
  }, []);
  return null;
}
