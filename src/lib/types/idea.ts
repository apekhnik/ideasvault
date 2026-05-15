export enum IdeaPriority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

export enum IdeaFormMode {
  Create = "create",
  Edit = "edit",
}

export const DEFAULT_CATEGORY = "General";

export interface IdeaFormData {
  id?: number;
  title?: string;
  category?: string;
  priority?: IdeaPriority;
  rating?: number;
  notes?: string;
}

export interface IdeaCardData {
  id: number;
  title: string;
  category: string;
  priority: IdeaPriority;
  rating: number;
  notes: string;
  date: string;
}
