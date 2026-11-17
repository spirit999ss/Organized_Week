import { useCallback, useEffect } from "react";
import { HABIT_DEFINITIONS_KEY, HABITS_KEY, REWARDS_KEY } from "../constants/storage";
import { useLocalStorage } from "./useLocalStorage";
import type { HabitDefinition, HabitsByDate, RewardsByDate } from "../types";
import { uid } from "../utils/id";
import {
  recalculateRewards,
  recordsEqual,
  sanitizeHabitProgress,
} from "../utils/habitProgress";

function normalizeDefinitions(value: unknown): HabitDefinition[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is HabitDefinition =>
      Boolean(item) &&
      typeof item === "object" &&
      typeof (item as Record<string, unknown>).id === "string" &&
      typeof (item as Record<string, unknown>).name === "string" &&
      typeof (item as Record<string, unknown>).createdAt === "string",
  );
}

function normalizeProgress(value: unknown): HabitsByDate {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>).flatMap(([date, ids]) =>
      /^\d{4}-\d{2}-\d{2}$/.test(date) && Array.isArray(ids)
        ? [[date, ids.filter((id): id is string => typeof id === "string")]]
        : [],
    ),
  );
}

export function useHabits() {
  const [definitions, setDefinitions] = useLocalStorage<HabitDefinition[]>(
    HABIT_DEFINITIONS_KEY,
    [],
    normalizeDefinitions,
  );
  const [habits, setHabits] = useLocalStorage<HabitsByDate>(
    HABITS_KEY,
    {},
    normalizeProgress,
  );
  const [rewards, setRewards] = useLocalStorage<RewardsByDate>(
    REWARDS_KEY,
    {},
    (value) => (value && typeof value === "object" ? value as RewardsByDate : {}),
  );
  useEffect(() => {
    const sanitizedProgress = sanitizeHabitProgress(habits, definitions);
    if (!recordsEqual(habits, sanitizedProgress)) setHabits(sanitizedProgress);

    const sanitizedRewards = recalculateRewards(sanitizedProgress, definitions);
    if (!recordsEqual(rewards, sanitizedRewards)) setRewards(sanitizedRewards);
  }, [definitions, habits, rewards, setHabits, setRewards]);
  const addHabit = useCallback((name: string) => {
    setDefinitions((current) => [
      ...current,
      { id: uid(), name: name.trim(), createdAt: new Date().toISOString() },
    ]);
  }, [setDefinitions]);
  const updateHabit = useCallback((id: string, name: string) => {
    setDefinitions((current) =>
      current.map((habit) => (habit.id === id ? { ...habit, name: name.trim() } : habit)),
    );
  }, [setDefinitions]);
  const deleteHabit = useCallback((id: string) => {
    const nextDefinitions = definitions.filter((habit) => habit.id !== id);
    const nextProgress = sanitizeHabitProgress(habits, nextDefinitions);
    setDefinitions(nextDefinitions);
    setHabits(nextProgress);
    setRewards(recalculateRewards(nextProgress, nextDefinitions));
  }, [definitions, habits, setDefinitions, setHabits, setRewards]);
  const setHabitsForDate = useCallback((date: string, ids: string[]) => {
    setHabits((current) =>
      sanitizeHabitProgress({ ...current, [date]: ids }, definitions),
    );
  }, [definitions, setHabits]);
  return {
    definitions,
    habits,
    rewards,
    addHabit,
    updateHabit,
    deleteHabit,
    setHabitsForDate,
    setRewards,
  };
}
