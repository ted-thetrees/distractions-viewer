'use client';

import { Distraction } from '@/types';
import DistractionCard from './DistractionCard';

interface MasonryGridProps {
  distractions: Distraction[];
}

export default function MasonryGrid({ distractions }: MasonryGridProps) {
  if (distractions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>No distractions found.</p>
      </div>
    );
  }

  return (
    <div className="masonry-grid">
      {distractions.map((distraction) => (
        <DistractionCard 
          key={distraction.id} 
          distraction={distraction} 
        />
      ))}
    </div>
  );
}