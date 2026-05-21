# Set up Proverbs 31 design system foundation

What this delivers This first step builds the shared visual foundation for the Proverbs 31: Daily Organizer app. No real screens yet — just the bones that every future screen will plug into, so everything stays consistent and beautiful from day one.

**Important build instruction: After this foundation is approved and built, I will provide a dedicated prompt for each screen one at a time. Do not build beyond what each screen prompt explicitly instructs. Do not improvise features, layouts, components, or interactions that are not described in the prompt. Wait for each screen prompt before proceeding.**

Features

- A complete design system applied app-wide: exact colors, fonts (Cormorant Garamond for headings, DM Sans for body), spacing, radii, and shadows pulled from your spec.
- A reusable deep purple header that appears at the top of every main screen, showing the little "P" logo mark, the "PROVERBS 31" wordmark, a bell icon, and a rotating daily verse card with faint concentric circles in the corner.
- A reusable bottom tab bar with four tabs — Tasks, Habits, Journal, Settings — using the inactive/active lavender states you specified.
- Four placeholder tab screens (Tasks, Habits, Journal, Settings) that simply show the global header and tab bar wired up correctly, so the shell is ready for real content next.
- A cream-lavender app background (`#FAF8FE`) behind everything for a soft, devotional feel.

Design

- Header: full-width `#3E2878` block with two faint white concentric circles in the top-right, a 28px circular logo with an italic serif "P", the wordmark in tiny spaced uppercase, and a translucent verse card with white italic Cormorant text (`#F5F0FF`) and a small reference line below at 50% white opacity. All text in the header must be near-white and fully legible against the dark purple background.
- Bottom nav: white with a hairline lavender top border, 9px labels under lucide icons, inactive `#AEA4C4`, active `#8B6FC0`.
- Typography: Cormorant Garamond Light for all titles and verses (gives the gentle, scriptural tone), DM Sans for everything functional.
- Surfaces: white cards on a lavender-tinted background, soft `#E2D8F4` borders, generous rounded corners.
- App icon: deep purple gradient background (`#3E2878` → `#8B6FC0`) with a single elegant italic serif "P" in soft cream (`#F5F0FF`), framed by a thin circular outline — mirroring the in-app logo mark.

Color tokens (use these exact values, no substitutions):

- Header background: `#3E2878`
- Primary/interactive: `#8B6FC0`
- Header text and verse: `#F5F0FF`
- App background: `#FAF8FE`
- Card background: `#FFFFFF`
- Secondary surface: `#F0ECF8`
- Border: `#E2D8F4`
- Body text: `#1E1340`
- Muted text: `#7A6E96`
- Hint text: `#AEA4C4`

Screens

- Tasks tab (placeholder): header + tab bar visible, empty content area ready for the tasks list later.
- Habits tab (placeholder): same shell, ready for habit cards.
- Journal tab (placeholder): same shell, ready for journal entries.
- Settings tab (placeholder): same shell, ready for settings groups.

After this foundation is approved and built, I will provide screen prompts one at a time. Build only what each prompt describes. Do not add screens, features, or components not explicitly requested.

