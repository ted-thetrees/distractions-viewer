import { Distraction, CodaRow, CodaRowsResponse } from '@/types';

const CODA_API_BASE = 'https://coda.io/apis/v1';
const DOC_ID = 'x8nvwL5l1e';
const TABLE_ID = 'grid-BQE4pcweF2'; // Distractions | Regulars | Browsing

// Column IDs from the table
const COLUMNS = {
  name: 'c-yrhJnxU2ns',
  link: 'c-V60iC4UaYP',
  image: 'c-R5LP8UaCQf',
  scale: 'c-q3eAZofAM0',
  status: 'c-39S1Z-7QdP',
};

export async function fetchDistractions(): Promise<Distraction[]> {
  const token = process.env.CODA_API_TOKEN;
  
  if (!token) {
    throw new Error('CODA_API_TOKEN is not configured');
  }

  const url = `${CODA_API_BASE}/docs/${DOC_ID}/tables/${TABLE_ID}/rows`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 300 }, // Cache for 5 minutes
  });

  if (!response.ok) {
    throw new Error(`Coda API error: ${response.status} ${response.statusText}`);
  }

  const data: CodaRowsResponse = await response.json();
  
  // Transform and filter to only Live items
  const distractions = data.items
    .map((row) => transformCodaRow(row))
    .filter((d) => d.status === 'Live');

  return distractions;
}

function transformCodaRow(row: CodaRow): Distraction {
  const values = row.values;
  
  return {
    id: row.id,
    name: values[COLUMNS.name] || 'Untitled',
    link: values[COLUMNS.link] || '#',
    imageUrl: extractImageUrl(values[COLUMNS.image]),
    scale: values[COLUMNS.scale] || 0,
    status: values[COLUMNS.status] || 'Live',
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function extractImageUrl(imageValue: any): string | undefined {
  // Coda image fields can be strings or arrays
  if (!imageValue) return undefined;
  
  if (typeof imageValue === 'string') {
    // If it's already a URL, return it
    if (imageValue.startsWith('http')) return imageValue;
    // Otherwise it's a filename, we need to construct the Coda attachment URL
    return undefined; // TODO: Handle Coda attachment URLs
  }
  
  if (Array.isArray(imageValue) && imageValue.length > 0) {
    return extractImageUrl(imageValue[0]);
  }
  
  return undefined;
}

export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}