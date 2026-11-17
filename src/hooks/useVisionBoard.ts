import { useCallback, useEffect, useState } from "react";
import { GOALS_KEY } from "../constants/storage";
import { MAX_VISION_GOALS } from "../constants/visionBoard";
import { useLocalStorage } from "./useLocalStorage";
import { deleteVisionImage, saveVisionImage } from "../services/visionImageStorage";
import type { GoalStatus, NewVisionGoalInput, VisionGoal } from "../types";
import { uid } from "../utils/id";

function normalizeGoals(value: unknown): VisionGoal[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is VisionGoal =>
      Boolean(item) &&
      typeof item === "object" &&
      typeof (item as Record<string, unknown>).id === "string" &&
      typeof (item as Record<string, unknown>).title === "string" &&
      typeof (item as Record<string, unknown>).description === "string" &&
      ((item as Record<string, unknown>).imageId === null ||
        typeof (item as Record<string, unknown>).imageId === "string") &&
      typeof (item as Record<string, unknown>).createdAt === "string" &&
      typeof (item as Record<string, unknown>).updatedAt === "string",
  );
}

export function useVisionBoard() {
  const [goals, setGoals] = useLocalStorage<VisionGoal[]>(GOALS_KEY, [], normalizeGoals);
  const [error, setError] = useState("");
  const addGoal = useCallback(async (input: NewVisionGoalInput): Promise<boolean> => {
    const title = input.title.trim();
    if (goals.length >= MAX_VISION_GOALS || !title) {
      setError(goals.length >= MAX_VISION_GOALS ? `Alcanzaste el máximo de ${MAX_VISION_GOALS} metas.` : "El título es obligatorio.");
      return false;
    }
    const imageId = input.imageBlob ? uid() : null;
    try {
      if (input.imageBlob && imageId) {
        const now = new Date().toISOString();
        await saveVisionImage({ id: imageId, blob: input.imageBlob, mimeType: input.imageBlob.type, createdAt: now, updatedAt: now });
      }
      const now = new Date().toISOString();
      setGoals((current) => [...current, {
        id: uid(), title, description: input.description.trim(), imageId,
        status: "pendiente", createdAt: now, updatedAt: now,
      }]);
      return true;
    } catch (reason) {
      if (imageId) {
        try { await deleteVisionImage(imageId); } catch { /* preserve the original failure */ }
      }
      setError(reason instanceof Error ? reason.message : "No se pudo guardar la meta.");
      return false;
    }
  }, [goals.length, setGoals]);
  const updateGoal = useCallback((id: string, title: string, description: string) => {
    if (!title.trim()) return false;
    setGoals((current) => current.map((goal) =>
      goal.id === id ? { ...goal, title: title.trim(), description: description.trim(), updatedAt: new Date().toISOString() } : goal,
    ));
    return true;
  }, [setGoals]);
  const setStatus = useCallback((id: string, status: GoalStatus) => {
    setGoals((current) => current.map((goal) =>
      goal.id === id ? { ...goal, status, updatedAt: new Date().toISOString() } : goal,
    ));
  }, [setGoals]);
  const setImage = useCallback(async (id: string, imageBlob: Blob): Promise<boolean> => {
    const previous = goals.find((goal) => goal.id === id)?.imageId;
    if (!previous && !goals.some((goal) => goal.id === id)) {
      setError("No se encontró la meta.");
      return false;
    }
    const imageId = uid();
    const now = new Date().toISOString();
    try {
      await saveVisionImage({ id: imageId, blob: imageBlob, mimeType: imageBlob.type, createdAt: now, updatedAt: now });
      setGoals((current) => current.map((goal) =>
        goal.id === id ? { ...goal, imageId, updatedAt: new Date().toISOString() } : goal,
      ));
      if (previous) await deleteVisionImage(previous);
      return true;
    } catch (reason) {
      try { await deleteVisionImage(imageId); } catch { /* best effort cleanup */ }
      setError(reason instanceof Error ? reason.message : "No se pudo cambiar la imagen.");
      return false;
    }
  }, [goals, setGoals]);
  const removeImage = useCallback(async (id: string) => {
    const previous = goals.find((goal) => goal.id === id)?.imageId;
    if (!previous) return;
    try {
      await deleteVisionImage(previous);
      setGoals((current) => current.map((goal) =>
        goal.id === id ? { ...goal, imageId: null, updatedAt: new Date().toISOString() } : goal,
      ));
    } catch (reason) { setError(reason instanceof Error ? reason.message : "No se pudo eliminar la imagen."); }
  }, [goals, setGoals]);
  const deleteGoal = useCallback(async (id: string) => {
    const goal = goals.find((item) => item.id === id);
    if (goal?.imageId) {
      try { await deleteVisionImage(goal.imageId); } catch (reason) { setError(reason instanceof Error ? reason.message : "No se pudo limpiar la imagen de la meta."); return; }
    }
    setGoals((current) => current.filter((item) => item.id !== id));
  }, [goals, setGoals]);
  useEffect(() => { if (error) { const timer = window.setTimeout(() => setError(""), 4000); return () => window.clearTimeout(timer); } }, [error]);
  return { goals, error, addGoal, updateGoal, setStatus, setImage, removeImage, deleteGoal };
}
