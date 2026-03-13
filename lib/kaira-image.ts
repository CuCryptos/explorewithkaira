import Replicate from 'replicate';
import sharp from 'sharp';
import type { Post } from '@/types';

type ReplicateModelRef = `${string}/${string}` | `${string}/${string}:${string}`;
type KairaVisualIntent = 'hotel_review' | 'itinerary' | 'hidden_gems' | 'editorial_feature';

export const KAIRA_IDENTITY_PROMPT =
  'A candid photograph of {trigger}, a woman in her mid-to-late twenties ' +
  'with an ethnically ambiguous appearance — she could be Mediterranean, Latin, ' +
  'Middle Eastern, or mixed. Dark hair, warm skin tone, striking features. ' +
  'She is always alone in the frame.';

export const KAIRA_STYLE_PROMPT =
  'Shot on Canon EOS R5 with 85mm f/1.4 lens, natural depth of field. ' +
  'Visible skin texture and natural pores, subtle under-eye shadows, ' +
  'flyaway hair strands caught by wind. Real fabric weight and natural wrinkles in clothing. ' +
  'The style is candid editorial photography — caught mid-moment, not posing for camera. ' +
  'Dark and warm color grading, rich shadows, warm highlights, slightly desaturated. ' +
  'Slight film grain, subtle sensor noise. ' +
  'The image should feel like an unretouched frame from a 35mm film scan, not social media content.';

export const KAIRA_NEGATIVE_PROMPT =
  'cartoon, anime, illustration, painting, watercolor, sketch, deformed, ' +
  'disfigured, blurry, low quality, text, watermark, logo, multiple people, ' +
  'group photo, bright saturated Instagram filter, airbrushed skin, smooth skin, ' +
  'plastic skin, poreless skin, beauty filter, over-processed, HDR, mannequin, ' +
  'wax figure, CGI, 3D render, perfect symmetry, overly sharp, hyper-detailed, studio backdrop';

export const KAIRA_PRESETS = {
  mykonos_pool: {
    description: 'Infinity pool overlooking the Aegean, white Cycladic architecture, golden hour',
    scene: 'Infinity pool overlooking the Aegean Sea, white Cycladic architecture in the background, golden hour light, wearing a swimsuit or flowing dress, leaning on poolside railing, sunlight catching water droplets on skin',
  },
  paris_night: {
    description: 'Parisian street at night, elegant evening outfit',
    scene: 'Parisian street at night, warm streetlamp glow, elegant evening outfit, café or bridge in background, mid-stride crossing street, streetlamp casting long shadow behind her',
  },
  paris_cafe: {
    description: 'Seated at a Parisian café terrace, daytime chic casual',
    scene: 'Seated at a Parisian café terrace, espresso or wine on table, daytime, wearing chic casual, glancing sideways at something off-camera, one hand around espresso cup',
  },
  bali_sunset: {
    description: 'Tropical sunset with jungle or rice terraces',
    scene: 'Tropical sunset, lush jungle or rice terraces, flowing fabric, warm golden light, walking barefoot on a stone path, hand brushing tall grass',
  },
  dubai_skyline: {
    description: 'Modern cityscape at dusk, sleek fashion',
    scene: 'Modern cityscape at dusk, luxurious setting, sleek fashion, city lights beginning to glow, standing at a balcony railing, wind pulling at her clothes and hair',
  },
  tulum_beach: {
    description: 'Caribbean beach at dawn, bohemian luxury',
    scene: 'Caribbean beach at dawn, soft morning light, bohemian luxury style, ruins or palm trees, walking along waterline, wet sand underfoot, hair blown across face',
  },
  amalfi_coast: {
    description: 'Colorful Italian coastal village, Mediterranean light',
    scene: 'Colorful Italian coastal village, Mediterranean light, sun hat and summer dress, lemon groves or terraces, paused on stone steps, adjusting sun hat with one hand',
  },
  gym_fitness: {
    description: 'High-end gym, athletic wear, dynamic pose',
    scene: 'High-end gym or studio, athletic wear, dynamic mid-movement pose, dramatic lighting, mid-rep with visible exertion, slight perspiration, focused expression',
  },
  high_fashion: {
    description: 'Studio or urban editorial, magazine-quality',
    scene: 'Studio or urban editorial setting, high-fashion outfit, strong directional lighting, magazine-quality composition, turning to look over her shoulder, coat caught mid-swing',
  },
  hotel_luxury: {
    description: 'Luxury hotel interior, elegant attire',
    scene: 'Luxury hotel interior — lobby, suite, or terrace — elegant attire, warm ambient lighting, seated on chair arm, one shoe half-off, relaxed unguarded moment',
  },
  hotel_review_editorial: {
    description: 'Luxury hotel review hero frame, calm editorial composition',
    scene: 'Luxury hotel suite or terrace, elegant restrained styling, seated or standing in an unguarded pause, premium textures and warm ambient light, composed like an editorial cover rather than a fashion ad',
  },
  itinerary_arrival: {
    description: 'Arrival moment in a city or destination, movement and anticipation',
    scene: 'Arrival moment in a beautiful destination, stepping out onto a balcony, crossing a quiet street, or pausing at a station or hotel entrance, wardrobe polished but practical, image feels like the first chapter of a weekend away',
  },
  hidden_gems_stroll: {
    description: 'Quiet backstreet or tucked-away corner, intimate discovery',
    scene: 'Walking through a quiet side street, courtyard, terrace, or hidden passage, glancing toward something half-seen off camera, the mood intimate, discovered, and far from tourist traffic',
  },
  restaurant: {
    description: 'Upscale restaurant or bar, evening candid feel',
    scene: 'Upscale restaurant or bar setting, evening lighting, cocktail or wine, candid mid-conversation feel, leaning forward mid-laugh, candlelight reflected in her eyes',
  },
  winter: {
    description: 'Cold-weather destination, cozy luxury winter outfit',
    scene: 'Cold-weather destination, cozy luxury winter outfit, snow or misty mountains, warm vs cold contrast, hands wrapped around a warm mug, breath visible in cold air',
  },
} as const;

