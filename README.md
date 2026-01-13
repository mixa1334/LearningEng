
## Pocket English – English Vocabulary & Translation Trainer

Pocket English is a mobile app built with Expo and React Native to help you systematically grow and review your English vocabulary.  
It provides structured learning sessions, category-based word management, daily goals, and an English–Russian translation helper – all backed by persistent storage and progress tracking.

---

## Features

- **Personal dashboard**
  - Profile screen with overview of your learning progress.
  - Daily goal card to keep you on track.
  - Quick access to settings and preferences.

- **Learning & review**
  - Daily set of words split into **Learn** and **Review** modes.
  - Dedicated **Learning** tab with a clean card-based UI.
  - Quick overview of words available for fast review.

- **Vocabulary management**
  - Separate **Vocabulary** tab with navigation to:
    - **Categories** – create, edit, and delete vocabulary categories.
    - **Words** – add, edit, and remove words in your personal dictionary.
    - **Translation** – jump into the translation helper.

- **English–Russian translation**
  - Translate words **English ↔ Russian**.
  - Swap translation direction with one tap.
  - See current translation result and browse a history of recent translations.
  - Remove single translations or clear the whole history.

- **Nice UI & UX**
  - Built on `react-native-paper` for modern material-style components.
  - Theming support via `ThemeProvider` for consistent colors and typography.
  - Safe area–aware layouts tuned for both iOS and Android.

---

## Tech stack

- **Framework**: Expo (React Native)
- **Navigation**: `expo-router`, `@react-navigation/*`
- **State management**: Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **UI library**: `react-native-paper` + `@expo/vector-icons`
- **Persistence**: `expo-sqlite` (for storing vocabulary and related data)
- **Animation & media**: `lottie-react-native`, `expo-image`
- **Tooling**: TypeScript, ESLint (`eslint-config-expo`)

---

## Getting started

### Prerequisites

- **Node.js**: Recommended LTS version
- **npm** (comes with Node) or **yarn/pnpm**
- **Expo tools**:
  - Expo CLI (optional but handy):  
    ```bash
    npm install -g expo-cli
    ```
  - Expo Go app on your Android/iOS device **or** an Android/iOS simulator/emulator.

### Install dependencies

From the project root:

```bash
npm install
```

### Run the app

Start the development server:

```bash
npm run start
```

or directly with Expo:

```bash
npx expo start
```

Then:

- **On a real device**: Scan the QR code with the Expo Go app.
- **On Android emulator**: Press `a` in the terminal.
- **On iOS simulator (macOS)**: Press `i` in the terminal.


## Available scripts

In `package.json`:

- **`npm run start`**: Start the Expo dev server.
- **`npm run web`**: Start the app in a web browser.
- **`npm run android`**: Start the app directly on an Android emulator/device.
- **`npm run ios`**: Start the app directly on an iOS simulator/device (macOS only).
- **`npm run lint`**: Run ESLint checks.
- **`npm run reset-project`**: Run the custom reset script (for cleaning and re-initializing the project).

---

## Project structure (high level)

- **`app/`**: Screens and navigation (Expo Router).
  - `_layout.tsx` – root layout that wires up navigation, theming, SQLite, and Redux.
  - `(tabs)/_layout.tsx` – bottom tab layout with three main tabs:
    - `vocabulary` – vocabulary navigation stack.
    - `index` – **Learn & Review Words** tab (learn + practice flows).
    - `profile` – profile, progress, daily goal, FAQ, quotes, settings.
  - `(tabs)/vocabulary/` – vocabulary sub-screens:
    - `index.tsx` – entry point for vocabulary actions.
    - `categories.tsx` – manage categories.
    - `words.tsx` – manage words.
    - `translation.tsx` – English–Russian translation helper.
    - `create-category.tsx`, `create-word.tsx`, `save-translation.tsx` – helper screens for specific flows.

- **`src/`**: Main application code (logic, UI, data access).
  - `components/` – reusable UI components.
    - `common/` – shared UI (cards, dividers, loading spinner, theme provider, etc.).
    - `learn/` – learning and practice flow components (learning cards, practice modes, error states, etc.).
    - `profile/` – profile, progress, daily goal, FAQ, quotes, settings.
    - `vocabulary/` – category and word lists, pickers, and edit dialogs.
  - `hooks/` – domain-specific hooks (`useLearn`, `usePractice`, `useVocabulary`, `useTranslation`, `useUserData`, etc.).
  - `store/` – Redux store configuration and slices.
    - `index.ts` – creates the store and typed hooks.
    - `slice/*Slice.ts` – slices for learning, practice, vocabulary, translation, and user data.
  - `entity/` – core TypeScript types for categories, words, translations, and user data.
  - `database/` – SQLite setup and migration runner (`db.ts`, `migrations.ts`).
  - `service/` – domain services for categories, words, translations, user data, daily quote, and backup.
  - `storage/` – helpers for persisting user-related settings and data.
  - `mapper/` – mapping helpers between raw DB rows and entity types.
  - `resources/` – constants and SQL schema (`resources/constants`, `resources/sql/schema.ts`).
  - `util/` – generic helpers (e.g. date and string utilities).

- **`assets/`**: Static assets (images, animations, and seed data in `assets/data/*`).
- **`docs/`**: Project documentation (overview, architecture, learning flows, data model, and screenshots).

---


## License

This project is licensed under a custom **Pocket English Non-Commercial License**.  
In short: the source code is available for personal, educational, and community use, but **commercial use is not allowed** without a separate commercial license from the authors.  
See the `LICENSE` file for the full legal text.