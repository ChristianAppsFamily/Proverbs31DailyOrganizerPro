export type Verse = {
  text: string;
  reference: string;
};

/** Verses cycled in the global header card. */
export const VERSES: Verse[] = [
  {
    text: "She watches over the affairs of her household and does not eat the bread of idleness.",
    reference: "Proverbs 31 : 27",
  },
  {
    text: "Charm is deceptive, and beauty is fleeting; but a woman who fears the Lord is to be praised.",
    reference: "Proverbs 31 : 30",
  },
  {
    text: "She gets up while it is still night; she provides food for her family.",
    reference: "Proverbs 31 : 15",
  },
  {
    text: "She is clothed with strength and dignity; she can laugh at the days to come.",
    reference: "Proverbs 31 : 25",
  },
  {
    text: "She opens her mouth with wisdom, and on her tongue is the law of kindness.",
    reference: "Proverbs 31 : 26",
  },
];

/** Returns a verse that rotates by the day of the year — stable per-day. */
export function getDailyVerse(now: Date = new Date()): Verse {
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return VERSES[dayOfYear % VERSES.length];
}
