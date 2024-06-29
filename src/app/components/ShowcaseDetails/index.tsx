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

  return (
    <div>
      <h1>Showcase Detail</h1>
      <h2>Name</h2>
      <h2>Products</h2>
      <Accordion>
        <AccordionItem key="1" aria-label="products" title="Product List">
          List of products
        </AccordionItem>
      </Accordion>

      <h2>Stats</h2>
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
            Name
          </TableColumn>
          <TableColumn key="height" allowsSorting>
            Height
          </TableColumn>
          <TableColumn key="mass" allowsSorting>
            Mass
          </TableColumn>
          <TableColumn key="birth_year" allowsSorting>
            Birth year
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
    </div>
  );
};

export default ShowcaseDetails;
