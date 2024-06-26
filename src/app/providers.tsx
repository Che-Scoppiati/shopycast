"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mainnet, base, baseSepolia } from "viem/chains";

// Setup queryClient
const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID || ""}
        config={{
          defaultChain: base,
          supportedChains: [mainnet, base, baseSepolia],
          loginMethods: ["email", "wallet", "farcaster"],
          // support coinbase smart wallet aswell
          externalWallets: {
            coinbaseWallet: {
              connectionOptions: "all",
            },
          },
          appearance: {
            theme: "light",
            accentColor: "#676FFF",
            logo: "https://onchain-shop.vercel.app/logo.png",
          },
          // Create embedded wallets for users who don't have a wallet
          embeddedWallets: {
            createOnLogin: "users-without-wallets",
          },
        }}
      >
        <NextUIProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </NextUIProvider>
      </PrivyProvider>
    </>
  );
};

export default Providers;
