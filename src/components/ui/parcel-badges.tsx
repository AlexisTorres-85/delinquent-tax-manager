import { Badge } from '@/components/ui/badge';
import type { ParcelStatus, ParcelStage } from '@/data/parcels/types';

// ─── Status dot colors ───────────────────────────────────────────────────────
const STATUS_DOT_COLOR: Record<ParcelStatus, string> = {
  'Delinquent':              '#dc2626', // red-600
  'Payment Plan':            '#d97706', // amber-600
  'Early Enforcement':       '#ea580c', // orange-600
  'Tax Deed Preparation':    '#be123c', // rose-700
  'Advertisement / Waiting': '#2563eb', // blue-600
  'Auction / Sale':          '#7c3aed', // violet-600
  'Post-Deed Processing':    '#0d9488', // teal-600
  'Financial Processing':    '#16a34a', // green-600
  'On Hold':                 '#6b7280', // gray-500
  'Review':                  '#0891b2', // cyan-600
  'Legal':                   '#1d4ed8', // blue-700
  'Complete':                '#15803d', // green-700
};

// ─── Stage → parent status mapping (for dot color) ───────────────────────────
const STAGE_TO_STATUS: Record<ParcelStage, ParcelStatus> = {
  // Delinquent
  'Initial Delinquency':       'Delinquent',
  'Early Notice Issued':       'Delinquent',
  'Final Notice Issued':       'Delinquent',
  'Letter Rpt Expiration':     'Delinquent',
  '90-Day Expiration Window':  'Delinquent',
  'Pre-Enforcement Review':    'Delinquent',
  'Escalation Ready':          'Delinquent',
  // Payment Plan
  'In Payment Plan':           'Payment Plan',
  'Payment Plan Letter Sent':  'Payment Plan',
  // Early Enforcement
  'Title Search':                'Early Enforcement',
  'Notice of Tax Deed App':      'Early Enforcement',
  'Letter of Affidavit':         'Early Enforcement',
  'Owner/Occupant Notification': 'Early Enforcement',
  'Utility Notification':        'Early Enforcement',
  // Tax Deed Preparation
  'Prepare Tax Deed':                      'Tax Deed Preparation',
  'Create Tax Deed Verify & Taxes Form':   'Tax Deed Preparation',
  'Finalize Tax Deed Verify & Taxes Form': 'Tax Deed Preparation',
  'Create County Clerk Memo':              'Tax Deed Preparation',
  'Submit to County Clerk':                'Tax Deed Preparation',
  'Submit to P&D':                         'Tax Deed Preparation',
  'Treasurer Review':                      'Tax Deed Preparation',
  'Finance Committee Review':              'Tax Deed Preparation',
  // Advertisement / Waiting
  'Advertise Tax Deed':             'Advertisement / Waiting',
  'Post Advertisement Wait Period': 'Advertisement / Waiting',
  // Auction / Sale
  'Send to Auction':        'Auction / Sale',
  'Finalize Sale':          'Auction / Sale',
  'Over the Counter Sales': 'Auction / Sale',
  // Post-Deed Processing
  'Complete Tax Deed':    'Post-Deed Processing',
  'County Tax Deed':      'Post-Deed Processing',
  'Eviction Proceedings': 'Post-Deed Processing',
  'Quit Claim':           'Post-Deed Processing',
  // Financial Processing
  'Finance Journal Entry':       'Financial Processing',
  'Proceeds Notice':             'Financial Processing',
  'Proceeds Affidavit Returned': 'Financial Processing',
  'Proceeds Check Issued':       'Financial Processing',
  // Review
  'Legal Description Review':     'Review',
  'Legal Description Correction': 'Review',
  'Awaiting Legal Description':   'Review',
  // Legal
  'Legal Description Verification': 'Legal',
  // On Hold
  'Bankruptcy':              'On Hold',
  'Litigation / Legal Hold': 'On Hold',
  'Appeal Pending':          'On Hold',
  'Estate / Probate':        'On Hold',
  'Administrative Review':   'On Hold',
  'Hardship Review':         'On Hold',
  // Complete
  'Paid in Full':      'Complete',
  'Move to Treasurer': 'Complete',
};

// ─── Shared dot ─────────────────────────────────────────────────────────────
function Dot({ color }: { color: string }) {
  return (
    <span className="relative inline-flex shrink-0 size-2">
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{ backgroundColor: color }}
      />
      <span
        className="relative inline-flex size-2 rounded-full"
        style={{ backgroundColor: color }}
      />
    </span>
  );
}

// ─── Components ─────────────────────────────────────────────────────────────

export function StatusBadge({ status }: { status: ParcelStatus }) {
  const dotColor = STATUS_DOT_COLOR[status];
  return (
    <Badge variant="outline" className="gap-1.5 font-medium whitespace-nowrap bg-white dark:bg-background border-divider">
      <Dot color={dotColor} />
      {status}
    </Badge>
  );
}

export function StageBadge({ stage }: { stage: ParcelStage }) {
  const parentStatus = STAGE_TO_STATUS[stage];
  const dotColor = STATUS_DOT_COLOR[parentStatus] ?? '#6b7280';
  return (
    <Badge variant="outline" className="gap-1.5 font-medium whitespace-nowrap bg-white dark:bg-background border-divider">
      <Dot color={dotColor} />
      {stage}
    </Badge>
  );
}

