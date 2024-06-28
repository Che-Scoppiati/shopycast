import { createStorefrontApiClient } from "@shopify/storefront-api-client";

export const getAllProductsFromShopify = async (
  store_url: string,
  accessToken: string,
) => {
  if (!store_url || !accessToken) {
    return {
      shopifyData: null,
      errors: "missing args shopify",
      extensions: null,
    };
  }
  // current shopify api_version: 2024-04 https://shopify.dev/docs/api/usage/versioning
  // Storefront API private delegate access tokens should only be used in a server-to-server implementation.
  const shopifyClient = createStorefrontApiClient({
    storeDomain: store_url,
    apiVersion: "2024-04",
    privateAccessToken: accessToken,
  });
  if (!shopifyClient) {
    return {
      shopifyData: null,
      errors: "Shopify client not found",
      extensions: null,
    };
  }

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

// given gid://shopify/Shop/123456789, returns 123456789
export const extractShopId = (shopId: string) => {
  return shopId?.split("/").pop() || "";
};

export interface Product {
  id: string;
  availableForSale: boolean;
  title: string;
  handle: string;
  description: string;
  images: { edges: { node: { url: string } }[] };
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
              url
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
