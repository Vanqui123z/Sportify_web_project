-- Add the latitude and longitude columns to the field table if they don't exist
ALTER TABLE `sportify`.`field` 
ADD COLUMN IF NOT EXISTS `latitude` DOUBLE NULL AFTER `address`,
ADD COLUMN IF NOT EXISTS `longitude` DOUBLE NULL AFTER `latitude`;

-- Update some sample coordinates for testing
-- These are example coordinates for Ho Chi Minh City sports venues
UPDATE `sportify`.`field` SET 
  `latitude` = 10.762622, 
  `longitude` = 106.660172 
WHERE `fieldid` = 1;

UPDATE `sportify`.`field` SET 
  `latitude` = 10.775893, 
  `longitude` = 106.701920 
WHERE `fieldid` = 2;

UPDATE `sportify`.`field` SET 
  `latitude` = 10.759058, 
  `longitude` = 106.662048 
WHERE `fieldid` = 3;

UPDATE `sportify`.`field` SET 
  `latitude` = 10.780060, 
  `longitude` = 106.694801 
WHERE `fieldid` = 4;

UPDATE `sportify`.`field` SET 
  `latitude` = 10.796877, 
  `longitude` = 106.669401 
WHERE `fieldid` = 5;