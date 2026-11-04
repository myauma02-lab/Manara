-- Kept separate from the data backfill because PostgreSQL requires a newly
-- added enum value to be committed before it can be used in a query.
ALTER TYPE "PaperSubtype" ADD VALUE IF NOT EXISTS 'RESEARCH_REPORT';
