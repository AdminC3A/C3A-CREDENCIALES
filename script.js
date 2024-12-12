// Función para generar el código QR
function generarCodigoQR(nombreCompleto) {
  // ... (tu código para generar el código QR)
  return qrCode; // Asegúrate de retornar el código QR generado
}

// Función para generar una credencial
function generateCredential() {
  const nombre = document.getElementById("nombreInput").value;
  const puesto = document.getElementById("puestoInput").value;
  const empresa = document.getElementById("empresaInput").value;

  // Generar el código QR
  const qrCode = generarCodigoQR(nombre);

  // Resto del código para dibujar en el canvas...

  // Descargar automáticamente la imagen
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `credencial_${nombre.replace(/\s+/g, '_')}.png`;
  link.click();

  // Mostrar credencial generada en la página
  document.getElementById("credentials-container").appendChild(canvas);
}

// Asignar el evento click a un botón
const generarBoton = document.getElementById("generarBoton");
generarBoton.addEventListener("click", generateCredential);
