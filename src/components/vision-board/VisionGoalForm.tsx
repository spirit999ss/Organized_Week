import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useRef, useState } from "react";

import type { NewVisionGoalInput } from "../../types";
import { processVisionImage } from "../../utils/image";

type Props = {
  onSubmit: (input: NewVisionGoalInput) => Promise<boolean>;
  disabled?: boolean;
};

export function VisionGoalForm({ onSubmit, disabled = false }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageBlob, setImageBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(
    () => () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    },
    [previewUrl],
  );

  async function selectImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";

    if (!file) return;

    setError("");
    setIsProcessing(true);
    setStatus("Procesando imagen...");

    try {
      const blob = await processVisionImage(file);

      setImageBlob(blob);
      setFileName(file.name);

      setPreviewUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return URL.createObjectURL(blob);
      });

      setStatus("Imagen lista.");
    } catch (reason) {
      setImageBlob(null);
      setFileName("");

      setPreviewUrl((previous) => {
        if (previous) URL.revokeObjectURL(previous);
        return "";
      });

      setError(
        reason instanceof Error
          ? reason.message
          : "No se pudo procesar la imagen.",
      );

      setStatus("");
    } finally {
      setIsProcessing(false);
    }
  }

  function removeImage() {
    setImageBlob(null);
    setFileName("");

    setPreviewUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return "";
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setStatus("");
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setError("El título es obligatorio.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    setStatus("Guardando meta...");

    try {
      if (
        await onSubmit({
          title: normalizedTitle,
          description: description.trim(),
          imageBlob,
        })
      ) {
        setTitle("");
        setDescription("");
        removeImage();
        setStatus("Meta agregada.");
      } else {
        setStatus("");
      }
    } catch (reason) {
      setError(
        reason instanceof Error
          ? reason.message
          : "No se pudo guardar la meta.",
      );

      setStatus("");
    } finally {
      setIsSubmitting(false);
    }
  }

  const imageInputDisabled = isProcessing || isSubmitting;

  return (
    <form
      onSubmit={submit}
      className="mt-5 space-y-5"
      aria-busy={isProcessing || isSubmitting}
    >
      <div className="space-y-2">
        <label
          htmlFor="goal-title"
          className="block text-sm font-medium text-white"
        >
          Título de meta
        </label>

        <input
          id="goal-title"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Nueva meta"
          className="w-full rounded-xl border border-[#555555] bg-[#111111] px-3 py-2 outline-none transition focus:border-[#999999] focus:ring-2 focus:ring-[#777777]/30"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="goal-description"
          className="block text-sm font-medium text-white"
        >
          Descripción de meta
        </label>

        <textarea
          id="goal-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Descripción (opcional)"
          rows={3}
          className="w-full resize-y rounded-xl border border-[#555555] bg-[#111111] px-3 py-2 outline-none transition focus:border-[#999999] focus:ring-2 focus:ring-[#777777]/30"
        />
      </div>

      <fieldset className="min-w-0 space-y-2">
        <legend className="text-sm font-medium text-white">
          Imagen de la meta
          <span className="ml-1 text-xs font-normal text-[#999999]">
            (opcional)
          </span>
        </legend>

        <input
          ref={fileInputRef}
          id="goal-image"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={selectImage}
          disabled={imageInputDisabled}
          className="peer sr-only"
        />

        {!previewUrl ? (
          <label
            htmlFor="goal-image"
            aria-disabled={imageInputDisabled}
            className={[
              "flex w-full flex-col items-center justify-center rounded-2xl",
              "border border-dashed border-[#666666] bg-[#151515]",
              "px-4 py-6 text-center transition",
              "peer-focus-visible:outline peer-focus-visible:outline-2",
              "peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#aaaaaa]",
              imageInputDisabled
                ? "cursor-not-allowed opacity-50"
                : "cursor-pointer hover:border-[#aaaaaa] hover:bg-[#1d1d1d]",
            ].join(" ")}
          >
            <span
              aria-hidden="true"
              className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-[#555555] bg-[#202020]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-5 w-5 text-[#bbbbbb]"
              >
                <path
                  d="M12 16V4m0 0-4 4m4-4 4 4M5 14v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            <span className="text-sm font-semibold text-white">
              {isProcessing ? "Procesando imagen..." : "Seleccionar imagen"}
            </span>

            <span className="mt-2 text-xs text-[#999999]">
              JPG, PNG, WebP o GIF · máximo 10 MB
            </span>

            <span className="mt-4 rounded-xl bg-linear-to-r from-[#777777] to-[#444444] px-4 py-2 text-sm font-semibold text-white">
              Buscar en el dispositivo
            </span>
          </label>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#555555] bg-[#0c0c0c]">
            <div className="relative">
              <img
                src={previewUrl}
                alt={
                  title.trim()
                    ? `Vista previa de ${title.trim()}`
                    : "Vista previa de la meta"
                }
                className="aspect-[3/2] w-full object-contain"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/50 to-transparent"
              />
            </div>

            <div className="space-y-3 border-t border-[#555555] p-3 sm:p-4">
              <div className="min-w-0">
                <p className="text-xs text-[#999999]">Imagen seleccionada</p>

                <p
                  className="mt-1 truncate text-sm text-white"
                  title={fileName}
                >
                  {fileName}
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <label
                  htmlFor="goal-image"
                  aria-disabled={imageInputDisabled}
                  className={[
                    "inline-flex min-h-10 flex-1 items-center justify-center",
                    "rounded-lg border border-[#777777] bg-[#333333]",
                    "px-3 py-2 text-center text-xs font-medium text-white",
                    "peer-focus-visible:outline peer-focus-visible:outline-2",
                    "peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#aaaaaa]",
                    imageInputDisabled
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:bg-[#444444]",
                  ].join(" ")}
                >
                  Cambiar imagen
                </label>

                <button
                  type="button"
                  onClick={removeImage}
                  disabled={imageInputDisabled}
                  className="min-h-10 flex-1 rounded-lg border border-red-400/40 bg-red-950/20 px-3 py-2 text-xs font-medium text-red-300 transition hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Quitar imagen
                </button>
              </div>
            </div>
          </div>
        )}

        {status && (
          <div
            role="status"
            aria-live="polite"
            className="rounded-xl border border-[#555555] bg-[#151515] px-3 py-2"
          >
            <p className="text-xs text-[#bbbbbb]">{status}</p>
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="rounded-xl border border-[#ffaaaa]/30 bg-[#151515] px-3 py-2"
          >
            <p className="text-xs text-[#ffaaaa]">{error}</p>
          </div>
        )}
      </fieldset>

      <button
        type="submit"
        disabled={disabled || isProcessing || isSubmitting}
        className="w-full rounded-xl bg-[#555555] px-4 py-2.5 font-semibold transition hover:bg-[#666666] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
      >
        {isSubmitting ? "Guardando meta..." : "Agregar meta"}
      </button>
    </form>
  );
}
