import { useState } from "react";
import { processVisionImage } from "../../utils/image";

type Props = { onImage: (blob: Blob) => Promise<boolean> };
type PropsWithId = Props & { inputId: string };
export function VisionImagePicker({ inputId, onImage }: PropsWithId) {
  const [status, setStatus] = useState("");
  async function change(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; if (!file) return;
    setStatus("Procesando imagen...");
    try { const image = await processVisionImage(file); setStatus("Guardando imagen..."); if (await onImage(image)) setStatus(""); else setStatus("No se pudo cambiar la imagen."); }
    catch (error) { setStatus(error instanceof Error ? error.message : "No se pudo procesar la imagen."); }
    event.target.value = "";
  }
  return <div><label className="text-xs text-[#aaa]" htmlFor={inputId}>Cambiar imagen</label><input id={inputId} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={change} className="block text-xs mt-1" />{status && <p className="text-xs text-[#ffaaaa] mt-1" role="status">{status}</p>}</div>;
}
