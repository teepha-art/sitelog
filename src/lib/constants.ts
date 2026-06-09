export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
export const FILES_PER_ENTITY = 1;
export const PROGRESS_MIN = 0;
export const PROGRESS_MAX = 100;
export const MIN_TAP_TARGET_PX = 44;
export const RESET_CODE_EXPIRY_MINUTES = 15;

export const PROJECT_STATUSES = ['active', 'delayed', 'on_hold', 'completed'] as const;
export const ISSUE_STATUSES = ['open', 'in_progress', 'resolved'] as const;
export const PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;
export const REQUEST_STATUSES = ['pending', 'approved', 'rejected', 'fulfilled'] as const;
