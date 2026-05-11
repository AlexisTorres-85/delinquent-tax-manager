import { Badge } from '@/components/ui/badge';
import type { ParcelStatus, ParcelStage } from '@/data/parcels/types';

// ─── Status Colors (bold/solid) ─────────────────────────────────────────────
type ColorStyle = { bg: string; text: string };

const STATUS_COLORS: Record<ParcelStatus, ColorStyle> = {
  'Delinquent':              { bg: '#dc2626', text: '#fff' }, // red-600
  'Payment Plan':            { bg: '#d97706', text: '#fff' }, // amber-600
  'Early Enforcement':       { bg: '#ea580c', text: '#fff' }, // orange-600
  'Tax Deed Preparation':    { bg: '#be123c', text: '#fff' }, // rose-700
  'Advertisement / Waiting': { bg: '#2563eb', text: '#fff' }, // blue-600
  'Auction / Sale':          { bg: '#7c3aed', text: '#fff' }, // violet-600
  'Post-Deed Processing':    { bg: '#0d9488', text: '#fff' }, // teal-600
  'Financial Processing':    { bg: '#16a34a', text: '#fff' }, // green-600
  'On Hold':                 { bg: '#6b7280', text: '#fff' }, // gray-500
  'Review':                  { bg: '#0891b2', text: '#fff' }, // cyan-600
  'Legal':                   { bg: '#1d4ed8', text: '#fff' }, // blue-700
  'Complete':                { bg: '#15803d', text: '#fff' }, // green-700
};

