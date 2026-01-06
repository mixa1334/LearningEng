## Data model

This document summarizes the main entities and how they are stored.

### Entities (conceptual)

- **Category**
  - `id`
  - `name`
  - `type` (pre-loaded vs user-added)
  - `icon` (emoji or icon name)
  - Relationship: has many **Words**
- **Word**
  - `id`
  - `word_en` (English text)
  - `word_ru` (Russian text)
  - `type` (pre-loaded vs user-added)
  - `learned` flag
  - `category` reference (via `category_id` in DB)
  - `next_review` datetime
  - `priority` (for scheduling / ordering)
  - `text_example` (usage example)
- **Translation**
  - `id`
  - `word_en`
  - `word_ru`
  - `translation_date` (timestamp of when the translation was made)
- **User data**
  - `name`
  - `totalLearnedWords`
  - `streak`
  - `lastLearningDate`
  - `reviewedToday`
  - `learnedToday`
  - `dailyGoal`
  - `dailyGoalAchieve`
  - `theme`

### Implementation references

- `src/entity/types.ts` – TypeScript types for entities.
- `src/database/db.ts` and `src/database/migrations.ts` – SQLite setup and migrations.
- `src/resources/sql/schema.ts` – database schema definitions.
- `src/service/*Service.ts` – how entities are created, updated, and queried.


