-- Add spatial index to latitude and longitude columns for better performance in location queries
ALTER TABLE fields ADD INDEX idx_field_coordinates (latitude, longitude);