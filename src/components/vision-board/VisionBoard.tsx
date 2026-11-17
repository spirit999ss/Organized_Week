import type { GoalStatus, NewVisionGoalInput, VisionGoal } from "../../types";

import { MAX_VISION_GOALS } from "../../constants/visionBoard";
import { VisionBoardCard } from "./VisionBoardCard";
import { VisionGoalForm } from "./VisionGoalForm";

type Props = {
  goals: VisionGoal[];
  error: string;
  onAdd: (input: NewVisionGoalInput) => Promise<boolean>;
  onStatus: (id: string, status: GoalStatus) => void;
  onUpdate: (id: string, title: string, description: string) => void;
  onImage: (id: string, imageBlob: Blob) => Promise<boolean>;
  onRemoveImage: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function VisionBoard({
  goals,
  error,
  onAdd,
  onStatus,
  onUpdate,
  onImage,
  onRemoveImage,
  onDelete,
}: Props) {
  return (
    <section className="mt-5 overflow-hidden rounded-3xl border border-[#666666]/40 bg-linear-to-br from-[#292929] via-[#151515] to-[#000000] p-4 shadow-2xl sm:p-5 lg:p-6">
      <header className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold sm:text-xl">Vision Board</h2>

          <p className="mt-1 text-xs text-[#999999]">
            Metas: {goals.length}/{MAX_VISION_GOALS}
          </p>
        </div>
      </header>

      {goals.length === 0 ? (
        <div className="mt-4 flex min-h-28 items-center justify-center rounded-2xl border border-[#666666]/40 bg-[#151515] px-4 py-6 text-center">
          <p className="text-sm text-[#999999]">Tu Vision Board está vacío.</p>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <VisionBoardCard
              key={goal.id}
              goal={goal}
              onStatus={onStatus}
              onUpdate={onUpdate}
              onImage={onImage}
              onRemoveImage={onRemoveImage}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}

      <div className="mt-5">
        {goals.length < MAX_VISION_GOALS ? (
          <VisionGoalForm
            onSubmit={onAdd}
            disabled={goals.length >= MAX_VISION_GOALS}
          />
        ) : (
          <div className="rounded-2xl border border-[#666666]/40 bg-[#151515] px-4 py-3 text-center">
            <p className="text-sm text-[#bbbbbb]">
              Alcanzaste el máximo de {MAX_VISION_GOALS} metas.
            </p>
          </div>
        )}
      </div>

      {error && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-[#ffaaaa]/30 bg-[#151515] px-4 py-3"
        >
          <p className="text-sm text-[#ffaaaa]">{error}</p>
        </div>
      )}
    </section>
  );
}
