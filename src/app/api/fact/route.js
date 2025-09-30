import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

const GROQ_KEY = (process.env.GROQ_API_KEY ?? "").trim();
const MODEL = "llama-3.3-70b-versatile"; // Model Groq yang support Indonesian

const FACTS = [
  {
    raw: "Mendaur ulang aluminium menghemat hingga ~95% energi dibanding memproduksi aluminium baru.",
    source: {
      title: "US EPA – Recycling Basics",
      url: "https://www.epa.gov/recycle/recycling-basics",
      label: "US EPA",
    },
  },
  {
    raw: "Limbah makanan menyumbang sekitar 8–10% emisi gas rumah kaca global.",
    source: {
      title: "UNEP – Food Waste Index Report 2021",
      url: "https://www.unep.org/resources/report/unep-food-waste-index-report-2021",
      label: "UNEP",
    },
  },
  {
    raw: "Tempat pembuangan akhir menghasilkan metana; dalam horizon 100 tahun, dampak pemanasan metana ≈28 kali CO₂.",
    source: {
      title: "IPCC AR6 – Global Warming Potentials",
      url: "https://www.ipcc.ch/report/ar6/wg1/",
      label: "IPCC",
    },
  },
  {
    raw: "Kaca dan aluminium dapat didaur ulang berulang kali tanpa kehilangan kualitas material.",
    source: {
      title: "US EPA – Recycling Basics",
      url: "https://www.epa.gov/recycle/recycling-basics",
      label: "US EPA",
    },
  },
  {
    raw: "Tanpa perbaikan, sampah kota dunia diproyeksikan mencapai ~3,4 miliar ton pada 2050.",
    source: {
      title: "World Bank – What a Waste 2.0",
      url: "https://www.worldbank.org/en/topic/urbandevelopment/brief/solid-waste-management",
      label: "World Bank",
    },
  },
];

function hashString(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function pickIndex(seed) {
  if (seed) return hashString(seed) % FACTS.length;
  return Math.floor(Math.random() * FACTS.length);
}
function clampWords(s, maxWords = 24) {
  const words = s.trim().replace(/\s+/g, " ").split(" ");
  return words.length <= maxWords
    ? words.join(" ")
    : words.slice(0, maxWords).join(" ");
}
function ensureEndsWithSource(text, label) {
  return /\bSumber\s*:\s*.+$/i.test(text) ? text : `${text} Sumber: ${label}`;
}
function sanitizeOneLine(s) {
  return s
    .replace(/[\r\n]+/g, " ")
    .replace(/^["""']|["""']$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

async function tryGroq(prompt) {
  if (!GROQ_KEY) return { ok: false, reason: "NO_GROQ_KEY" };
  console.log("[Groq] Attempting with model:", MODEL);
  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: "system",
              content:
                "You are a helpful assistant that rewrites facts into engaging fun facts. Keep it concise and preserve all numbers/units.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          max_tokens: 100,
          temperature: 0.7,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("[Groq] Error:", errText);
      return { ok: false, reason: `HTTP_${response.status}`, error: errText };
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || "";

    console.log("[Groq] Success! Generated:", text.slice(0, 50) + "...");
    return { ok: true, text: sanitizeOneLine(text) };
  } catch (e) {
    console.error("[Groq] Fetch error:", e.message);
    return { ok: false, reason: "FETCH_ERROR", error: String(e?.message || e) };
  }
}

export async function GET(req) {
  const url = new URL(req.url);
  const seed = url.searchParams.get("seed") ?? undefined;
  const lang = (url.searchParams.get("lang") ?? "id").toLowerCase();
  const rawOnly = url.searchParams.get("raw") === "1";

  console.log("\n=== NEW REQUEST ===");
  console.log("Model:", MODEL);
  console.log("Groq Key exists:", !!GROQ_KEY);
  console.log("Language:", lang);

  const idx = pickIndex(seed);
  const picked = FACTS[idx];
  const label = picked.source.label;

  const promptID = [
    "Tulis 1 kalimat FUN FACT berbahasa Indonesia (maksimum 24 kata).",
    "Pertahankan angka/satuan/istilah. Tanpa emoji. Tanpa tanda kutip.",
    `Akhiri kalimat dengan: Sumber: ${label}`,
    `Teks: ${picked.raw}`,
  ].join(" ");

  const promptEN = [
    "Write 1 sentence FUN FACT in English (maximum 24 words).",
    "Preserve numbers/units/terms. No emoji. No quotation marks.",
    `End the sentence with: Source: ${label}`,
    `Text: ${picked.raw}`,
  ].join(" ");

  const prompt = lang === "en" ? promptEN : promptID;

  let usedAI = false;
  let envOK = !!GROQ_KEY;
  let reason = envOK ? "GROQ_KEY_PRESENT" : "GROQ_KEY_MISSING";
  let generated = "";

  if (!rawOnly && envOK) {
    const result = await tryGroq(prompt);
    if (result.ok) {
      generated = result.text;
      usedAI = true;
      reason = "GROQ_OK";
    } else {
      generated = `${picked.raw} Sumber: ${label}`;
      usedAI = false;
      reason = `FALLBACK_RAW_AFTER_${result.reason}`;
    }
  } else {
    generated = `${picked.raw} Sumber: ${label}`;
    if (rawOnly) {
      reason = "RAW_ONLY";
    }
  }

  generated = clampWords(
    ensureEndsWithSource(sanitizeOneLine(generated), label),
    24
  );

  const body = {
    fact: generated,
    source: picked.source,
    factIncludesSource: true,
    meta: {
      provider: usedAI ? "groq" : "local-fallback",
      model: MODEL,
      lang,
      usedSeed: !!seed,
      seed: seed ?? null,
      pickedIndex: idx,
      envOK,
      reason,
      ts: new Date().toISOString(),
    },
  };

  console.log("Final reason:", reason);
  console.log("===================\n");

  return new NextResponse(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "X-Fact-Index": String(idx),
      "X-Fact-Seed": String(seed ?? ""),
      "X-Fact-Provider": usedAI ? "groq" : "local-fallback",
    },
  });
}
