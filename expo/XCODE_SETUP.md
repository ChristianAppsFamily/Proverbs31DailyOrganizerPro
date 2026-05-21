# Xcode local testing (physical iPhone)

This app uses **native modules** (AdMob, ATT, notifications, in-app purchases). You must use a **development build** — Expo Go will not work.

## Prerequisites

- macOS with Xcode 15+
- Apple Developer account (free or paid)
- iPhone connected via USB
- Node.js 18+ and CocoaPods (`sudo gem install cocoapods`)

## 1. Install dependencies

```bash
cd /Users/longmorebiz/Desktop/ChristianAppEmpire/proverbs-31-organizer-main/expo
npm install --legacy-peer-deps
```

`react-native-iap` requires **`react-native-nitro-modules`** (peer dependency). It is listed in `package.json`; if `pod install` fails with `Unable to find a specification for NitroModules`, run:

```bash
npm install --legacy-peer-deps react-native-nitro-modules@^0.35.0
```

## 2. Generate the iOS project

```bash
npx expo prebuild --platform ios --clean
```

This creates the `ios/` folder with AdMob, ATT, and notification entitlements from `app.config.js`.

## 3. Open in Xcode

```bash
open ios/Proverbs31.xcworkspace
```

**Important:** Always open the **`.xcworkspace`** file (inside `ios/`), not the `.xcodeproj`. CocoaPods creates the workspace after a successful `pod install`.

## 4. Signing

1. Select the app target in Xcode.
2. **Signing & Capabilities** → choose your Team.
3. Set a unique **Bundle Identifier** if needed (default: `app.rork.au728cqyl2zvkiuezh60i`).

## 5. Run on your phone

1. Select your iPhone as the run destination.
2. Press **Run** (⌘R).
3. On first launch: splash → **ATT prompt** → ads load → banner at bottom of screens.

## Ad unit IDs

| Platform | App ID | Banner |
|----------|--------|--------|
| iOS | `ca-app-pub-3002325591150738~8603205607` | `ca-app-pub-3002325591150738/2556672005` |
| Android | `ca-app-pub-3002325591150738~9800737201` | `ca-app-pub-3002325591150738/3754203607` |

- **Debug** (`__DEV__`): Google test banner units (safe for development).
- **Release / Archive**: your production banner IDs. Set `EXPO_PUBLIC_USE_PRODUCTION_ADS=true` in the Xcode scheme or EAS production profile.

## App Store Connect (Pro purchase)

1. Create an in-app purchase product: `proverbs31_premium`
2. Rebuild after adding the product.
3. Use a **Sandbox** Apple ID on device to test purchases.

## Privacy policy (GitHub Pages)

Published from `docs/privacy-policy/index.html` in the repo root. Enable **GitHub Pages** → source: `main` branch → folder `/docs`.

Update `constants/urls.ts` if your GitHub username or repo name differs.

## Useful commands

```bash
# Run on connected device from CLI
npx expo run:ios --device

# Production archive (after configuring signing)
# Product → Archive in Xcode
```
