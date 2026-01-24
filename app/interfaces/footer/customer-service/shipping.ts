export interface ShippingItem {
  label: string;
  description: string;
}

export interface ShippingSection {
  id: string;
  title: string;
  icon: string;
  content: string;
  items: ShippingItem[];
}

export interface ShippingContact {
  title: string;
  description: string;
  phone: string;
  email: string;
  schedule: string;
}

export interface ShippingData {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: ShippingSection[];
  importantNotes: string[];
  contact: ShippingContact;
}
