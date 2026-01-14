-- Add fields to support public question banks and browsing
ALTER TABLE question_banks 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS field_of_study VARCHAR(100),
ADD COLUMN IF NOT EXISTS question_count INT DEFAULT 0;

-- Create index for better search performance
CREATE INDEX IF NOT EXISTS idx_field_of_study ON question_banks(field_of_study);
CREATE INDEX IF NOT EXISTS idx_is_public ON question_banks(is_public);
CREATE INDEX IF NOT EXISTS idx_question_type ON questions(type);
CREATE INDEX IF NOT EXISTS idx_question_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_bank_id ON questions(bank_id);

-- Update stats view
DROP VIEW IF EXISTS bank_stats;
CREATE VIEW bank_stats AS
SELECT 
  qb.id,
  qb.title,
  qb.field_of_study,
  COUNT(q.id) as question_count
FROM question_banks qb
LEFT JOIN questions q ON qb.id = q.bank_id
GROUP BY qb.id, qb.title, qb.field_of_study;
