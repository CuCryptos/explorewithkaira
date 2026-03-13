import { GoogleGenAI, PersonGeneration, SafetyFilterLevel } from '@google/genai';
import sharp from 'sharp';
import type { Post } from '@/types';

type ArticleVisualIntent = 'hotel_review' | 'itinerary' | 'hidden_gems' | 'destination_feature';

export const DESTINATION_BASE_PROMPT =
  'Cinematic editorial photography. Rich warm color grading, deep shadows, golden highlights. ' +
  'Shot on a full-frame camera with shallow depth of field. No people, no text, no watermarks. ' +
  'The image should feel like a film still from a luxury travel documentary.';

export const DESTINATION_PRESETS = {
  tropical_beach: {
    description: 'White sand, turquoise water, palm trees, golden hour',
    scene: 'Pristine white sand beach, crystal turquoise water, palm trees swaying, golden hour light casting long shadows, gentle waves',
  },
  european_cityscape: {
    description: 'Cobblestone streets, historic architecture, warm streetlamps',
    scene: 'European cobblestone street at dusk, warm streetlamp glow on historic stone buildings, café tables on the sidewalk, ambient golden light',
  },
  luxury_hotel: {
    description: 'High-end interior, marble, warm ambient lighting',
    scene: 'Luxury hotel interior, marble floors, plush furnishings, warm ambient lighting, floor-to-ceiling windows with a city or ocean view',
  },
  mountain_vista: {
    description: 'Dramatic peaks, misty valleys, epic scale',
    scene: 'Dramatic mountain peaks at sunrise, misty valleys below, epic scale landscape, golden light breaking through clouds',
  },
  coastal_village: {
    description: 'Mediterranean or tropical village, colorful buildings',
    scene: 'Colorful coastal village buildings cascading down a hillside to the sea, Mediterranean light, terracotta roofs, vibrant bougainvillea',
  },
  nightlife: {
    description: 'City lights, neon reflections, moody evening',
    scene: 'Urban nightscape, city lights reflecting on wet streets, neon signs, moody blue and amber tones, rooftop bar or boulevard view',
  },
  desert_luxury: {
    description: 'Sand dunes or desert resort, warm tones, dramatic sky',
    scene: 'Golden sand dunes at sunset, dramatic sky with warm orange and purple tones, luxury desert camp or infinity pool in the distance',
  },
  tropical_jungle: {
    description: 'Lush greenery, waterfalls, dappled light',
    scene: 'Lush tropical jungle, cascading waterfall, dappled sunlight through dense canopy, emerald green foliage, misty atmosphere',
  },
} as const;

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is required');
  }
  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey });
  }
  return geminiClient;
}

export function buildDestinationPrompt(
  presetKey?: string | null,
  sceneDescription?: string | null,
  options: { lighting?: string; mood?: string; timeOfDay?: string } = {},
) {
  const parts = [DESTINATION_BASE_PROMPT];

  if (presetKey && presetKey in DESTINATION_PRESETS) {
    parts.push(DESTINATION_PRESETS[presetKey as keyof typeof DESTINATION_PRESETS].scene);
  }

  if (sceneDescription) {
    parts.push(sceneDescription);
  }

  if (options.lighting) parts.push(`Lighting: ${options.lighting}`);
  if (options.mood) parts.push(`Mood: ${options.mood}`);
  if (options.timeOfDay) parts.push(`Time of day: ${options.timeOfDay}`);

  return parts.join('. ');
}

function getPostSearchText(post: Post) {
  return `${post.title} ${post.slug} ${post.excerpt}`.toLowerCase();
}

export function inferDestinationIntent(post: Post): ArticleVisualIntent {
  const text = getPostSearchText(post);
  if (/(hotel|review|suite|where to stay|riad)/.test(text)) return 'hotel_review';
  if (/(3 days|weekend|itinerary|guide|48 hours|72 hours)/.test(text)) return 'itinerary';
  if (/(hidden gems|secret|beyond|quiet corners|locals|under-the-radar)/.test(text)) return 'hidden_gems';
  return 'destination_feature';
}

