export interface Employee {
  id?: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  salary: number;
  hire_date: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  created_at?: string;
  updated_at?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Finance',
  'HR',
  'Operations',
  'Sales',
  'Legal',
  'Customer Support',
];

export const EMPLOYEE_STATUSES = ['Active', 'Inactive', 'On Leave'];
