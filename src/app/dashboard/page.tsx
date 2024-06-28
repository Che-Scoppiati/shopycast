import { Suspense } from "react";
import { Navbar } from "../components/Navbar";
import { Showcases } from "@/app/components/Showcases";
import { Shops } from "../components/Shops";
import PrivyAuthentication from "@/app/components/PrivyAuthentication";

export default function Home() {
  return (
    <>
      <Suspense>
        <PrivyAuthentication />
      </Suspense>
      <Suspense>
        <Navbar />
      </Suspense>
      <Shops />
      <Showcases />
    </>
  );
}
