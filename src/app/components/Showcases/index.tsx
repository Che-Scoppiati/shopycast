"use client";

import { Spinner } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Showcase } from "@/lib/mongodb";
import { ShowcaseCard } from "./ShowcaseCard";
import { NavbarLink } from "../Navbar";
import { CreateShowcaseModal } from "../CreateShowcaseModal";

export const Showcases: React.FC = () => {
  const [refetchShowcases, setRefetchShowcases] = useState(true);

  const { isLoading, error, data } = useQuery({
    queryKey: ["getAllShowcases"],
    queryFn: () =>
      fetch("/api/88428708178/showcases").then((res) => res.json()),
    select: (data) => data.showcases,
    enabled: refetchShowcases,
  });

  const [showcases, setShowcases] = useState<Showcase[] | null>(data);

  useEffect(() => {
    setShowcases(data);
    setRefetchShowcases(false);
  }, [data]);

  if (isLoading) return <Spinner color="primary" size="lg" />;
  if (error) return "An error has occurred: " + error.message;

  return (
    <div className="flex flex-col w-full items-start gap-6">
      <div className="flex w-full justify-between">
        <h1 className="text-3xl font-bold">Your Showcases</h1>
        <CreateShowcaseModal />
      </div>
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
        <div className="grid grid-cols-4 gap-6">
          {showcases.map((showcase, i) => (
            <ShowcaseCard
              key={showcase.id}
              showcase={showcase}
              index={i}
              setRefetchShowcases={setRefetchShowcases}
            />
          ))}
        </div>
      )}
    </div>
  );
};
