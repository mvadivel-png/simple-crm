# Simple CRM

A minimal CRM application for managing contacts with first name, last name, and phone number. Built with React, Node.js, Express, and PostgreSQL (Neon).

## Features

- Add new contacts
- Edit existing contacts
- Delete contacts
- View all contacts
- Clean, simple interface

## Tech Stack

- **Frontend**: React 18 + Vite
- **Backend**: Node.js + Express
- **Database**: PostgreSQL (Neon)
- **Deployment**: Vercel

## Project Structure

```
crm/
├── backend/
│   ├── server.js          # Express API server
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── main.jsx       # React entry point
│   │   └── index.css      # Styles
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
├── vercel.json            # Vercel deployment config
└── README.md
```

## Local Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Neon PostgreSQL database account

### 1. Database Setup (Neon)

1. Create a free account at [Neon](https://neon.tech)
2. Create a new project
3. Copy your connection string (it looks like: `postgresql://user:password@host/dbname`)

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your Neon database connection string
# DATABASE_URL=your_neon_connection_string
# PORT=3001

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:3001` and automatically create the `contacts` table.

### 3. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the frontend dev server
npm run dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

- `GET /api/contacts` - Get all contacts
- `GET /api/contacts/:id` - Get a specific contact
- `POST /api/contacts` - Create a new contact
- `PUT /api/contacts/:id` - Update a contact
- `DELETE /api/contacts/:id` - Delete a contact

## Deployment to Vercel

### 1. Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [Vercel](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: ./
   - **Build Command**: Leave empty (handled by vercel.json)
   - **Output Directory**: Leave empty
5. Add Environment Variables:
   - `DATABASE_URL` - Your Neon database connection string
6. Click "Deploy"

### 3. Environment Variables for Production

In Vercel project settings, add:

**Backend:**
- `DATABASE_URL` - Your Neon connection string
- `PORT` - (optional, Vercel sets this automatically)

**Frontend:**
- `VITE_API_URL` - Set to your backend API URL (e.g., `https://your-app.vercel.app/api`)

Note: You may need to update the API URL in the frontend after deployment, or use Vercel's automatic routing.

## Database Schema

```sql
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

The table is created automatically when the backend starts.

## Development Notes

- No authentication required (as specified)
- Minimal fields only (first name, last name, phone)
- Uses PostgreSQL prepared statements to prevent SQL injection
- CORS enabled for local development
- Frontend proxies API requests during development

## Troubleshooting

### Backend won't start
- Check that your `.env` file has the correct `DATABASE_URL`
- Ensure Neon database is accessible
- Check if port 3001 is available

### Frontend can't connect to backend
- Ensure backend is running on port 3001
- Check browser console for errors
- Verify API_URL in frontend/.env (if using)

### Deployment issues
- Verify all environment variables are set in Vercel
- Check Vercel deployment logs
- Ensure DATABASE_URL points to your Neon database with SSL enabled

## License

MIT
