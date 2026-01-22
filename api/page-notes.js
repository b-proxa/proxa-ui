const { put, list } = require('@vercel/blob');

const NOTES_FILENAME = 'proxa-page-notes.json';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET - load notes for a page (or all notes)
  if (req.method === 'GET') {
    try {
      const { blobs } = await list();
      const notesBlob = blobs.find(b => b.pathname === NOTES_FILENAME);

      if (!notesBlob) {
        return res.json({});
      }

      const response = await fetch(notesBlob.url);
      const allNotes = await response.json();

      // If page query param provided, return just that page's notes
      const page = req.query?.page;
      if (page) {
        return res.json({ notes: allNotes[page] || '' });
      }

      return res.json(allNotes);
    } catch (error) {
      console.error('Load page notes error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // POST - save notes for a page
  if (req.method === 'POST') {
    try {
      const { page, notes } = req.body;

      if (!page) {
        return res.status(400).json({ error: 'Page ID required' });
      }

      // Load existing notes
      let allNotes = {};
      const { blobs } = await list();
      const notesBlob = blobs.find(b => b.pathname === NOTES_FILENAME);

      if (notesBlob) {
        const response = await fetch(notesBlob.url);
        allNotes = await response.json();
      }

      // Update notes for this page
      allNotes[page] = notes;

      // Save back
      await put(NOTES_FILENAME, JSON.stringify(allNotes), {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'application/json',
      });

      return res.json({ success: true });
    } catch (error) {
      console.error('Save page notes error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
