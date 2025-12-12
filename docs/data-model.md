## Data model

This document summarizes the main entities and how they are stored.

### Entities (conceptual)

- **Category**
  - Name
  - Optional emoji/icon
  - Relationship: has many **Words**
- **Word**
  - Text in English
  - Translation (e.g. Russian)
  - Category reference
  - Metadata: created/updated at, maybe difficulty or status fields.
- **Translation**
  - Source text
  - Target text
  - Direction (EN → RU or RU → EN)
  - Timestamp, maybe favorite/flag fields.
- **User data**
  - Daily goal
  - Progress stats
  - Other preferences.

### Implementation references

- `model/entity/types.ts` – TypeScript types for entities.
- `model/database/db.ts` and `model/database/migrations.ts` – SQLite setup and migrations.
- `resources/sql/schema.ts` – database schema definitions.
- `model/service/*Service.ts` – how entities are created, updated, and queried.


