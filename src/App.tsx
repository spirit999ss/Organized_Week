import { SCHEMA_VERSION, SCHEMA_VERSION_KEY } from "./constants/storage";
import { useEffect, useState } from "react";

import { DAYS } from "./constants/days";
import type { DayKey } from "./types";
import { DaySelector } from "./components/DaySelector";
import { HabitManager } from "./components/habits/HabitManager";
import { HabitPanel } from "./components/habits/HabitPanel";
import { Header } from "./components/Header";
import { RewardBank } from "./components/rewards/RewardBank";
import { RewardOptionManager } from "./components/rewards/RewardOptionManager";
import { TasksPanel } from "./components/tasks/TasksPanel";
import { VisionBoard } from "./components/vision-board/VisionBoard";
import { WeeklySummary } from "./components/rewards/WeeklySummary";
import { useHabits } from "./hooks/useHabits";
import { useRewards } from "./hooks/useRewards";
import { useTasks } from "./hooks/useTasks";
import { useVisionBoard } from "./hooks/useVisionBoard";
import { weekDate } from "./utils/date";

export default function App() {
  useEffect(() => {
    localStorage.setItem(SCHEMA_VERSION_KEY, SCHEMA_VERSION);
  }, []);
  const [selectedDay, setSelectedDay] = useState<DayKey>(
    DAYS[new Date().getDay()].key,
  );
  const dayIndex = DAYS.findIndex((item) => item.key === selectedDay);
  const currentDate = weekDate(dayIndex);
  const day = DAYS[dayIndex];
  const habitState = useHabits();
  const rewardState = useRewards(habitState.rewards);
  const tasks = useTasks(currentDate);
  const vision = useVisionBoard();
  function toggleHabit(date: string, id: string) {
    if (date === weekDate(0)) return;
    const current = habitState.habits[date] ?? [];
    habitState.setHabitsForDate(
      date,
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }
  function editConsumption(item: (typeof rewardState.consumptions)[number]) {
    const value = Number(
      window.prompt("¿Cuántos minutos consumiste?", String(item.minutes)),
    );
    if (Number.isFinite(value)) rewardState.updateConsumption(item.id, value);
  }
  return (
    <div className="min-h-screen text-white bg-linear-to-br from-[#000000] via-[#222222] to-[#999999]">
      <main className="relative max-w-6xl mx-auto px-4 py-8 sm:py-10">
        <Header balance={rewardState.balance} />
        <DaySelector
          days={DAYS}
          selectedDay={selectedDay}
          habits={habitState.habits}
          habitDefinitions={habitState.definitions}
          onSelect={setSelectedDay}
        />
        <div className="mb-5">
          <h2 className="text-xl font-semibold">{day.label}</h2>
          <p className="text-xs text-[#999999]">{currentDate}</p>
        </div>
        <HabitManager
          definitions={habitState.definitions}
          onAdd={habitState.addHabit}
          onUpdate={habitState.updateHabit}
          onDelete={habitState.deleteHabit}
        />
        <HabitPanel
          day={day}
          date={currentDate}
          definitions={habitState.definitions}
          habits={habitState.habits}
          onToggle={toggleHabit}
        />
        <TasksPanel
          tasks={tasks.tasks}
          onAdd={tasks.addTask}
          onToggle={tasks.toggleTask}
          onDelete={tasks.deleteTask}
          onEdit={tasks.updateTask}
          onClear={tasks.clearTasks}
        />
        <WeeklySummary
          habits={habitState.habits}
          rewards={habitState.rewards}
          habitDefinitions={habitState.definitions}
        />
        <RewardOptionManager
          options={rewardState.options}
          onAdd={rewardState.addOption}
          onUpdate={rewardState.updateOption}
          onDelete={rewardState.deleteOption}
        />
        <RewardBank
          balance={rewardState.balance}
          options={rewardState.options}
          consumptions={rewardState.consumptions}
          canConsume={selectedDay === "domingo"}
          onConsume={(option, minutes) =>
            rewardState.consume(option, minutes, selectedDay === "domingo")
          }
          onEdit={editConsumption}
          onDelete={rewardState.deleteConsumption}
        />
        <VisionBoard
          goals={vision.goals}
          error={vision.error}
          onAdd={vision.addGoal}
          onStatus={vision.setStatus}
          onUpdate={vision.updateGoal}
          onImage={vision.setImage}
          onRemoveImage={vision.removeImage}
          onDelete={vision.deleteGoal}
        />
      </main>
    </div>
  );
}
