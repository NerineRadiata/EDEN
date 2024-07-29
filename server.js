const express = require('express');
const AWS = require('aws-sdk');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Thiết lập AWS SDK để sử dụng với Cloudflare R2
const s3 = new AWS.S3({
  endpoint: 'https://a24ed95912e33d89079396931e498bbf.r2.cloudflarestorage.com',
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  s3ForcePathStyle: true,
  signatureVersion: 'v4',
});

// Route để lấy danh sách ảnh
app.get('/api/images', async (req, res) => {
  try {
    const data = await s3.listObjectsV2({
      Bucket: 'images', // Tên bucket của bạn
      Prefix: 'images/', // Thư mục chứa ảnh
    }).promise();

    const images = data.Contents.map(item => ({
      file: `https://a24ed95912e33d89079396931e498bbf.r2.cloudflarestorage.com/${item.Key}`,
      title: item.Key.split('/').pop().split('.')[0], // Sử dụng tên file làm title
    }));

    res.json(images);
  } catch (error) {
    console.error('Error fetching images:', error);
    res.status(500).json({ error: 'Error fetching images' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
