"use client";

import { Spinner } from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Showcase } from "@/lib/mongodb";
import { ShowcaseCard } from "./ShowcaseCard";
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
      <div className="flex w-full justify-between items-end">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Your Showcases</h1>
          {showcases?.length && showcases?.length > 0 ? (
            <h2 className="text-lg text-default-500">
              Click on a Showcase to view, edit or delete it
            </h2>
          ) : (
            <div className="flex gap-[6px]">
              <h2 className="text-lg text-default-500">
                You don&apos;t have any showcases yet. To get started, create
                one by clicking the button.
              </h2>
            </div>
          )}
        </div>
        <CreateShowcaseModal setRefetchShowcases={setRefetchShowcases} />
      </div>
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
