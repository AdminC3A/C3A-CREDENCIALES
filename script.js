document.getElementById('generateAll').addEventListener('click', function () {
    const fileInput = document.getElementById('excelFile');
    const company = document.getElementById('company').value;

    if (!fileInput.files.length || !company) {
        alert('Por favor, carga un archivo Excel y proporciona el nombre de la empresa.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (event) {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet);

        rows.forEach((row, index) => {
            const name = row['Nombre Completo'];
            const position = row['Puesto'];

            if (!name || !position) {
                console.warn(`Fila ${index + 1} incompleta, saltando...`);
                return;
            }

            const qrCode = generateQRCode(name, position, company);
            createCredential(name, position, company, qrCode, index + 1);
        });
    };

    reader.readAsArrayBuffer(file);
});

function generateQRCode(name, position, company) {
    const data = `${name}|${position}|${company}`;
    const canvas = document.createElement('canvas');
    const qr = new QRious({
        element: canvas,
        value: data,
        size: 100,
    });
    return canvas.toDataURL('image/png');
}

function createCredential(name, position, company, qrCode, index) {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    // Fondo blanco
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Logo
    const logo = new Image();
    logo.src = 'logo.png'; // Cambia a la ruta de tu logo
    logo.onload = function () {
        ctx.drawImage(logo, 30, 30, 150, 150);

        // Texto
        ctx.fillStyle = '#333';
        ctx.font = 'bold 40px Arial';
        ctx.fillText('Credencial de Acceso', 200, 70);
        ctx.font = '30px Arial';
        ctx.fillText(`Nombre: ${name}`, 200, 150);
        ctx.fillText(`Puesto: ${position}`, 200, 200);
        ctx.fillText(`Empresa: ${company}`, 200, 250);

        // QR Code
        const qrImg = new Image();
        qrImg.src = qrCode;
        qrImg.onload = function () {
            ctx.drawImage(qrImg, 750, 100, 200, 200);

            // Descargar
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `credencial_${index}.png`;
            link.click();
        };
    };
}
