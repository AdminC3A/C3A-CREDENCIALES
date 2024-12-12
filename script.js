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

    /**
     * Módulo 4: Generar la credencial
     */
    generarCredencialBtn.addEventListener("click", () => {
        credencialCanvas.width = 744;
        credencialCanvas.height = 1050;

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

        // Fondo blanco
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, credencialCanvas.width, credencialCanvas.height);

        // Logo
        const logo = new Image();
        logo.src = "logo.png";
        logo.onload = () => {
            ctx.drawImage(logo, 172, 20, 400, 100);

            // Foto
            if (imagenSeleccionada) {
                ctx.drawImage(imagenSeleccionada, 222, 250, 300, 300);
            } else {
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

            // QR
            const qrImage = new Image();
            qrImage.src = qrContainer.querySelector("img").src;
            qrImage.onload = () => ctx.drawImage(qrImage, 272, 800, 200, 200);
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
