// Escucha el botón para generar el QR automáticamente
const generarQRBtn = document.getElementById('generarQR');

generarQRBtn.addEventListener('click', () => {
    // Obtener los valores de los campos del formulario
    const nombreCompleto = document.getElementById('nombre').value.trim();
    const puesto = document.getElementById('puesto').value.trim();
    const empresa = document.getElementById('empresa').value.trim();

    // Validar que los campos requeridos estén completos
    if (!nombreCompleto || !puesto || !empresa) {
        alert('Por favor, completa todos los campos: Nombre, Puesto y Empresa.');
        return;
    }

    // Generar el código QR basado en los valores ingresados
    const nombres = nombreCompleto.split(' ');
    const primerNombre = nombres[0] || ''; // Previene errores si no hay espacios
    const primeraLetraNombre = primerNombre.charAt(0) || ''; // Previene errores si está vacío

    // Validar que haya al menos una letra en el nombre
    if (!primeraLetraNombre) {
        alert('El campo "Nombre Completo" debe contener al menos una palabra.');
        return;
    }

    const codigoASCII = primeraLetraNombre.charCodeAt(0).toString();
    const textoQR = primeraLetraNombre + puesto.charAt(0);
    const codigoQRFinal = textoQR.padEnd(2, 'X') + codigoASCII.padStart(10, '0');

    // Escribir el código QR generado en el campo QR opcional
    const codigoQRInput = document.getElementById('codigoQR');
    codigoQRInput.value = codigoQRFinal;

    // Mensaje opcional para el usuario
    alert('Código QR generado automáticamente. Puedes usarlo o editarlo manualmente.');
});

// Escucha el botón para generar la credencial
const generarCredencialBtn = document.getElementById('generarUno');

generarCredencialBtn.addEventListener('click', () => {
    // Obtener los valores del formulario
    const nombre = document.getElementById('nombre').value.trim();
    const puesto = document.getElementById('puesto').value.trim();
    const empresa = document.getElementById('empresa').value.trim();
    const codigoQR = document.getElementById('codigoQR').value.trim();

    // Validar que todos los campos estén completos
    if (!nombre || !puesto || !empresa || !codigoQR) {
        alert('Por favor, completa todos los campos, incluido el Código QR.');
        return;
    }

    // Generar y mostrar la credencial
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    // Dibujar la credencial
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#333';
    ctx.font = 'bold 40px Arial';
    ctx.fillText('Credencial de Acceso', 30, 50);
    ctx.font = '30px Arial';
    ctx.fillText(`Nombre: ${nombre}`, 30, 100);
    ctx.fillText(`Puesto: ${puesto}`, 30, 150);
    ctx.fillText(`Empresa: ${empresa}`, 30, 200);

    // Generar QR y dibujarlo
    const qrCanvas = document.createElement('canvas');
    new QRCode(qrCanvas, {
        text: codigoQR,
        width: 150,
        height: 150,
    });
    const qrImg = new Image();
    qrImg.src = qrCanvas.toDataURL('image/png');
    qrImg.onload = function () {
        ctx.drawImage(qrImg, 800, 50, 150, 150);

        // Descargar credencial
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'credencial.png';
        link.click();
    };
});
