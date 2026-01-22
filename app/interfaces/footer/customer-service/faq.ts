export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQCategoryData {
  id: string;
  title: string;
  icon: string;
  items: FAQItem[];
}

export interface FAQData {
  categorias: FAQCategoryData[];
}
