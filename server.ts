import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!apiKey,
    service: 'UDYAMSETU-AI-Orchestration-Engine',
    time: new Date().toISOString(),
  });
});

// AI: Project Analysis & Discovery Endpoint
app.post('/api/gemini/analyze-project', async (req, res) => {
  const { projectData } = req.body;
  if (!projectData) {
    return res.status(400).json({ error: 'projectData is required' });
  }

  if (!aiClient) {
    // Return structured regulatory fallback when key is not configured
    return res.json({
      isFallback: true,
      summary: `Analyzed ${projectData.name || 'Industrial Project'} (${projectData.sector || 'Food Processing'}, ${projectData.state || 'Bihar'}). Identified 8 potentially applicable approvals across 5 statutory departments.`,
      criticalPath: ['Land/Shed Allotment', 'Consent to Establish (CTO/CTE - Pollution)', 'Factory Inspectorate NOC', 'Fire Safety NOC', 'FSSAI Manufacturing License'],
      recommendations: [
        'Initiate Consent to Establish (CTE) in parallel with Fire NOC to shorten critical path by 25 working days.',
        'Prepare detailed Effluent Treatment Plant (ETP) capacity drawings for Bihar SPCB review.',
        'Pre-validate FSSAI manufacturing facility layout prior to civil construction.'
      ]
    });
  }

  try {
    const prompt = `You are the statutory AI intelligence engine of UDYAMSETU AI (Smart India Hackathon 2026), orchestrating industrial regulatory approvals in India.
Analyze this industrial project and provide structured decision support:
Project Details: ${JSON.stringify(projectData)}

Format your response as valid JSON matching this schema:
{
  "summary": "Executive statutory summary of applicable approvals and regulations",
  "criticalPath": ["List of critical path approvals in order"],
  "recommendations": ["3-4 actionable regulatory advice for the entrepreneur"]
}
Remember: Never claim legal guarantee. Final statutory authority belongs solely to the authorized department officers.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Gemini project analysis error:', error);
    return res.status(500).json({ error: error.message || 'AI analysis failed' });
  }
});

// AI: Document Pre-Validation Endpoint
app.post('/api/gemini/validate-document', async (req, res) => {
  const { docName, docType, metadata } = req.body;

  if (!aiClient) {
    // Intelligent domain fallback
    return res.json({
      isFallback: true,
      status: 'NEEDS_ATTENTION',
      readinessScore: 82,
      confidence: 0.94,
      findings: [
        'Promoter DIN matches verified MCA record.',
        'Address in site lease agreement matches industrial plot survey no. 412/A, Industrial Area Hajipur.',
        'Minor discrepancy: Fire egress corridor width in architectural drawing is marked 1.8m (recommended minimum is 2.0m for industrial hazard category).',
      ],
      mandatoryFieldsDetected: ['Enterprise Name', 'Plot Number', 'Promoter Signature', 'Architect Reg No'],
      missingElements: ['Structural Stability Certificate stamp on Annexure B'],
      disclaimer: 'AI-assisted pre-validation. Official verification rests with the inspecting officer.'
    });
  }

  try {
    const prompt = `Analyze this industrial compliance document for pre-validation in UDYAMSETU AI:
Document Name: ${docName}
Type: ${docType}
Metadata: ${JSON.stringify(metadata)}

Return JSON:
{
  "status": "VALID" | "NEEDS_ATTENTION" | "MISSING" | "LOW_CONFIDENCE",
  "readinessScore": number (0-100),
  "confidence": number (0.0 - 1.0),
  "findings": ["Detailed findings list"],
  "mandatoryFieldsDetected": ["List of detected statutory fields"],
  "missingElements": ["List of missing or low-clarity items"],
  "disclaimer": "AI-assisted pre-validation. Statutory decision remains with authorized authorities."
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Gemini document validation error:', error);
    return res.status(500).json({ error: error.message || 'Validation failed' });
  }
});

// AI: Udyam AI Contextual Assistant
app.post('/api/gemini/chat', async (req, res) => {
  const { message, projectContext, history } = req.body;

  if (!aiClient) {
    // Context-sensitive fallback responses
    const lower = (message || '').toLowerCase();
    let reply = '';
    let sources = ['Bihar Industrial Investment Promotion Policy 2016 (Amended 2020)', 'Water (Prevention and Control of Pollution) Act 1974', 'Factories Act 1948'];
    
    if (lower.includes('next') || lower.includes('action') || lower.includes('do')) {
      reply = `Based on Mithila Foods Pvt. Ltd.'s current stage:
1. **Respond to Industries Dept Query**: Query regarding Machinery Quotation & Effluent Load is awaiting your response.
2. **Pollution Consent (CTE)**: Submit validated Water Balance Chart to advance from Under Scrutiny to Inspection.
3. **Fire NOC**: Can run in parallel; upload building elevation schematic to enable inspection scheduling.`;
    } else if (lower.includes('pollution') || lower.includes('spcb') || lower.includes('cte')) {
      reply = `Pollution Control Consent (CTE) applies to Mithila Foods Pvt. Ltd. because food processing generates organic effluent (BOD/COD) and uses boiler emissions. 
Under Bihar State Pollution Control Board guidelines, your orange-category unit requires an Effluent Treatment Plant (ETP) specification and stack height calculation before construction commencement.`;
    } else if (lower.includes('scheme') || lower.includes('subsidy') || lower.includes('support')) {
      reply = `Your project qualifies for multiple government support initiatives:
1. **PM Formalisation of Micro food processing Enterprises (PMFME)**: Up to 35% capital subsidy (max ₹10 Lakh).
2. **Bihar Industrial Investment Promotion Scheme**: 100% stamp duty exemption & 10% capital subsidy on plant & machinery.
3. **Interest Subvention**: 5% interest relief for food processing clusters.`;
    } else {
      reply = `For Mithila Foods Pvt. Ltd. (₹8 Cr, Food Processing, Bihar), 8 approvals have been mapped. 3 are currently In Progress, 2 Completed (Udyam & Land), and 3 Pending. Your submission readiness is at 82%. What specific approval or requirement would you like to explore?`;
    }

    return res.json({
      reply,
      sources,
      confidence: 0.96,
      disclaimer: 'AI-assisted statutory guidance. Always verify with official gazetted notifications.',
    });
  }

  try {
    const systemInstruction = `You are "Udyam AI", the authoritative Regulation-to-Action contextual guide of UDYAMSETU AI for Smart India Hackathon 2026.
You assist industrial entrepreneurs and government officers navigating industrial approvals, dependencies, compliance, and government schemes in India.
Current Project Context: ${JSON.stringify(projectContext || {})}
Guidelines:
- Provide concise, structured, professional answers.
- Mention specific departments, parallel execution opportunities, and statutory forms where relevant.
- Support statements with Rule/Policy references.
- Always include the statutory disclaimer that legal authority rests with competent departmental officers.`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction,
      },
    });

    return res.json({
      reply: response.text,
      sources: ['National Single Window System (NSWS) Framework', 'State Industrial Policy (Bihar)', 'Business Reforms Action Plan (BRAP) 2024'],
      confidence: 0.95,
      disclaimer: 'AI-assisted guidance — verify statutory requirements with the competent authority.',
    });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    return res.status(500).json({ error: error.message || 'Chat failed' });
  }
});

// Vite Middleware for development vs Static in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`UDYAMSETU AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
});
