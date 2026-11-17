import { useState } from "react";

type HabitFormProps = { onSubmit: (name: string) => boolean };

export function HabitForm({ onSubmit }: HabitFormProps) {
  const [name, setName] = useState("");
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (onSubmit(name)) setName("");
  }
  return (
    <form onSubmit={submit} className="flex gap-2 mt-4">
      <label className="sr-only" htmlFor="new-habit">Nombre del hábito</label>
      <input id="new-habit" value={name} onChange={(event) => setName(event.target.value)}
        placeholder="Nuevo hábito" className="flex-1 px-3 py-2 rounded-xl bg-[#111111] border border-[#555555]" />
      <button type="submit" className="px-4 py-2 rounded-xl bg-[#555555]">Agregar</button>
    </form>
  );
}
