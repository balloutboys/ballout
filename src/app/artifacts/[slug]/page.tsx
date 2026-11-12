import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ArtifactPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isSupabaseConfigured()) notFound();

  const supabase = await createClient();
  const { data } = await supabase
    .from("artifacts")
    .select("title,description,url,content")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (!data) notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-16">
      <Link href="/" className="text-sm text-neutral-500 hover:underline">← All artifacts</Link>
      <h1 className="mt-4 text-4xl font-black tracking-tight">{data.title}</h1>
      {data.description && <p className="mt-2 text-neutral-500">{data.description}</p>}
      {data.url && (
        <a href={data.url} target="_blank" rel="noreferrer" className="mt-6 inline-block rounded-lg bg-black px-4 py-2 font-semibold text-white dark:bg-white dark:text-black">
          Open artifact ↗
        </a>
      )}
      {data.content && <pre className="mt-8 whitespace-pre-wrap rounded-xl border border-neutral-200 p-5 dark:border-neutral-800">{data.content}</pre>}
    </main>
  );
}
