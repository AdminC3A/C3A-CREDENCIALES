// Espera a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    /**
     * Módulo 1: Selección de elementos del DOM
     * Selecciona todos los elementos que se utilizarán para realizar las acciones.
     */
    const generarQRBtn = document.getElementById("generarQR");
    const generarCredencialBtn = document.getElementById("generarCredencial");
    const cargarFotoArchivoBtn = document.getElementById("cargarFotoArchivo");
    const cargarFotoCamaraBtn = document.getElementById("cargarFotoCamara");
    const autorizarDescargarBtn = document.getElementById("autorizarDescargar");
    const qrContainer = document.getElementById("qrCanvas"); // Donde aparece el QR
    const fotoContainer = document.getElementById("fotoCanvas"); // Donde aparece la foto cargada
    const credencialCanvas = document.getElementById("credencialCanvas"); // Canvas para dibujar la credencial
    let imagenSeleccionada = null; // Variable para almacenar la imagen cargada o capturada

    /**
 * Modulo 2: Cargar foto desde archivo
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
                    fotoContainer.innerHTML = ""; // Limpiar contenedor anterior
                    const canvasFoto = document.createElement("canvas");
                    canvasFoto.width = 150;
                    canvasFoto.height = 150;
                    const ctx = canvasFoto.getContext("2d");
                    ctx.clearRect(0, 0, canvasFoto.width, canvasFoto.height);
                    ctx.beginPath();
                    ctx.arc(75, 75, 75, 0, Math.PI * 2, true);
                    ctx.closePath();
                    ctx.clip();
                    ctx.drawImage(img, 0, 0, 150, 150);
                    fotoContainer.appendChild(canvasFoto); // Mostrar la previsualización circular
                    alert("Imagen cargada correctamente. Ahora puedes generar la credencial.");
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
});

/**
 * Modulo 3: Cargar foto desde cámara
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
                canvas.width = 400;
                canvas.height = 400;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const img = new Image();
                img.onload = () => {
                    imagenSeleccionada = img; // Guardar la imagen
                    fotoContainer.innerHTML = ""; // Limpiar contenedor anterior
                    const canvasFoto = document.createElement("canvas");
                    canvasFoto.width = 150;
                    canvasFoto.height = 150;
                    const ctxPreview = canvasFoto.getContext("2d");
                    ctxPreview.clearRect(0, 0, canvasFoto.width, canvasFoto.height);
                    ctxPreview.beginPath();
                    ctxPreview.arc(75, 75, 75, 0, Math.PI * 2, true);
                    ctxPreview.closePath();
                    ctxPreview.clip();
                    ctxPreview.drawImage(img, 0, 0, 150, 150);
                    fotoContainer.appendChild(canvasFoto); // Mostrar la previsualización circular
                    alert("Imagen capturada correctamente. Ahora puedes generar la credencial.");
                };
                img.src = canvas.toDataURL();
                stream.getTracks().forEach(track => track.stop()); // Detener la cámara
                video.remove();
                captureButton.remove();
            });
        })
        .catch((error) => {
            console.error("Error al acceder a la cámara:", error);
        });
});

    /**
 * Modulo 4: Generar la credencial
 * Este módulo ajusta el tamaño del canvas y posiciona correctamente los elementos en la credencial.
 */
