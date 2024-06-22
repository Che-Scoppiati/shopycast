import { shopifyClient } from "@/lib/shopify";
import { FRAMES_BASE_PATH, appURL } from "@/lib/utils";
import { Button, Card, CardBody, CardHeader, Input, Image } from "@nextui-org/react";
import { fetchMetadata } from "frames.js/next";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const epochTimestamp = new Date().getTime();
  const url = new URL(`${FRAMES_BASE_PATH}?t=${epochTimestamp}`, appURL());
  return {
    other: await fetchMetadata(url).catch(() => ({})),
  };
}

export default async function Home() {
  const { data, errors, extensions } = await shopifyClient.request(
    getAllProductsQuery,
    {
      variables: {
        first: 10,
      },
    }
  );
  // console.log("shopify", { data, errors, extensions }, errors?.graphQLErrors);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-20">
      <div className="w-full flex flex-col gap-16">
        <h1 className="text-6xl font-bold w-fit m-auto">Onchain Shop</h1>
        <div className="w-full flex flex-col gap-16">
          <div className="w-full flex justify-between">
            <Input type="text" label="Your Shopify Key" className="w-[33%]" />
            <p className="text-xl w-[33%] text-end">
              Select your products and create a frame to embed on Farcaster!
            </p>
          </div>
          <div className="w-full flex flex-col gap-6">
            <div className="flex w-full justify-between">
              <h2 className="text-3xl font-bold w-fit">Select Products</h2>
              <Button size="md" color="success">
                Create Frame
              </Button>  
            </div>
            <div className="grid grid-cols-4 gap-6">
              {data &&
                data.products.nodes.map((product: any) => (
                  <Card className="p-3 gap-4" key={product.id}>
                    <CardHeader className="p-0 flex-col items-start gap-2">
                      <h4 className="font-bold text-large leading-none">{product.title}</h4>
                      <small className="text-default-500 leading-none">{product.description}</small>
                    </CardHeader>
                    <CardBody className="overflow-visible p-0">
                      {product.variants.edges.map((edge: any) => (
                        <div className="flex flex-col items-center gap-4" key={edge.node.id}>
                          <Image
                            src={edge.node.image.url}
                            alt={product.title}
                            className="object-cover rounded-xl aspect-square"
                            width={300}
                          />
                          <div className="flex w-full justify-between">
                            <div className="flex flex-col gap-1">
                              <p className="leading-none">
                                {edge.node.price.amount} {edge.node.price.currencyCode}
                              </p>
                              <p className="leading-none">
                                {edge.node.availableForSale ? "Available" : "Sold out"}
                              </p>
                            </div>
                            <Button color="success">
                              Buy
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardBody>
                  </Card>
                ))
              }
            </div>
          </div>
        </div>
      </div>
      
    </main>
  );
}

const getAllProductsQuery = `
  query allProducts($first: Int!) {
    shop {
      id
      name
      brand {
        logo {
          image {
            url
          }
        }
      }
    }
    products(first: $first) {
      nodes {
        id
        availableForSale
        title
        handle
        description(truncateAt: 100)
        images(first: 3) {
          edges {
            node {
              id
            }
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              availableForSale
              price {
                amount
                currencyCode
              }
              image {
                url
              }
            }
          }
        }
      }
    }
  }
`;
