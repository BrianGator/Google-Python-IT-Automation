/**
 * Types for Google IT Automation Lab Sandbox
 */

export interface FeedbackItem {
  id: number;
  title: string;
  name: string;
  date: string;
  feedback: string;
}

export interface CarSaleItem {
  id: number;
  car: {
    car_make: string;
    car_model: string;
    car_year: number;
  };
  price: string;
  total_sales: number;
}

export interface FruitItem {
  id: number;
  name: string;
  weight: number;
  description: string;
  image_name: string;
}

export interface EmailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  isRead: boolean;
  attachmentName?: string;
  attachmentType?: string;
  attachmentData?: any; // Contains processed PDF report data
}

export interface SystemMetrics {
  cpuUsage: number;
  diskFreePercent: number;
  memoryAvailableMB: number;
  localhostResolves: boolean;
}

export interface LabTask {
  id: string;
  text: string;
  isCompleted: boolean;
  hint: string;
}

export interface Lab {
  id: string;
  title: string;
  shortDescription: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeMinutes: number;
  tasks: LabTask[];
}

export interface EditorFile {
  path: string;
  name: string;
  content: string;
  language: "python" | "json" | "bash" | "markdown";
  isDraft: boolean;
}

export interface TerminalLine {
  type: "input" | "stdout" | "stderr" | "system";
  text: string;
  timestamp: string;
}

export interface BackendState {
  labId: string;
  feedbacks: FeedbackItem[];
  fruits: FruitItem[];
  uploadedFiles: string[];
  emails: EmailMessage[];
  metrics: SystemMetrics;
  tasks: Record<string, boolean>; // map task ID to completed status
}
