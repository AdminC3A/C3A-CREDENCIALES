function generateCredential(name, position, company, qrCode, index) {
  const canvas = document.createElement("canvas");
  canvas.width = 600;
  canvas.height = 1000;
  const ctx = canvas.getContext("2d");

  // Fondo blanco
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Logo centrado arriba
  const logo = new Image();
  logo.src = "logo.png"; // Ruta del logo
  logo.onload = function () {
    ctx.drawImage(logo, canvas.width / 2 - 75, 30, 150, 150);

    // Texto del título centrado debajo del logo
    ctx.fillStyle = "#333";
    ctx.font = "bold 30px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Credencial de Acceso", canvas.width / 2, 200);

    // Marco negro con centro blanco para la foto
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000";
    ctx.strokeRect(225, 220, 150, 200);
    ctx.fillStyle = "#fff";
    ctx.fillRect(228, 223, 144, 194);

    // Texto centrado (nombre, puesto, empresa)
    ctx.fillStyle = "#333";
    ctx.font = "bold 20px Arial";
    ctx.fillText("Nombre:", canvas.width / 2, 450);
    ctx.font = "normal 18px Arial";
    ctx.fillText(name || "N/A", canvas.width / 2, 480);

    ctx.font = "bold 20px Arial";
    ctx.fillText("Puesto:", canvas.width / 2, 510);
    ctx.font = "normal 18px Arial";
    ctx.fillText(position || "N/A", canvas.width / 2, 540);

    ctx.font = "bold 20px Arial";
    ctx.fillText("Empresa:", canvas.width / 2, 570);
    ctx.font = "normal 18px Arial";
    ctx.fillText(company || "Elemento Arquitectura Interior", canvas.width / 2, 600);

    // Generar QR
    const qrCanvas = document.createElement("canvas");
    new QRCode(qrCanvas, {
      text: qrCode,
      width: 150,
      height: 150,
    });

    const qrImg = new Image();
    qrImg.src = qrCanvas.toDataURL("image/png");
    qrImg.onload = function () {
      ctx.drawImage(qrImg, canvas.width / 2 - 75, 700, 150, 150);

      // Descargar automáticamente
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `credencial_${index + 1}.png`;
      link.click();

      // Mostrar credencial generada en la página
      document.getElementById("output").appendChild(canvas); 
    };
  };

  logo.onerror = function () {
    console.error("Error al cargar el logo. Verifica la ruta.");
  };
}

// Ejemplo de uso:
// Suponiendo que tienes una función generarCodigoQR(nombre) que devuelve el código QR
const nombre = "Juan Pérez";
const puesto = "Supervisor";
const empresa = "Elemento Arquitectura Interior";
const qrCode = generarCodigoQR(nombre); 
generateCredential(nombre, puesto, empresa, qrCode, 0);
