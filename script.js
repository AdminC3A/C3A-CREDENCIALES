// Función para dibujar la credencial en un canvas
function dibujarCredencial(canvas, nombre, puesto, empresa, qrCode) {
  const ctx = canvas.getContext('2d');
  // ... (tu código para dibujar en el canvas, adaptando las coordenadas y estilos a tu diseño)

  // Agregar el código QR a la imagen (asumiendo que qrCode es una URL de imagen)
  const qrImage = new Image();
  qrImage.src = qrCode;
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

  // Validar que se haya proporcionado un código QR
  if (!codigoQR) {
    alert("Por favor, ingresa un código QR válido.");
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 500; // Ajusta el tamaño según tu diseño
  canvas.height = 700;
  dibujarCredencial(canvas, nombre, puesto, empresa, codigoQR);

  // Descargar automáticamente la imagen
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `credencial_${nombre.replace(/\s+/g, '_')}.png`;
  link.click();

  // Mostrar credencial generada en la página
  document.getElementById("credentials-container").appendChild(canvas);
}
