"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { NextUIProvider } from "@nextui-org/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { mainnet, base, baseSepolia } from "viem/chains";
import { createContext, useEffect, useState } from "react";

interface AppContextProps {
  activeShopId: string;
  setActiveShopId: (shopId: string) => void;
}

export const AppContext = createContext<AppContextProps | undefined>(undefined);

// Setup queryClient
const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [activeShopId, setActiveShopId] = useState<string>("");

  useEffect(() => {
    if (activeShopId) {
      localStorage?.setItem("activeShopId", activeShopId);
    }
  }, [activeShopId]);

  useEffect(() => {
    const shopId = localStorage?.getItem("activeShopId");
    if (shopId) setActiveShopId(shopId);
  }, []);

  return (
    <>
      <AppContext.Provider value={{ activeShopId, setActiveShopId }}>
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
              theme: "dark",
              accentColor: "#A620FF",
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
      </AppContext.Provider>
    </>
  );
};

export default Providers;
