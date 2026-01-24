export interface LegalSection {
  id: string;
  title: string;
  content: string[];
}

export interface LegalPageData {
  lastUpdated: string;
  sections: LegalSection[];
}

export interface LegalPageConfig {
  title: string;
  subtitle: string;
  lastUpdatedNote: string;
  footerTitle?: string;
  footerContent?: string[];
}
