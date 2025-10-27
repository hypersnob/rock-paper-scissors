"use client";

import React from "react";
import { JazzReactProvider } from "jazz-tools/react";
import { GameAccount } from "@/jazz/schema";

const apiKey = process.env.NEXT_PUBLIC_JAZZ_API_KEY;

export function JazzWrapper({ children }: { children: React.ReactNode }) {
  return (
    <JazzReactProvider
      sync={{
        peer: `wss://cloud.jazz.tools/?key=${apiKey}`,
      }}
      AccountSchema={GameAccount}
      authSecretStorageKey="jazz-auth-secret"
      defaultProfileName="unknown friend"
    >
      {children}
    </JazzReactProvider>
  );
}
