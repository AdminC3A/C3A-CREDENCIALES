// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    // Selección de elementos del DOM
    const generarQRBtn = document.getElementById("generarQR");
    const generarCredencialBtn = document.getElementById("generarCredencial");
    const cargarFotoArchivoBtn = document.getElementById("cargarFotoArchivo");
    const cargarFotoCamaraBtn = document.getElementById("cargarFotoCamara");
    const autorizarDescargarBtn = document.getElementById("autorizarDescargar");
    const qrContainer = document.getElementById("qrCanvas"); // Contenedor del QR
    const fotoContainer = document.getElementById("fotoCanvas"); // Contenedor de la foto cargada
    const credencialCanvas = document.getElementById("credencialCanvas"); // Canvas para la credencial

    let imagenSeleccionada = null; // Almacenar imagen cargada/capturada

    /**
     * Módulo 1: Generar Código QR
     */
    generarQRBtn.addEventListener("click", () => {
        const nombre = document.getElementById("nombre").value.trim();
        const puesto = document.getElementById("puesto").value.trim();

        if (!nombre || !puesto) {
            alert("Por favor, completa los campos de Nombre y Puesto.");
            return;
        }

        // Generar el código QR
        const palabrasNombre = nombre.split(" ");
        const inicialesNombre = palabrasNombre.map(palabra => palabra.charAt(0).toUpperCase()).join("");
        const inicialPuesto = puesto.charAt(0).toUpperCase();
        const iniciales = (inicialesNombre + inicialPuesto).substring(0, 3);
        const codigoASCII = nombre.charCodeAt(0).toString();
        const totalLength = 8;
        const cerosNecesarios = totalLength - (iniciales.length + codigoASCII.length);
        const codigoQR = `${iniciales}${"0".repeat(cerosNecesarios)}${codigoASCII}`;

        document.getElementById("codigoQR").value = codigoQR;
        qrContainer.innerHTML = ""; // Limpiar QR anterior

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

    /**
     * Módulo 2: Cargar foto desde archivo
     */
    cargarFotoArchivoBtn.addEventListener("click", () => {
        const imagenInput = document.createElement("input");
        imagenInput.type = "file";
        imagenInput.accept = "image/*";
        imagenInput.click();

        imagenInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        imagenSeleccionada = img; // Guardar la imagen
                        const ctxFoto = fotoContainer.getContext("2d");
                        ctxFoto.clearRect(0, 0, fotoContainer.width, fotoContainer.height);
                        ctxFoto.beginPath();
                        ctxFoto.arc(75, 75, 75, 0, Math.PI * 2, true); // Círculo
                        ctxFoto.closePath();
                        ctxFoto.clip();
                        ctxFoto.drawImage(img, 0, 0, 150, 150); // Dibujar previsualización circular
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    });

    /**
     * Módulo 3: Cargar foto desde cámara
     */
    cargarFotoCamaraBtn.addEventListener("click", () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                const video = document.createElement("video");
                video.srcObject = stream;
                video.play();

                const captureButton = document.createElement("button");
                captureButton.textContent = "Capturar";
                document.body.append(video, captureButton);

                captureButton.addEventListener("click", () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = 150;
                    canvas.height = 150;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const img = new Image();
                    img.onload = () => {
                        imagenSeleccionada = img;
                        const ctxFoto = fotoContainer.getContext("2d");
                        ctxFoto.clearRect(0, 0, fotoContainer.width, fotoContainer.height);
                        ctxFoto.beginPath();
                        ctxFoto.arc(75, 75, 75, 0, Math.PI * 2, true); // Círculo
                        ctxFoto.closePath();
                        ctxFoto.clip();
                        ctxFoto.drawImage(img, 0, 0, 150, 150); // Dibujar previsualización circular
                    };
                    img.src = canvas.toDataURL();
                    stream.getTracks().forEach(track => track.stop()); // Detener cámara
                    video.remove();
                    captureButton.remove();
                });
            })
            .catch((error) => console.error("Error al acceder a la cámara:", error));
    });

   // Módulo 4: Generar la credencial
