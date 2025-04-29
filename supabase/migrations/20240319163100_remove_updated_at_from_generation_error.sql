-- Migration: Remove updated_at from generation_error table
-- Description: Removes the updated_at column from generation_error table since errors are immutable
-- and will not be updated after creation.
-- Author: AI Assistant
-- Date: 2024-03-19

-- Remove updated_at column from generation_error table
alter table generation_error drop column updated_at;

-- Note: This is a destructive change that removes the column and its data
-- The change is safe because:
-- 1. Errors are immutable - they are created once and never updated
-- 2. The created_at column remains to track when the error occurred
-- 3. No existing functionality depends on the updated_at column for generation_error 