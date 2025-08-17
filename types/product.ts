export interface Product {
  id: string;
  name: string;
  options: Option[];
}

interface Option {
  id: string;
  name: string;
  isCustom: boolean;
  items: OptionItem[];
}

interface OptionItem {
  id: string;
  name: string;
}
