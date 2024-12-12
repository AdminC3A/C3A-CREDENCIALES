document.addEventListener("DOMContentLoaded", () => {
    const generarQRBtn = document.getElementById("generarQR");
    const qrContainer = document.getElementById("imagenQRPreview");

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

        // Limitar las iniciales a un máximo de 3 caracteres
        const iniciales = (inicialesNombre + inicialPuesto).substring(0, 3);

        // Calcular el código ASCII de la primera letra del nombre
        const codigoASCII = nombre.charCodeAt(0).toString(); // Código ASCII como cadena

        // Calcular el número de ceros necesarios
        const totalLength = 8;
        const cerosNecesarios = totalLength - (iniciales.length + codigoASCII.length);

        // Construir el código QR
        const codigoQR = `${iniciales}${"0".repeat(cerosNecesarios)}${codigoASCII}`;

        // Mostrar el QR generado en el campo correspondiente
        document.getElementById("codigoQR").value = codigoQR;

        // Generar el QR visual
        qrContainer.innerHTML = ""; // Limpiar el contenedor anterior
        try {
            new QRCode(qrContainer, {
                text: codigoQR,
                width: 150,
                height: 150,
            });
            console.log(`Código QR generado: ${codigoQR}`);
        } catch (error) {
            console.error("Error al generar el QR:", error);
        }
    });
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

        if (!nombre || !puesto || !empresa || !nss || !fechaNacimiento) {
            alert("Por favor, completa todos los campos.");
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

        console.log("Credencial generada.");
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

        // Datos a enviar a Google Sheets
        const data = {
            Nombre: nombre,
            Puesto: puesto,
            NSS: nss,
            FechaNacimiento: fechaNacimiento,
            Empresa: empresa,
            CodigoQR: codigoQR,
        };

        // Enviar a Google Sheets
        fetch("URL_DE_TU_HOJA_DE_CALCULO", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(result => {
                console.log("Datos enviados a Google Sheets:", result);
                alert("Datos enviados y credencial descargada.");
            })
            .catch(error => {
                console.error("Error al enviar los datos:", error);
            });

        // Descargar credencial
        const link = document.createElement("a");
        link.href = credencialCanvas.toDataURL("image/png");
        link.download = `Credencial-${codigoQR}.png`;
        link.click();
    });
});
