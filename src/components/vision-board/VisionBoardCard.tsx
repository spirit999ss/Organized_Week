import { useEffect, useState } from "react";
import type { GoalStatus, VisionGoal } from "../../types";
import { getVisionImage } from "../../services/visionImageStorage";
import { VisionImagePicker } from "./VisionImagePicker";
type Props = { goal: VisionGoal; onStatus: (id: string, status: GoalStatus) => void; onUpdate: (id: string, title: string, description: string) => void; onImage: (id: string, imageBlob: Blob) => Promise<boolean>; onRemoveImage: (id: string) => Promise<void>; onDelete: (id: string) => Promise<void> };
export function VisionBoardCard({ goal, onStatus, onUpdate, onImage, onRemoveImage, onDelete }: Props) {
  const [url, setUrl] = useState(""); const [loadedImageId, setLoadedImageId] = useState<string | null>(null); const [imageState, setImageState] = useState<"ready" | "missing" | "error">("ready"); const [editing, setEditing] = useState(false); const [title, setTitle] = useState(goal.title); const [description, setDescription] = useState(goal.description);
  useEffect(() => {
    let active = true;
    let objectUrl = "";
    if (goal.imageId) {
      getVisionImage(goal.imageId).then((image) => {
        if (active && image) {
          objectUrl = URL.createObjectURL(image.blob);
          setUrl(objectUrl);
          setLoadedImageId(goal.imageId);
          setImageState("ready");
        } else if (active) setImageState("missing");
      }).catch(() => {
        if (active) setImageState("error");
      });
    }
    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [goal.imageId]);
  function save() { if (title.trim()) { onUpdate(goal.id, title, description); setEditing(false); } }
  const imageIsLoading = Boolean(goal.imageId && loadedImageId !== goal.imageId && imageState !== "error" && imageState !== "missing");
  return <article className="rounded-2xl overflow-hidden border border-[#555555]/60 bg-[#111111]"><div className="relative aspect-3/2 bg-[#444444]">{imageState === "ready" && loadedImageId === goal.imageId && url ? <img src={url} alt={goal.title} className="w-full h-full object-contain opacity-70" /> : imageIsLoading ? <p className="p-5 text-sm text-[#bbbbbb]">Cargando imagen...</p> : imageState === "error" ? <p className="p-5 text-sm text-[#ffaaaa]">No se pudo cargar la imagen.</p> : imageState === "missing" && goal.imageId ? <p className="p-5 text-sm text-[#ffaaaa]">No se encontró la imagen.</p> : <p className="p-5 text-sm text-[#999999]">Esta meta no tiene imagen.</p>}<span className="absolute bottom-3 left-3 text-xs px-2 py-1 rounded-lg bg-[#111111]/80 border border-[#666666]">{goal.status}</span></div><div className="p-4">{editing ? <><label className="sr-only" htmlFor={`title-${goal.id}`}>Título</label><input id={`title-${goal.id}`} value={title} onChange={(event) => setTitle(event.target.value)} className="w-full px-2 py-1 bg-[#222222] rounded" /><label className="sr-only" htmlFor={`desc-${goal.id}`}>Descripción</label><textarea id={`desc-${goal.id}`} value={description} onChange={(event) => setDescription(event.target.value)} className="w-full mt-2 px-2 py-1 bg-[#222222] rounded" /><button type="button" onClick={save} className="text-xs mt-2">Guardar</button></> : <><h3 className="font-semibold text-sm">{goal.title}</h3><p className="text-xs text-[#999999] mt-1">{goal.description}</p></>}<select aria-label="Estado de la meta" value={goal.status} onChange={(event) => onStatus(goal.id, event.target.value as GoalStatus)} className="w-full mt-3 px-3 py-2 rounded-lg bg-[#222222] border border-[#555555] text-xs text-white"><option value="pendiente">Pendiente</option><option value="en progreso">En progreso</option><option value="conseguida">Conseguida</option></select><div className="flex flex-wrap gap-2 mt-3"><button type="button" onClick={() => setEditing(true)} className="text-xs text-[#aaa]">Editar</button><VisionImagePicker inputId={`vision-image-${goal.id}`} onImage={(imageBlob) => onImage(goal.id, imageBlob)} />{goal.imageId && <button type="button" onClick={() => { if (window.confirm("¿Eliminar solamente la imagen de esta meta?")) onRemoveImage(goal.id); }} className="text-xs text-[#aaa]">Eliminar imagen</button>}<button type="button" onClick={() => { if (window.confirm(`¿Eliminar la meta "${goal.title}"?`)) onDelete(goal.id); }} className="text-xs text-[#aaa]">Eliminar</button></div></div></article>;
}
