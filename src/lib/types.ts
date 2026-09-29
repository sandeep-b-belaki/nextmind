export type Lang = 'kn' | 'en' | 'hi';

export type SchemeStatus = 'draft' | 'published' | 'expired' | 'needs_verification';
export type VerifyStatus = 'verified' | 'needs_review' | 'expired';
export type Role = 'user' | 'admin' | 'editor';

export interface Category {
  id: number;
  slug: string;
  name_kn: string;
  name_en: string;
  name_hi: string;
  icon: string;
  description_kn: string;
  description_en: string;
  description_hi: string;
  sort_order: number;
}

export interface Department {
  id: number;
  slug: string;
  name_kn: string;
  name_en: string;
  name_hi: string;
}

export interface EligibilityRule {
  id?: number;
  scheme_id?: number;
  field: string;
  operator: string;
  value: string;
}

export interface SchemeDocument {
  id?: number;
  scheme_id?: number;
  name_kn: string;
  name_en: string;
  name_hi: string;
  desc_kn: string;
  desc_en: string;
  desc_hi: string;
  sort_order: number;
}

export interface ApplicationStep {
  id?: number;
  scheme_id?: number;
  step_number: number;
  title_kn: string;
  title_en: string;
  title_hi: string;
  body_kn: string;
  body_en: string;
  body_hi: string;
  tip_kn: string;
  tip_en: string;
  tip_hi: string;
}

export interface Tutorial {
  id?: number;
  scheme_id?: number;
  title_kn: string;
  title_en: string;
  title_hi: string;
  video_url: string;
}

export interface Scheme {
  id: number;
  slug: string;
  name_kn: string;
  name_en: string;
  name_hi: string;
  desc_kn: string;
  desc_en: string;
  desc_hi: string;
  simple_kn: string;
  simple_en: string;
  simple_hi: string;
  category_id: number;
  department_id: number;
  start_date: string;
  last_date: string;
  status: SchemeStatus;
  official_url: string;
  notification_pdf: string | null;
  tutorial_video: string | null;
  image: string | null;
  last_verified_at: string;
  verify_status: VerifyStatus;
  view_count: number;
  is_demo: number;
  created_at: string;
  updated_at: string;
}

export interface SchemeListItem extends Scheme {
  category_slug: string;
  category_name_kn: string;
  category_name_en: string;
  category_name_hi: string;
  category_icon: string;
  department_slug: string;
  department_name_kn: string;
  department_name_en: string;
  department_name_hi: string;
  eligibility_count: number;
}

export interface SchemeDetail extends SchemeListItem {
  eligibility: EligibilityRule[];
  documents: SchemeDocument[];
  steps: ApplicationStep[];
  tutorials: Tutorial[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface NotificationPrefs {
  new_schemes: number;
  deadlines: number;
  scholarships: number;
  farmers: number;
  employment: number;
}

export interface SearchFilters {
  q?: string;
  category?: string;
  department?: string;
  status?: string;
  eligibility?: string;
}

export interface Report {
  id?: number;
  scheme_id: number | null;
  scheme_slug: string | null;
  type: string;
  message: string;
  email: string;
  status: string;
  created_at?: string;
}
