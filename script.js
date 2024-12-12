document.addEventListener("DOMContentLoaded", () => {
    const generarQRBtn = document.getElementById("generarQR");
    const generarCredencialBtn = document.getElementById("generarCredencial");
    const autorizarDescargarBtn = document.getElementById("autorizarDescargar");
    const qrContainer = document.getElementById("imagenQRPreview");
    const credencialCanvas = document.getElementById("credencialCanvas");
    let codigoQR = ""; // Variable global para almacenar el código QR

    // Botón 1: Generar QR
    generarQRBtn.addEventListener("click", () => {
        const nombre = document.getElementById("nombre").value.trim();
        const puesto = document.getElementById("puesto").value.trim();

        if (!nombre || !puesto) {
            alert("Por favor, completa los campos de Nombre y Puesto.");
            return;
        }

        // Generar las iniciales
        const palabrasNombre = nombre.split(" ");
        const inicialesNombre = palabrasNombre.map(palabra => palabra.charAt(0).toUpperCase()).join("");
        const inicialPuesto = puesto.charAt(0).toUpperCase();
        const iniciales = (inicialesNombre + inicialPuesto).substring(0, 3);

        // Calcular el código ASCII de la primera letra del nombre
        const codigoASCII = nombre.charCodeAt(0).toString();
        const totalLength = 8;
        const cerosNecesarios = totalLength - (iniciales.length + codigoASCII.length);

        // Construir el código QR
        codigoQR = `${iniciales}${"0".repeat(cerosNecesarios)}${codigoASCII}`;
        document.getElementById("codigoQR").value = codigoQR;

        // Generar el QR visual
        qrContainer.innerHTML = "";
        try {
            new QRCode(qrContainer, {
                text: codigoQR,
                width: 150,
                height: 150,
            });
        } catch (error) {
            console.error("Error al generar el QR:", error);
        }
    });

    // Botón 2: Generar Credencial
  generarCredencialBtn.addEventListener("click", () => {
    // Ajustar tamaño del canvas para el díptico abierto
    credencialCanvas.width = 874; // Ancho total (7.4 cm x 300 DPI)
    credencialCanvas.height = 2480; // Alto total (21 cm x 300 DPI)

    const ctx = credencialCanvas.getContext("2d");
    ctx.clearRect(0, 0, credencialCanvas.width, credencialCanvas.height); // Limpiar el canvas antes de dibujar

    const nombre = document.getElementById("nombre").value.trim();
    const puesto = document.getElementById("puesto").value.trim();
    const empresa = document.getElementById("empresa").value.trim();
    const nss = document.getElementById("nss").value.trim();
    const fechaNacimiento = document.getElementById("fechaNacimiento").value.trim();

    if (!nombre || !puesto || !empresa || !nss || !fechaNacimiento || !codigoQR) {
        alert("Por favor, completa todos los campos y genera el código QR.");
        return;
    }

    // Fondo blanco para todo el díptico
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, credencialCanvas.width, credencialCanvas.height);

    // Dibujar borde negro
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, credencialCanvas.width, credencialCanvas.height);

    // **Mitad izquierda**
    const leftX = 0; // Inicio de la mitad izquierda
    const leftWidth = 874; // Ancho de la mitad izquierda
    const leftHeight = 1240; // Altura de la mitad izquierda

    // Dibujar fondo blanco para la mitad izquierda
    ctx.fillStyle = "#fff";
    ctx.fillRect(leftX, 0, leftWidth, leftHeight);

    // Espacio para perforación manual
    ctx.fillStyle = "#fff";
    ctx.fillRect(leftX + 337, 20, 200, 20); // Ajustar posición según diseño

    // Dibujar logo
    const logo = new Image();
    logo.src = "logo.png"; // Ruta de tu logo
    logo.onload = () => {
        ctx.drawImage(logo, leftX + 250, 60, 350, 350); // Ajustar posición y tamaño del logo

        // Títulos
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.font = "bold 30px Arial";
        ctx.fillText("Credencial de Acceso", leftX + leftWidth / 2, 450);

        ctx.font = "bold 25px Arial";
        ctx.fillText("CASA TRES AGUAS", leftX + leftWidth / 2, 500);

        // Recuadro para la foto o espacio central
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ctx.strokeRect(leftX + 237, 550, 400, 400);

        // Información del usuario
        ctx.textAlign = "left";
        ctx.font = "20px Arial";
        ctx.fillText(`Nombre: ${nombre}`, leftX + 50, 1000);
        ctx.fillText(`Puesto: ${puesto}`, leftX + 50, 1050);
        ctx.fillText(`Empresa: ${empresa}`, leftX + 50, 1100);
        ctx.fillText(`NSS: ${nss}`, leftX + 50, 1150);
        ctx.fillText(`Fecha de Nacimiento: ${fechaNacimiento}`, leftX + 50, 1200);

        // Dibujar el QR
        const qrImage = new Image();
        qrImage.src = qrContainer.querySelector("img").src; // Usar el QR generado previamente
        qrImage.onload = () => {
            ctx.drawImage(qrImage, leftX + 262, 1300, 350, 350); // Ajustar posición y tamaño del QR
        };
    };

    // **Mitad derecha (en blanco por ahora)**
    const rightX = leftWidth; // Inicio de la mitad derecha
    ctx.fillStyle = "#fff";
    ctx.fillRect(rightX, 0, leftWidth, credencialCanvas.height); // Mantener en blanco
});

    // Botón 3: Autorizar y Descargar
    autorizarDescargarBtn.addEventListener("click", () => {
        const nombre = document.getElementById("nombre").value.trim();
        const puesto = document.getElementById("puesto").value.trim();
        const empresa = document.getElementById("empresa").value.trim();
        const nss = document.getElementById("nss").value.trim();
        const fechaNacimiento = document.getElementById("fechaNacimiento").value.trim();

        if (!nombre || !puesto || !empresa || !nss || !fechaNacimiento || !codigoQR) {
            alert("Por favor, completa todos los campos y genera el código QR.");
            return;
        }

        // Datos a enviar
        const data = {
            Nombre: nombre,
            Puesto: puesto,
            NSS: nss,
            FechaNacimiento: fechaNacimiento,
            Empresa: empresa,
            CodigoQR: codigoQR,
        };

        // Enviar a Google Sheets
        fetch("URL_DE_TU_WEB_APP", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
            .then(() => {
                const link = document.createElement("a");
                link.href = credencialCanvas.toDataURL("image/png");
                link.download = `Credencial-${codigoQR}.png`;
                link.click();
                alert("Credencial autorizada y descargada.");
            })
            .catch(error => console.error("Error:", error));
    });
});
