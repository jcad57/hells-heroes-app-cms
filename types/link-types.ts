export interface ExternalLinkItem {
  id: number;
  title: string;
  url: string;
  description: string | null;
}

export interface LocalFoodItem {
  id: number;
  name: string;
  address: string;
  description?: string | null;
}

export interface VendorItem {
  id: number;
  name: string;
  url: string;
  description?: string | null;
}

export type LinkEntityType = "external-link" | "local-food" | "vendor";

export interface DialogField {
  name: string;
  label: string;
  type: "text" | "url" | "textarea";
  required: boolean;
  placeholder?: string;
}
