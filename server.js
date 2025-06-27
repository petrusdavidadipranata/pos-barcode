const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Lokasi file data
const filePath = path.join(__dirname, 'data.json');

// 🔐 Validasi awal: jika file tidak ada atau rusak, buat default []
if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, '[]');
  console.log('📁 File data.json belum ada, dibuat baru.');
} else {
  try {
    const isi = fs.readFileSync(filePath, 'utf8');
    JSON.parse(isi); // cek validitas
  } catch (err) {
    fs.writeFileSync(filePath, '[]');
    console.log('⚠️ File data.json rusak. Direset ke array kosong.');
  }
}

// Endpoint: simpan barang
app.post('/simpan-barang', (req, res) => {
  const { kode, nama, harga } = req.body;

  if (!kode || !nama || !harga) {
    return res.status(400).json({ message: 'Data tidak lengkap' });
  }

  let dataBarang = [];

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    dataBarang = JSON.parse(content);
  } catch (err) {
    console.error("❌ Error parsing isi data.json:", err.message);
    return res.status(500).json({ message: 'Gagal membaca data.json' });
  }

  dataBarang.push({ kode, nama, harga });

  try {
    fs.writeFileSync(filePath, JSON.stringify(dataBarang, null, 2));
    res.json({ message: '✅ Barang berhasil disimpan!' });
  } catch (err) {
    console.error("❌ Gagal menulis file JSON:", err.message);
    res.status(500).json({ message: 'Gagal menyimpan file' });
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
