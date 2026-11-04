ALTER TABLE "publications"
ADD COLUMN "topics" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Preserve existing category assignments only when they already match one
-- of the approved topic names in publication keywords or tags.
WITH approved_topics AS (
  SELECT topic, position
  FROM unnest(ARRAY[
    'Media Studies',
    'Economic Discourse',
    'Politic & Social Discourse',
    'Human Ecology',
    'Law and Public Policy'
  ]::TEXT[]) WITH ORDINALITY AS approved(topic, position)
)
UPDATE "publications" AS publication
SET "topics" = ARRAY(
  SELECT approved.topic
  FROM approved_topics AS approved
  WHERE EXISTS (
    SELECT 1
    FROM unnest(COALESCE(publication."keywords", ARRAY[]::TEXT[])) AS keyword(value)
    WHERE lower(trim(keyword.value)) = lower(approved.topic)
  ) OR EXISTS (
    SELECT 1
    FROM "publication_tags" AS publication_tag
    JOIN "tags" AS tag ON tag."id" = publication_tag."tagId"
    WHERE publication_tag."publicationId" = publication."id"
      AND lower(trim(tag."name")) = lower(approved.topic)
  )
  ORDER BY approved.position
);
