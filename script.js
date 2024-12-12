// Función para generar el código QR
function generarCodigoQR(nombreCompleto) {
  // ... (tu código para generar el código QR)
  return qrCode; // Asegúrate de retornar el código QR generado
}

// Función para dibujar la credencial en un canvas
function dibujarCredencial(canvas, nombre, puesto, empresa, qrCode) {
  const ctx = canvas.getContext('2d');
  // ... (código para dibujar en el canvas)
}

// Función para generar una credencial
function generateCredential() {
  const nombre = document.getElementById("nombre").value;
  const puesto = document.getElementById("puesto").value;
  const empresa = document.getElementById("empresa").value;

  const qrCode = generarCodigoQR(nombre);

  const canvas = document.createElement('canvas');
  // ... (configurar el tamaño del canvas)
  dibujarCredencial(canvas, nombre, puesto, empresa, qrCode);

  // Descargar automáticamente la imagen
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `credencial_${nombre.replace(/\s+/g, '_')}.png`;
  link.click();

  // Mostrar credencial generada en la página
  document.getElementById("credentials-container").appendChild(canvas);
}
