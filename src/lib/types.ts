export interface Product {
  id: string;
  slug: string;
  brand: 'EpiPen' | 'Jext' | 'Emergency Kits';
  name: string;
  strength: string;
  target_group: string;
  pack_size: string;
  price: number;
  vat_rate: number;
  is_available: number;
  requires_headteacher_requisition: number;
  requires_pharmacy_approval: number;
  description: string;
  clinical_notes: string;
  storage_instructions: string;
  image_url: string;
  display_order: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  order_reference: string;
  organisation_id: string;
  school_id: string;
  user_id?: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  delivery_school_name: string;
  delivery_address_line1: string;
  delivery_address_line2?: string;
  delivery_city: string;
  delivery_postcode: string;
  delivery_instructions?: string;
  billing_organisation_name: string;
  billing_address_line1: string;
  billing_address_line2?: string;
  billing_city: string;
  billing_postcode: string;
  po_number?: string;
  subtotal: number;
  vat_total: number;
  shipping_total: number;
  total_amount: number;
  payment_method: 'card' | 'bacs_invoice';
  payment_status: 'pending' | 'paid' | 'partially_paid' | 'refunded' | 'failed';
  order_status: 'draft' | 'submitted' | 'awaiting_documentation' | 'awaiting_review' | 'awaiting_pharmacy_approval' | 'awaiting_payment' | 'approved_for_fulfilment' | 'processing' | 'dispatched' | 'delivered' | 'cancelled';
  documentation_status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  pharmacy_review_status: 'pending' | 'assigned' | 'approved' | 'rejected';
  courier_name?: string;
  tracking_number?: string;
  dispatched_at?: string;
  delivered_at?: string;
  requisition_doc_name?: string;
  requisition_doc_url?: string;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
  school_name?: string;
  organisation_name?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  strength: string;
  pack_size: string;
  unit_price: number;
  quantity: number;
  vat_amount: number;
  total_price: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;
  order_id: string;
  organisation_id: string;
  school_id: string;
  issue_date: string;
  due_date: string;
  po_number?: string;
  subtotal: number;
  vat_total: number;
  total_amount: number;
  amount_paid: number;
  status: 'draft' | 'issued' | 'paid' | 'partially_paid' | 'overdue' | 'cancelled';
  bacs_bank_name: string;
  bacs_account_name: string;
  bacs_sort_code: string;
  bacs_account_number: string;
  bacs_reference: string;
  notes?: string;
  sent_to_email?: string;
  sent_at?: string;
  paid_at?: string;
  created_at: string;
  school_name?: string;
  order_reference?: string;
}

export interface BatchRecord {
  id: string;
  product_id: string;
  product_name?: string;
  batch_number: string;
  manufacturer: string;
  expiry_date: string;
  quantity_received: number;
  quantity_allocated: number;
  supplier_ref?: string;
  is_active: number;
  notes?: string;
  created_at: string;
}

export interface SchoolSupplyRecord {
  id: string;
  order_id: string;
  order_reference?: string;
  school_id: string;
  school_name?: string;
  product_id: string;
  product_name?: string;
  strength?: string;
  batch_record_id: string;
  batch_number: string;
  expiry_date: string;
  quantity_supplied: number;
  supplied_date: string;
  status: 'active' | 'approaching_expiry' | 'expired' | 'replaced';
  reorder_token?: string;
  notes?: string;
  days_remaining?: number;
  reminders_count?: number;
  last_reminder_sent?: string;
}

export interface ExpiryReminder {
  id: string;
  supply_record_id: string;
  school_id: string;
  school_name?: string;
  interval_months: number;
  scheduled_date: string;
  recipient_email: string;
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  sent_at?: string;
  error_message?: string;
  reorder_token?: string;
  product_name?: string;
  batch_number?: string;
  expiry_date?: string;
}

export interface TrainingCourse {
  id: string;
  slug: string;
  title: string;
  category: string;
  duration_minutes: number;
  summary: string;
  target_audience: string;
  pass_mark_percentage: number;
  modules?: TrainingModule[];
  questions?: QuizQuestion[];
}

export interface TrainingModule {
  id: string;
  course_id: string;
  title: string;
  lessons?: TrainingLesson[];
}

export interface TrainingLesson {
  id: string;
  module_id: string;
  title: string;
  content_html: string;
  video_url?: string;
  key_takeaways?: string;
  display_order: number;
}

export interface QuizQuestion {
  id: string;
  course_id: string;
  question: string;
  options_json: string;
  correct_option_index: number;
  explanation: string;
}

export interface User {
  id: string;
  organisation_id?: string;
  school_id?: string;
  name: string;
  email: string;
  role: string;
  job_title?: string;
  phone?: string;
  organisation_name?: string;
  school_name?: string;
}
