"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Image,
  Spinner,
} from "@nextui-org/react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { NavbarLink } from "../Navbar";

interface Showcase {
  id: string;
  shopId: string;
  products: {
    id: string;
    name: string;
    description: string;
    image: string;
    currency: string;
    variants: {
      id: string;
      name: string;
      value: string;
      price: number;
    }[];
  }[];
}

export const Showcases: React.FC = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["getAllShowcases"],
    queryFn: () => fetch("/api/francoshop/showcases").then((res) => res.json()),
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
            <Card key={showcase.id} className={"p-3 gap-4 bg-white"}>
              <CardHeader className="flex w-full justify-between p-0">
                <div className="flex flex-col items-start gap-1">
                  <h4 className="font-bold text-large leading-none">
                    Showcase {i + 1}
                  </h4>
                  <small className="text-default-500 leading-none">
                    {showcase.products.length} product(s)
                  </small>
                </div>
                <Button size="md" color="primary" onClick={() => {}}>
                  Copy URL
                </Button>
              </CardHeader>
              <CardBody className="overflow-visible p-0">
                <div className="grid items-center gap-4 grid-cols-3">
                  {showcase.products.map((product) => (
                    <Image
                      key={product.id}
                      alt="Product image"
                      className="object-cover rounded-xl"
                      src={product.image}
                      width={80}
                    />
                  ))}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