generarCredencialBtn.addEventListener("click", () => {
    // Tamaño de la credencial ajustado a 7.4 x 10.5 cm (744 x 1050 px)
    credencialCanvas.width = 744;
    credencialCanvas.height = 1050;

    const ctx = credencialCanvas.getContext("2d");
    ctx.clearRect(0, 0, credencialCanvas.width, credencialCanvas.height);

    // Capturar datos del formulario
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

    // Fondo blanco para la credencial
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, credencialCanvas.width, credencialCanvas.height);

    // Dibujar el logo
    const logo = new Image();
    logo.src = "logo.png"; // Asegúrate de tener este archivo en el directorio correcto
    logo.onload = () => {
        ctx.drawImage(logo, 172, 20, 400, 100); // Escala y posición ajustada

        // Títulos
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.font = "bold 28px Arial";
        ctx.fillText("Credencial de Acceso", credencialCanvas.width / 2, 180);
        ctx.fillText("CASA TRES AGUAS", credencialCanvas.width / 2, 220);

        // Foto cargada o cuadro vacío
        if (imagenSeleccionada) {
            // Insertar la imagen cargada o capturada
            ctx.beginPath();
            ctx.arc(372, 400, 150, 0, Math.PI * 2, true); // Crear un círculo
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(imagenSeleccionada, 222, 250, 300, 300); // Ajustar tamaño y posición
            ctx.restore();
        } else {
            // Dibujar un cuadro para la foto
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 2;
            ctx.strokeRect(222, 250, 300, 300);
        }

        // Datos personales
        ctx.textAlign = "left";
        ctx.font = "20px Arial";
        ctx.fillText(`Nombre: ${nombre}`, 50, 600);
        ctx.fillText(`Puesto: ${puesto}`, 50, 640);
        ctx.fillText(`Empresa: ${empresa}`, 50, 680);
        ctx.fillText(`NSS: ${nss}`, 50, 720);
        ctx.fillText(`Fecha de Nacimiento: ${fechaNacimiento}`, 50, 760);

        // Generar QR
        const qrImage = new Image();
        qrImage.src = qrContainer.querySelector("img")?.src || ""; // Obtener el QR generado
        qrImage.onload = () => {
            ctx.drawImage(qrImage, 272, 800, 200, 200); // Ajustar tamaño y posición del QR
            console.log("Credencial generada correctamente.");
        };

        qrImage.onerror = () => {
            console.warn("No se pudo cargar el QR en la credencial.");
        };
    };
});

    /**
     * Módulo 5: Generar credencial
     * Dibuja todos los elementos (QR, foto, texto) en el canvas de la credencial.
     */
    generarCredencialBtn.addEventListener("click", () => {
        credencialCanvas.width = 744; // 7.4 cm
        credencialCanvas.height = 1050; // 10.5 cm

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

        // Dibujar fondo blanco
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, credencialCanvas.width, credencialCanvas.height);

        // Logo y textos
        const logo = new Image();
        logo.src = "logo.png";
        logo.onload = () => {
            ctx.drawImage(logo, 172, 20, 400, 400);

            ctx.fillStyle = "#000";
            ctx.textAlign = "center";
            ctx.font = "bold 24px Arial";
            ctx.fillText("Credencial de Acceso", credencialCanvas.width / 2, 450);
            ctx.fillText("CASA TRES AGUAS", credencialCanvas.width / 2, 500);

            // Foto cargada o cuadro vacío
            if (imagenSeleccionada) {
                ctx.drawImage(imagenSeleccionada, 172, 550, 400, 400);
            } else {
                ctx.strokeStyle = "#000";
                ctx.lineWidth = 2;
                ctx.strokeRect(172, 550, 400, 400);
            }

            // Datos personales
            ctx.textAlign = "left";
            ctx.font = "18px Arial";
            ctx.fillText(`Nombre: ${nombre}`, 50, 1000);
            ctx.fillText(`Puesto: ${puesto}`, 50, 1050);
            ctx.fillText(`Empresa: ${empresa}`, 50, 1100);
            ctx.fillText(`NSS: ${nss}`, 50, 1150);
            ctx.fillText(`Fecha de Nacimiento: ${fechaNacimiento}`, 50, 1200);

            // Código QR
            const qrImage = new Image();
            qrImage.src = qrContainer.querySelector("img").src;
            qrImage.onload = () => {
                ctx.drawImage(qrImage, 172, 1250, 400, 400);
            };
        };
    });

    /**
     * Módulo 6: Autorizar y descargar
     * Permite descargar la credencial generada como una imagen PNG.
     */
    autorizarDescargarBtn.addEventListener("click", () => {
        const link = document.createElement("a");
        link.href = credencialCanvas.toDataURL("image/png");
        link.download = `Credencial-${document.getElementById("codigoQR").value}.png`;
        link.click();
    });
});
