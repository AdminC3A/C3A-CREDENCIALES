document.addEventListener("DOMContentLoaded", () => {
    const generarQRBtn = document.getElementById("generarQR");
    const cargarFotoArchivoBtn = document.getElementById("cargarFotoArchivo");
    const cargarFotoCamaraBtn = document.getElementById("cargarFotoCamara");
    const generarCredencialBtn = document.getElementById("generarCredencial");
    const autorizarDescargarBtn = document.getElementById("autorizarDescargar");

    const qrCanvas = document.getElementById("qrCanvas");
    const fotoCanvas = document.getElementById("fotoCanvas");
    const credencialCanvas = document.getElementById("credencialCanvas");

    let imagenSeleccionada = null; // Variable para la imagen cargada

    // **Generar QR**
    generarQRBtn.addEventListener("click", () => {
        const qrContext = qrCanvas.getContext("2d");
        qrContext.clearRect(0, 0, qrCanvas.width, qrCanvas.height);

        const nombre = document.getElementById("nombre").value.trim();
        const puesto = document.getElementById("puesto").value.trim();

        if (!nombre || !puesto) {
            alert("Por favor, completa los campos de Nombre y Puesto.");
            return;
        }

        const codigoQR = `${nombre.charAt(0)}${puesto.charAt(0)}0000`;
        const qrCode = new QRCode(document.createElement("div"), {
            text: codigoQR,
            width: 150,
            height: 150,
        });

        qrCode._el.children[0].toBlob((blob) => {
            const img = new Image();
            img.onload = () => {
                qrContext.drawImage(img, 0, 0, 150, 150);
            };
            img.src = URL.createObjectURL(blob);
        });
    });

    // **Cargar Foto desde Archivo**
    cargarFotoArchivoBtn.addEventListener("click", () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.click();

        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        const fotoContext = fotoCanvas.getContext("2d");
                        fotoContext.clearRect(0, 0, fotoCanvas.width, fotoCanvas.height);
                        fotoContext.drawImage(img, 0, 0, 150, 150);
                        imagenSeleccionada = img;
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        };
    });

    // **Cargar Foto desde Cámara**
    cargarFotoCamaraBtn.addEventListener("click", () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((stream) => {
                const video = document.createElement("video");
                const captureButton = document.createElement("button");
                video.srcObject = stream;
                video.play();

                captureButton.textContent = "Capturar";
                captureButton.onclick = () => {
                    const fotoContext = fotoCanvas.getContext("2d");
                    fotoContext.clearRect(0, 0, fotoCanvas.width, fotoCanvas.height);
                    fotoContext.drawImage(video, 0, 0, 150, 150);
                    imagenSeleccionada = fotoCanvas;

                    stream.getTracks().forEach(track => track.stop());
                    video.remove();
                    captureButton.remove();
                };

                document.body.append(video, captureButton);
            })
            .catch((error) => console.error("Error al acceder a la cámara:", error));
    });

    // **Generar Credencial**
    generarCredencialBtn.addEventListener("click", () => {
        // Dibuja QR y foto en credencial
        const credencialContext = credencialCanvas.getContext("2d");
        credencialContext.clearRect(0, 0, credencialCanvas.width, credencialCanvas.height);
        credencialContext.drawImage(qrCanvas, 50, 50, 150, 150);
        if (imagenSeleccionada) {
            credencialContext.drawImage(imagenSeleccionada, 50, 250, 150, 150);
        }
    });

    // **Autorizar y Descargar**
    autorizarDescargarBtn.addEventListener("click", () => {
        const link = document.createElement("a");
        link.href = credencialCanvas.toDataURL("image/png");
        link.download = "Credencial.png";
        link.click();
    });
});
