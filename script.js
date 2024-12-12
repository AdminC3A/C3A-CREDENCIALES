document.addEventListener("DOMContentLoaded", () => {
    // Selección de elementos
    const generarQRBtn = document.getElementById("generarQR");
    const generarCredencialBtn = document.getElementById("generarCredencial");
    const cargarFotoArchivoBtn = document.getElementById("cargarFotoArchivo");
    const cargarFotoCamaraBtn = document.getElementById("cargarFotoCamara");
    const autorizarDescargarBtn = document.getElementById("autorizarDescargar");
    const descargarParteTraseraBtn = document.getElementById("descargarParteTrasera"); // Agregar botón
    const qrContainer = document.getElementById("qrCanvas"); // Contenedor QR
    const fotoContainer = document.getElementById("fotoCanvas"); // Contenedor foto
    const credencialCanvas = document.getElementById("credencialCanvas"); // Canvas credencial

    let imagenSeleccionada = null; // Imagen cargada/capturada

    /**
     * Módulo 1: Generar QR
     */
    generarQRBtn.addEventListener("click", () => {
        const nombre = document.getElementById("nombre").value.trim();
        const puesto = document.getElementById("puesto").value.trim();

        if (!nombre || !puesto) {
            alert("Por favor, completa los campos de Nombre y Puesto.");
            return;
        }

        // Generar código QR
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
                        ctxFoto.arc(75, 75, 75, 0, Math.PI * 2, true);
                        ctxFoto.closePath();
                        ctxFoto.clip();
                        ctxFoto.drawImage(img, 0, 0, 150, 150);
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    });

    /**
     * Módulo 3: Generar Parte Trasera
     */
    descargarParteTraseraBtn.addEventListener("click", () => {
        const parteTraseraCanvas = document.createElement("canvas");
        parteTraseraCanvas.width = 744;
        parteTraseraCanvas.height = 1050;
        const ctx = parteTraseraCanvas.getContext("2d");

        ctx.clearRect(0, 0, parteTraseraCanvas.width, parteTraseraCanvas.height);

        // Fondo blanco
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, parteTraseraCanvas.width, parteTraseraCanvas.height);

        // Texto
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
        ctx.fillText("medidas disciplinarias necesarias.", parteTraseraCanvas.width / 2, 190);

        ctx.textAlign = "center";
        ctx.font = "20px Arial";
        const numeroIMSS = "No. IMSS: 2296790174-9";
        ctx.fillText(numeroIMSS, parteTraseraCanvas.width / 2, 250);

        // Línea de firma
        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(100, 700);
        ctx.lineTo(parteTraseraCanvas.width - 100, 700);
        ctx.stroke();

        ctx.font = "18px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Firma del Portador", parteTraseraCanvas.width / 2, 730);

        // Descargar
        const link = document.createElement("a");
        link.href = parteTraseraCanvas.toDataURL("image/png");
        link.download = "Parte-Trasera-Credencial.png";
        link.click();
    });
});
