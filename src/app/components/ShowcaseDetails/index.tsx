"use client";
import { Accordion, AccordionItem } from "@nextui-org/accordion";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { Spinner, getKeyValue } from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";
import { useState } from "react";

const ShowcaseDetails = () => {
  const [isLoading, setIsLoading] = useState(true);

  let list = useAsyncList({
    async load({ signal }) {
      let res = await fetch("https://swapi.py4e.com/api/people/?search", {
        signal,
      });
      let json = await res.json();
      setIsLoading(false);

      return {
        items: json.results,
      };
    },
    async sort({ items, sortDescriptor }: { items: any; sortDescriptor: any }) {
      return {
        items: items.sort((a: any, b: any) => {
          let first = a[sortDescriptor.column];
          let second = b[sortDescriptor.column];
          let cmp =
            (parseInt(first) || first) < (parseInt(second) || second) ? -1 : 1;

          if (sortDescriptor.direction === "descending") {
            cmp *= -1;
          }

          return cmp;
        }),
      };
    },
  });

  let listProducts = {
    count: 3,
    next: null,
    previous: null,
    results: [
      {
        variantId: "T-Shirt Blue M",
        addedToCart: "10",
        wentToCheckout: "5",
        originCast: "0x1234",
      },
      {
        variantId: "T-Shirt White L",
        addedToCart: "20",
        wentToCheckout: "10",
        originCast: "0x5678",
      },
      {
        variantId: "T-Shirt Black S",
        addedToCart: "30",
        wentToCheckout: "15",
        originCast: "0x91011",
      },
    ],
  };
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-4xl font-bold">Showcase Detail</h1>
      <Accordion
        defaultExpandedKeys={["1", "2"]}
        selectionMode="multiple"
        className="px-0"
      >
        <AccordionItem
          key="1"
          aria-label="referrals"
          title="Referrals"
          classNames={{
            content: "pb-6",
          }}
        >
          <Table
            aria-label="Example table with client side sorting"
            sortDescriptor={list.sortDescriptor}
            onSortChange={list.sort}
            classNames={{
              table: "min-h-[400px]",
            }}
          >
            <TableHeader>
              <TableColumn key="name" allowsSorting>
                Referral User
              </TableColumn>
              <TableColumn key="height" allowsSorting>
                # Users who added to Cart
              </TableColumn>
              <TableColumn key="mass" allowsSorting>
                # Users who went to Checkout
              </TableColumn>
              <TableColumn key="birth_year" allowsSorting>
                Origin Cast
              </TableColumn>
            </TableHeader>
            <TableBody
              items={list.items}
              isLoading={isLoading}
              loadingContent={<Spinner label="Loading..." />}
            >
              {(item: any) => (
                <TableRow key={item.name}>
                  {(columnKey: any) => (
                    <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </AccordionItem>
        <AccordionItem key="2" aria-label="best-products" title="Best Products">
          <Table
            aria-label="Example table with client side sorting"
            sortDescriptor={list.sortDescriptor}
            onSortChange={list.sort}
          >
            <TableHeader>
              <TableColumn key="variantId" allowsSorting>
                Product Variant
              </TableColumn>
              <TableColumn key="addedToCart" allowsSorting>
                Added to Cart
              </TableColumn>
              <TableColumn key="wentToCheckout" allowsSorting>
                Checkout
              </TableColumn>
              <TableColumn key="originCast" allowsSorting>
                Origin Cast
              </TableColumn>
            </TableHeader>
            <TableBody>
              {listProducts.results.map((item) => (
                <TableRow key={item.variantId}>
                  {(columnKey: any) => (
                    <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ShowcaseDetails;
