// Escucha el botón para generar el QR automáticamente
const generarQRBtn = document.getElementById('generarQR');
const generarCredencialBtn = document.getElementById('generarUno');

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

    // Generar las primeras letras del código basado en el nombre, puesto y empresa
    const nombres = nombreCompleto.split(' ');
    const primerNombre = nombres[0] || ''; // Previene errores si no hay espacios
    const primerApellido = puesto.charAt(0) || ''; // Primera letra del puesto
    const segundaLetra = empresa.charAt(0) || ''; // Primera letra de la empresa

    // Validar que haya al menos una letra en el nombre
    if (!primerNombre) {
        alert('El campo "Nombre Completo" debe contener al menos una palabra.');
        return;
    }

    const primeraLetraNombre = primerNombre.charAt(0) || ''; // Primera letra del primer nombre
    const codigoBase = `${primeraLetraNombre}${primerApellido}${segundaLetra}`.toUpperCase();

    // Generar el código ASCII de la primera letra del nombre
    const codigoASCII = primeraLetraNombre.charCodeAt(0).toString();

    // Completar el código QR hasta 8 caracteres con ceros antes del código ASCII
    let codigoQRFinal = (codigoBase + codigoASCII.padStart(5, '0')).padEnd(8, '0').substring(0, 8);

    // Escribir el código QR generado en el campo QR opcional
    const codigoQRInput = document.getElementById('codigoQR');
    codigoQRInput.value = codigoQRFinal;

    alert('Código QR generado automáticamente. Puedes usarlo o editarlo manualmente.');
});

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
    canvas.width = 600;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');

    // Dibujar la credencial
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar borde negro
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Añadir logo
    const logo = new Image();
    logo.src = 'logo.png'; // Asegúrate de tener el logo en tu directorio
    logo.onload = function () {
        ctx.drawImage(logo, 225, 30, 150, 150);

        // Añadir textos
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';

        ctx.font = 'bold 30px Arial';
        ctx.fillText('Credencial de Acceso', canvas.width / 2, 220);
        ctx.font = 'bold 24px Arial';
        ctx.fillText('CASA TRES AGUAS', canvas.width / 2, 260);

        ctx.font = '20px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`Nombre: ${nombre}`, 50, 320);
        ctx.fillText(`Puesto: ${puesto}`, 50, 360);
        ctx.fillText(`Empresa: ${empresa}`, 50, 400);

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
            ctx.drawImage(qrImg, 225, 450, 150, 150);

            // Descargar credencial
            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `Credencial-${codigoQR}.png`; // Nombre dinámico del archivo
            link.click();

            // Mostrar la credencial generada en pantalla
            const outputDiv = document.getElementById('output');
            outputDiv.innerHTML = ''; // Limpiar contenido anterior
            outputDiv.appendChild(canvas);
        };
    };
});
