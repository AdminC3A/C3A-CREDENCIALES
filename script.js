document.addEventListener("DOMContentLoaded", () => {
    const generarQRBtn = document.getElementById("generarQR");
    const generarCredencialBtn = document.getElementById("generarCredencial");
    const cargarFotoArchivoBtn = document.getElementById("cargarFotoArchivo");
    const cargarFotoCamaraBtn = document.getElementById("cargarFotoCamara");
    const autorizarDescargarBtn = document.getElementById("autorizarDescargar");
    const qrContainer = document.getElementById("imagenQRPreview");
    const fotoContainer = document.getElementById("imagenFotoPreview");
    const credencialCanvas = document.getElementById("credencialCanvas");
    const imagenInput = document.createElement("input");
    imagenInput.type = "file";
    imagenInput.accept = "image/*";

    let codigoQR = ""; // Variable global para el QR
    let imagenSeleccionada = null; // Variable para la imagen cargada

    // **Generar QR**
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
        codigoQR = `${iniciales}${"0".repeat(cerosNecesarios)}${codigoASCII}`;
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

    // **Cargar Foto desde Archivo**
    cargarFotoArchivoBtn.addEventListener("click", () => {
        imagenInput.click(); // Abrir selector de archivos
    });

    imagenInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    imagenSeleccionada = img;
                    fotoContainer.innerHTML = "";
                    fotoContainer.appendChild(img); // Mostrar imagen
                    alert("Imagen cargada correctamente.");
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // **Cargar Foto desde Cámara**
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
                    canvas.width = 150;
                    canvas.height = 150;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const img = new Image();
                    img.onload = () => {
                        imagenSeleccionada = img;
                        fotoContainer.innerHTML = "";
                        fotoContainer.appendChild(img);
                        stream.getTracks().forEach(track => track.stop()); // Detener cámara
                        alert("Imagen capturada correctamente.");
                    };
                    img.src = canvas.toDataURL();
                });

                document.body.append(video, captureButton);
            })
            .catch((error) => console.error("Error al acceder a la cámara:", error));
    });

    // **Generar Credencial**
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

            const qrImage = new Image();
            qrImage.src = qrContainer.querySelector("img").src;
            qrImage.onload = () => {
                ctx.drawImage(qrImage, 172, 1000, 400, 400);
            };
        };
    });

    // **Autorizar y Descargar**
    autorizarDescargarBtn.addEventListener("click", () => {
        if (!codigoQR) {
            alert("Genera un código QR antes de descargar la credencial.");
            return;
        }
        const link = document.createElement("a");
        link.href = credencialCanvas.toDataURL("image/png");
        link.download = `Credencial-${codigoQR}.png`;
        link.click();
    });
});
