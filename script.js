// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    const generarQRBtn = document.getElementById('generarQR');
    const generarCredencialBtn = document.getElementById('generarUno');

    // Verificar si los botones existen
    if (!generarQRBtn || !generarCredencialBtn) {
        console.error('Error: No se encontraron los botones necesarios en el DOM.');
        return;
    }

    // Evento para generar el QR
    generarQRBtn.addEventListener('click', () => {
        const nombreCompleto = document.getElementById('nombre').value.trim();
        const puesto = document.getElementById('puesto').value.trim();
        const empresa = document.getElementById('empresa').value.trim();

        if (!nombreCompleto || !puesto || !empresa) {
            alert('Por favor, completa todos los campos: Nombre, Puesto y Empresa.');
            return;
        }

        const nombres = nombreCompleto.split(' ');
        const primerNombre = nombres[0] || '';
        const primerApellido = puesto.charAt(0) || '';
        const segundaLetra = empresa.charAt(0) || '';

        const primeraLetraNombre = primerNombre.charAt(0) || '';
        const codigoBase = `${primeraLetraNombre}${primerApellido}${segundaLetra}`.toUpperCase();
        const codigoASCII = primeraLetraNombre.charCodeAt(0).toString();
        let codigoQRFinal = (codigoBase + codigoASCII.padStart(3, '0')).padEnd(8, '0').substring(0, 8);

        const codigoQRInput = document.getElementById('codigoQR');
        codigoQRInput.value = codigoQRFinal;

        alert('Código QR generado automáticamente. Puedes usarlo o editarlo manualmente.');
    });

    // Evento para generar la credencial
    generarCredencialBtn.addEventListener('click', () => {
        const nombre = document.getElementById('nombre').value.trim();
        const puesto = document.getElementById('puesto').value.trim();
        const empresa = document.getElementById('empresa').value.trim();
        const codigoQR = document.getElementById('codigoQR').value.trim();

        if (!nombre || !puesto || !empresa || !codigoQR) {
            alert('Por favor, completa todos los campos, incluido el Código QR.');
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
        logo.src = 'logo.png'; // Asegúrate de tener el logo en tu directorio
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

            const qrCanvas = document.createElement('canvas');
            new QRCode(qrCanvas, { text: codigoQR, width: 150, height: 150 });

            const qrImg = new Image();
            qrImg.src = qrCanvas.toDataURL('image/png');
            qrImg.onload = function () {
                ctx.drawImage(qrImg, canvas.width / 2 - 75, 750, 150, 150);

                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = `Credencial-${codigoQR}.png`;
                link.click();

                const outputDiv = document.getElementById('output');
                outputDiv.innerHTML = '';
                outputDiv.appendChild(canvas);
            };
        };
    });
});
