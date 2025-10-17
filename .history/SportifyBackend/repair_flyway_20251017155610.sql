-- Script to repair Flyway migration checksum for version 3
-- This updates the checksum in the Flyway schema history table to match the new file content

-- First, check the current state
SELECT * FROM flyway_schema_history WHERE version = '3';

-- Update the checksum for version 3 to 0 (or calculate MD5 checksum of new file content if needed)
UPDATE flyway_schema_history 
SET checksum = 0 
WHERE version = '3';

-- Verify the update
SELECT * FROM flyway_schema_history WHERE version = '3';