import { DAYS } from "../../constants/days";
import type { HabitsByDate, RewardsByDate } from "../../types";
import type { HabitDefinition } from "../../types";
import { weekDate } from "../../utils/date";
import { getHabitProgress } from "../../utils/habitProgress";

type WeeklySummaryProps = {
  habits: HabitsByDate;
  rewards: RewardsByDate;
  habitDefinitions: HabitDefinition[];
};

const panelClass =
  "bg-linear-to-br from-[#292929] via-[#151515] to-[#000000] rounded-3xl border border-[#666666]/40 shadow-2xl overflow-hidden";

export function WeeklySummary({ habits, rewards, habitDefinitions }: WeeklySummaryProps) {
  const rows = DAYS.slice(1).map((day, index) => ({
    day,
    progress: getHabitProgress(habits[weekDate(index + 1)], habitDefinitions),
    earned: rewards[weekDate(index + 1)],
  }));
  const hours = rows.filter((row) => row.earned).length;
  return (
    <section className={`${panelClass} mt-5 p-5`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-semibold">Progreso semanal</h2>
          <p className="text-xs text-[#999999]">
            Hábitos completados de lunes a sábado
          </p>
        </div>
        <strong className="text-lg">{hours}/6 h</strong>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
        {rows.map(({ day, progress, earned }) => (
          <div
            key={day.key}
            className="rounded-xl bg-[#111111] border border-[#444444] p-3"
          >
            <p className="text-xs text-[#999999]">{day.label}</p>
            <p className="font-semibold mt-1">{progress.completed}/{progress.total}</p>
            <p className="text-xs text-[#bbbbbb]">
              {progress.percentage}%
            </p>
            <p
              className={`text-xs mt-2 ${earned ? "text-white" : "text-[#777777]"}`}
            >
              {earned ? "✓ 1 hora ganada" : "Sin hora"}
            </p>
          </div>
        ))}
      </div>
      <p className="text-sm text-[#cccccc] mt-4">
        {hours === 6
          ? "Semana completa: ganaste las 6 horas posibles."
          : `Ganaste ${hours} de 6 horas posibles esta semana.`}
      </p>
    </section>
  );
}
