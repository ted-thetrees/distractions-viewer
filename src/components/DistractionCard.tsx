'use client';

import { Distraction, CATEGORIES } from '@/types';
import { extractDomain, getRelativeTime } from '@/lib/coda';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRobot, faNewspaper, faCode, faPalette, faMusic, 
  faCamera, faWrench, faCartShopping, faGraduationCap,
  faListCheck, faLink, faShareNodes
} from '@fortawesome/free-solid-svg-icons';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

// Map category icon names to actual icons
const iconMap: Record<string, IconDefinition> = {
  'robot': faRobot,
  'youtube': faYoutube,
  'share-nodes': faShareNodes,
  'newspaper': faNewspaper,
  'code': faCode,
  'palette': faPalette,
  'music': faMusic,
  'camera': faCamera,
  'wrench': faWrench,
  'cart-shopping': faCartShopping,
  'graduation-cap': faGraduationCap,
  'list-check': faListCheck,
  'link': faLink,
};

interface DistractionCardProps {
  distraction: Distraction;
}

export default function DistractionCard({ distraction }: DistractionCardProps) {
  const domain = extractDomain(distraction.link);
  const timeAgo = getRelativeTime(distraction.createdAt);
  const category = distraction.category || 'other';
  const categoryConfig = CATEGORIES[category] || CATEGORIES.other;
  const icon = iconMap[categoryConfig.icon] || faLink;

  // Placeholder image if none provided
  const imageUrl = distraction.imageUrl || 
    `https://placehold.co/600x375/e2e8f0/64748b?text=${encodeURIComponent(domain)}`;

  const handleClick = () => {
    window.open(distraction.link, '_blank', 'noopener,noreferrer');
  };

  return (
    <article 
      className="distraction-card"
      onClick={handleClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      <div className="card-image-container">
        <img 
          src={imageUrl}
          alt={distraction.name}
          className="card-image"
          loading="lazy"
        />
        <div className="category-pill">
          <FontAwesomeIcon icon={icon} className="w-3 h-3" />
          <span>{categoryConfig.label}</span>
        </div>
      </div>
      
      <div className="card-content">
        <h2 className="card-title">{distraction.name}</h2>
        <div className="card-meta">
          <span className="card-domain">
            <img 
              src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
              alt=""
              className="domain-favicon"
            />
            {domain}
          </span>
          <span>·</span>
          <span>{timeAgo}</span>
        </div>
      </div>
    </article>
  );
}