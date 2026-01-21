const { put, list } = require('@vercel/blob');

const NOTES_FILENAME = 'proxa-notes.txt';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET - load notes
  if (req.method === 'GET') {
    try {
      const { blobs } = await list();
      const notesBlob = blobs.find(b => b.pathname === NOTES_FILENAME);

      if (!notesBlob) {
        return res.json({ content: '' });
      }

      const response = await fetch(notesBlob.url);
      const content = await response.text();
      return res.json({ content });
    } catch (error) {
      console.error('Load notes error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // POST - save notes
  if (req.method === 'POST') {
    try {
      const { content } = req.body;

      await put(NOTES_FILENAME, content || '', {
        access: 'public',
        addRandomSuffix: false,
      });

      return res.json({ success: true });
    } catch (error) {
      console.error('Save notes error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
