document.addEventListener('DOMContentLoaded', () => {
    const generarQRBtn = document.getElementById('generarQR');
    const imagenQRBtn = document.getElementById('imagenQR');
    const generarCredencialBtn = document.getElementById('generarUno');
    const qrPreviewDiv = document.getElementById('imagenQRPreview');
    const outputDiv = document.getElementById('output');

    let codigoQR = '';

    // Evento para generar el QR
    generarQRBtn.addEventListener('click', () => {
        const nombreCompleto = document.getElementById('nombre').value.trim();
        const puesto = document.getElementById('puesto').value.trim();
        const empresa = document.getElementById('empresa').value.trim();
        const codigoQRInput = document.getElementById('codigoQR');

        if (!nombreCompleto || !puesto || !empresa) {
            alert('Por favor, completa todos los campos: Nombre, Puesto y Empresa.');
            return;
        }

        // Generar el QR si el campo está vacío o no tiene 8 dígitos
        codigoQR = codigoQRInput.value.trim();
        if (!codigoQR || codigoQR.length !== 8) {
            const nombres = nombreCompleto.split(' ');
            const primerNombre = nombres[0] || '';
            const primerApellido = puesto.charAt(0) || '';
            const segundaLetra = empresa.charAt(0) || '';
            const codigoBase = `${primerNombre[0]}${primerApellido}${segundaLetra}`.toUpperCase();
            codigoQR = (codigoBase + primerNombre.charCodeAt(0).toString().padStart(3, '0')).padEnd(8, '0');
            codigoQRInput.value = codigoQR;
        }
    });

    // Evento para generar la imagen del QR
    imagenQRBtn.addEventListener('click', () => {
        if (!codigoQR) {
            alert('Por favor, genera el código QR primero.');
            return;
        }

        qrPreviewDiv.innerHTML = ''; // Limpiar previsualización
        const qrCanvas = document.createElement('canvas');
        new QRCode(qrCanvas, { text: codigoQR, width: 150, height: 150 });
        const qrImg = document.createElement('img');
        qrImg.src = qrCanvas.toDataURL('image/png');
        qrImg.alt = 'Imagen del QR';
        qrPreviewDiv.appendChild(qrImg); // Mostrar imagen del QR
    });

    // Evento para generar la credencial
    generarCredencialBtn.addEventListener('click', () => {
        if (!codigoQR) {
            alert('Por favor, genera y visualiza el QR primero.');
            return;
        }
        alert('Lógica para generar credencial...');
    });
});
