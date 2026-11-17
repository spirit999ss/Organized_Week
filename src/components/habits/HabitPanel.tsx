import type { Day, HabitDefinition, HabitsByDate } from "../../types";

import { getHabitProgress } from "../../utils/habitProgress";

type HabitPanelProps = {
  day: Day;
  date: string;
  definitions: HabitDefinition[];
  habits: HabitsByDate;
  onToggle: (date: string, id: string) => void;
};
const panelClass =
  "bg-linear-to-br from-[#292929] via-[#151515] to-[#000000] rounded-3xl border border-[#666666]/40 shadow-2xl overflow-hidden";

export function HabitPanel({
  day,
  date,
  definitions,
  habits,
  onToggle,
}: HabitPanelProps) {
  const { completed, total, percentage } = getHabitProgress(
    habits[date],
    definitions,
  );
  if (day.key === "domingo")
    return (
      <section className={`${panelClass} p-5`}>
        <h3 className="font-semibold">Hábitos Diarios</h3>
        <p className="text-sm text-[#999999] mt-2">
          El domingo no suma hábitos. Aquí puedes utilizar tus horas acumuladas.
        </p>
      </section>
    );
  return (
    <section className={`${panelClass} p-5`}>
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="font-semibold">Hábitos Diarios</h3>
          <p className="text-xs text-[#999999]">
            {completed}/{total} completados
          </p>
        </div>
        <span className="text-sm">{percentage}%</span>
      </div>
      {total === 0 ? (
        <p className="text-sm text-[#999999]">Progreso</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {definitions.map((habit) => {
            const checked = habits[date]?.includes(habit.id) ?? false;
            return (
              <button
                type="button"
                key={habit.id}
                onClick={() => onToggle(date, habit.id)}
                className={`p-3 rounded-xl border text-left text-sm ${checked ? "bg-linear-to-br from-[#888888] to-[#444444] border-[#cccccc]" : "bg-[#111111] border-[#555555]"}`}
              >
                <span className="mr-2">{checked ? "✓" : "○"}</span>
                {habit.name}
              </button>
            );
          })}
        </div>
      )}
      <div className="mt-4 h-2 rounded-full bg-[#333333] overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-[#777777] to-[#eeeeee]"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </section>
  );
}
