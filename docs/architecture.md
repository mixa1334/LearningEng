## Architecture

This document describes the high-level architecture of **LearningEng** and how the main folders fit together.

### Top-level folders

- **`app/`** – screens and navigation (Expo Router + React Navigation).
- **`src/components/`** – reusable UI components grouped by domain (`common`, `learn`, `profile`, `vocabulary`).
- **`src/hooks/`** – custom React hooks that encapsulate business logic and data access.
- **`src/store/`** – Redux store configuration and slices for app state.
- **`src/entity/`** – core domain types (categories, words, translations, user data).
- **`src/database/`** – SQLite setup and migrations.
- **`src/service/`** – domain services (categories, words, translations, user data, daily quote, backup).
- **`src/storage/`** – helpers for persisting user-related settings and data.
- **`src/mapper/`** – mappers between raw DB rows and domain types.
- **`src/resources/`** – constants and SQL schema definition.
- **`src/util/`** – generic helpers (e.g. date utilities, string helpers).
- **`assets/`** – static assets (Lottie animations, seed data, images, etc.).
- **`docs/`** – project documentation.

### Data flow (simplified)

1. **UI layer** (`app/`, `src/components/`) renders screens and controls.
2. **Hooks** (`src/hooks/`) orchestrate data fetching and actions for specific domains.
3. **Store** (`src/store/`) holds in-memory application state via Redux slices.
4. **Domain & services** (`src/service/`, `src/storage/`, `src/mapper/`, `src/entity/`) talk to the database and other storage helpers.
5. **Database** (`src/database/`, `src/resources/sql/`) persists vocabulary, user data, and related entities.

### Key modules

- `src/service/*Service.ts` – business logic around categories, words, translations, user data, daily quote, and backup.
- `src/store/slice/*Slice.ts` – state shape and reducers for each domain.
- `src/hooks/useLearn.ts`, `src/hooks/usePractice.ts`, `src/hooks/useVocabulary.ts`, `src/hooks/useTranslation.ts`, `src/hooks/useUserData.ts` – glue between UI and data/domain layer.


