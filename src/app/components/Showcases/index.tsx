"use client";

import { Spinner } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { NavbarLink } from "../Navbar";
import { Showcase } from "@/lib/mongodb";
import { ShowcaseCard } from "./ShowcaseCard";

export const Showcases: React.FC = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["getAllShowcases"],
    queryFn: () =>
      fetch("/api/88428708178/showcases").then((res) => res.json()),
    select: (data) => data.showcases,
  });

  const [showcases, setShowcases] = useState<Showcase[] | null>(data);

  useEffect(() => {
    setShowcases(data);
  }, [data]);

  if (isLoading) return <Spinner color="primary" size="lg" />;
  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="flex flex-col w-full items-start gap-6">
      <h1 className="text-3xl font-bold">Your Showcases</h1>
      {!showcases?.length && (
        <div className="flex gap-[6px]">
          <p className="text-xl text-default-500">
            You don&apos;t have any showcases yet. Create one
          </p>
          <NavbarLink href="/create" isSelected={false} className="text-xl">
            here
          </NavbarLink>
          <p className="text-xl text-default-500">to get started.</p>
        </div>
      )}
      {showcases && showcases.length > 0 && (
        <div className="grid grid-cols-4 gap-4">
          {showcases.map((showcase, i) => (
            <ShowcaseCard key={showcase.id} showcase={showcase} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};
