const { put } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const contentType = req.headers['content-type'] || '';

    // Handle multipart form data
    if (contentType.includes('multipart/form-data')) {
      // For multipart, we need to parse the form
      const chunks = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);

      // Extract filename from multipart data
      const boundary = contentType.split('boundary=')[1];
      const parts = buffer.toString().split('--' + boundary);

      let filename = 'upload-' + Date.now();
      let fileBuffer = null;

      for (const part of parts) {
        if (part.includes('filename="')) {
          const match = part.match(/filename="([^"]+)"/);
          if (match) filename = match[1];

          // Get the file content (after double newline)
          const headerEnd = part.indexOf('\r\n\r\n');
          if (headerEnd > -1) {
            const content = part.slice(headerEnd + 4);
            // Remove trailing boundary markers
            const endIndex = content.lastIndexOf('\r\n');
            fileBuffer = Buffer.from(content.slice(0, endIndex > 0 ? endIndex : content.length));
          }
        }
      }

      if (!fileBuffer) {
        return res.status(400).json({ error: 'No file found in request' });
      }

      const blob = await put(filename, fileBuffer, {
        access: 'public',
      });

      return res.json({
        success: true,
        file: {
          name: filename,
          url: blob.url,
          size: fileBuffer.length
        }
      });
    }

    // Handle raw body with filename in header
    const filename = req.headers['x-filename'] || 'upload-' + Date.now();
    const blob = await put(filename, req, {
      access: 'public',
    });

    res.json({
      success: true,
      file: {
        name: filename,
        url: blob.url
      }
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message });
  }
};
