const { list } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { blobs } = await list();

    const files = blobs.map(blob => ({
      name: blob.pathname,
      url: blob.url,
      size: formatFileSize(blob.size),
      type: getFileType(blob.pathname),
      date: new Date(blob.uploadedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    }));

    res.json(files);
  } catch (error) {
    console.error('List files error:', error);
    res.status(500).json({ error: error.message });
  }
};

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

function getFileType(filename) {
  const ext = filename.split('.').pop().toLowerCase();
  return ext;
}