const DEFAULT_REPLICATE_MODEL: ReplicateModelRef = 'black-forest-labs/flux-schnell';

function isReplicateVersionHash(value: string): boolean {
  return /^[a-z0-9]{10,}$/i.test(value) && !value.includes('/');
}

export function buildKairaPrompt(triggerToken: string, presetKey?: string | null, sceneDescription?: string | null) {
  const parts = [KAIRA_IDENTITY_PROMPT.replace('{trigger}', triggerToken)];

  if (presetKey && presetKey in KAIRA_PRESETS) {
    parts.push(KAIRA_PRESETS[presetKey as keyof typeof KAIRA_PRESETS].scene);
  }

  if (sceneDescription) {
    parts.push(sceneDescription);
  }

  parts.push(KAIRA_STYLE_PROMPT);
  return parts.join('. ');
}

function getPostSearchText(post: Post) {
  return `${post.title} ${post.slug} ${post.excerpt}`.toLowerCase();
}

export function inferKairaIntent(post: Post): KairaVisualIntent {
  const text = getPostSearchText(post);
  if (/(hotel|review|suite|where to stay|riad)/.test(text)) return 'hotel_review';
  if (/(hidden gems|secret|beyond|quiet corners|under-the-radar)/.test(text)) return 'hidden_gems';
  if (/(3 days|weekend|itinerary|guide|48 hours|72 hours)/.test(text)) return 'itinerary';
  return 'editorial_feature';
}

export function inferKairaPreset(post: Post): keyof typeof KAIRA_PRESETS {
  const text = getPostSearchText(post);
  const intent = inferKairaIntent(post);

  if (intent === 'hotel_review') return 'hotel_review_editorial';
  if (intent === 'itinerary') {
    if (/(paris)/.test(text)) return 'paris_cafe';
    return 'itinerary_arrival';
  }
  if (intent === 'hidden_gems') return 'hidden_gems_stroll';
  if (/(amalfi)/.test(text)) return 'amalfi_coast';
  if (/(tulum)/.test(text)) return 'tulum_beach';
  if (/(bali)/.test(text)) return 'bali_sunset';
  return 'high_fashion';
}

function buildIntentSceneDescription(post: Post, intent: KairaVisualIntent) {
  const title = post.title.trim();
  const excerpt = post.excerpt.trim();

  switch (intent) {
    case 'hotel_review':
      return [
        title,
        excerpt,
        'Editorial hero image for a luxury hotel review. The mood is intimate, expensive, and observational rather than overtly glamorous.',
      ].filter(Boolean).join('. ');
    case 'itinerary':
      return [
        title,
        excerpt,
        'Editorial cover for a luxury itinerary. The image should suggest movement, anticipation, and the start of a beautifully planned weekend.',
      ].filter(Boolean).join('. ');
    case 'hidden_gems':
      return [
        title,
        excerpt,
        'Editorial cover for a hidden gems story. The image should feel discovered, private, and slightly mysterious, never crowded or performative.',
      ].filter(Boolean).join('. ');
    default:
      return [title, excerpt].filter(Boolean).join('. ');
  }
}

export function buildDefaultKairaPrompt(post: Post, triggerToken: string) {
  const intent = inferKairaIntent(post);
  const preset = inferKairaPreset(post);
  const sceneDescription = buildIntentSceneDescription(post, intent);
  return buildKairaPrompt(triggerToken, preset, sceneDescription);
}

export async function generateKairaImageBuffer(
  prompt: string,
  options: { aspectRatio?: '1:1' | '16:9' | '9:16' | '4:3' | '3:4'; numOutputs?: number } = {},
): Promise<Buffer> {
  const apiToken = process.env.REPLICATE_API_TOKEN;
  if (!apiToken) {
    throw new Error('REPLICATE_API_TOKEN is required');
  }

  const model = (process.env.KAIRA_MODEL_VERSION || DEFAULT_REPLICATE_MODEL).trim();
  const replicate = new Replicate({ auth: apiToken });
  const input = {
    prompt,
    negative_prompt: KAIRA_NEGATIVE_PROMPT,
    num_outputs: Math.min(Math.max(options.numOutputs || 1, 1), 4),
    aspect_ratio: options.aspectRatio || '3:4',
    output_format: 'png',
    guidance: 3.0,
    num_inference_steps: 32,
    lora_scale: 0.75,
  };

  let output: unknown;
  if (isReplicateVersionHash(model)) {
    const prediction = await replicate.predictions.create({
      version: model,
      input,
    });
    const completed = await replicate.wait(prediction);
    output = completed.output;
  } else {
    output = await replicate.run(model as ReplicateModelRef, { input });
  }

  const result = Array.isArray(output) ? output[0] : output;
  const response = await fetch(String(result));
  if (!response.ok) {
    throw new Error(`Failed to fetch generated image: ${response.status} ${response.statusText}`);
  }

  const raw = Buffer.from(await response.arrayBuffer());
  return sharp(raw).png().toBuffer();
}
