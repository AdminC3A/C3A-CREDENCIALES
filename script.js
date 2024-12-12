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
        const ctx = credencialCanvas.getContext("2d");
        ctx.clearRect(0, 0, credencialCanvas.width, credencialCanvas.height);

        const nombre = document.getElementById("nombre").value.trim();
        const puesto = document.getElementById("puesto").value.trim();
        const empresa = document.getElementById("empresa").value.trim();
        const nss = document.getElementById("nss").value.trim();
        const fechaNacimiento = document.getElementById("fechaNacimiento").value.trim();

        if (!nombre || !puesto || !empresa || !nss || !fechaNacimiento || !codigoQR) {
            alert("Por favor, completa todos los campos y genera el código QR.");
            return;
        }

        // Dibujar la credencial
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, credencialCanvas.width, credencialCanvas.height);
        ctx.fillStyle = "#000";
        ctx.font = "20px Arial";
        ctx.fillText(`Nombre: ${nombre}`, 20, 50);
        ctx.fillText(`Puesto: ${puesto}`, 20, 100);
        ctx.fillText(`Empresa: ${empresa}`, 20, 150);
        ctx.fillText(`NSS: ${nss}`, 20, 200);
        ctx.fillText(`Fecha de Nacimiento: ${fechaNacimiento}`, 20, 250);
        ctx.fillText(`Código QR: ${codigoQR}`, 20, 300);
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