// ─── Stage Colors (tonal – lighter hue of parent status) ────────────────────
const STAGE_COLORS: Record<ParcelStage, ColorStyle> = {
  // Delinquent → red tones (light → dark as severity increases)
  'Initial Delinquency':       { bg: '#fee2e2', text: '#991b1b' }, // red-100 / red-800
  'Early Notice Issued':       { bg: '#fecaca', text: '#b91c1c' }, // red-200 / red-700
  'Final Notice Issued':       { bg: '#fca5a5', text: '#fff' },    // red-300 / white
  'Letter Rpt Expiration':     { bg: '#f87171', text: '#7f1d1d' }, // red-400 / red-900
  '90-Day Expiration Window':  { bg: '#ef4444', text: '#fff' },    // red-500 / white
  'Pre-Enforcement Review':    { bg: '#dc2626', text: '#fff' },    // red-600 / white
  'Escalation Ready':          { bg: '#991b1b', text: '#fff' },    // red-800 / white

  // Payment Plan → amber tones
  'In Payment Plan':            { bg: '#fef3c7', text: '#92400e' }, // amber-100 / amber-800
  'Payment Plan Letter Sent':   { bg: '#fde68a', text: '#78350f' }, // amber-200 / amber-900

  // Early Enforcement → orange tones
  'Title Search':               { bg: '#ffedd5', text: '#9a3412' }, // orange-100 / orange-800
  'Notice of Tax Deed App':     { bg: '#fed7aa', text: '#9a3412' }, // orange-200 / orange-800
  'Letter of Affidavit':        { bg: '#fdba74', text: '#7c2d12' }, // orange-300 / orange-900
  'Owner/Occupant Notification':{ bg: '#f97316', text: '#fff' },    // orange-500 / white
  'Utility Notification':       { bg: '#ea580c', text: '#fff' },    // orange-600 / white

  // Tax Deed Preparation → rose tones
  'Prepare Tax Deed':                       { bg: '#ffe4e6', text: '#9f1239' }, // rose-100 / rose-800
  'Create Tax Deed Verify & Taxes Form':    { bg: '#fecdd3', text: '#9f1239' }, // rose-200 / rose-800
  'Finalize Tax Deed Verify & Taxes Form':  { bg: '#fda4af', text: '#881337' }, // rose-300 / rose-900
  'Create County Clerk Memo':               { bg: '#fb7185', text: '#fff' },    // rose-400 / white
  'Submit to County Clerk':                 { bg: '#f43f5e', text: '#fff' },    // rose-500 / white
  'Submit to P&D':                          { bg: '#e11d48', text: '#fff' },    // rose-600 / white
  'Treasurer Review':                       { bg: '#be123c', text: '#fff' },    // rose-700 / white
  'Finance Committee Review':               { bg: '#9f1239', text: '#fff' },    // rose-800 / white

  // Advertisement / Waiting → blue tones
  'Advertise Tax Deed':            { bg: '#dbeafe', text: '#1e40af' }, // blue-100 / blue-800
  'Post Advertisement Wait Period':{ bg: '#bfdbfe', text: '#1e3a8a' }, // blue-200 / blue-900

  // Auction / Sale → violet tones
  'Send to Auction':          { bg: '#ede9fe', text: '#5b21b6' }, // violet-100 / violet-800
  'Finalize Sale':            { bg: '#ddd6fe', text: '#4c1d95' }, // violet-200 / violet-900
  'Over the Counter Sales':   { bg: '#c4b5fd', text: '#4c1d95' }, // violet-300 / violet-900

  // Post-Deed Processing → teal tones
  'Complete Tax Deed':        { bg: '#ccfbf1', text: '#115e59' }, // teal-100 / teal-800
  'County Tax Deed':          { bg: '#99f6e4', text: '#134e4a' }, // teal-200 / teal-900
  'Eviction Proceedings':     { bg: '#5eead4', text: '#134e4a' }, // teal-300 / teal-900
  'Quit Claim':               { bg: '#2dd4bf', text: '#fff' },    // teal-400 / white

  // Financial Processing → green tones
  'Finance Journal Entry':       { bg: '#dcfce7', text: '#166534' }, // green-100 / green-800
  'Proceeds Notice':             { bg: '#bbf7d0', text: '#14532d' }, // green-200 / green-900
  'Proceeds Affidavit Returned': { bg: '#86efac', text: '#14532d' }, // green-300 / green-900
  'Proceeds Check Issued':       { bg: '#4ade80', text: '#14532d' }, // green-400 / green-900

  // Review → cyan tones
  'Legal Description Review':     { bg: '#cffafe', text: '#155e75' }, // cyan-100 / cyan-800
  'Legal Description Correction': { bg: '#a5f3fc', text: '#164e63' }, // cyan-200 / cyan-900
  'Awaiting Legal Description':   { bg: '#67e8f9', text: '#164e63' }, // cyan-300 / cyan-900

  // Legal → blue tones
  'Legal Description Verification': { bg: '#dbeafe', text: '#1e3a8a' }, // blue-100 / blue-900

  // On Hold → gray tones
  'Bankruptcy':              { bg: '#f3f4f6', text: '#374151' }, // gray-100 / gray-700
  'Litigation / Legal Hold': { bg: '#e5e7eb', text: '#374151' }, // gray-200 / gray-700
  'Appeal Pending':          { bg: '#d1d5db', text: '#1f2937' }, // gray-300 / gray-800
  'Estate / Probate':        { bg: '#9ca3af', text: '#fff' },    // gray-400 / white
  'Administrative Review':   { bg: '#6b7280', text: '#fff' },    // gray-500 / white
  'Hardship Review':         { bg: '#4b5563', text: '#fff' },    // gray-600 / white

  // Complete → green tones
  'Paid in Full':    { bg: '#bbf7d0', text: '#14532d' }, // green-200 / green-900
  'Move to Treasurer': { bg: '#86efac', text: '#14532d' }, // green-300 / green-900
};

// ─── Components ─────────────────────────────────────────────────────────────

export function StatusBadge({ status }: { status: ParcelStatus }) {
  const { bg, text } = STATUS_COLORS[status];
  return (
    <Badge style={{ backgroundColor: bg, color: text, borderColor: 'transparent', whiteSpace: 'nowrap' }}>
      {status}
    </Badge>
  );
}

export function StageBadge({ stage }: { stage: ParcelStage }) {
  const { bg, text } = STAGE_COLORS[stage];
  return (
    <Badge style={{ backgroundColor: bg, color: text, borderColor: 'transparent', whiteSpace: 'nowrap' }}>
      {stage}
    </Badge>
  );
}