function inferDestinationPreset(post: Post, intent: ArticleVisualIntent): keyof typeof DESTINATION_PRESETS | null {
  const text = getPostSearchText(post);

  if (intent === 'hotel_review') return 'luxury_hotel';
  if (/(tulum|bali|beach|island|mykonos)/.test(text)) return 'tropical_beach';
  if (/(amalfi|coast|village|comporta|jose ignacio)/.test(text)) return 'coastal_village';
  if (/(dubai|alula|desert|oman|marrakech)/.test(text)) return 'desert_luxury';
  if (/(cape town|mountain|atacama|deplar|fogo)/.test(text)) return 'mountain_vista';
  if (/(night|bar|lounge|neon)/.test(text)) return 'nightlife';
  if (/(tropical|jungle|waterfall|rainforest)/.test(text)) return 'tropical_jungle';
  if (/(paris|istanbul|cartagena|city|weekend|hidden gems|secret)/.test(text)) return 'european_cityscape';
  return null;
}

function buildIntentSceneDescription(post: Post, intent: ArticleVisualIntent) {
  const title = post.title.trim();
  const excerpt = post.excerpt.trim();

  switch (intent) {
    case 'hotel_review':
      return [
        title,
        excerpt,
        'Hero image for a luxury hotel review. Focus on one unforgettable interior or terrace moment, premium materials, quiet atmosphere, no signage, no staff, no guests.',
        'Compose for a magazine cover crop with negative space and a sense of stillness rather than a busy brochure look.',
      ].filter(Boolean).join('. ');
    case 'itinerary':
      return [
        title,
        excerpt,
        'Cover image for a luxury itinerary. Emphasize arrival, movement, and place: a cinematic streetscape, waterfront, terrace, or layered neighborhood view.',
        'The scene should feel aspirational but usable, with room for headline crop and a strong sense of destination.',
      ].filter(Boolean).join('. ');
    case 'hidden_gems':
      return [
        title,
        excerpt,
        'Cover image for a hidden gems travel piece. Show a quieter side street, courtyard, doorway, terrace, alley, or tucked-away table that feels discovered, intimate, and not touristy.',
        'Avoid postcard landmarks and obvious stock-photo compositions.',
      ].filter(Boolean).join('. ');
    default:
      return [title, excerpt].filter(Boolean).join('. ');
  }
}

export function buildDefaultDestinationPrompt(post: Post) {
  const intent = inferDestinationIntent(post);
  const preset = inferDestinationPreset(post, intent);
  const sceneDescription = buildIntentSceneDescription(post, intent);

  const optionsByIntent: Record<ArticleVisualIntent, { mood: string; lighting?: string; timeOfDay?: string }> = {
    hotel_review: {
      mood: 'quiet luxury, cinematic, warm, editorial',
      lighting: 'soft ambient interior light with sculpted shadows',
    },
    itinerary: {
      mood: 'aspirational, cinematic, warm, editorial',
      timeOfDay: 'golden hour or blue-hour transition',
    },
    hidden_gems: {
      mood: 'intimate, discovered, cinematic, warm',
      lighting: 'soft directional light with shadow and texture',
    },
    destination_feature: {
      mood: 'cinematic, warm, editorial',
    },
  };

  return buildDestinationPrompt(preset, sceneDescription, {
    ...optionsByIntent[intent],
  });
}

export async function generateDestinationImageBuffer(
  prompt: string,
  options: { aspectRatio?: string } = {},
): Promise<Buffer> {
  const gemini = getGeminiClient();

  const response = await gemini.models.generateImages({
    model: process.env.IMAGE_MODEL || 'imagen-4.0-generate-001',
    prompt,
    config: {
      numberOfImages: 1,
      aspectRatio: options.aspectRatio || process.env.IMAGE_ASPECT_RATIO || '16:9',
      safetyFilterLevel: SafetyFilterLevel.BLOCK_LOW_AND_ABOVE,
      personGeneration: PersonGeneration.DONT_ALLOW,
    },
  });

  if (!response.generatedImages || response.generatedImages.length === 0) {
    throw new Error('No images generated');
  }

  const imageBytes = response.generatedImages[0].image?.imageBytes;
  if (!imageBytes) {
    throw new Error('Generated image bytes missing from response');
  }

  const raw = Buffer.from(imageBytes, 'base64');
  return sharp(raw)
    .resize(1600, 900, { fit: 'cover' })
    .webp({ quality: 90 })
    .toBuffer();
}
