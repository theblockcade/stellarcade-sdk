import Link from "next/link";

export default function HomePage() {
  return (
    <main className="home-hero">
      <h1>
        Provably fair, <span className="g">provably yours to verify</span>
      </h1>
      <p>
        stellarcade-sdk is the TypeScript client for TheBlockCade — games, prize
        pools, quests and tournaments on Stellar/Soroban. Every round ships with
        a commit-reveal proof you can check yourself, offline, with one function
        call.
      </p>
      <div className="home-cta">
        <Link className="btn btn-signal" href="/docs/quickstart">
          Get started
        </Link>
        <Link className="btn btn-dark" href="/docs/fairness">
          How fairness works
        </Link>
      </div>
    </main>
  );
}
