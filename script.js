const generarCredencialBtn = document.getElementById('generarCredencial');

generarCredencialBtn.addEventListener('click', () => {
    // Obtener los valores de los campos del formulario
    const nombre = document.getElementById('nombre').value;
    const puesto = document.getElementById('puesto').value;
    const empresa = document.getElementById('empresa').value;
    const codigoQR = document.getElementById('codigoQR').value;

    // Construir el texto del código QR (puedes personalizar esto)
    const textoQR = `Nombre: ${nombre}\nPuesto: ${puesto}\nEmpresa: ${empresa}`;

    // Crear un elemento canvas para el código QR
    const qrCanvas = document.createElement('canvas');
    qrCanvas.id = 'qr-canvas';
    qrCanvas.width = 200; // Ajusta el tamaño del canvas según tus necesidades
    qrCanvas.height = 200;

    // Generar el código QR
    new QRCode(qrCanvas, {
        text: textoQR,
        width: qrCanvas.width,
        height: qrCanvas.height,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H // Nivel de corrección de errores
    });

    // Mostrar el canvas con el código QR
    const contenedorQR = document.getElementById('contenedor-qr');
    contenedorQR.innerHTML = ''; // Limpiar el contenedor antes de agregar el nuevo QR
    contenedorQR.appendChild(qrCanvas);

    // Opción para descargar el código QR
    const downloadLink = document.createElement('a');
    downloadLink.href = qrCanvas.toDataURL();
    downloadLink.download = 'codigoQR.png';
    downloadLink.textContent = 'Descargar QR';
    contenedorQR.appendChild(downloadLink);
});
