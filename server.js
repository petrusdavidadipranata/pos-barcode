const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Path ke file data
const filePath = path.join(__dirname, 'data.json');

// Validasi awal file data
if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]');
else {
  try { JSON.parse(fs.readFileSync(filePath, 'utf8')); }
  catch { fs.writeFileSync(filePath, '[]'); }
}

// Simpan barang (admin)
app.post('/simpan-barang', (req, res) => {
  const { kode, nama, harga } = req.body;
  if (!kode || !nama || !harga) return res.status(400).json({ message: 'Data tidak lengkap' });

  let data = [];
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return res.status(500).json({ message: 'Gagal membaca file data' });
  }

  data.push({ kode, nama, harga: parseInt(harga) });

  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    res.json({ message: '✅ Barang disimpan!' });
  } catch {
    res.status(500).json({ message: '❌ Gagal simpan file' });
  }
});

// Ambil semua barang (transaksi)
app.get('/ambil-barang', (req, res) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    res.json(JSON.parse(content));
  } catch {
    res.status(500).json({ message: '❌ Gagal membaca data' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});
