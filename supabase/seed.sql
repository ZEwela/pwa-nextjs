
-- Insert sample data into the events table
INSERT INTO events (title, type, venue, address, date, time, description, image, area, user_id)
VALUES
  ('Art Exhibition: Modern London', 'exhibition', 'Tate Modern', 'Bankside, London SE1 9TG', '2025-01-15', '18:00', 'A showcase of contemporary art from London-based artists.', 'http://localhost:54323/storage/v1/object/public/event-images/image.jpg', 'South Bank', 'd0c59317-c60f-4eee-99c3-66c72ab2130c'),
  ('Jazz Evening at Ronnie''s', 'performance', 'Ronnie Scott''s Jazz Club', '47 Frith St, Soho, London W1D 4HT', '2025-02-20', '20:00', 'An evening of live jazz featuring renowned saxophonists.', 'http://localhost:54323/storage/v1/object/public/event-images/image.jpg', 'Soho', 'd0c59317-c60f-4eee-99c3-66c72ab2130c'),
  ('Photography Workshop', 'workshop', 'The Photographers'' Gallery', '16-18 Ramillies St, London W1F 7LW', '2025-03-05', '10:00', 'Learn the art of photography from a professional photographer.', 'http://localhost:54323/storage/v1/object/public/event-images/image.jpg', 'West End', 'd0c59317-c60f-4eee-99c3-66c72ab2130c'),
  ('Gallery Opening: The National Gallery', 'opening', 'The National Gallery', 'Trafalgar Square, London WC2N 5DN', '2025-01-30', '17:00', 'Grand opening of new exhibits at The National Gallery.', 'http://localhost:54323/storage/v1/object/public/event-images/image.jpg', 'Westminster', 'd0c59317-c60f-4eee-99c3-66c72ab2130c');

-- Verify that data is inserted correctly
SELECT * FROM events;
