import type { HabitDefinition } from "../../types";
import { HabitForm } from "./HabitForm";
import { useState } from "react";

type HabitManagerProps = {
  definitions: HabitDefinition[];
  onAdd: (name: string) => void;
  onUpdate: (id: string, name: string) => void;
  onDelete: (id: string) => void;
};

export function HabitManager({
  definitions,
  onAdd,
  onUpdate,
  onDelete,
}: HabitManagerProps) {
  const [message, setMessage] = useState("");

  function add(name: string) {
    const normalized = name.trim().toLocaleLowerCase();

    if (
      !normalized ||
      definitions.some(
        (habit) => habit.name.trim().toLocaleLowerCase() === normalized,
      )
    ) {
      setMessage("Escribe un nombre válido y no repetido.");
      return false;
    }

    onAdd(name);
    setMessage("");
    return true;
  }

  return (
    <section className="bg-linear-to-br from-[#292929] via-[#151515] to-[#000000] rounded-3xl border border-[#666666]/40 p-5 h-81  overflow-x-hidden flex flex-col gap-1 mb-3">
      <h2 className="font-semibold text-base">Configurar hábitos</h2>

      {definitions.length === 0 ? (
        <p className="text-sm text-[#999999] mt-2">0 Habitos</p>
      ) : (
        <ul className="flex flex-col gap-3 mt-4 overflow-y-auto">
          {definitions.map((habit) => (
            <HabitRow
              key={habit.id}
              habit={habit}
              onUpdate={onUpdate}
              onDelete={() => {
                if (window.confirm(`¿Eliminar el hábito "${habit.name}"?`)) {
                  onDelete(habit.id);
                }
              }}
            />
          ))}
        </ul>
      )}

      <div className="border-t border-[#ffffff15] pt-4 mt-1">
        <HabitForm onSubmit={add} />
      </div>

      {message && <p className="text-xs text-[#ffaaaa] mt-1">{message}</p>}
    </section>
  );
}

function HabitRow({
  habit,
  onUpdate,
  onDelete,
}: {
  habit: HabitDefinition;
  onUpdate: (id: string, name: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(habit.name);

  return (
    <li className="flex gap-3 items-center justify-between p-3 rounded-xl bg-[#ffffff08] border border-[#ffffff10]">
      <span className="flex-1 min-w-0 text-sm wrap-break-word">
        {editing ? (
          <input
            aria-label="Editar hábito"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full px-3 py-2 bg-[#111111] border border-[#555555] rounded-lg outline-none focus:border-[#999999]"
          />
        ) : (
          habit.name
        )}
      </span>

      <div className="flex items-center gap-2 shrink-0">
        {editing ? (
          <button
            type="button"
            onClick={() => {
              if (name.trim()) {
                onUpdate(habit.id, name.trim());
                setEditing(false);
              }
            }}
            className="text-xs text-green-400 px-3 py-2 rounded-lg hover:bg-[#ffffff15] transition-colors"
          >
            Guardar
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-xs text-[#aaa] px-3 py-2 rounded-lg hover:bg-[#ffffff15] transition-colors"
          >
            Editar
          </button>
        )}

        <button
          type="button"
          onClick={onDelete}
          className="text-xs text-red-400 px-3 py-2 rounded-lg hover:bg-[#ff000015] transition-colors"
        >
          Eliminar
        </button>
      </div>
    </li>
  );
}
