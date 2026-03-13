import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { createSupabaseAdminClient } from '@/lib/supabase-admin';
import { baseUrl, siteId } from '@/lib/brand';
import { createPostsSDK } from '@/lib/content-sdk';
import { buildDefaultKairaPrompt, buildKairaPrompt, generateKairaImageBuffer, KAIRA_PRESETS } from '@/lib/kaira-image';
import { persistGeneratedImageForPost } from '@/lib/generated-image-storage';

async function verifyAuth(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get('authorization');
  if (authHeader === `Bearer ${process.env.CRON_SECRET}`) return true;

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    return !!user;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!(await verifyAuth(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const slug = String(body.slug || '').trim();
    const preset = String(body.preset || '').trim();
    const sceneDescription = String(body.sceneDescription || '').trim();
    const aspectRatio = String(body.aspectRatio || '3:4').trim() as '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

    if (!slug) {
      return NextResponse.json({ error: 'slug is required' }, { status: 400 });
    }

    if (preset && !(preset in KAIRA_PRESETS)) {
      return NextResponse.json({ error: `Unknown Kaira preset: ${preset}` }, { status: 400 });
    }

    const adminClient = createSupabaseAdminClient();
    const posts = createPostsSDK(adminClient);
    const post = await posts.getPostBySlug(siteId, slug);
    const triggerToken = process.env.KAIRA_TRIGGER_TOKEN || 'KAIRA';
    const prompt = preset || sceneDescription
      ? buildKairaPrompt(triggerToken, preset || null, sceneDescription || null)
      : buildDefaultKairaPrompt(post, triggerToken);
    const buffer = await generateKairaImageBuffer(prompt, { aspectRatio });

    const publicUrl = await persistGeneratedImageForPost({
      post,
      buffer,
      pathPrefix: 'generated/kaira',
      extension: 'png',
      mimeType: 'image/png',
      altText: `${post.title} Kaira editorial image`,
      caption: `AI-generated Kaira image for ${post.title}`,
    });

    return NextResponse.json({
      ok: true,
      slug: post.slug,
      url: publicUrl,
      prompt,
      previewUrl: `${baseUrl}/${post.slug}`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
