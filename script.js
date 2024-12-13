// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    // Selección de elementos del DOM
    const generarQRBtn = document.getElementById("generarQR");
    const cargarFotoArchivoBtn = document.getElementById("cargarFotoArchivo");
    const qrContainer = document.getElementById("qrCanvas"); // Contenedor del QR
    const fotoContainer = document.getElementById("fotoCanvas"); // Contenedor de la foto cargada

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
            const canvasQR = document.createElement("canvas");
            canvasQR.width = 150; // Tamaño del QR
            canvasQR.height = 150;
            qrContainer.appendChild(canvasQR);

            new QRCode(canvasQR, {
                text: codigoQR,
                width: 150,
                height: 150,
            });

            console.log(`Código QR generado: ${codigoQR}`);
        } catch (error) {
            console.error("Error al generar el QR:", error);
            alert("Hubo un problema al generar el código QR. Por favor, intenta nuevamente.");
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

    // Los demás módulos permanecen intactos.
});

    /**
 * Módulo 3: Cargar foto desde cámara
 */
cargarFotoCamaraBtn.addEventListener("click", () => {
    // Detectar si el usuario está en un dispositivo móvil
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (!isMobile) {
        alert("Esta función solo está disponible en dispositivos móviles.");
        return;
    }

    // Acceder a la cámara
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            const video = document.createElement("video");
            video.srcObject = stream;
            video.play();

            const captureButton = document.createElement("button");
            captureButton.textContent = "Capturar";
            captureButton.style.display = "block";
            captureButton.style.margin = "10px auto";

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

                    // Dibujar la foto en el contenedor circular
                    const ctxFoto = fotoContainer.getContext("2d");
                    ctxFoto.clearRect(0, 0, fotoContainer.width, fotoContainer.height);
                    ctxFoto.beginPath();
                    ctxFoto.arc(75, 75, 75, 0, Math.PI * 2, true);
                    ctxFoto.closePath();
                    ctxFoto.clip();
                    ctxFoto.drawImage(img, 0, 0, 150, 150);
                };

                img.src = canvas.toDataURL();
                stream.getTracks().forEach(track => track.stop()); // Detener cámara
                video.remove();
                captureButton.remove();
            });
        })
        .catch((error) => {
            console.error("Error al acceder a la cámara:", error);
            alert("No se pudo acceder a la cámara. Por favor, revisa los permisos.");
        });
});

 * Módulo 4: Generar la credencial
 * Genera una credencial ajustada al tamaño 7.4 cm x 10.5 cm (744 x 1050 px).
 */
generarCredencialBtn.addEventListener("click", () => {
    // Tamaño del canvas ajustado a 7.4 cm x 10.5 cm
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
    logo.src = "logo.png"; // Asegúrate de que el archivo esté disponible en el directorio correcto
    logo.onload = () => {
        ctx.drawImage(logo, 272, 20, 200, 200); // Centrado horizontalmente

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
            ctx.drawImage(qrImage, 222, 600, 300, 300); // Centrado horizontalmente
            console.log("Credencial generada correctamente.");
        };

        qrImage.onerror = () => {
            console.warn("No se pudo cargar el QR en la credencial.");
        };
    };

    logo.onerror = () => {
        alert("No se pudo cargar el logo. Asegúrate de que el archivo logo.png está disponible.");
    };
});

    /**
     * Módulo 5: Descargar la credencial
     */
    const autorizarDescargarBtn = document.getElementById("autorizarDescargar");
    autorizarDescargarBtn.addEventListener("click", () => {
        const link = document.createElement("a");
        link.href = credencialCanvas.toDataURL("image/png");
        link.download = `Credencial-${document.getElementById("codigoQR").value}.png`;
        link.click();
    });
});
