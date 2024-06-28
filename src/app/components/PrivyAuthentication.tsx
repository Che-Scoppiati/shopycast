"use client";

import { useRouter } from "next/navigation";
import { usePrivy } from "@privy-io/react-auth";

export default function PrivyAuthentication() {
  const router = useRouter();
  const { ready, authenticated, user } = usePrivy();

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
