import { useMemo } from "react";
import { CONSUMPTIONS_KEY, REWARD_OPTIONS_KEY } from "../constants/storage";
import { useLocalStorage } from "./useLocalStorage";
import type { Consumption, RewardBalance, RewardOption, RewardsByDate } from "../types";
import { uid } from "../utils/id";
import { todayIso } from "../utils/date";

function normalizeOptions(value: unknown): RewardOption[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is RewardOption =>
      Boolean(item) &&
      typeof item === "object" &&
      typeof (item as Record<string, unknown>).id === "string" &&
      typeof (item as Record<string, unknown>).title === "string" &&
      typeof (item as Record<string, unknown>).category === "string" &&
      typeof (item as Record<string, unknown>).createdAt === "string",
  );
}

function normalizeConsumptions(value: unknown): Consumption[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const source = item as Record<string, unknown>;
    if (
      typeof source.id !== "string" ||
      typeof source.minutes !== "number" ||
      typeof source.date !== "string"
    ) return [];
    return [{
      id: source.id,
      rewardOptionId: typeof source.rewardOptionId === "string" ? source.rewardOptionId : "",
      title: typeof source.title === "string" ? source.title : "Opción anterior",
      category: typeof source.category === "string" ? source.category : typeof source.type === "string" ? source.type : "Anterior",
      minutes: source.minutes,
      date: source.date,
    }];
  });
}

export function useRewards(rewards: RewardsByDate) {
  const [options, setOptions] = useLocalStorage<RewardOption[]>(
    REWARD_OPTIONS_KEY,
    [],
    normalizeOptions,
  );
  const [consumptions, setConsumptions] = useLocalStorage<Consumption[]>(
    CONSUMPTIONS_KEY,
    [],
    normalizeConsumptions,
  );
  const balance = useMemo<RewardBalance>(() => {
    const earned = Object.values(rewards).filter(Boolean).length * 60;
    const used = consumptions.reduce((sum, item) => sum + item.minutes, 0);
    return { earned, used, available: Math.max(0, earned - used) };
  }, [consumptions, rewards]);
  const addOption = (title: string, category: string) =>
    setOptions((current) => [...current, {
      id: uid(), title: title.trim(), category: category.trim(), createdAt: new Date().toISOString(),
    }]);
  const updateOption = (id: string, title: string, category: string) =>
    setOptions((current) => current.map((option) =>
      option.id === id ? { ...option, title: title.trim(), category: category.trim() } : option,
    ));
  const deleteOption = (id: string) =>
    setOptions((current) => current.filter((option) => option.id !== id));
  function consume(option: RewardOption, minutes: number, isSunday: boolean): boolean {
    if (!isSunday || !Number.isInteger(minutes) || minutes <= 0 || minutes > balance.available) return false;
    setConsumptions((current) => [...current, {
      id: uid(), rewardOptionId: option.id, title: option.title, category: option.category,
      minutes, date: todayIso(),
    }]);
    return true;
  }
  function updateConsumption(id: string, minutes: number): boolean {
    if (!Number.isInteger(minutes) || minutes <= 0) return false;
    const item = consumptions.find((entry) => entry.id === id);
    if (!item || balance.used - item.minutes + minutes > balance.earned) return false;
    setConsumptions((current) => current.map((entry) => entry.id === id ? { ...entry, minutes } : entry));
    return true;
  }
  return {
    options, consumptions, balance, addOption, updateOption, deleteOption, consume,
    updateConsumption, deleteConsumption: (id: string) =>
      setConsumptions((current) => current.filter((item) => item.id !== id)),
  };
}
