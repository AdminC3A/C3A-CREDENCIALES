// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    const generarCredencialBtn = document.getElementById('generarUno');
    const outputDiv = document.getElementById('output');

    // Evento para generar la credencial y el QR
    generarCredencialBtn.addEventListener('click', () => {
        const nombre = document.getElementById('nombre').value.trim();
        const puesto = document.getElementById('puesto').value.trim();
        const empresa = document.getElementById('empresa').value.trim();
        const codigoQRInput = document.getElementById('codigoQR');

        if (!nombre || !puesto || !empresa) {
            alert('Por favor, completa todos los campos: Nombre, Puesto y Empresa.');
            return;
        }

        // Generar el código QR si el campo está vacío o no tiene 8 dígitos
        let codigoQR = codigoQRInput.value.trim();
        if (!codigoQR || codigoQR.length !== 8) {
            const nombres = nombre.split(' ');
            const primerNombre = nombres[0] || '';
            const primerApellido = puesto.charAt(0) || '';
            const segundaLetra = empresa.charAt(0) || '';

            const primeraLetraNombre = primerNombre.charAt(0) || '';
            const codigoBase = `${primeraLetraNombre}${primerApellido}${segundaLetra}`.toUpperCase();
            const codigoASCII = primeraLetraNombre.charCodeAt(0).toString();
            codigoQR = (codigoBase + codigoASCII.padStart(3, '0')).padEnd(8, '0').substring(0, 8);

            // Actualizar el campo QR con el código generado
            codigoQRInput.value = codigoQR;
        }

        // Generar la imagen del QR y mostrarla junto al formulario
        outputDiv.innerHTML = ''; // Limpiar contenido previo
        const qrCanvas = document.createElement('canvas');
        new QRCode(qrCanvas, { text: codigoQR, width: 150, height: 150 });
        const qrImg = document.createElement('img');
        qrImg.src = qrCanvas.toDataURL('image/png');
        qrImg.alt = 'Código QR Generado';
        qrImg.style.marginTop = '20px';
        outputDiv.appendChild(qrImg); // Mostrar la imagen del QR

        // Crear la credencial con el QR
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 1000;
        const ctx = canvas.getContext('2d');

        // Dibujar la credencial
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
            ctx.fillText(`Nombre: ${nombre}`, 60, 600);
            ctx.fillText(`Puesto: ${puesto}`, 60, 640);
            ctx.fillText(`Empresa: ${empresa}`, 60, 680);

            // Dibujar el código QR en la credencial
            const qrImgForCanvas = new Image();
            qrImgForCanvas.src = qrCanvas.toDataURL('image/png');
            qrImgForCanvas.onload = function () {
                ctx.drawImage(qrImgForCanvas, canvas.width / 2 - 75, 750, 150, 150);

                // Descargar la credencial como imagen
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = `Credencial-${codigoQR}.png`;
                link.click();

                outputDiv.appendChild(canvas); // Mostrar la credencial generada
            };
        };
    });
});
