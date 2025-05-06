"use client";

import { State, WagmiProvider } from "wagmi";

import * as React from "react";
import { getWagmiConfig } from "@/config/wagmi.config";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export interface IClientProvider {
  children: React.ReactNode;
  inititalState: State | undefined;
}
export default function ClientProvider({ children, inititalState }: IClientProvider) {
  const [config] = React.useState(() => getWagmiConfig())
  const [queryClient] = React.useState(() => new QueryClient())

  return (
    <WagmiProvider config={config} initialState={inititalState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}
