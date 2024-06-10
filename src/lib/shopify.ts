import { createStorefrontApiClient } from "@shopify/storefront-api-client";

// current shopify api_version: 2024-04 https://shopify.dev/docs/api/usage/versioning
// Storefront API private delegate access tokens should only be used in a server-to-server implementation.
export const shopifyClient = createStorefrontApiClient({
  storeDomain: process.env.SHOPIFY_STORE_URL || "",
  apiVersion: "2024-04",
  privateAccessToken: process.env.SHOPIFY_STOREFRONT_PRIVATE_ACCESS_TOKEN || "",
});
