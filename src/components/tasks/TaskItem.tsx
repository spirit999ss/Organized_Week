import { useRef, useState } from "react";
import type { Task } from "../../types";

type TaskItemProps = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, text: string) => void;
};

export function TaskItem({ task, onToggle, onDelete, onEdit }: TaskItemProps) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const savedRef = useRef(false);

  function startEditing() {
    savedRef.current = false;
    setEditText(task.text);
    setEditing(true);
  }
  function saveEdit() {
    if (savedRef.current) return;
    savedRef.current = true;
    const text = editText.trim();
    if (text) onEdit(task.id, text);
    else onDelete(task.id);
    setEditing(false);
  }

  return (
    <li
      className={`group flex items-center gap-3 p-3 rounded-xl border bg-linear-to-r from-[#303030] to-[#111111] border-[#555555]/60 ${task.done ? "opacity-50" : ""}`}
    >
      <button
        type="button"
        onClick={() => onToggle(task.id)}
        className={`w-6 h-6 shrink-0 rounded-lg border-2 ${task.done ? "bg-[#cccccc] border-[#cccccc] text-black" : "border-[#888888]"}`}
      >
        {task.done ? "✓" : ""}
      </button>
      {editing ? (
        <input
          autoFocus
          value={editText}
          onChange={(event) => setEditText(event.target.value)}
          onBlur={saveEdit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              saveEdit();
            }
          }}
          className="flex-1 bg-transparent border-b border-[#aaaaaa] focus:outline-none"
        />
      ) : (
        <span
          onDoubleClick={startEditing}
          className={`flex-1 text-sm ${task.done ? "line-through text-[#888888]" : ""}`}
        >
          {task.text}
        </span>
      )}
      <button
        type="button"
        onClick={startEditing}
        className="text-xs text-[#999999] hover:text-white"
      >
        Editar
      </button>
      <button
        type="button"
        onClick={() => onDelete(task.id)}
        className="text-xs text-[#999999] hover:text-white"
      >
        Eliminar
      </button>
    </li>
  );
}
