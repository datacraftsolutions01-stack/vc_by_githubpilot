# VC Briefing - AI-Powered Venture Capital Analysis

A Next.js 14 application that generates concise venture capital briefs from pitch deck text using AI.

![VC Briefing UI](https://github.com/user-attachments/assets/4fbed6c4-99b9-49f3-880e-cb41928c9205)

## Features

- **Clean SaaS UI**: Modern, responsive design built with Tailwind CSS
- **AI-Powered Analysis**: Supports both OpenAI (GPT-4o-mini) and Google Gemini (1.5 Flash) APIs
- **Dual Processing**: First summarizes pitch deck into 5 bullet points, then generates comprehensive VC brief
- **Flexible VC Personas**: Customizable investor perspectives for tailored analysis
- **Error Handling**: Graceful error handling with informative user feedback
- **Gumroad Integration**: Configurable CTA for premium tools

## Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key OR Google Gemini API key (at least one required)

## Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vc-briefing
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Edit `.env.local` with your API keys:
   ```env
   # At least one API key is required
   OPENAI_API_KEY=your_openai_api_key_here
   GEMINI_API_KEY=your_gemini_api_key_here
   
   # Public environment variable for Gumroad CTA
   NEXT_PUBLIC_GUMROAD_LINK=https://gumroad.com/your-product-link
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the application**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

1. **Enter Pitch Deck Text**: Paste your startup's pitch deck content into the textarea
2. **Specify VC Persona**: Describe the type of investor perspective you want (e.g., "experienced SaaS investor", "healthcare-focused VC partner")
3. **Generate Brief**: Click the "Generate VC Brief" button
4. **Review Results**: The application will display:
   - A 5-point executive summary
   - A comprehensive VC brief tailored to your specified persona

## API Routes

### POST `/api/generate`

Generates VC briefs from pitch deck text.

**Request Body:**
```json
{
  "deckText": "Your pitch deck content...",
  "vcPersona": "experienced SaaS investor"
}
```

**Response:**
```json
{
  "success": true,
  "summary": "• Bullet point summary...",
  "brief": "Comprehensive VC brief...",
  "provider": "openai" | "gemini"
}
```

## Project Structure

```
src/
├── app/
│   ├── api/generate/
│   │   └── route.ts          # API endpoint for VC brief generation
│   ├── layout.tsx            # Root layout with metadata
│   └── page.tsx              # Main application UI
└── lib/
    └── llm.ts                # LLM integration helpers
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

1. Build the application:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Optional* | OpenAI API key for GPT-4o-mini |
| `GEMINI_API_KEY` | Optional* | Google Gemini API key for 1.5 Flash |
| `NEXT_PUBLIC_GUMROAD_LINK` | Optional | Public URL for Gumroad CTA button |

*At least one AI API key is required for the application to function.

## Technology Stack

- **Framework**: Next.js 15.5.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.0
- **AI APIs**: OpenAI GPT-4o-mini, Google Gemini 1.5 Flash
- **Deployment**: Vercel-ready

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure tests pass: `npm run build && npm run lint`
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
