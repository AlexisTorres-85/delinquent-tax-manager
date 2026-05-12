export type LegalReviewStatus = 'In Review' | 'Correction Requested' | 'Approved';

export type LegalReviewType =
  | 'GCS Legal Review'
  | 'Research Legal Review'
  | 'Approved Legal Review'
  | 'Boundary Dispute'
  | 'Easement Review'
  | 'Title Search Review'
  | 'Survey Review';

export type LegalReviewPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type LegalReview = {
  id: string;
  parcelNumber: string;
  reviewStatus: LegalReviewStatus;
  reviewType: LegalReviewType;
  priority: LegalReviewPriority;
  assignedTo: string;
  requestedBy: string;
  requestedDate: string; // MM/DD/YYYY
  completedDate: string | null; // MM/DD/YYYY or null if not yet complete
  notes: string;
};

export type LegalReviewRecord = {
  parcelNumber: string;
  reviews: LegalReview[];
};
