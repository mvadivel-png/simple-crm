import express from 'express';
import cors from 'cors';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Middleware to handle both /api prefix (local) and without prefix (Vercel)
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    req.url = req.url.replace('/api', '');
  }
  next();
});

// Database connection
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err.stack);
  } else {
    console.log('Database connected successfully');
    release();
  }
});

// Create table if not exists
const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Contacts table ready');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

initDb();

// Routes

// GET all contacts
app.get('/contacts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contacts ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// GET single contact
app.get('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM contacts WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ error: 'Failed to fetch contact' });
  }
});

// POST new contact
app.post('/contacts', async (req, res) => {
  try {
    const { first_name, last_name, phone } = req.body;

    if (!first_name || !last_name || !phone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const result = await pool.query(
      'INSERT INTO contacts (first_name, last_name, phone) VALUES ($1, $2, $3) RETURNING *',
      [first_name, last_name, phone]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

// PUT update contact
app.put('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, phone } = req.body;

    if (!first_name || !last_name || !phone) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const result = await pool.query(
      'UPDATE contacts SET first_name = $1, last_name = $2, phone = $3 WHERE id = $4 RETURNING *',
      [first_name, last_name, phone, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// DELETE contact
app.delete('/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM contacts WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Export for Vercel serverless
export default app;

// Only start server if not in Vercel environment
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
