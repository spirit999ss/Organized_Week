import type { RewardBalance } from "../types";
import { formatMinutes } from "../utils/format";

type HeaderProps = {
  balance: RewardBalance;
};

export function Header({ balance }: HeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-linear-to-r from-white to-[#999999] bg-clip-text text-transparent">
          Organized Week
        </h1>
      </div>
      <div className="px-4 py-3 rounded-2xl bg-linear-to-br from-[#333333] to-[#111111] border border-[#666666]/40">
        <p className="text-sm font-semibold">Horas de premios</p>
        <p className="text-xs text-[#999999]">
          {formatMinutes(balance.available)} disponibles
        </p>
      </div>
    </header>
  );
}
