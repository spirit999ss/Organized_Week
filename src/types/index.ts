export type DayKey =
  | "domingo"
  | "lunes"
  | "martes"
  | "miercoles"
  | "jueves"
  | "viernes"
  | "sabado";

export type Day = {
  key: DayKey;
  label: string;
  short: string;
  emoji: string;
};

export type Task = {
  id: string;
  text: string;
  done: boolean;
};

export type TasksByDate = Record<string, Task[]>;

export interface HabitDefinition {
  id: string;
  name: string;
  createdAt: string;
}

export type HabitName = string;
export type HabitsByDate = Record<string, string[]>;
export type RewardsByDate = Record<string, boolean>;

export interface RewardOption {
  id: string;
  title: string;
  category: string;
  createdAt: string;
}
export interface EntertainmentItem {
  title: string;
  type: string;
}

export interface Consumption {
  id: string;
  rewardOptionId: string;
  title: string;
  category: string;
  minutes: number;
  date: string;
}

export type GoalStatus = "pendiente" | "en progreso" | "conseguida";

export interface VisionGoal {
  id: string;
  title: string;
  description: string;
  status: GoalStatus;
  imageId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NewVisionGoalInput {
  title: string;
  description: string;
  imageBlob: Blob | null;
}

export interface StoredVisionImage {
  id: string;
  blob: Blob;
  mimeType: string;
  createdAt: string;
  updatedAt: string;
}

export type RewardBalance = {
  earned: number;
  used: number;
  available: number;
};
