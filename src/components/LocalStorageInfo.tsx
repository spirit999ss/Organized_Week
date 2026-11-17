import { useState } from "react";

/*Por ahora no va a funcionar */
type Estimate = { usage?: number; quota?: number };
function formatBytes(value: number) {
  return `${(value / 1024 / 1024).toFixed(2)} MB`;
}
export function LocalStorageInfo() {
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [message, setMessage] = useState("");
  async function inspect() {
    try {
      const storage = navigator.storage;
      if (!storage?.estimate) {
        setMessage("El navegador no ofrece estimación de almacenamiento.");
        return;
      }
      setEstimate(await storage.estimate());
    } catch {
      setMessage("No se pudo consultar el almacenamiento.");
    }
  }
  async function persist() {
    try {
      const result = await navigator.storage?.persist?.();
      setMessage(
        result
          ? "El navegador concedió la persistencia."
          : "El navegador no concedió la persistencia.",
      );
    } catch {
      setMessage("No se pudo solicitar la persistencia.");
    }
  }
  return (
    <section className="bg-linear-to-br from-[#292929] via-[#151515] to-[#000000] rounded-3xl border border-[#666666]/40 p-5 mt-5">
      <h2 className="font-semibold">Almacenamiento local</h2>
      <p className="text-xs text-[#999999] mt-1">
        La decisión final sobre la persistencia corresponde al navegador.
      </p>
      <div className="flex gap-2 mt-3">
        <button
          type="button"
          onClick={inspect}
          className="px-3 py-2 rounded-xl bg-[#444444]"
        >
          Consultar uso
        </button>
        <button
          type="button"
          onClick={persist}
          className="px-3 py-2 rounded-xl bg-[#444444]"
        >
          Proteger datos locales
        </button>
      </div>
      {estimate?.usage !== undefined && estimate.quota !== undefined && (
        <p className="text-xs text-[#bbbbbb] mt-3">
          Uso aproximado: {formatBytes(estimate.usage)} · Cuota aproximada:{" "}
          {formatBytes(estimate.quota)} ·{" "}
          {((estimate.usage / estimate.quota) * 100).toFixed(2)}%
        </p>
      )}
      {message && <p className="text-xs text-[#bbbbbb] mt-2">{message}</p>}
    </section>
  );
}
