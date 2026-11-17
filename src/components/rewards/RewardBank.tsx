import type { Consumption, RewardBalance, RewardOption } from "../../types";

import { formatMinutes } from "../../utils/format";
import { useState } from "react";

type Props = {
  balance: RewardBalance;
  options: RewardOption[];
  consumptions: Consumption[];
  onConsume: (option: RewardOption, minutes: number) => boolean;
  onEdit: (item: Consumption) => void;
  onDelete: (id: string) => void;
  canConsume: boolean;
};
const panelClass =
  "bg-linear-to-br from-[#292929] via-[#151515] to-[#000000] rounded-3xl border border-[#666666]/40 shadow-2xl overflow-hidden";
export function RewardBank({
  balance,
  options,
  consumptions,
  onConsume,
  onEdit,
  onDelete,
  canConsume,
}: Props) {
  const [minutes, setMinutes] = useState("");
  const [selected, setSelected] = useState("");
  const selectedOption =
    options.find((option) => option.id === selected) ?? options[0];
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(minutes);
    if (selectedOption && onConsume(selectedOption, amount)) setMinutes("");
  }
  return (
    <section className={`${panelClass} mt-5 p-5`}>
      <div className="flex flex-wrap justify-between gap-3 mb-4">
        <h2 className="font-semibold">Horas de premios</h2>
        <div className="text-right">
          <p className="text-xl font-bold">
            {formatMinutes(balance.available)}
          </p>
          <p className="text-xs text-[#999999]">
            disponible · {formatMinutes(balance.used)} utilizado
          </p>
        </div>
      </div>
      {options.length === 0 ? (
        <p className="text-sm text-[#999999]">
          Configura opciones de premios para registrar consumos.
        </p>
      ) : (
        <form
          onSubmit={submit}
          className="grid sm:grid-cols-[1fr_auto_auto] gap-3 mb-5"
        >
          <label className="sr-only" htmlFor="reward-select">
            Opción de premio
          </label>
          <select
            id="reward-select"
            value={selected || options[0].id}
            onChange={(event) => setSelected(event.target.value)}
            className="px-3 py-3 rounded-xl bg-[#111111] border border-[#555555] text-white"
          >
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.title} · {option.category}
              </option>
            ))}
          </select>
          <label className="sr-only" htmlFor="reward-minutes">
            Minutos
          </label>
          <input
            id="reward-minutes"
            type="number"
            min="1"
            max={balance.available}
            value={minutes}
            onChange={(event) => setMinutes(event.target.value)}
            placeholder="Minutos"
            className="px-3 py-3 rounded-xl bg-[#111111] border border-[#555555] text-white"
          />
          <button
            type="submit"
            disabled={!minutes || balance.available <= 0 || !canConsume}
            className="px-4 py-3 rounded-xl bg-linear-to-r from-[#888888] to-[#444444] disabled:opacity-30 font-semibold"
          >
            Registrar
          </button>
        </form>
      )}
      {consumptions.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between gap-2 rounded-xl bg-[#111111] border border-[#444444] p-3 text-sm"
        >
          <div>
            <p>
              {item.title}{" "}
              <span className="text-xs text-[#999999]">· {item.category}</span>
            </p>
            <p className="text-xs text-[#777777]">
              {item.date} · {formatMinutes(item.minutes)}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="text-xs text-[#999999]"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => onDelete(item.id)}
              className="text-xs text-[#999999]"
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}
