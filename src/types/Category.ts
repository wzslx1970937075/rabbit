import type { Brands } from "./Brands";
import type { Goods } from "./Goods";

export interface Category {
  id: string;
  name: string;
  picture: string;
  saleInfo: string;
  children: Category[] | undefined;
  goods: Goods[] | undefined;
  saleProperties: SaleProperty[];
  brands: Brands[];

  layer: number;
  parent: Category | undefined;
}

interface SaleProperty {
  id: string;
  name: string;
  properties: Omit<SaleProperty, "properties">[];
}
