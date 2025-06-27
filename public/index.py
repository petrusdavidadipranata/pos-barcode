<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>QR Code Scanner with Popup</title>

  <!-- Bootstrap 5 CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">

  <script src="https://unpkg.com/html5-qrcode"></script>

  <style>
    body { font-family: Arial, sans-serif; padding: 20px; }
    #reader { width: 320px; margin: 20px auto; }
  </style>
</head>
<body>

  <div class="container text-center">
    <h2 class="mb-4">📷 QR Code Scanner</h2>

    <!-- Tempat scan kamera -->
    <div id="reader"></div>

    <!-- Popup hasil QR -->
    <div id="qr-popup" class="alert alert-success alert-dismissible fade show mt-4 d-none" role="alert">
      <strong>Hasil QR:</strong> <span id="qr-result"></span>
      <button type="button" class="btn-close" onclick="hidePopup()" aria-label="Close"></button>
    </div>
  </div>

  <!-- Bootstrap 5 JS (opsional untuk dismiss button) -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

  <script>
    // Fungsi tampilkan popup
    function showPopup(text) {
      const popup = document.getElementById('qr-popup');
      const result = document.getElementById('qr-result');
      result.textContent = text;
      popup.classList.remove('d-none');

      // Sembunyikan popup otomatis setelah 5 detik
      setTimeout(() => {
        popup.classList.add('d-none');
      }, 5000);
    }

    // Fungsi tutup popup manual
    function hidePopup() {
      document.getElementById('qr-popup').classList.add('d-none');
    }

    // Saat berhasil scan
    function onScanSuccess(decodedText) {
      showPopup(decodedText);

      // Kirim ke server jika mau
      fetch('/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: decodedText })
      }).catch(console.error);
    }

    // Mulai scanner
    const html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start(
      { facingMode: "environment" },  // kamera belakang
      { fps: 10, qrbox: 250 },
      onScanSuccess
    );
  </script>
</body>
</html>
