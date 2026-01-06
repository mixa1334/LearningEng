## Learning flows

This document explains how the learning and review flows are structured from a product and implementation perspective.

### Concepts

- **Daily goal** – target number of words to learn/review per day (configured on the profile screen).
- **Learn session** – focuses on **new or less familiar** words.
- **Review session** – focuses on **previously learned** words that need reinforcement.
- **Practice modes** – additional training flows (e.g. word pairs, word building, overview) that reuse your vocabulary.

### High-level flow

1. On app start, user data and settings are loaded (including daily goal).
2. The **Learn & Review Words** tab fetches from the store/domain layer a set of words appropriate for:
   - **Learn mode** – new words that fit into the daily goal.
   - **Review mode** – words scheduled or available for review.
   - **Practice modes** – custom practice sets built from your chosen category and filters.
3. When the user completes learning/reviewing/practicing a word:
   - Progress is updated (both in Redux state and persisted storage, where applicable).
   - The next word in the queue is shown, or the session ends when the set is exhausted.

### Implementation hints

- Look into:
  - `src/hooks/useLearn.ts` – orchestration logic for daily learn/review sets.
  - `src/hooks/usePractice.ts` – logic for practice sets and filters.
  - `src/store/slice/learnSlice.ts` – state and reducers related to daily learning sessions.
  - `src/store/slice/practiceSlice.ts` – state and reducers related to practice flows.
  - `src/components/learn/learning/*` – UI for the main learning flow.
  - `src/components/learn/practice/*` – UI for practice modes (modes, settings, wrapper).


