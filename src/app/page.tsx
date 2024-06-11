import { shopifyClient } from "@/lib/shopify";
import { FRAMES_BASE_PATH, appURL } from "@/lib/utils";
import { fetchMetadata } from "frames.js/next";
import { Metadata } from "next";
import Image from "next/image";

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
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {data &&
        data.products.nodes.map((product: any) => (
          <div key={product.id} className="flex flex-col items-center">
            <h2 className="text-2xl font-bold">{product.title}</h2>
            <p className="text-sm">{product.description}</p>
            <div className="flex flex-col items-center">
              {product.variants.edges.map((edge: any) => (
                <div key={edge.node.id}>
                  <Image
                    src={edge.node.image.url}
                    alt={product.title}
                    width={200}
                    height={200}
                  />
                  <p>
                    {edge.node.price.amount} {edge.node.price.currencyCode}
                  </p>
                  <p>{edge.node.availableForSale ? "Available" : "Sold out"}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
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
