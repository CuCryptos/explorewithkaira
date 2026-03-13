import { createClient } from '@supabase/supabase-js';

const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SITE_ID',
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

const siteId = process.env.SITE_ID;
const slug = 'where-to-stay-in-tokyo-luxury-neighborhood-guide';
const title = 'Where to Stay in Tokyo: A Luxury Neighborhood Guide';
const excerpt =
  'An honest guide to where to stay in Tokyo, with the neighborhoods, hotel styles, and tradeoffs that matter before you book.';
const featuredImage =
  'https://ysooqnlnoyhwbgjcmqjy.supabase.co/storage/v1/object/public/content-images/2026/02/tokyo-luxury-hotel-skyline.webp';

const content = `
<div class="kaira-callout" data-kaira-cluster="tokyo-neighborhood-guide">
  <p class="kaira-eyebrow">Who this Tokyo neighborhood guide is for</p>
  <p>This is for travelers who have already accepted that Tokyo is not one city but several moods stitched together by trains. If you are choosing between hotels, start with my guide to the <a href="/tokyo-luxury-hotels-aman-park-hyatt">best luxury hotels in Tokyo</a>. If you want the rest of the city mapped clearly too, keep my <a href="/tokyo-weekend-guide-three-days">3-day Tokyo itinerary</a>, my <a href="/tokyo-hidden-gems-secret-corners">Tokyo hidden gems guide</a>, and my <a href="/aman-tokyo-honest-review">Aman Tokyo review</a> nearby.</p>
</div>
<p>Where you stay in Tokyo decides what the city becomes. Choose badly, and Tokyo feels like a long series of train transfers between neighborhoods other people are enjoying more than you are. Choose well, and the city begins to make emotional sense. Morning coffee is on the right street. The walk back from dinner feels cinematic instead of logistical. You stop treating the hotel like a place to sleep and start using it as a lens.</p>
<p>The mistake most first-time visitors make is booking a famous hotel before they understand the neighborhood around it. Tokyo is too large and too textured for that. You are not simply choosing a room. You are choosing your mornings, your late-night walks, your restaurant radius, and the version of Tokyo that will feel easiest to love.</p>
<p>This is where I would stay now if I wanted luxury, atmosphere, and the right kind of convenience instead of generic centrality.</p>
<h2>Otemachi and Marunouchi: Quiet Precision and Fast Access</h2>
<p>If you want Tokyo to feel polished, composed, and almost suspiciously efficient, stay in Otemachi or Marunouchi. This is the Tokyo of broad avenues, deep-pocketed business travelers, and hotels that understand the power of restraint. You are close to Tokyo Station, the Imperial Palace, and the sort of infrastructure that makes every transfer feel smoother than it should.</p>
<p>This is also where some of the city’s most serious luxury addresses make the most sense. If Aman Tokyo is on your shortlist, read my full <a href="/aman-tokyo-honest-review">Aman Tokyo review</a> before you book. It is still extraordinary, but the neighborhood around it matters just as much as the lobby everyone photographs.</p>
<p>Stay here if you value calm, easy airport movement, and hotels that feel insulated from the city without losing access to it. Do not stay here if your ideal Tokyo is messy, intimate, and best discovered after midnight.</p>
<h2>Ginza: The Beautiful Version of Being in the Middle of Everything</h2>
<p>Ginza is for travelers who want luxury to feel legible. The sidewalks are wide, the stores are immaculate, and the entire district seems to have been edited by someone with exacting taste and a large budget. It is a comfortable choice for a first trip because it makes Tokyo feel navigable right away. You can walk to fine dining, department-store basements, cocktail bars, and enough train lines to go almost anywhere without friction.</p>
<p>The tradeoff is that Ginza can feel a little too polished if what you want is Tokyo with a pulse. It is elegant, yes, but not especially surprising. I would choose Ginza for a short luxury trip where convenience matters more than mystery, or if I wanted to anchor the trip around shopping and restaurants rather than neighborhood texture.</p>
<h2>Omotesando and Aoyama: The Most Stylish Place to Stay Well</h2>
<p>If I wanted Tokyo to feel beautiful from the moment I left the hotel lobby, I would look hard at Omotesando and Aoyama. This part of the city gives you tree-lined streets, architecture that actually makes you slow down, and a calmer kind of fashion energy than Shibuya. It is polished without being sterile. You can have a serious coffee in the morning, spend the afternoon in design shops and galleries, and end the night with a dinner that feels elegant instead of performative.</p>
<p>This is the version of Tokyo I recommend to travelers who care about atmosphere more than checklist proximity. It also pairs well with a trip built around quieter discoveries, so if that is your instinct, use this alongside my <a href="/tokyo-hidden-gems-secret-corners">Tokyo hidden gems guide</a>.</p>
<h2>Shibuya: Better Than It Sounds, If You Stay Above the Noise</h2>
<p>People hear Shibuya and think of the crossing, the giant screens, and the sort of sensory overload that makes them swear they will stay somewhere calmer. That instinct is understandable, but it is not the whole story. Shibuya works surprisingly well if you choose a hotel that lifts you above the frenzy and gives you easy access to the better parts of the neighborhood: the backstreets, the late-night counters, the quick train hops, the feeling that the city is wide open after dinner.</p>
<p>I would not choose Shibuya for a hushed romantic trip, but I would absolutely choose it for a first weekend in Tokyo where movement and energy matter. It fits especially well with my <a href="/tokyo-weekend-guide-three-days">3-day Tokyo itinerary</a>, because you can cover a lot of city without spending your whole trip in transit.</p>
<h2>Toranomon and Azabudai: New Luxury, High-Rise Calm, and Fewer Accidents</h2>
<p>Toranomon and Azabudai feel like Tokyo’s newer answer to the question of luxury. The buildings are sharper, the hotels are more recently calibrated, and the experience often feels less bound to legacy. If Otemachi is about composed classicism, Toranomon is about confidence in glass and height. It can be an excellent choice if you want a modern hotel, a little more space, and a stay that feels sleek rather than storied.</p>
<p>The downside is that some travelers will find it emotionally thinner. It is easy to stay very well here without feeling especially rooted in Tokyo. I would choose it if the hotel itself is the point and the neighborhood is secondary.</p>
<h2>What I Would Actually Choose</h2>
<p>If this were a first luxury trip to Tokyo, I would split the decision like this:</p>
<ul>
  <li>For calm, easy logistics, and serious hotel luxury: Otemachi or Marunouchi.</li>
  <li>For a polished first trip with restaurants and shopping at your feet: Ginza.</li>
  <li>For style, walkability, and the most attractive days on foot: Omotesando or Aoyama.</li>
  <li>For movement, nightlife, and a high-energy weekend: Shibuya.</li>
  <li>For sleek newer hotels where the property matters most: Toranomon or Azabudai.</li>
</ul>
<p>If you are still comparing actual properties, go back to my guide to the <a href="/tokyo-luxury-hotels-aman-park-hyatt">best luxury hotels in Tokyo</a>. That is the page for choosing the hotel. This page is for choosing the version of Tokyo you want to wake up inside.</p>
<div class="kaira-cluster-links" data-kaira-cluster-links="tokyo">
  <p class="kaira-eyebrow">More Tokyo guides</p>
  <ul>
    <li><a href="/tokyo-luxury-hotels-aman-park-hyatt">Best luxury hotels in Tokyo</a></li>
    <li><a href="/where-to-stay-in-tokyo-luxury-neighborhood-guide">Where to stay in Tokyo</a></li>
    <li><a href="/tokyo-weekend-guide-three-days">3 days in Tokyo</a></li>
    <li><a href="/tokyo-hidden-gems-secret-corners">Tokyo hidden gems</a></li>
    <li><a href="/aman-tokyo-honest-review">Aman Tokyo review</a></li>
  </ul>
</div>
`.trim();

