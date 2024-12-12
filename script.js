// Escucha el botón para generar el QR automáticamente
const generarQRBtn = document.getElementById('generarQR');
const generarCredencialBtn = document.getElementById('generarUno');

// Generar QR constante basado en los datos
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

// Generar la credencial
generarCredencialBtn.addEventListener('click', () => {
    const nombre = document.getElementById('nombre').value.trim();
    const puesto = document.getElementById('puesto').value.trim();
    const empresa = document.getElementById('empresa').value.trim();
    const codigoQR = document.getElementById('codigoQR').value.trim();

    if (!nombre || !puesto || !empresa || !codigoQR) {
        alert('Por favor, completa todos los campos, incluido el Código QR.');
        return;
    }

    // Generar el canvas para la credencial
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');

    // Fondo blanco y borde negro
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = '#000';
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Añadir logo
    const logo = new Image();
    logo.src = 'logo.png'; // Coloca el archivo "logo.png" en tu directorio
    logo.onload = function () {
        ctx.drawImage(logo, 225, 30, 150, 150);

        // Título y cuadro negro vacío
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.font = 'bold 30px Arial';
        ctx.fillText('Credencial de Acceso', canvas.width / 2, 220);

        ctx.font = 'bold 24px Arial';
        ctx.fillText('CASA TRES AGUAS', canvas.width / 2, 260);

        // Dibujar cuadro negro como marco (sin relleno)
        ctx.strokeStyle = '#000'; // Borde negro
        ctx.lineWidth = 2; // Línea delgada
        ctx.strokeRect(200, 280, 200, 280); // Posición (x, y) y dimensiones (ancho, alto)

        // Nombre, puesto y empresa
        ctx.fillStyle = '#333';
        ctx.textAlign = 'left';
        ctx.font = '20px Arial';
        ctx.fillText(`Nombre: ${nombre}`, 60, 600);
        ctx.fillText(`Puesto: ${puesto}`, 60, 640);
        ctx.fillText(`Empresa: ${empresa}`, 60, 680);

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
            ctx.drawImage(qrImg, 225, 750, 150, 150);

            // Descargar credencial
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `Credencial-${codigoQR}.png`; // Nombre del archivo dinámico
            link.click();

            // Mostrar la credencial generada en pantalla
            const outputDiv = document.getElementById('output');
            outputDiv.innerHTML = ''; // Limpiar contenido anterior
            outputDiv.appendChild(canvas);
        };
    };
});
