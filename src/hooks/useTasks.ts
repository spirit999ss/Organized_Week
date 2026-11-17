import { useCallback } from "react";
import { TASKS_KEY } from "../constants/storage";
import { useLocalStorage } from "./useLocalStorage";
import type { DayKey, Task, TasksByDate } from "../types";
import { uid } from "../utils/id";
import { weekDate } from "../utils/date";

function normalizeTasks(value: unknown): TasksByDate {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const source = value as Record<string, unknown>;
  return Object.fromEntries(
    Object.entries(source).flatMap(([key, tasks]) => {
      if (!Array.isArray(tasks)) return [];
      const normalized = tasks.filter(
        (task): task is Task =>
          Boolean(task) &&
          typeof task === "object" &&
          typeof (task as Record<string, unknown>).id === "string" &&
          typeof (task as Record<string, unknown>).text === "string" &&
          typeof (task as Record<string, unknown>).done === "boolean",
      );
      const dateKey = /^\d{4}-\d{2}-\d{2}$/.test(key)
        ? key
        : weekDate(["domingo", "lunes", "martes", "miercoles", "jueves", "viernes", "sabado"].indexOf(key as DayKey));
      return [[dateKey, normalized]];
    }),
  );
}

export function useTasks(date: string) {
  const [tasksByDate, setTasksByDate] = useLocalStorage<TasksByDate>(
    TASKS_KEY,
    {},
    normalizeTasks,
  );
  const tasks = tasksByDate[date] ?? [];

  const addTask = useCallback((text: string) => {
    setTasksByDate((previous) => ({
      ...previous,
      [date]: [...(previous[date] ?? []), { id: uid(), text, done: false }],
    }));
  }, [date, setTasksByDate]);
  const toggleTask = useCallback((id: string) => {
    setTasksByDate((previous) => ({
      ...previous,
      [date]: (previous[date] ?? []).map((task) =>
        task.id === id ? { ...task, done: !task.done } : task,
      ),
    }));
  }, [date, setTasksByDate]);
  const updateTask = useCallback((id: string, text: string) => {
    setTasksByDate((previous) => ({
      ...previous,
      [date]: (previous[date] ?? []).map((task) =>
        task.id === id ? { ...task, text } : task,
      ),
    }));
  }, [date, setTasksByDate]);
  const deleteTask = useCallback((id: string) => {
    setTasksByDate((previous) => ({
      ...previous,
      [date]: (previous[date] ?? []).filter((task) => task.id !== id),
    }));
  }, [date, setTasksByDate]);
  const clearTasks = useCallback(() => {
    setTasksByDate((previous) => {
      const next = { ...previous };
      delete next[date];
      return next;
    });
  }, [date, setTasksByDate]);

  return { tasks, addTask, toggleTask, updateTask, deleteTask, clearTasks };
}
