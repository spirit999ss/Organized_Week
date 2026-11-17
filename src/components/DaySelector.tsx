import type { Day, DayKey, HabitDefinition, HabitsByDate } from "../types";
import { weekDate } from "../utils/date";
import { getHabitProgress } from "../utils/habitProgress";

type DaySelectorProps = {
  days: Day[];
  selectedDay: DayKey;
  habits: HabitsByDate;
  habitDefinitions: HabitDefinition[];
  onSelect: (day: DayKey) => void;
};

export function DaySelector({
  days,
  selectedDay,
  habits,
  habitDefinitions,
  onSelect,
}: DaySelectorProps) {
  return (
    <div className="grid grid-cols-7 gap-2 sm:gap-3 mb-6">
      {days.map((item, index) => {
        const { completed, total } = getHabitProgress(
          habits[weekDate(index)],
          habitDefinitions,
        );
        const active = selectedDay === item.key;
        return (
          <button
            type="button"
            key={item.key}
            onClick={() => onSelect(item.key)}
            className={`relative flex flex-col items-center gap-2 p-2 sm:p-4 rounded-2xl border transition-all ${active ? "bg-linear-to-br from-[#888888] to-[#333333] border-[#cccccc] shadow-xl" : "bg-linear-to-br from-[#222222] to-[#080808] border-[#444444] hover:border-[#999999]"}`}
          >
            <span className="text-xl sm:text-2xl">{item.emoji}</span>
            <span className="text-[10px] sm:text-xs font-semibold">
              {item.short}
            </span>
            <span className="text-[10px] text-[#cccccc]">
              {index === 0 ? "Descanso" : `${completed}/${total}`}
            </span>
          </button>
        );
      })}
    </div>
  );
}
