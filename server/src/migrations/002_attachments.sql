-- 002_attachments.sql
-- add attachments JSON column to questions

USE hnd_question_bank;

ALTER TABLE questions
  ADD COLUMN attachments JSON NULL AFTER answer;
