// Función para dibujar la credencial en un canvas
function dibujarCredencial(canvas, nombre, puesto, empresa, qrCanvas) {
    const ctx = canvas.getContext('2d');
    // ... (tu código para dibujar en el canvas, adaptando las coordenadas y estilos a tu diseño)

    // Obtener la imagen del código QR desde el canvas generado
    const qrImage = new Image();
    qrImage.src = qrCanvas.toDataURL();
    qrImage.onload = () => {
        ctx.drawImage(qrImage, 100, 300); // Ajusta las coordenadas según tu diseño
    };
}

// Función para generar una credencial
function generateCredential() {
    const nombre = document.getElementById("nombre").value;
    const puesto = document.getElementById("puesto").value;
    const empresa = document.getElementById("empresa").value;
    const codigoQR = document.getElementById("codigoQR").value;

    // Validación para asegurarte de que el usuario haya ingresado un valor para el código QR
    if (!codigoQR) {
        alert("Por favor, ingresa un valor para el código QR.");
        return;
    }

    // Crear un elemento canvas para dibujar el código QR
    const qrCanvas = document.createElement('canvas');
    qrCanvas.id = 'qr-canvas';
    document.body.appendChild(qrCanvas);

    // Utilizar la biblioteca qrcode.js para generar el código QR
    new QRCode(document.getElementById('qr-canvas'), {
        text: codigoQR,
        width: 128,
        height: 128,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });

    // Crear el canvas de la credencial y dibujarla
    const canvas = document.createElement('canvas');
    canvas.width = 500;
    canvas.height = 700;
    dibujarCredencial(canvas, nombre, puesto, empresa, qrCanvas);

    // Descargar automáticamente la imagen
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `credencial_${nombre.replace(/\s+/g, '_')}.png`;
    link.click();

    // Mostrar credencial generada en la página (opcional)
    document.getElementById("credentials-container").appendChild(canvas);
}

// Ejecutar la función al hacer clic en un botón (por ejemplo)
document.getElementById("generarCredencialButton").addEventListener("click", generateCredential);
