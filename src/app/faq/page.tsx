"use client";

import { Suspense } from "react";
import { Navbar } from "@/app/components/Navbar";
import { Faq } from "@/app/components/Faq";

export default function Dashboard() {
  return (
    <>
      <Suspense>
        <Navbar />
      </Suspense>
      <Faq />
    </>
  );
}
