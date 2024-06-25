import { createStorefrontApiClient } from "@shopify/storefront-api-client";

// current shopify api_version: 2024-04 https://shopify.dev/docs/api/usage/versioning
// Storefront API private delegate access tokens should only be used in a server-to-server implementation.
export const shopifyClient = createStorefrontApiClient({
  storeDomain: process.env.SHOPIFY_STORE_URL || "",
  apiVersion: "2024-04",
  privateAccessToken: process.env.SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN || "",
});

export const getAllProducts = async () => {
  const {
    data: shopifyData,
    errors,
    extensions,
  } = await shopifyClient.request(getAllProductsQuery, {
    variables: {
      first: 10,
    },
  });

  return { shopifyData, errors, extensions };
};

export interface Product {
  id: string;
  availableForSale: boolean;
  title: string;
  handle: string;
  description: string;
  images: { edges: { node: { id: string } }[] };
  variants: {
    edges: {
      node: {
        id: string;
        availableForSale: boolean;
        price: { amount: string; currencyCode: string };
        image: { url: string };
        selectedOptions: { name: string; value: string }[];
      };
    }[];
  };
}

export const getAllProductsQuery = `
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
              selectedOptions {
                name
                value
              }
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
