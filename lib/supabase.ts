import { createCategoriesSDK, createContentClient, createPostsSDK } from './content-sdk';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createContentClient(supabaseUrl, supabaseKey);
export const posts = createPostsSDK(supabase);
export const categories = createCategoriesSDK(supabase);
