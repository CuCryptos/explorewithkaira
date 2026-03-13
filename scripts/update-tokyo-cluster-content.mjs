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

const clusterLinks = `
<div class="kaira-cluster-links" data-kaira-cluster-links="tokyo">
  <p class="kaira-eyebrow">Build the rest of your Tokyo trip</p>
  <ul>
    <li><a href="/tokyo-luxury-hotels-aman-park-hyatt">Best luxury hotels in Tokyo</a></li>
    <li><a href="/where-to-stay-in-tokyo-luxury-neighborhood-guide">Where to stay in Tokyo</a></li>
    <li><a href="/tokyo-weekend-guide-three-days">3 days in Tokyo</a></li>
    <li><a href="/tokyo-hidden-gems-secret-corners">Tokyo hidden gems</a></li>
    <li><a href="/aman-tokyo-honest-review">Aman Tokyo review</a></li>
  </ul>
</div>
`.trim();

const updates = [
  {
    slug: 'tokyo-luxury-hotels-aman-park-hyatt',
    marker: 'tokyo-hotels',
    insertBefore: '<h2>The Art of Stillness in a City That Never Sleeps</h2>',
    callout: `
<div class="kaira-callout" data-kaira-cluster="tokyo-hotels">
  <p class="kaira-eyebrow">Who this is for</p>
  <p>This guide is for travelers deciding where to stay in Tokyo and which luxury hotels are actually worth the rate. If you are building the full trip, start with my <a href="/tokyo-weekend-guide-three-days">3-day Tokyo itinerary</a>, keep these <a href="/tokyo-hidden-gems-secret-corners">Tokyo hidden gems</a> open for the quieter hours, and compare this list with my <a href="/aman-tokyo-honest-review">Aman Tokyo review</a>.</p>
</div>
    `.trim(),
    replacements: [
      {
        from:
          /<p>A practical note before we begin:[\s\S]*?feel like the journey has already begun\.<\/p>/,
        to: `<p>A practical note before we begin: Tokyo's luxury hotels offer their most gracious rates in January and February, when the city belongs to its residents again, and during the moody rains of June. If cherry blossoms are your reason, book three to six months ahead. Getting from Haneda to most of these addresses costs around six to eight thousand yen by taxi, though several properties send sleek limousine buses that cost a fraction of that and feel like the journey has already begun. If you are still shaping the trip around the stay, pair this list with my <a href="/tokyo-weekend-guide-three-days">3-day Tokyo itinerary</a> and save these <a href="/tokyo-hidden-gems-secret-corners">Tokyo hidden gems</a> for the slower pockets between hotel check-ins.</p>`,
      },
    ],
  },
  {
    slug: 'tokyo-weekend-guide-three-days',
    marker: 'tokyo-itinerary',
    insertBefore: '<h2>Day One: The City Before It Wakes</h2>',
    callout: `
<div class="kaira-callout" data-kaira-cluster="tokyo-itinerary">
  <p class="kaira-eyebrow">Who this 3-day Tokyo itinerary is for</p>
  <p>This is for readers who want a first Tokyo trip that feels considered rather than frantic. Choose your base from my guide to the <a href="/tokyo-luxury-hotels-aman-park-hyatt">best luxury hotels in Tokyo</a>, keep my <a href="/tokyo-hidden-gems-secret-corners">Tokyo hidden gems guide</a> nearby for detours, and read the <a href="/aman-tokyo-honest-review">Aman Tokyo review</a> if that hotel is on your shortlist.</p>
</div>
    `.trim(),
    replacements: [],
  },
  {
    slug: 'tokyo-hidden-gems-secret-corners',
    marker: 'tokyo-hidden-gems',
    insertBefore: '<h2>The Quarter That Time Folded</h2>',
    callout: `
<div class="kaira-callout" data-kaira-cluster="tokyo-hidden-gems">
  <p class="kaira-eyebrow">What I mean by Tokyo hidden gems</p>
  <p>This is not a list of gimmicks or places that only sound secret on social media. It is for readers who want the quieter Tokyo that reveals itself slowly. Use it alongside my <a href="/tokyo-weekend-guide-three-days">3-day Tokyo itinerary</a>, my guide to the <a href="/tokyo-luxury-hotels-aman-park-hyatt">best luxury hotels in Tokyo</a>, and my <a href="/aman-tokyo-honest-review">Aman Tokyo review</a> if you are building the whole trip at once.</p>
</div>
    `.trim(),
    replacements: [],
  },
  {
    slug: 'aman-tokyo-honest-review',
    marker: 'aman-tokyo-review',
    insertBefore: '<h2>The Arrival</h2>',
    callout: `
<div class="kaira-callout" data-kaira-cluster="aman-tokyo-review">
  <p class="kaira-eyebrow">Who this Aman Tokyo review is for</p>
  <p>This is for travelers wondering whether Aman Tokyo is still worth the price in a city that now has more serious luxury competition. If you are comparing options, start with my guide to the <a href="/tokyo-luxury-hotels-aman-park-hyatt">best luxury hotels in Tokyo</a>, then map the rest of the stay with my <a href="/tokyo-weekend-guide-three-days">3-day Tokyo itinerary</a> and these <a href="/tokyo-hidden-gems-secret-corners">Tokyo hidden gems</a>.</p>
</div>
    `.trim(),
    replacements: [],
  },
];

for (const update of updates) {
  const { data: existing, error: fetchError } = await supabase
    .from('posts')
    .select('id, content')
    .eq('site_id', siteId)
    .eq('slug', update.slug)
    .single();

  if (fetchError) {
    throw new Error(`Failed to load ${update.slug}: ${fetchError.message}`);
  }

  let content = String(existing.content || '');

  if (!content.includes(`data-kaira-cluster="${update.marker}"`)) {
    if (!content.includes(update.insertBefore)) {
      throw new Error(`Could not find insertion point for ${update.slug}`);
    }
    content = content.replace(update.insertBefore, `${update.callout}\n${update.insertBefore}`);
  }

  for (const replacement of update.replacements) {
    content = content.replace(replacement.from, replacement.to);
  }

  if (content.includes('data-kaira-cluster-links="tokyo"')) {
    content = content.replace(
      /<div class="kaira-cluster-links" data-kaira-cluster-links="tokyo">[\s\S]*?<\/div>/,
      clusterLinks,
    );
  } else {
    content = `${content}\n${clusterLinks}`;
  }

  const { error: updateError } = await supabase
    .from('posts')
    .update({ content })
    .eq('id', existing.id);

  if (updateError) {
    throw new Error(`Failed to update ${update.slug}: ${updateError.message}`);
  }

  console.log(`updated ${update.slug}`);
}
