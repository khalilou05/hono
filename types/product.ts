export interface Product {
  id: string;
  name: string;
  items: Items[];
}

interface Items {
  id: string;
  name: string;
}
