import sharp from 'sharp';
import { createMediaSDK, createPostsSDK } from './content-sdk';
import type { Post } from '@/types';
import { createSupabaseAdminClient } from './supabase-admin';
import { siteId } from './brand';

interface PersistGeneratedImageInput {
  post: Post;
  buffer: Buffer;
  pathPrefix: string;
  extension: 'png' | 'webp';
  mimeType: 'image/png' | 'image/webp';
  altText: string;
  caption: string;
}

export async function persistGeneratedImageForPost(input: PersistGeneratedImageInput) {
  const adminClient = createSupabaseAdminClient();
  const posts = createPostsSDK(adminClient);
  const media = createMediaSDK(adminClient);
  const bucket = String(process.env.SUPABASE_STORAGE_BUCKET || 'content-images').trim();

  const fileName = `${input.post.slug}-${Date.now()}.${input.extension}`;
  const storagePath = `${input.pathPrefix}/${fileName}`;

  const { error: uploadError } = await adminClient.storage.from(bucket).upload(storagePath, input.buffer, {
    contentType: input.mimeType,
    upsert: false,
  });

  if (uploadError) {
    throw new Error(`Storage upload failed: ${uploadError.message}`);
  }

  const {
    data: { publicUrl },
  } = adminClient.storage.from(bucket).getPublicUrl(storagePath);

  const metadata = await sharp(input.buffer).metadata();

  await media.uploadMedia(siteId, {
    url: publicUrl,
    altText: input.altText,
    caption: input.caption,
    mimeType: input.mimeType,
    width: metadata.width,
    height: metadata.height,
  });

  await posts.updatePost(input.post.id, {
    featuredImage: publicUrl,
    seo: {
      ...input.post.seo,
      ogImage: publicUrl,
    },
  });

  return publicUrl;
}
