const { put } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Filename');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const filename = req.query.filename || req.headers['x-filename'] || 'file-' + Date.now();

    const blob = await put(filename, req, {
      access: 'public',
    });

    res.json({
      success: true,
      file: {
        name: filename,
        url: blob.url,
        path: blob.url
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports.config = {
  api: {
    bodyParser: false,
  },
};
