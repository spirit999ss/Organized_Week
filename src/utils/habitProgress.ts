import type { HabitDefinition, HabitsByDate, RewardsByDate } from "../types";

export type HabitProgress = {
  total: number;
  completed: number;
  percentage: number;
};

export function getHabitProgress(
  completedHabitIds: string[] | undefined,
  habitDefinitions: HabitDefinition[],
): HabitProgress {
  const validHabitIds = new Set(habitDefinitions.map((habit) => habit.id));
  const validCompletedIds = [
    ...new Set(
      (completedHabitIds ?? []).filter((habitId) => validHabitIds.has(habitId)),
    ),
  ];
  const total = habitDefinitions.length;
  const completed = validCompletedIds.length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  return {
    total,
    completed,
    percentage: Math.min(100, Math.max(0, percentage)),
  };
}

export function sanitizeHabitProgress(
  progress: HabitsByDate,
  habitDefinitions: HabitDefinition[],
): HabitsByDate {
  const validHabitIds = new Set(habitDefinitions.map((habit) => habit.id));
  return Object.fromEntries(
    Object.entries(progress).map(([date, completedHabitIds]) => [
      date,
      [
        ...new Set(
          completedHabitIds.filter((habitId) => validHabitIds.has(habitId)),
        ),
      ],
    ]),
  );
}

export function calculateDailyReward(
  date: string,
  completedHabitIds: string[] | undefined,
  habitDefinitions: HabitDefinition[],
): boolean {
  if (new Date(`${date}T00:00:00`).getDay() === 0) return false;
  const progress = getHabitProgress(completedHabitIds, habitDefinitions);
  return progress.total > 0 && progress.completed === progress.total;
}

export function recalculateRewards(
  progress: HabitsByDate,
  habitDefinitions: HabitDefinition[],
): RewardsByDate {
  return Object.fromEntries(
    Object.keys(progress)
      .filter((date) =>
        calculateDailyReward(date, progress[date], habitDefinitions),
      )
      .map((date) => [date, true]),
  );
}

export function recordsEqual(
  first: HabitsByDate | RewardsByDate,
  second: HabitsByDate | RewardsByDate,
): boolean {
  return JSON.stringify(first) === JSON.stringify(second);
}
