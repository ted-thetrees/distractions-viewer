export interface Distraction {
  id: string;
  name: string;
  link: string;
  imageUrl?: string;
  scale: number;
  status: 'Live' | 'Archived';
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CodaRow {
  id: string;
  type: string;
  href: string;
  name: string;
  index: number;
  createdAt: string;
  updatedAt: string;
  browserLink: string;
  values: {
    [key: string]: any;
  };
}

export interface CodaRowsResponse {
  items: CodaRow[];
  href: string;
  nextPageToken?: string;
  nextPageLink?: string;
}

export interface CategoryConfig {
  icon: string;  // Font Awesome icon name
  label: string;
  color?: string;
}

export const CATEGORIES: Record<string, CategoryConfig> = {
  'ai': { icon: 'robot', label: 'AI' },
  'video': { icon: 'youtube', label: 'Video' },
  'social': { icon: 'share-nodes', label: 'Social' },
  'news': { icon: 'newspaper', label: 'News' },
  'dev': { icon: 'code', label: 'Dev' },
  'design': { icon: 'palette', label: 'Design' },
  'music': { icon: 'music', label: 'Music' },
  'photo': { icon: 'camera', label: 'Photo' },
  'tools': { icon: 'wrench', label: 'Tools' },
  'shopping': { icon: 'cart-shopping', label: 'Shopping' },
  'learning': { icon: 'graduation-cap', label: 'Learning' },
  'productivity': { icon: 'list-check', label: 'Productivity' },
  'other': { icon: 'link', label: 'Link' },
};