import { rows } from '@/lib/pg';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminTutorialsPage() {
  const tutorials = await rows<{ id: number; title_kn: string; title_en: string; video_url: string; scheme_name: string; slug: string }>(
    `SELECT t.id, t.title_kn, t.title_en, t.video_url, s.name_en AS scheme_name, s.slug
     FROM tutorials t JOIN schemes s ON s.id = t.scheme_id
     ORDER BY t.id DESC`
  );

  const schemeVideos = await rows<{ name_en: string; name_kn: string; slug: string; tutorial_video: string }>(
    `SELECT name_en, name_kn, slug, tutorial_video FROM schemes
     WHERE tutorial_video IS NOT NULL AND tutorial_video != ''`
  );

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-slate-900">Tutorials</h1>
      <p className="mt-1 text-sm text-slate-500">Kannada tutorial videos attached to schemes.</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Tutorial Videos</h2>
          {tutorials.length === 0 && schemeVideos.length === 0 ? (
            <p className="mt-3 text-sm text-slate-400">
              No tutorials yet. Add a “Tutorial video” URL when creating or editing a scheme.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {schemeVideos.map((s) => (
                <li key={s.slug} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 text-sm">
                  <span>
                    <span className="block font-semibold text-slate-800">{s.name_en}</span>
                    <span className="font-kn text-xs text-slate-400">{s.name_kn}</span>
                  </span>
                  <a href={s.tutorial_video} target="_blank" rel="noopener noreferrer" className="shrink-0 text-xs font-bold text-brand-700 hover:underline">
                    Watch ↗
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">How to add a tutorial</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-600">
            <li>
              Open a scheme in the{' '}
              <Link href="/admin/schemes" className="font-bold text-brand-700 hover:underline">
                Schemes
              </Link>{' '}
              list.
            </li>
            <li>Paste the video URL into the “Tutorial video” field.</li>
            <li>Save the scheme — the “Watch Kannada Tutorial” button appears automatically.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
