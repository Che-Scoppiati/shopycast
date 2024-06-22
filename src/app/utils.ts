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
