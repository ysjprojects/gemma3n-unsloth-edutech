# 🧪 Science Lab Creator

An interactive science quiz application that generates adaptive educational experiments for elementary school students.

## Features

- **Adaptive Difficulty**: Quiz difficulty automatically adjusts based on student performance
- **Interactive Quizzes**: Engaging, visual quizzes with animations and feedback
- **Multiple Themes**: Default, futuristic, and pastel visual themes
- **AI-Generated Content**: CodeLlama-powered experiment generation for unlimited topics
- **Seed Data**: Pre-built interactive quizzes for heat energy, electrical systems, and light energy

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Hugging Face API token (get one at [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens))

### Local Development

1. Clone and install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

3. Add your Hugging Face token to `.env.local`:
```
HUGGINGFACE_TOKEN=hf_your_token_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel

### Manual Deployment

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy to Vercel:
```bash
vercel --prod
```

3. Set environment variables in Vercel dashboard:
   - `HUGGINGFACE_TOKEN`: Your Hugging Face API token
   - `HUGGINGFACE_MODEL`: (Optional) Defaults to `codellama/CodeLlama-7b-hf`

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `HUGGINGFACE_TOKEN` | Yes | - | Your Hugging Face API token |
| `HUGGINGFACE_MODEL` | No | `codellama/CodeLlama-7b-hf` | The Hugging Face model to use |

## Architecture

- **Frontend**: Next.js 15 with React 19, Tailwind CSS
- **API**: Next.js API routes with Hugging Face integration
- **AI Models**: CodeLlama for code generation
- **Deployment**: Optimized for Vercel

## Supported Topics

### Seed Data (Instant Loading)
- Heat Energy (3 difficulty levels)
- Basic Electrical Systems
- Light Energy

### AI-Generated (On-Demand)
- Any science topic via CodeLlama integration
- Automatically generates interactive HTML experiments

## Development

### Build Commands

```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # Code linting
```

### Tech Stack

- Next.js 15 (React 19)
- TypeScript
- Tailwind CSS 4
- Hugging Face Inference API

## License

MIT
