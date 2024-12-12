document.addEventListener("DOMContentLoaded", () => {
    const generarQRBtn = document.getElementById("generarQR");
    const generarCredencialBtn = document.getElementById("generarCredencial");
    const agregarFotoBtn = document.getElementById("agregarFoto");
    const autorizarDescargarBtn = document.getElementById("autorizarDescargar");
    const qrContainer = document.getElementById("imagenQRPreview");
    const credencialCanvas = document.getElementById("credencialCanvas");
    const imagenInput = document.createElement("input");
    imagenInput.type = "file";
    imagenInput.accept = "image/*";

    let imagenSeleccionada = null; // Variable para almacenar la imagen cargada

    // **Evento para generar el código QR**
    generarQRBtn.addEventListener("click", () => {
        const nombre = document.getElementById("nombre").value.trim();
        const puesto = document.getElementById("puesto").value.trim();

        if (!nombre || !puesto) {
            alert("Por favor, completa los campos de Nombre y Puesto.");
            return;
        }

        const palabrasNombre = nombre.split(" ");
        const inicialesNombre = palabrasNombre.map(palabra => palabra.charAt(0).toUpperCase()).join("");
        const inicialPuesto = puesto.charAt(0).toUpperCase();
        const iniciales = (inicialesNombre + inicialPuesto).substring(0, 3);

        const codigoASCII = nombre.charCodeAt(0).toString();
        const totalLength = 8;
        const cerosNecesarios = totalLength - (iniciales.length + codigoASCII.length);
        const codigoQR = `${iniciales}${"0".repeat(cerosNecesarios)}${codigoASCII}`;

        document.getElementById("codigoQR").value = codigoQR;
        qrContainer.innerHTML = "";

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

    // **Evento para agregar la foto**
    agregarFotoBtn.addEventListener("click", () => {
        imagenInput.click(); // Abrir el selector de archivos
    });

    imagenInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    imagenSeleccionada = img;
                    alert("Imagen cargada correctamente.");
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // **Evento para generar la credencial**
    generarCredencialBtn.addEventListener("click", () => {
        credencialCanvas.width = 874;
        credencialCanvas.height = 2480;

        const ctx = credencialCanvas.getContext("2d");
        ctx.clearRect(0, 0, credencialCanvas.width, credencialCanvas.height);

        const nombre = document.getElementById("nombre").value.trim();
        const puesto = document.getElementById("puesto").value.trim();
        const empresa = document.getElementById("empresa").value.trim();
        const nss = document.getElementById("nss").value.trim();
        const fechaNacimiento = document.getElementById("fechaNacimiento").value.trim();
        const codigoQR = document.getElementById("codigoQR").value.trim();

        if (!nombre || !puesto || !empresa || !nss || !fechaNacimiento || !codigoQR) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, credencialCanvas.width, credencialCanvas.height);

        const logo = new Image();
        logo.src = "logo.png";
        logo.onload = () => {
            ctx.drawImage(logo, 237, 60, 400, 400);

            ctx.fillStyle = "#000";
            ctx.textAlign = "center";
            ctx.font = "bold 30px Arial";
            ctx.fillText("Credencial de Acceso", credencialCanvas.width / 2, 500);
            ctx.fillText("CASA TRES AGUAS", credencialCanvas.width / 2, 550);

            if (imagenSeleccionada) {
                ctx.drawImage(imagenSeleccionada, 237, 600, 400, 400);
            } else {
                ctx.strokeStyle = "#000";
                ctx.lineWidth = 2;
                ctx.strokeRect(237, 600, 400, 400);
            }

            ctx.textAlign = "left";
            ctx.font = "20px Arial";
            ctx.fillText(`Nombre: ${nombre}`, 50, 1050);
            ctx.fillText(`Puesto: ${puesto}`, 50, 1100);
            ctx.fillText(`Empresa: ${empresa}`, 50, 1150);
            ctx.fillText(`NSS: ${nss}`, 50, 1200);
            ctx.fillText(`Fecha de Nacimiento: ${fechaNacimiento}`, 50, 1250);

            const qrImage = new Image();
            qrImage.src = qrContainer.querySelector("img").src;
            qrImage.onload = () => {
                ctx.drawImage(qrImage, 237, 1350, 400, 400);
            };
        };
    });

    autorizarDescargarBtn.addEventListener("click", () => {
        const link = document.createElement("a");
        link.href = credencialCanvas.toDataURL("image/png");
        link.download = `Credencial-${document.getElementById("codigoQR").value}.png`;
        link.click();
    });
});
