import Link from "next/link";
import NoiseBackground from "@/components/ui/noise-background";

const btnBase =
  "inline-flex items-center gap-2 rounded-full px-[32px] py-4 text-[17px] font-bold transition-all duration-200";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-200 px-6 min-h-screen flex flex-col items-center justify-center text-center">
      <NoiseBackground />
      <h1 className="text-[clamp(2.25rem,9vw,5rem)] leading-[1.05] font-extrabold tracking-[-0.03em]">
        Provably fair,{" "}
        <span className="bg-linear-to-r from-signal to-hot bg-clip-text text-transparent">
          provably yours to verify
        </span>
      </h1>
      <p className="mx-auto mt-6 max-w-150 text-[clamp(1.0625rem,2.6vw,1.2rem)] leading-[1.65] text-muted">
        stellarcade-sdk is the TypeScript client for TheBlockCade — games, prize
        pools, quests and tournaments on Stellar/Soroban. Every round ships with
        a commit-reveal proof you can check yourself, offline, with one function
        call.
      </p>
      <div className="mt-9 inline-flex gap-3.5">
        <Link
          className={`${btnBase} bg-signal text-bg shadow-[0_4px_20px_var(--color-signal-glow)] hover:bg-hot hover:-translate-y-px`}
          href="/quickstart"
        >
          Get started
        </Link>
        <Link
          className={`${btnBase} border border-line-strong bg-surface2 text-ink hover:border-signal hover:bg-surface3 hover:text-signal`}
          href="/fairness"
        >
          How fairness works
        </Link>
      </div>
    </main>
  );
}
