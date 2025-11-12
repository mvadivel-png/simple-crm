import app from '../backend/server.js';

export default async function handler(req, res) {
  return app(req, res);
}
