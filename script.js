document.addEventListener("DOMContentLoaded", () => {
    const generarQRBtn = document.getElementById("generarQR");
    const generarCredencialBtn = document.getElementById("generarCredencial");
    const cargarFotoArchivoBtn = document.getElementById("cargarFotoArchivo");
    const cargarFotoCamaraBtn = document.getElementById("cargarFotoCamara");
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

    // **Evento para cargar la foto desde archivo**
    cargarFotoArchivoBtn.addEventListener("click", () => {
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
                    alert("Imagen cargada correctamente. Ahora puedes generar la credencial.");
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // **Evento para cargar la foto desde la cámara**
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
                        imagenSeleccionada = img;
                        alert("Imagen capturada correctamente. Ahora puedes generar la credencial.");
                        stream.getTracks().forEach(track => track.stop()); // Detener la cámara
                    };
                    img.src = canvas.toDataURL();
                });

                document.body.append(video, captureButton);
            })
            .catch((error) => {
                console.error("Error al acceder a la cámara:", error);
            });
    });

    // **Evento para generar la credencial**
    generarCredencialBtn.addEventListener("click", () => {
        credencialCanvas.width = 744; // Ajustado para 7.4 cm
        credencialCanvas.height = 1050; // Ajustado para 10.5 cm

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
            ctx.drawImage(logo, 172, 20, 400, 400);

            ctx.fillStyle = "#000";
            ctx.textAlign = "center";
            ctx.font = "bold 24px Arial";
            ctx.fillText("Credencial de Acceso", credencialCanvas.width / 2, 450);
            ctx.fillText("CASA TRES AGUAS", credencialCanvas.width / 2, 500);

            if (imagenSeleccionada) {
                ctx.drawImage(imagenSeleccionada, 172, 550, 400, 400);
            } else {
                ctx.strokeStyle = "#000";
                ctx.lineWidth = 2;
                ctx.strokeRect(172, 550, 400, 400);
            }

            ctx.textAlign = "left";
            ctx.font = "18px Arial";
            ctx.fillText(`Nombre: ${nombre}`, 50, 1000);
            ctx.fillText(`Puesto: ${puesto}`, 50, 1050);
            ctx.fillText(`Empresa: ${empresa}`, 50, 1100);
            ctx.fillText(`NSS: ${nss}`, 50, 1150);
            ctx.fillText(`Fecha de Nacimiento: ${fechaNacimiento}`, 50, 1200);

            const qrImage = new Image();
            qrImage.src = qrContainer.querySelector("img").src;
            qrImage.onload = () => {
                ctx.drawImage(qrImage, 172, 1250, 400, 400);
            };
        };
    });

    // **Evento para autorizar y descargar**
    autorizarDescargarBtn.addEventListener("click", () => {
        const link = document.createElement("a");
        link.href = credencialCanvas.toDataURL("image/png");
        link.download = `Credencial-${document.getElementById("codigoQR").value}.png`;
        link.click();
    });
});
