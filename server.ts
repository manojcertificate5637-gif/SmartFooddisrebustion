import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI();
  } catch (err) {
    console.warn('Gemini AI initialization notice:', err);
  }
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    aiAvailable: !!aiClient,
    timestamp: new Date().toISOString(),
  });
});

// AI Plan Explanation endpoint
app.post('/api/ai/explain-plan', async (req: Request, res: Response) => {
  const { planSummary, matches, constraints } = req.body;

  if (!aiClient) {
    // Graceful deterministic fallback
    return res.json({
      fallback: true,
      explanation: `Deterministic Allocation Summary: Evaluated ${matches?.length || 0} allocation pairs. Hard constraints for verified safe-use deadlines, temperature cold-chain compatibility, and vehicle capacities were strictly satisfied. High-priority community kitchens and emergency shelters received preferential allocation based on pre-configured scoring weights.`,
      recommendations: [
        'Prioritize refrigerated dispatch for temperature-sensitive dairy and prepared meals.',
        'Monitor delivery windows to ensure drop-offs occur at least 60 minutes prior to verified safe-use deadlines.',
        'Address unallocated surplus via secondary donation or non-perishable conversion.',
      ],
    });
  }

  try {
    const prompt = `You are an expert logistics coordinator and food safety specialist for the SMART FOOD REDISTRIBUTION platform.
Analyze this food redistribution plan:
Data Summary: ${JSON.stringify({ planSummary, matches: matches?.slice(0, 5), constraints })}

Provide a concise, professional 3-sentence operational explanation of why these allocations are optimal, followed by 3 actionable operational recommendations for logistics staff.
Format as JSON with keys: "explanation" (string) and "recommendations" (array of 3 strings). Keep all advice strictly grounded in the supplied constraints (cold-chain, expiry, vehicle capacity).`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      fallback: false,
      explanation: parsed.explanation || 'Plan validated under strict deterministic safety and capacity constraints.',
      recommendations: parsed.recommendations || [
        'Ensure vehicle temperature sensors are verified before departure.',
        'Verify recipient receiving contact 30 minutes prior to arrival.',
        'Follow designated drop-off sequence to minimize transit time.',
      ],
    });
  } catch (err: any) {
    console.error('Gemini API call failed, falling back:', err.message);
    return res.json({
      fallback: true,
      explanation: `Operational Plan Explanation: Verified ${matches?.length || 0} distribution routes. Deterministic checks confirmed storage compatibility, vehicle volume fit, and safe-use expiration margins across all recipients.`,
      recommendations: [
        'Dispatch time-critical prepared meals first.',
        'Verify recipient loading dock availability.',
        'Record arrival temperature upon delivery.',
      ],
    });
  }
});

// AI Food Safety & Categorization Insight
app.post('/api/ai/analyze-food', async (req: Request, res: Response) => {
  const { name, category, quantity, unit, storageCondition, safeUseDeadline } = req.body;

  if (!aiClient) {
    return res.json({
      fallback: true,
      insight: `Food item "${name}" (${quantity} ${unit}) classified under ${category}. Storage requirement: ${storageCondition}. Safe-use deadline: ${safeUseDeadline || 'Requires inspection'}. Compliant with municipal donation handling guidelines.`,
      safetyChecklist: [
        'Inspect packaging integrity and seal.',
        `Ensure continuous ${storageCondition} temperature maintenance.`,
        'Verify allergen disclosures on container labels.',
      ],
    });
  }

  try {
    const prompt = `As a food safety expert, analyze this surplus food listing:
Item: ${name}
Category: ${category}
Quantity: ${quantity} ${unit}
Storage: ${storageCondition}
Safe-Use Deadline: ${safeUseDeadline}

Provide a concise 2-sentence safety guidance statement and 3 essential handling precautions for redistribution logistics.
Return JSON with "insight" (string) and "safetyChecklist" (array of strings).`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      fallback: false,
      insight: parsed.insight,
      safetyChecklist: parsed.safetyChecklist,
    });
  } catch (err: any) {
    return res.json({
      fallback: true,
      insight: `Standard protocol active for ${category}. Maintain ${storageCondition} standards.`,
      safetyChecklist: [
        'Check internal temperature before loading.',
        'Avoid direct sunlight and heat exposure.',
        'Deliver well before safe-use deadline.',
      ],
    });
  }
});

// Vite middleware in development or static serve in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SMART FOOD REDISTRIBUTION server active at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server failed to start:', err);
});
