
## LearningEng – English Vocabulary & Translation Trainer

LearningEng is a mobile app built with Expo and React Native to help you systematically grow and review your English vocabulary.  
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
- **`npm run android`**: Start the app directly on an Android emulator/device.
- **`npm run ios`**: Start the app directly on an iOS simulator/device (macOS only).
- **`npm run lint`**: Run ESLint checks.
- **`npm run reset-project`**: Run the custom reset script in `scripts/reset-project.js`.

---

## Project structure (high level)

- **`app/`**: Screens and navigation (Expo Router).
  - `index.tsx` – redirects into the main tab layout.
  - `(tabs)/` – bottom tab screens:
    - `ProfileTab.tsx` – profile, progress, daily goal, settings.
    - `LearnTab.tsx` – learning/review flows for your daily word set.
    - `VocabularyTab.tsx` – entry point to categories, words, and translation.
  - `CategoryVocabularyPage.tsx` – manage categories.
  - `WordVocabularyPage.tsx` – manage words.
  - `TranslationPage.tsx` – English–Russian translation page.

- **`components/`**: Reusable UI components.
  - `common/` – shared UI (cards, dividers, loading spinner, theme provider, etc.).
  - `learn/` – learning flow components (learning content, headers, word cards, etc.).
  - `profile/` – profile, progress, daily goal, settings dialog.
  - `word/` – dialogs and lists for word management.

- **`store/`**: Redux store configuration and slices.
  - `index.ts` – creates the store and typed hooks.
  - `slice/*Slice.ts` – separate slices for learning, vocabulary, translation, and user data.

- **`assets/`**: Static assets (images, fonts, animations, etc.).
- **`resources/`**: Constants (layout spacing, dimensions, etc.).
- **`util/`**: Utility functions and helpers.

---


## License

This project is licensed under the **MIT License**.  
See the `LICENSE` file for full license text.