'use client';

import { useMemo, useState } from 'react';

interface GenerateResponse {
  success: boolean;
  summary?: string;
  brief?: string;
  provider?: string;
  error?: string;
}

export default function Home() {
  const [deckText, setDeckText] = useState('');
  const [vcPersona, setVcPersona] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateResponse | null>(null);

  const handleGenerate = async () => {
    if (!deckText.trim()) {
      setResult({ success: false, error: 'Please paste your pitch deck text.' });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckText: deckText.trim(), vcPersona: vcPersona.trim() || undefined }),
      });

      const data = await response.json();
      setResult(data);
    } catch (e) {
      setResult({ success: false, error: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const gumroadLink = process.env.NEXT_PUBLIC_GUMROAD_LINK || '#';

  const bullets: string[] = useMemo(() => {
    if (!result?.summary) return [];
    const raw = result.summary
      .split(/\r?\n|•|\u2022|\-/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => s.replace(/^[•\-\d\.)\s]+/, ''));
    return raw.slice(0, 5);
  }, [result?.summary]);

  const investorAngle: string = useMemo(() => {
    const src = (result?.brief || result?.summary || '').trim();
    if (!src) return '';
    const m = src.match(/[^.!?]+[.!?]/);
    return (m ? m[0] : src.slice(0, 220)).trim();
  }, [result?.brief, result?.summary]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 blur-3xl opacity-30" aria-hidden>
          <div className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-rose-400 w-[60rem] h-[60rem] rounded-full -translate-x-1/3 -translate-y-1/3" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 pt-14 pb-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-600">
              Turn your deck into a VC-ready snapshot in &lt;30s.
            </span>
          </h1>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            Paste your pitch deck below and get a free snapshot.
          </p>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-4 pb-10">
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8 space-y-6">
          {/* Pitch Deck Input */}
          <div>
            <label htmlFor="deckText" className="block text-sm font-medium text-slate-700 mb-2">
              Pitch Deck Text
            </label>
            <textarea
              id="deckText"
              value={deckText}
              onChange={(e) => setDeckText(e.target.value)}
              placeholder="Paste your pitch deck content here..."
              className="w-full h-44 sm:h-52 px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-vertical"
              disabled={isLoading}
            />
          </div>

          {/* VC Persona Input (optional) */}
          <div>
            <label htmlFor="vcPersona" className="block text-sm font-medium text-slate-700 mb-2">
              VC Persona <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <input
              id="vcPersona"
              type="text"
              value={vcPersona}
              onChange={(e) => setVcPersona(e.target.value)}
              placeholder="e.g., Sequoia, a16z"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              disabled={isLoading}
            />
          </div>

          {/* Generate Button */}
          <div className="flex justify-center">
            <button
              onClick={handleGenerate}
              disabled={isLoading || !deckText.trim()}
              className="px-8 py-3 rounded-full font-semibold text-white shadow-lg transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-rose-600 hover:from-indigo-500 hover:via-fuchsia-500 hover:to-rose-500"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </span>
              ) : (
                'Generate VC Snapshot'
              )}
            </button>
          </div>

          {/* Results */}
          {result && (
            <div className="border-t border-slate-100 pt-6">
              {result.success ? (
                <div className="space-y-6">
                  {/* Snapshot Bullets */}
                  {(bullets.length > 0) && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-3">Snapshot</h3>
                      <ul className="list-disc pl-5 space-y-2 text-slate-700">
                        {bullets.map((b, i) => (
                          <li key={i}>{b}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Investor Angle */}
                  {investorAngle && (
                    <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-indigo-700 mb-1">Investor Angle</div>
                      <p className="text-slate-800">{investorAngle}</p>
                    </div>
                  )}

                  {/* Full Brief (optional readout) */}
                  {result.brief && (
                    <details className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                      <summary className="cursor-pointer text-sm font-medium text-slate-800">View full VC brief</summary>
                      <pre className="mt-3 whitespace-pre-wrap text-sm text-slate-700 font-sans">{result.brief}</pre>
                    </details>
                  )}

                  {/* Provider Info */}
                  {result.provider && (
                    <div className="text-xs text-slate-500 text-center">
                      Generated using {result.provider === 'openai' ? 'OpenAI GPT-4o-mini' : 'Google Gemini 1.5 Flash'}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 10-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error</h3>
                      <div className="mt-2 text-sm text-red-700">{result.error}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-8">
          <a
            href={gumroadLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-7 py-3 rounded-full font-semibold text-white shadow-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500"
          >
            Unlock Full VC Brief – $79
          </a>
        </div>
      </main>

      {/* Trust Strip */}
      <footer className="mt-12 border-t border-slate-200 bg-white/70 backdrop-blur">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <ul className="flex flex-col sm:flex-row items-center justify-center gap-3 text-slate-600 text-sm">
            <li className="flex items-center gap-2"><span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500"></span>No signup</li>
            <li className="hidden sm:block text-slate-300">•</li>
            <li className="flex items-center gap-2"><span className="inline-block h-2.5 w-2.5 rounded-full bg-indigo-500"></span>Your data is private</li>
            <li className="hidden sm:block text-slate-300">•</li>
            <li className="flex items-center gap-2"><span className="inline-block h-2.5 w-2.5 rounded-full bg-rose-500"></span>Delivery within 24h</li>
          </ul>
        </div>
      </footer>
    </div>
  );
}