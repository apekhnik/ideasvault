export enum IdeaPriority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

export enum IdeaFormMode {
  Create = "create",
  Edit = "edit",
}

export enum IdeaCategory {
  Design = "Design",
  Architecture = "Architecture",
  Research = "Research",
  Personal = "Personal",
  Business = "Business",
  General = "General",
}

export interface IdeaFormData {
  id?: number;
  title?: string;
  category?: IdeaCategory | string;
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
