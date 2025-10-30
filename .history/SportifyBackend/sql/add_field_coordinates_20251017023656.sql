-- Add latitude and longitude columns if they don't exist
ALTER TABLE field ADD COLUMN IF NOT EXISTS latitude DOUBLE;
ALTER TABLE field ADD COLUMN IF NOT EXISTS longitude DOUBLE;

-- Update coordinates for existing fields based on address
-- These are examples, you should replace with actual coordinates for your fields
UPDATE field SET latitude = 10.759660, longitude = 106.704230 WHERE fieldid = 1;  -- Example coordinate for a field in Ho Chi Minh City
UPDATE field SET latitude = 10.762622, longitude = 106.660172 WHERE fieldid = 2;  -- Example coordinate for another field
UPDATE field SET latitude = 10.780230, longitude = 106.699080 WHERE fieldid = 3;  -- Example coordinate
UPDATE field SET latitude = 10.775440, longitude = 106.640390 WHERE fieldid = 4;  -- Example coordinate
UPDATE field SET latitude = 10.798465, longitude = 106.674391 WHERE fieldid = 5;  -- Example coordinate

-- Update specific fields based on provided addresses from the screenshots
UPDATE field SET latitude = 10.779863, longitude = 106.717969 WHERE address LIKE '%An Hội, 256 Phan Huy Ích, Phường 12, Gò Vấp, Thành phố Hồ Chí Minh%'; 
UPDATE field SET latitude = 10.803917, longitude = 106.769648 WHERE address LIKE '%TNG, Hẻm Số 2 Tô Ngọc Vân, An Phú, Quận 2, Thành phố Hồ Chí Minh%';

-- You can add more updates as needed