import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// OpenAI configuration
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

// Gemini configuration
const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export interface LLMResponse {
  content: string;
  provider: 'openai' | 'gemini';
}

export async function generateText(prompt: string): Promise<LLMResponse> {
  // Try OpenAI first if available
  if (openai) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const content = completion.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No content returned from OpenAI');
      }

      return {
        content,
        provider: 'openai'
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      // Fall through to try Gemini
    }
  }

  // Try Gemini if OpenAI failed or is not available
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const content = response.text();

      if (!content) {
        throw new Error('No content returned from Gemini');
      }

      return {
        content,
        provider: 'gemini'
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to generate content with Gemini');
    }
  }

  throw new Error('No API keys configured. Please set OPENAI_API_KEY or GEMINI_API_KEY environment variables.');
}

export function getAvailableProviders(): string[] {
  const providers: string[] = [];
  if (process.env.OPENAI_API_KEY) providers.push('OpenAI (gpt-4o-mini)');
  if (process.env.GEMINI_API_KEY) providers.push('Gemini (gemini-1.5-flash)');
  return providers;
}