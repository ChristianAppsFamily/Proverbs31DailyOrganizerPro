# Xcode local testing (physical iPhone)

**PRO build (Proverbs31OrganizerPro):** Display name **Proverbs 31: Daily Organizer Pro** · version **1.1** · bundle `com.christianappempire.p31organizerpro` · Apple ID **1063672528** · SKU **P31OrganizePro**

This app uses **native modules** (notifications). You must use a **development build** — Expo Go will not work.

No ads or App Tracking Transparency in this build.

After changing `app.config.js` or icons, regenerate native code:

```bash
npm run prebuild:ios
```

## Prerequisites

- macOS with Xcode 15+
- Apple Developer account (free or paid)
- iPhone connected via USB
- Node.js 18+ and CocoaPods (`sudo gem install cocoapods`)

## 1. Install dependencies

```bash
cd expo
npm install --legacy-peer-deps
```

## 2. Generate the iOS project

```bash
npx expo prebuild --platform ios --clean
```

This creates the `ios/` folder with notification entitlements from `app.config.js`.

## 3. Open in Xcode

```bash
open ios/Proverbs31DailyOrganizerPro.xcworkspace
```

**Important:** Always open the **`.xcworkspace`** file (inside `ios/`), not the `.xcodeproj`. The name users see on the home screen is **Proverbs 31: Daily Organizer Pro**.

## 4. Signing

If Xcode shows **“Signing requires a development team”**:

1. Select the app target in Xcode.
2. Open **Signing & Capabilities**.
3. Check **Automatically manage signing**.
4. Choose your **Team** (Apple ID / developer account).
5. Confirm **Bundle Identifier** is `com.christianappempire.p31organizerpro`.

Without a team, the app cannot run on a physical iPhone or be archived for TestFlight/App Store.

- **Version** 1.1 · **Build** must be higher than the build on App Store Connect (configured as `2` in `app.config.js` — bump if yours is already ≥ 2).

## 5. Run on your phone

1. Select your iPhone as the run destination.
2. Press **Run** (⌘R).
3. On first launch: splash → main UI → optional notification permission on the Tasks tab.

After changing `assets/images/splash.png` or `icon.png`, run `npm run prebuild:ios` so Xcode picks up new assets.

## Store metadata

Constants live in `constants/appStore.ts`. App Store / review URLs use Apple ID **1063672528** via `constants/urls.ts`.
