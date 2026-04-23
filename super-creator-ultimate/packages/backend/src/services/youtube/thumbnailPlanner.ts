export interface ThumbnailPlan {
  headline: string;
  focalFrame: string;
  layout: string;
  colorDirection: string;
}

export const planThumbnail = (keyframes: string[], topic: string): ThumbnailPlan => ({
  headline: topic.split(' ').slice(0, 6).join(' ').toUpperCase(),
  focalFrame: keyframes[0] ?? 'no-frame-available',
  layout: 'Left subject close-up + right 3-word headline + directional arrow',
  colorDirection: 'High contrast complementary tones (violet/yellow), boosted mid-tones'
});
