const { put, list, del } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Filename');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET - list files
  if (req.method === 'GET') {
    try {
      const { blobs } = await list();

      const files = blobs.map(blob => ({
        name: blob.pathname,
        url: blob.url,
        path: blob.url,
        size: formatFileSize(blob.size),
        type: getFileType(blob.pathname),
        date: new Date(blob.uploadedAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })
      }));

      return res.json(files);
    } catch (error) {
      console.error('List files error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // DELETE - delete file
  if (req.method === 'DELETE') {
    try {
      const filename = req.query.filename;
      if (!filename) {
        return res.status(400).json({ error: 'Filename required' });
      }

      // Find the blob URL by listing and matching pathname
      const { blobs } = await list();
      const blob = blobs.find(b => b.pathname === filename);

      if (!blob) {
        return res.status(404).json({ error: 'File not found' });
      }

      await del(blob.url);
      return res.json({ success: true });
    } catch (error) {
      console.error('Delete error:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  // POST - upload file
  if (req.method === 'POST') {
    try {
      // Get filename from query, header, or generate fallback
      let filename = req.query.filename || req.headers['x-filename'] || 'file-' + Date.now();

      // Decode if URL encoded
      try {
        filename = decodeURIComponent(filename);
      } catch (e) {}

      const blob = await put(filename, req, {
        access: 'public',
        addRandomSuffix: false, // Keep original filename
      });

      return res.json({
        success: true,
        file: {
          name: filename,
          url: blob.url,
          path: blob.url,
          size: formatFileSize(blob.size || 0)
        }
      });
    } catch (error) {
      console.error('Upload error:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};

module.exports.config = {
  api: {
    bodyParser: false,
  },
};

function formatFileSize(bytes) {
  if (!bytes) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getFileType(filename) {
  if (!filename.includes('.')) return 'file';
  const ext = filename.split('.').pop().toLowerCase();
  return ext;
}