generarCredencialBtn.addEventListener("click", () => {
    // Tamaño del canvas ajustado a 7.4 cm x 10.5 cm (744 x 1050 px)
    credencialCanvas.width = 744;
    credencialCanvas.height = 1050;

    const ctx = credencialCanvas.getContext("2d");
    ctx.clearRect(0, 0, credencialCanvas.width, credencialCanvas.height);

    // Capturar datos del formulario
    const nombre = document.getElementById("nombre").value.trim();
    const puesto = document.getElementById("puesto").value.trim();
    const empresa = document.getElementById("empresa").value.trim();
    const codigoQR = document.getElementById("codigoQR").value.trim();

    if (!nombre || !puesto || !empresa || !codigoQR) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    // Fondo blanco para la credencial
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, credencialCanvas.width, credencialCanvas.height);

    // Dibujar el logo (2x2 cm -> 200x200 px)
    const logo = new Image();
    logo.src = "logo.png"; // Asegúrate de que el logo esté en el directorio correcto
    logo.onload = () => {
        ctx.drawImage(logo, 272, 20, 200, 200); // Centrado horizontalmente (744 - 200)/2 = 272

        // Dibujar la foto (2x2 cm -> 200x200 px)
        if (imagenSeleccionada) {
            ctx.drawImage(imagenSeleccionada, 272, 250, 200, 200); // Centrado horizontalmente
        } else {
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 2;
            ctx.strokeRect(272, 250, 200, 200); // Cuadro vacío para la foto
        }

        // Dibujar los datos personales (centrados)
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.font = "20px Arial";
        ctx.fillText(`Nombre: ${nombre}`, credencialCanvas.width / 2, 500);
        ctx.fillText(`Puesto: ${puesto}`, credencialCanvas.width / 2, 530);
        ctx.fillText(`Empresa: ${empresa}`, credencialCanvas.width / 2, 560);

        // Dibujar el QR (3x3 cm -> 300x300 px)
        const qrImage = new Image();
        qrImage.src = qrContainer.querySelector("img")?.src || "";
        qrImage.onload = () => {
            ctx.drawImage(qrImage, 222, 600, 300, 300); // Centrado horizontalmente (744 - 300)/2 = 222
            console.log("Credencial generada correctamente.");
        };

        qrImage.onerror = () => {
            console.warn("No se pudo cargar el QR en la credencial.");
        };
    };
});

    /**
     * Módulo 5: Descargar la credencial
     */
    autorizarDescargarBtn.addEventListener("click", () => {
        const link = document.createElement("a");
        link.href = credencialCanvas.toDataURL("image/png");
        link.download = `Credencial-${document.getElementById("codigoQR").value}.png`;
        link.click();
    });
});
/**
 * Módulo 6: Generar Parte Trasera de la Credencial
 * Este módulo genera la parte trasera con el formato ajustado.
 */
function generarParteTrasera() {
    const parteTraseraCanvas = document.createElement("canvas");
    parteTraseraCanvas.width = 744; // Tamaño ajustado a 7.4 cm
    parteTraseraCanvas.height = 1050; // Tamaño ajustado a 10.5 cm
    const ctx = parteTraseraCanvas.getContext("2d");

    ctx.clearRect(0, 0, parteTraseraCanvas.width, parteTraseraCanvas.height);

    // Fondo blanco
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, parteTraseraCanvas.width, parteTraseraCanvas.height);

    // Texto de advertencia
    ctx.fillStyle = "#000";
    ctx.font = "18px Arial";
    ctx.textAlign = "center";
    ctx.fillText(
        "El Gafete de seguridad deberá portarse todo el tiempo",
        parteTraseraCanvas.width / 2,
        100
    );
    ctx.fillText(
        "y de manera visible durante el tiempo que se permanezca en obra.",
        parteTraseraCanvas.width / 2,
        130
    );
    ctx.fillText(
        "En caso de incumplimiento, la persona será expulsada y se tomarán las",
        parteTraseraCanvas.width / 2,
        160
    );
    ctx.fillText(
        "medidas disciplinarias necesarias.",
        parteTraseraCanvas.width / 2,
        190
    );

    // No. IMSS
    ctx.textAlign = "center";
    ctx.font = "20px Arial";
    const numeroIMSS = "No. IMSS: 2296790174-9"; // Ajustar el número IMSS
    ctx.fillText(numeroIMSS, parteTraseraCanvas.width / 2, 250);

    // Línea de firma
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, 700);
    ctx.lineTo(parteTraseraCanvas.width - 100, 700);
    ctx.stroke();

    // Texto de firma
    ctx.font = "18px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Firma del Portador", parteTraseraCanvas.width / 2, 730);

    // Segunda línea de firma
    ctx.beginPath();
    ctx.moveTo(100, 770);
    ctx.lineTo(parteTraseraCanvas.width - 100, 770);
    ctx.stroke();

    ctx.fillText("Supervisión HSE BPD", parteTraseraCanvas.width / 2, 800);

    // Válidos
    const validoDesde = "Válido desde: 12/12/2024";
    const validoHasta = "Válido hasta: 12/6/2025";
    ctx.font = "16px Arial";
    ctx.textAlign = "left";
    ctx.fillText(validoDesde, 50, parteTraseraCanvas.height - 80);
    ctx.fillText(validoHasta, 50, parteTraseraCanvas.height - 50);

    // Descargar parte trasera
    const link = document.createElement("a");
    link.href = parteTraseraCanvas.toDataURL("image/png");
    link.download = "Parte-Trasera-Credencial.png";
    link.click();
}
    link.click();
});
