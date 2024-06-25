"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

export const RedirectToHome = () => {
  useEffect(() => {
    redirect("/");
  });
  return <></>;
};
