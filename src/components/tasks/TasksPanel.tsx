import { useState } from "react";
import type { FormEvent } from "react";
import type { Task } from "../../types";
import { TaskItem } from "./TaskItem";

type TasksPanelProps = {
  tasks: Task[];
  onAdd: (text: string) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onClear: () => void;
};

const panelClass =
  "bg-linear-to-br from-[#292929] via-[#151515] to-[#000000] rounded-3xl border border-[#666666]/40 shadow-2xl overflow-hidden";

export function TasksPanel({
  tasks,
  onAdd,
  onToggle,
  onDelete,
  onEdit,
  onClear,
}: TasksPanelProps) {
  const [text, setText] = useState("");
  const done = tasks.filter((task) => task.done).length;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = text.trim();
    if (!value) return;
    onAdd(value);
    setText("");
  }

  function clearDay() {
    if (window.confirm("¿Borrar todas las tareas de este día?")) onClear();
  }

  return (
    <section className={`${panelClass} mt-5`}>
      <div className="flex items-center justify-between px-5 sm:px-6 py-5 border-b border-[#555555]/40">
        <div>
          <h3 className="font-semibold">Tareas del día</h3>
          <p className="text-xs text-[#999999]">
            {done} de {tasks.length} realizadas · no afecta hábitos
          </p>
        </div>
        {tasks.length > 0 && (
          <button
            type="button"
            onClick={clearDay}
            className="text-xs text-[#999999] hover:text-white"
          >
            Limpiar día
          </button>
        )}
      </div>
      <form
        onSubmit={submit}
        className="flex flex-col sm:flex-row gap-3 px-5 sm:px-6 py-5 border-b border-[#555555]/40"
      >
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Escribe una nueva tarea..."
          className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-linear-to-r from-[#080808] to-[#222222] border border-[#555555] text-white placeholder:text-[#777777] focus:outline-none focus:border-[#cccccc]"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="px-6 py-3 rounded-xl bg-linear-to-r from-[#888888] to-[#444444] disabled:opacity-30 text-white font-semibold"
        >
          + Añadir tarea
        </button>
      </form>
      <div className="px-5 sm:px-6 py-5">
        {tasks.length === 0 ? (
          <p className="py-8 text-center text-sm text-[#777777]">
            Añade tareas para organizar este día.
          </p>
        ) : (
          <ul className="space-y-3">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
