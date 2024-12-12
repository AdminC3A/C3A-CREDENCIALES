const form = document.getElementById("credential-form");
const canvas = document.getElementById("credential");
const ctx = canvas.getContext("2d");
const credentialContainer = document.getElementById("credential-container");
const downloadButton = document.getElementById("download");

// Ruta del logotipo
const logoSrc = "./Logo Elemento .png";

form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Obtener datos
    const name = document.getElementById("name").value.trim();
    const position = document.getElementById("position").value.trim();

    // Generar QR
    const qrData = `${name}_${position}`;
    generateQRCode(qrData, (qrImage) => {
        drawCredential(name, position, qrImage);
    });

    // Mostrar credencial
    credentialContainer.style.display = "block";
});

function drawCredential(name, position, qrImage) {
    const cardWidth = canvas.width;
    const cardHeight = canvas.height;

    // Fondo
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, cardWidth, cardHeight);

    // Dibujar logotipo
    const logo = new Image();
    logo.src = logoSrc;
    logo.onload = () => {
        const logoWidth = 150;
        const logoHeight = 75;
        ctx.drawImage(logo, (cardWidth - logoWidth) / 2, 20, logoWidth, logoHeight);

        // Encabezado
        ctx.fillStyle = "#333";
        ctx.font = "bold 18px Arial";
        ctx.textAlign = "center";
        ctx.fillText("CASA TRES AGUAS", cardWidth / 2, 120);

        // Nombre y Puesto
        ctx.font = "16px Arial";
        ctx.fillText(name.toUpperCase(), cardWidth / 2, 160);
        ctx.fillText(position, cardWidth / 2, 190);

        // Dibujar QR
        const qrSize = 150;
        ctx.drawImage(qrImage, (cardWidth - qrSize) / 2, 220, qrSize, qrSize);

        // Pie de página
        ctx.font = "12px Arial";
        ctx.fillStyle = "#333";
        ctx.fillText("Elemento Arquitectura Interior", cardWidth / 2, cardHeight - 30);
    };
}

// Generar código QR
function generateQRCode(data, callback) {
    const qrCanvas = document.createElement("canvas");
    QRCode.toCanvas(qrCanvas, data, { width: 150, height: 150 }, (error) => {
        if (error) console.error(error);
        const qrImage = new Image();
        qrImage.src = qrCanvas.toDataURL();
        qrImage.onload = () => callback(qrImage);
    });
}

// Descargar credencial
downloadButton.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = "credencial.png";
    link.href = canvas.toDataURL();
    link.click();
});
