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
     * Módulo 2: Generar Código QR
     * Genera un código QR y lo muestra en el cuadro designado.
     */
    generarQRBtn.addEventListener("click", () => {
        const nombre = document.getElementById("nombre").value.trim();
        const puesto = document.getElementById("puesto").value.trim();

        if (!nombre || !puesto) {
            alert("Por favor, completa los campos de Nombre y Puesto.");
            return;
        }

        // Generar el código QR basado en iniciales y ASCII
        const palabrasNombre = nombre.split(" ");
        const inicialesNombre = palabrasNombre.map(palabra => palabra.charAt(0).toUpperCase()).join("");
        const inicialPuesto = puesto.charAt(0).toUpperCase();
        const iniciales = (inicialesNombre + inicialPuesto).substring(0, 3);
        const codigoASCII = nombre.charCodeAt(0).toString();
        const totalLength = 8;
        const cerosNecesarios = totalLength - (iniciales.length + codigoASCII.length);
        const codigoQR = `${iniciales}${"0".repeat(cerosNecesarios)}${codigoASCII}`;

        document.getElementById("codigoQR").value = codigoQR;
        qrContainer.innerHTML = ""; // Limpiar contenido anterior

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

    /**
     * Módulo 3: Cargar foto desde archivo
     * Permite al usuario cargar una foto desde su dispositivo.
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
                        fotoContainer.appendChild(img); // Mostrar imagen en cuadro
                        alert("Imagen cargada correctamente.");
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    });

    /**
     * Módulo 4: Cargar foto desde cámara
     * Accede a la cámara del dispositivo, permite capturar una foto y la muestra.
     */
    cargarFotoCamaraBtn.addEventListener("click", () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                const video = document.createElement("video");
                video.srcObject = stream;
                video.play();

                const captureButton = document.createElement("button");
                captureButton.textContent = "Capturar";
                captureButton.addEventListener("click", () => {
                    const canvas = document.createElement("canvas");
                    canvas.width = 400;
                    canvas.height = 400;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const img = new Image();
                    img.onload = () => {
                        imagenSeleccionada = img; // Guardar imagen
                        fotoContainer.innerHTML = ""; // Limpiar contenedor anterior
                        fotoContainer.appendChild(img); // Mostrar imagen capturada
                        alert("Imagen capturada correctamente.");
                        stream.getTracks().forEach(track => track.stop()); // Detener la cámara
                        document.body.removeChild(video);
                        document.body.removeChild(captureButton);
                    };
                    img.src = canvas.toDataURL();
                });

                document.body.append(video, captureButton);
            })
            .catch((error) => {
                console.error("Error al acceder a la cámara:", error);
            });
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
