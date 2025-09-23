'use client';

import { useState } from 'react';

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
    if (!deckText.trim() || !vcPersona.trim()) {
      setResult({
        success: false,
        error: 'Please fill in both the pitch deck text and VC persona fields.'
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deckText: deckText.trim(),
          vcPersona: vcPersona.trim(),
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch {
      setResult({
        success: false,
        error: 'Network error. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const gumroadLink = process.env.NEXT_PUBLIC_GUMROAD_LINK || '#';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">VC Briefing</h1>
          <p className="text-gray-600 mt-2">
            Generate AI-powered venture capital briefs from your pitch deck
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">
          {/* Pitch Deck Input */}
          <div>
            <label htmlFor="deckText" className="block text-sm font-medium text-gray-700 mb-2">
              Pitch Deck Text
            </label>
            <textarea
              id="deckText"
              value={deckText}
              onChange={(e) => setDeckText(e.target.value)}
              placeholder="Paste your pitch deck content here..."
              className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical"
              disabled={isLoading}
            />
          </div>

          {/* VC Persona Input */}
          <div>
            <label htmlFor="vcPersona" className="block text-sm font-medium text-gray-700 mb-2">
              VC Persona
            </label>
            <input
              id="vcPersona"
              type="text"
              value={vcPersona}
              onChange={(e) => setVcPersona(e.target.value)}
              placeholder="e.g., experienced SaaS investor, early-stage tech VC, healthcare-focused partner"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
          </div>

          {/* Generate Button */}
          <div className="flex justify-center">
            <button
              onClick={handleGenerate}
              disabled={isLoading || !deckText.trim() || !vcPersona.trim()}
              className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                'Generate VC Brief'
              )}
            </button>
          </div>

          {/* Results */}
          {result && (
            <div className="border-t pt-6">
              {result.success ? (
                <div className="space-y-6">
                  {/* Summary */}
                  {result.summary && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        Executive Summary
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                          {result.summary}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Brief */}
                  {result.brief && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        VC Brief
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                          {result.brief}
                        </pre>
                      </div>
                    </div>
                  )}

                  {/* Provider Info */}
                  {result.provider && (
                    <div className="text-xs text-gray-500 text-center">
                      Generated using {result.provider === 'openai' ? 'OpenAI GPT-4o-mini' : 'Google Gemini 1.5 Flash'}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Error
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        {result.error}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer with Gumroad CTA */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Want more advanced VC analysis tools?
            </h2>
            <p className="text-gray-600 mb-4">
              Get access to our premium suite of investment analysis tools
            </p>
            <a
              href={gumroadLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-md shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
              Get Premium Tools
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
