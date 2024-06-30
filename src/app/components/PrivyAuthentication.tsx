"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";
import { useEffect } from "react";

export default function PrivyAuthentication() {
  const router = useRouter();
  const { ready, authenticated, login } = usePrivy();

  const searchParams = useSearchParams();

  const triggerLogin = searchParams.get("login") === "true";

  useEffect(() => {
    if (triggerLogin) {
      login();
    }
  }, []);

  if (!ready) {
    // Do nothing while the PrivyProvider initializes with updated user state
    return <></>;
  }

  if (ready && !authenticated) {
    // Replace this code with however you'd like to handle an unauthenticated user
    // As an example, you might redirect them to a login page
    router.push("/");
  }

  if (ready && authenticated) {
    // Replace this code with however you'd like to handle an authenticated user
    return <></>;
  }
}
