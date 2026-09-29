import React, { useState } from 'react';
import { GENERATED_IMAGES } from '../data/destinationsData';

interface DestinationArtworkProps {
  imageKey: string;
  customImageUrl?: string;
  alt: string;
  className?: string;
}

const PALETTES: Record<
  string,
  { skyTop: string; skyBottom: string; sun: string; hillBack: string; hillFront: string; accent: string; water: string }
> = {
  hyderabad: { skyTop: '#1E1B4B', skyBottom: '#D97706', sun: '#FDE68A', hillBack: '#431407', hillFront: '#78350F', accent: '#F59E0B', water: '#1E293B' },
  visakhapatnam: { skyTop: '#0C4A6E', skyBottom: '#38BDF8', sun: '#FEF08A', hillBack: '#065F46', hillFront: '#047857', accent: '#FBBF24', water: '#0284C7' },
  tirupati: { skyTop: '#451A03', skyBottom: '#F59E0B', sun: '#FEF3C7', hillBack: '#14532D', hillFront: '#166534', accent: '#FBBF24', water: '#B45309' },
  srisailam: { skyTop: '#064E3B', skyBottom: '#34D399', sun: '#FDE68A', hillBack: '#115E59', hillFront: '#0F766E', accent: '#F59E0B', water: '#0D9488' },
  goa: { skyTop: '#9A3412', skyBottom: '#FB923C', sun: '#FEF08A', hillBack: '#3F6212', hillFront: '#15803D', accent: '#FDE047', water: '#0369A1' },
  mumbai: { skyTop: '#1E293B', skyBottom: '#F97316', sun: '#FDE047', hillBack: '#334155', hillFront: '#1E293B', accent: '#FB923C', water: '#0F172A' },
  delhi: { skyTop: '#7C2D12', skyBottom: '#FDBA74', sun: '#FEF3C7', hillBack: '#9A3412', hillFront: '#7C2D12', accent: '#FDE68A', water: '#431407' },
  jaipur: { skyTop: '#831843', skyBottom: '#FB7185', sun: '#FEF08A', hillBack: '#9D174D', hillFront: '#BE123C', accent: '#FDE047', water: '#4C0519' },
  agra: { skyTop: '#312E81', skyBottom: '#F9A8D4', sun: '#FFFBEB', hillBack: '#4338CA', hillFront: '#F8FAFC', accent: '#E2E8F0', water: '#1E1B4B' },
  varanasi: { skyTop: '#431407', skyBottom: '#F97316', sun: '#FEF08A', hillBack: '#7C2D12', hillFront: '#9A3412', accent: '#FACC15', water: '#1E3A8A' },
  kerala: { skyTop: '#064E3B', skyBottom: '#6EE7B7', sun: '#FEF9C3', hillBack: '#065F46', hillFront: '#047857', accent: '#FDE047', water: '#047857' },
  kashmir: { skyTop: '#0F172A', skyBottom: '#7DD3FC', sun: '#FFFBEB', hillBack: '#E2E8F0', hillFront: '#334155', accent: '#38BDF8', water: '#0369A1' },
  bengaluru: { skyTop: '#14532D', skyBottom: '#86EFAC', sun: '#FEF9C3', hillBack: '#166534', hillFront: '#15803D', accent: '#FDE047', water: '#065F46' },
  chennai: { skyTop: '#7C2D12', skyBottom: '#FBBF24', sun: '#FEF9C3', hillBack: '#9A3412', hillFront: '#B45309', accent: '#FDE68A', water: '#0369A1' },
  mysuru: { skyTop: '#1E1B4B', skyBottom: '#C084FC', sun: '#FEF08A', hillBack: '#3B0764', hillFront: '#581C87', accent: '#FACC15', water: '#1E1B4B' },
  ooty: { skyTop: '#0F172A', skyBottom: '#67E8F9', sun: '#FEF9C3', hillBack: '#15803D', hillFront: '#166534', accent: '#A7F3D0', water: '#0E7490' },
  hampi: { skyTop: '#78350F', skyBottom: '#FBBF24', sun: '#FEF3C7', hillBack: '#92400E', hillFront: '#B45309', accent: '#FDE68A', water: '#1E3A8A' },
  udaipur: { skyTop: '#1E3A8A', skyBottom: '#FDBA74', sun: '#FFFBEB', hillBack: '#312E81', hillFront: '#FFF7ED', accent: '#F59E0B', water: '#1D4ED8' },
  rishikesh: { skyTop: '#0F766E', skyBottom: '#99F6E4', sun: '#FEF9C3', hillBack: '#115E59', hillFront: '#134E4A', accent: '#2DD4BF', water: '#0D9488' },
  amritsar: { skyTop: '#1E1B4B', skyBottom: '#F59E0B', sun: '#FEF08A', hillBack: '#78350F', hillFront: '#D97706', accent: '#FACC15', water: '#1E3A8A' },
  andaman: { skyTop: '#0369A1', skyBottom: '#67E8F9', sun: '#FEF9C3', hillBack: '#047857', hillFront: '#059669', accent: '#38BDF8', water: '#0891B2' },
};

