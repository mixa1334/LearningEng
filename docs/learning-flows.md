## Learning flows

This document explains how the learning and review flows are structured from a product and implementation perspective.

### Concepts

- **Daily goal** – target number of words to learn/review per day (configured on the profile screen).
- **Learn session** – focuses on **new or less familiar** words.
- **Review session** – focuses on **previously learned** words that need reinforcement.

### High-level flow

1. On app start, user data and settings are loaded (including daily goal).
2. The **Learn** tab fetches from the store/model a set of words appropriate for:
   - **Learn mode** – new words that fit into the daily goal.
   - **Review mode** – words scheduled or available for review.
3. When the user completes learning/reviewing a word:
   - Progress is updated (both in Redux state and persisted storage).
   - The next word in the queue is shown, or the session ends when the set is exhausted.

### Implementation hints

- Look into:
  - `hooks/useLearn.ts` – orchestration logic for learn/review.
  - `store/slice/learnSlice.ts` – state and reducers related to learning sessions.
  - `components/learn/*` – UI for cards, headers, and error/empty states.


