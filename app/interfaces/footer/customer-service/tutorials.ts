// Interfaces para tutoriales de compra

export interface PurchaseStep {
  step: number;
  title: string;
  description: string;
  icon: string;
}

export interface HowToBuyData {
  title: string;
  subtitle: string;
  steps: PurchaseStep[];
}
