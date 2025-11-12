import app from '../backend/server.js';

// Vercel serverless function handler
export default async function handler(req, res) {
  // Pass the request to Express
  return app(req, res);
}
