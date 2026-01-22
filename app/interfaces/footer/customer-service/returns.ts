export interface ReturnItem {
  label: string;
  description: string;
}

export interface ReturnSection {
  id: string;
  title: string;
  icon: string;
  content: string;
  items: ReturnItem[];
}

export interface ReturnsData {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: ReturnSection[];
  importantNotes: string[];
}
