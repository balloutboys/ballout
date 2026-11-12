import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Artifact = { slug: string; title: string; description: string | null; created_at: string };

export default async function Home() {
  let artifacts: Artifact[] = [];
  let error: string | null = null;

  if (!isSupabaseConfigured()) {
    error = "Supabase isn't connected yet. Add the env vars from .env.example.";
  } else {
    const supabase = await createClient();
    const res = await supabase
      .from("artifacts")
      .select("slug,title,description,created_at")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (res.error) error = res.error.message;
    else artifacts = res.data ?? [];
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-black tracking-tight">Ballout Boys</h1>
      <p className="mt-2 text-neutral-500">Artifacts, drops and builds.</p>

      {error && <p className="mt-10 rounded-lg border border-amber-400/40 bg-amber-50 p-4 text-amber-900 dark:bg-amber-950/30 dark:text-amber-200">{error}</p>}

      {!error && artifacts.length === 0 && <p className="mt-10 text-neutral-500">Nothing published yet.</p>}

      <ul className="mt-10 space-y-4">
        {artifacts.map((a) => (
          <li key={a.slug}>
            <Link href={`/artifacts/${a.slug}`} className="block rounded-xl border border-neutral-200 p-5 hover:border-neutral-400 dark:border-neutral-800">
              <h2 className="text-xl font-bold">{a.title}</h2>
              {a.description && <p className="mt-1 text-neutral-500">{a.description}</p>}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
