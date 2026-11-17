import type { RewardOption } from "../../types";
import { RewardOptionForm } from "./RewardOptionForm";
import { useState } from "react";

type Props = {
  options: RewardOption[];
  onAdd: (title: string, category: string) => void;
  onUpdate: (id: string, title: string, category: string) => void;
  onDelete: (id: string) => void;
};
export function RewardOptionManager({
  options,
  onAdd,
  onUpdate,
  onDelete,
}: Props) {
  const [message, setMessage] = useState("");
  function add(title: string, category: string) {
    const normalize = (value: string) => value.trim().toLocaleLowerCase();
    if (
      !normalize(title) ||
      !normalize(category) ||
      options.some(
        (item) =>
          normalize(item.title) === normalize(title) &&
          normalize(item.category) === normalize(category),
      )
    ) {
      setMessage("Completa los campos y evita duplicados.");
      return false;
    }
    onAdd(title, category);
    setMessage("");
    return true;
  }
  return (
    <section className="bg-linear-to-br from-[#292929] via-[#151515] to-[#000000] rounded-3xl border border-[#666666]/40 p-5 mt-5">
      <h2 className="font-semibold">Opciones de premios</h2>
      {options.length === 0 ? (
        <p className="text-sm text-[#999999] mt-2">0 Opciones de premios</p>
      ) : (
        <ul className="space-y-2 mt-4">
          {options.map((option) => (
            <OptionRow
              key={option.id}
              option={option}
              onUpdate={onUpdate}
              onDelete={() => {
                if (window.confirm(`¿Eliminar "${option.title}"?`))
                  onDelete(option.id);
              }}
            />
          ))}
        </ul>
      )}
      <RewardOptionForm onSubmit={add} />
      {message && <p className="text-xs text-[#ffaaaa] mt-2">{message}</p>}
    </section>
  );
}
function OptionRow({
  option,
  onUpdate,
  onDelete,
}: {
  option: RewardOption;
  onUpdate: (id: string, title: string, category: string) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(option.title);
  const [category, setCategory] = useState(option.category);
  return (
    <li className="flex gap-2 items-center">
      <span className="flex-1 text-sm">
        {editing ? (
          <span className="flex gap-1">
            <input
              aria-label="Editar título de premio"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-1/2 px-2 py-1 bg-[#111111] border border-[#555555] rounded"
            />
            <input
              aria-label="Editar categoría de premio"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-1/2 px-2 py-1 bg-[#111111] border border-[#555555] rounded"
            />
          </span>
        ) : (
          `${option.title} · ${option.category}`
        )}
      </span>
      {editing ? (
        <button
          type="button"
          onClick={() => {
            if (title.trim() && category.trim()) {
              onUpdate(option.id, title, category);
              setEditing(false);
            }
          }}
          className="text-xs"
        >
          Guardar
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="text-xs text-[#aaa]"
        >
          Editar
        </button>
      )}
      <button type="button" onClick={onDelete} className="text-xs text-[#aaa]">
        Eliminar
      </button>
    </li>
  );
}