export const DestinationArtwork: React.FC<DestinationArtworkProps> = ({
  imageKey,
  customImageUrl,
  alt,
  className = 'w-full h-full object-cover',
}) => {
  const [imgError, setImgError] = useState(false);

  const resolvedPhotoUrl =
    customImageUrl ||
    (imageKey === 'hyderabad'
      ? GENERATED_IMAGES.hyderabad
      : imageKey === 'kerala'
      ? GENERATED_IMAGES.kerala
      : imageKey === 'kashmir'
      ? GENERATED_IMAGES.kashmir
      : imageKey === 'goa'
      ? GENERATED_IMAGES.goa
      : imageKey === 'jaipur'
      ? GENERATED_IMAGES.hero
      : undefined);

  if (resolvedPhotoUrl && !imgError) {
    return (
      <img
        src={resolvedPhotoUrl}
        alt={alt}
        referrerPolicy="no-referrer"
        onError={() => setImgError(true)}
        className={className}
      />
    );
  }

  const p = PALETTES[imageKey] || PALETTES.hyderabad;
  const uid = `art-${imageKey}`;

  return (
    <div className={`relative overflow-hidden select-none ${className}`} role="img" aria-label={alt}>
      <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" className="w-full h-full block">
        <defs>
          <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={p.skyTop} />
            <stop offset="72%" stopColor={p.skyBottom} />
            <stop offset="100%" stopColor={p.water} />
          </linearGradient>
          <radialGradient id={`${uid}-sun`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={p.sun} stopOpacity="0.95" />
            <stop offset="100%" stopColor={p.sun} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Sky Backdrop */}
        <rect width="600" height="400" fill={`url(#${uid}-sky)`} />

        {/* Glowing Sun / Moon */}
        <circle cx="440" cy="120" r="85" fill={`url(#${uid}-sun)`} />
        <circle cx="440" cy="120" r="32" fill={p.sun} opacity="0.9" />

        {/* Distant Mountain / Hill Silhouettes */}
        <path
          d="M0,275 Q110,180 230,245 T460,210 T600,255 L600,320 L0,320 Z"
          fill={p.hillBack}
          opacity="0.72"
        />
        <path
          d="M0,295 Q160,230 310,275 T600,250 L600,330 L0,330 Z"
          fill={p.hillFront}
          opacity="0.88"
        />

        {/* Landmark Specific Architectural Silhouette */}
        {imageKey === 'tirupati' || imageKey === 'chennai' ? (
          /* Sacred Dravidian Gopuram Silhouette */
          <g fill={p.accent} opacity="0.92" transform="translate(230, 115)">
            <polygon points="70,0 115,165 25,165" fill="#78350F" />
            <rect x="32" y="135" width="76" height="12" rx="2" />
            <rect x="38" y="108" width="64" height="10" rx="2" />
            <rect x="44" y="82" width="52" height="10" rx="2" />
            <rect x="50" y="56" width="40" height="10" rx="2" />
            <rect x="56" y="32" width="28" height="9" rx="2" />
            <circle cx="70" cy="14" r="6" />
            {/* Golden Vimana Dome */}
            <path d="M145,165 Q175,110 205,165 Z" fill="#FACC15" />
          </g>
        ) : imageKey === 'agra' || imageKey === 'amritsar' || imageKey === 'mysuru' || imageKey === 'udaipur' ? (
          /* Grand Royal Dome & Minarets / Palace Silhouette */
          <g transform="translate(175, 110)">
            <rect x="20" y="155" width="210" height="25" fill={p.hillFront} />
            <rect x="55" y="95" width="140" height="60" fill={p.accent} opacity="0.92" />
            <path d="M85,95 Q125,20 165,95 Z" fill={p.sun} />
            <path d="M60,95 Q72,62 84,95 Z" fill={p.sun} opacity="0.85" />
            <path d="M166,95 Q178,62 190,95 Z" fill={p.sun} opacity="0.85" />
            <rect x="24" y="55" width="10" height="100" fill={p.sun} opacity="0.9" />
            <rect x="216" y="55" width="10" height="100" fill={p.sun} opacity="0.9" />
          </g>
        ) : imageKey === 'visakhapatnam' || imageKey === 'andaman' ? (
          /* Coastal Bay, Lighthouse & Submarine / Island Silhouette */
          <g transform="translate(120, 145)">
            <path d="M180,130 L200,50 L214,50 L234,130 Z" fill="#F8FAFC" />
            <rect x="196" y="36" width="22" height="14" fill="#EF4444" />
            <ellipse cx="105" cy="148" rx="68" ry="14" fill="#0F172A" />
            <rect x="88" y="124" width="28" height="16" rx="3" fill="#0F172A" />
          </g>
        ) : imageKey === 'hampi' ? (
          /* Iconic Hampi Stone Chariot Silhouette */
          <g transform="translate(215, 125)" fill={p.accent}>
            <rect x="35" y="75" width="100" height="70" rx="4" fill="#92400E" />
            <polygon points="85,15 135,75 35,75" fill="#D97706" />
            <circle cx="58" cy="145" r="22" fill="#451A03" stroke={p.sun} strokeWidth="5" />
            <circle cx="112" cy="145" r="22" fill="#451A03" stroke={p.sun} strokeWidth="5" />
          </g>
        ) : (
          /* Classic Indian Heritage Archways, Bridge or Hill Pavilion */
          <g transform="translate(190, 125)">
            <rect x="30" y="70" width="160" height="90" fill={p.hillBack} />
            <path d="M65,160 L65,110 Q110,75 155,110 L155,160 Z" fill={p.sun} opacity="0.85" />
            <polygon points="30,70 110,25 190,70" fill={p.accent} opacity="0.9" />
          </g>
        )}

        {/* Water Reflection / Foreground River or Sea */}
        <rect x="0" y="305" width="600" height="95" fill={p.water} opacity="0.92" />
        <g fill={p.sun} opacity="0.35">
          <rect x="220" y="322" width="160" height="3" rx="1.5" />
          <rect x="245" y="336" width="110" height="3" rx="1.5" />
          <rect x="270" y="350" width="70" height="2" rx="1" />
        </g>
      </svg>
    </div>
  );
};
