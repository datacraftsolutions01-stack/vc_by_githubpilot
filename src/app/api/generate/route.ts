import { NextRequest, NextResponse } from 'next/server';
import { generateText } from '@/lib/llm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { deckText, vcPersona } = body as { deckText?: string; vcPersona?: string };

    // Validate input
    if (!deckText || typeof deckText !== 'string' || !deckText.trim()) {
      return NextResponse.json(
        { error: 'Missing or invalid deckText field', success: false },
        { status: 400 }
      );
    }

    // Persona is optional; use a sensible default if not provided
    const personaText =
      typeof vcPersona === 'string' && vcPersona.trim().length > 0
        ? vcPersona.trim()
        : 'VC investor';

    // First, summarize the deck text into five bullet points
    const summarizePrompt = `Please summarize the following pitch deck text into exactly 5 clear and concise bullet points. Focus on the key business aspects:

Pitch Deck Text:
${deckText}

Format your response as:
• [Bullet point 1]
• [Bullet point 2]
• [Bullet point 3]
• [Bullet point 4]
• [Bullet point 5]`;

    const summaryResponse = await generateText(summarizePrompt);
    const summary = summaryResponse.content;

    // Then, generate the VC brief based on the summary and persona
    const briefPrompt = `You are a ${personaText}. Based on the following pitch deck summary, generate a concise, one-page venture capital brief. The brief should be professional, analytical, and succinct.

Pitch Deck Summary:
${summary}

Generate a comprehensive VC brief that includes:
1. Executive Summary
2. Market Opportunity Assessment
3. Business Model Analysis
4. Team Evaluation
5. Risk Assessment
6. Investment Recommendation

Keep the brief concise but thorough, suitable for a one-page investment memo. Write from the perspective of the specified VC persona: ${personaText}.`;

    const briefResponse = await generateText(briefPrompt);

    return NextResponse.json({
      success: true,
      summary,
      brief: briefResponse.content,
      provider: briefResponse.provider,
    });
  } catch (error) {
    console.error('API error:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        success: false,
      },
      { status: 500 }
    );
  }
}
