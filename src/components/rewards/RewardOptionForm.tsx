import { useState } from "react";

type Props = { onSubmit: (title: string, category: string) => boolean };
export function RewardOptionForm({ onSubmit }: Props) {
  const [title, setTitle] = useState(""); const [category, setCategory] = useState("");
  function submit(event: React.FormEvent<HTMLFormElement>) { event.preventDefault(); if (onSubmit(title, category)) { setTitle(""); setCategory(""); } }
  return <form onSubmit={submit} className="grid sm:grid-cols-2 gap-2 mt-4">
    <label className="sr-only" htmlFor="reward-title">Título de premio</label><input id="reward-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Título" className="px-3 py-2 rounded-xl bg-[#111111] border border-[#555555]" />
    <label className="sr-only" htmlFor="reward-category">Categoría de premio</label><input id="reward-category" value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Categoría" className="px-3 py-2 rounded-xl bg-[#111111] border border-[#555555]" />
    <button type="submit" className="sm:col-span-2 px-4 py-2 rounded-xl bg-[#555555]">Agregar opción</button>
  </form>;
}
