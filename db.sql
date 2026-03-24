-- Run this in your PostgreSQL database to set up the schema

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100) NOT NULL,
  whatsapp_text TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address VARCHAR(100),
  user_agent TEXT,
  page_visited VARCHAR(255),
  visited_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255),
  customer_name VARCHAR(255),
  customer_phone VARCHAR(50),
  message TEXT,
  status VARCHAR(50) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_product_photos_product_id ON product_photos(product_id);
CREATE INDEX IF NOT EXISTS idx_visitors_visited_at ON visitors(visited_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- Sample data
INSERT INTO products (name, description, category, whatsapp_text, is_featured) VALUES
('Candy Charm Stack', 'A playful stack of colorful candy-inspired charm bracelets. Each piece is handcrafted with vibrant beads and charms.', 'Bracelets', 'Hi, I would like to order the Candy Charm Stack from Jigi Jewels. Can you help me?', true),
('Pink Crystal Necklace Set', 'Elegant pink crystal necklace with matching earrings. Perfect for any occasion.', 'Necklace Sets', 'Hi, I would like to order the Pink Crystal Necklace Set from Jigi Jewels. Can you help me?', true),
('Silver Heart Collection', 'Delicate silver heart charm bracelet and necklace set. A timeless piece for the romantic soul.', 'Sets', 'Hi, I would like to order the Silver Heart Collection from Jigi Jewels. Can you help me?', true),
('Gold Multi Chain Set', 'Layered gold chain necklace set with matching bracelet. Bold, luxurious and statement-making.', 'Sets', 'Hi, I would like to order the Gold Multi Chain Set from Jigi Jewels. Can you help me?', false),
('Amethyst Crystal Set', 'Purple amethyst crystal earrings and necklace set. Mystical and refined.', 'Earrings', 'Hi, I would like to order the Amethyst Crystal Set from Jigi Jewels. Can you help me?', false);
