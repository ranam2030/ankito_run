// Backwards-compat shim. New code should import from "./products" directly.
// PRODUCT here = the first product in the PRODUCTS list.

import { PRODUCTS } from "./products";

export { formatBDT, PRODUCTS, getProduct } from "./products";
export const PRODUCT = PRODUCTS[0];
