## Architecture

This document describes the high-level architecture of **LearningEng** and how the main folders fit together.

### Top-level folders

- **`app/`** – screens and navigation (Expo Router + React Navigation).
- **`components/`** – reusable UI components grouped by domain (common, learn, profile, word).
- **`hooks/`** – custom React hooks that encapsulate business logic and data access.
- **`model/`** – data model, services, and storage (database + DTOs + mappers).
- **`store/`** – Redux store configuration and slices for app state.
- **`assets/`** – static assets (Lottie animations, data, etc.).
- **`resources/`** – constants and SQL schema definition.
- **`util/`** – generic helpers (e.g. date utilities).

### Data flow (simplified)

1. **UI layer** (`app/`, `components/`) renders screens and controls.
2. **Hooks** (`hooks/`) orchestrate data fetching and actions for specific domains.
3. **Store** (`store/`) holds in-memory application state via Redux slices.
4. **Model & services** (`model/`) talk to the database and other storage helpers.
5. **Database** (`model/database/`, `resources/sql/`) persists vocabulary, user data, and related entities.

### Key modules

- `model/service/*Service.ts` – business logic around categories, words, translation, and user data.
- `store/slice/*Slice.ts` – state shape and reducers for each domain.
- `hooks/useLearn.ts`, `useVocabulary.ts`, `useTranslation.ts` – glue between UI and data/model.


