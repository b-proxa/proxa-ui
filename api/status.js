const { put, list } = require('@vercel/blob');

const STATUS_FILENAME = 'proxa-status.json';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET - load all statuses
  if (req.method === 'GET') {
    try {
      const { blobs } = await list();
      const statusBlob = blobs.find(b => b.pathname === STATUS_FILENAME);

      if (!statusBlob) {
        return res.json({});
      }

      const response = await fetch(statusBlob.url);
      const content = await response.json();
      return res.json(content);
    } catch (error) {
      console.error('Load status error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // POST - save status for a page
  if (req.method === 'POST') {
    try {
      const { page, status } = req.body;

      // Load existing statuses
      let statuses = {};
      const { blobs } = await list();
      const statusBlob = blobs.find(b => b.pathname === STATUS_FILENAME);

      if (statusBlob) {
        const response = await fetch(statusBlob.url);
        statuses = await response.json();
      }

      // Update status
      statuses[page] = status;

      // Save back
      await put(STATUS_FILENAME, JSON.stringify(statuses), {
        access: 'public',
        addRandomSuffix: false,
        contentType: 'application/json',
      });

      return res.json({ success: true, statuses });
    } catch (error) {
      console.error('Save status error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