const seo = {
  meta_title: title,
  meta_description: excerpt,
  focus_keyword: 'where to stay in tokyo',
  og_image: featuredImage,
};

const { data: category, error: categoryError } = await supabase
  .from('categories')
  .select('id')
  .eq('site_id', siteId)
  .eq('slug', 'destinations')
  .single();

if (categoryError) {
  throw new Error(`Failed to load destinations category: ${categoryError.message}`);
}

const { data: existing, error: existingError } = await supabase
  .from('posts')
  .select('id')
  .eq('site_id', siteId)
  .eq('slug', slug)
  .maybeSingle();

if (existingError) {
  throw new Error(`Failed to check existing post: ${existingError.message}`);
}

if (existing?.id) {
  const { error } = await supabase
    .from('posts')
    .update({
      title,
      content,
      excerpt,
      status: 'published',
      content_type: 'guide',
      category_id: category.id,
      featured_image: featuredImage,
      seo,
      published_at: new Date().toISOString(),
    })
    .eq('id', existing.id);

  if (error) {
    throw new Error(`Failed to update ${slug}: ${error.message}`);
  }

  console.log(`updated ${slug}`);
} else {
  const { error } = await supabase.from('posts').insert({
    site_id: siteId,
    title,
    slug,
    content,
    excerpt,
    status: 'published',
    content_type: 'guide',
    category_id: category.id,
    featured_image: featuredImage,
    seo,
    published_at: new Date().toISOString(),
  });

  if (error) {
    throw new Error(`Failed to create ${slug}: ${error.message}`);
  }

  console.log(`created ${slug}`);
}
