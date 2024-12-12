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
            const primerApellido = nombres[1] || '';
            const primeraLetraEmpresa = empresa.charAt(0) || '';

            // Tomar las iniciales y el código ASCII de la primera letra del nombre
            const iniciales = `${primerNombre.charAt(0)}${primerApellido.charAt(0)}${primeraLetraEmpresa}`.toUpperCase();
            const codigoASCII = primerNombre.charCodeAt(0).toString(); // ASCII de la primera letra

            // Generar el QR con las iniciales, ASCII y ceros a la izquierda
            codigoQR = (iniciales + codigoASCII).padStart(8, '0');

            // Actualizar el campo QR con el código generado
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
        if (!qrPreviewDiv.querySelector('img')) {
            alert('Por favor, genera y visualiza el QR primero.');
            return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 1000;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 5;
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

        const logo = new Image();
        logo.src = 'logo.png'; // Asegúrate de que el logo esté en el directorio
        logo.onload = function () {
            ctx.drawImage(logo, 225, 30, 150, 150);

            ctx.fillStyle = '#333';
            ctx.textAlign = 'center';
            ctx.font = 'bold 30px Arial';
            ctx.fillText('Credencial de Acceso', canvas.width / 2, 220);
            ctx.font = 'bold 24px Arial';
            ctx.fillText('CASA TRES AGUAS', canvas.width / 2, 260);

            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(200, 280, 200, 280);

            ctx.fillStyle = '#333';
            ctx.textAlign = 'left';
            ctx.font = '20px Arial';
            ctx.fillText(`Nombre: ${document.getElementById('nombre').value}`, 60, 600);
            ctx.fillText(`Puesto: ${document.getElementById('puesto').value}`, 60, 640);
            ctx.fillText(`Empresa: ${document.getElementById('empresa').value}`, 60, 680);

            const qrImgForCanvas = new Image();
            qrImgForCanvas.src = qrPreviewDiv.querySelector('img').src; // Obtener el QR generado
            qrImgForCanvas.onload = function () {
                ctx.drawImage(qrImgForCanvas, canvas.width / 2 - 75, 750, 150, 150);

                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = `Credencial-${codigoQR}.png`;
                link.click();

                alert('Credencial generada y descargada correctamente.');
            };
        };
    });
});
