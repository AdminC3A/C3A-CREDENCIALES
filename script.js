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
     * Módulo 1: Generar Código QR - MODULO VALIDADO
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
     * Módulo 2: Cargar foto desde archivo - MODULO VALIDADO
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
 * Módulo 3: Cargar foto desde cámara -- MODULO VALIDADO
 */
cargarFotoCamaraBtn.addEventListener("click", () => {
    // Detectar si el usuario está en un dispositivo móvil
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (!isMobile) {
        // Mostrar mensaje de advertencia si no es un dispositivo móvil
        alert("Esta función solo está disponible en dispositivos móviles. Por favor, usa tu dispositivo móvil para acceder a esta funcionalidad.");
        return;
    }

    // Crear un elemento <input> para abrir la cámara nativa
    const cameraInput = document.createElement("input");
    cameraInput.type = "file";
    cameraInput.accept = "image/*";
    cameraInput.capture = "environment"; // Solicita cámara trasera
    cameraInput.style.display = "none"; // Ocultar el input

    // Agregar el input temporalmente al documento
    document.body.appendChild(cameraInput);

    // Simular clic para abrir la cámara
    cameraInput.click();

    // Manejar la captura de la imagen
    cameraInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // Sustituir la imagen seleccionada previamente
                    imagenSeleccionada = img;

                    // Dibujar la nueva imagen en el contenedor circular
                    const ctxFoto = fotoContainer.getContext("2d");
                    ctxFoto.clearRect(0, 0, fotoContainer.width, fotoContainer.height); // Limpiar el canvas
                    ctxFoto.beginPath();
                    ctxFoto.arc(75, 75, 75, 0, Math.PI * 2, true); // Dibujar círculo
                    ctxFoto.closePath();
                    ctxFoto.clip();
                    ctxFoto.drawImage(img, 0, 0, 150, 150);

                    alert("La imagen capturada ha reemplazado la imagen previamente cargada.");
                };

                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Eliminar el input después de su uso
    cameraInput.addEventListener("blur", () => {
        document.body.removeChild(cameraInput);
    });
});

    // Módulo 4: Generar la credencial - MODULO VALIDADO
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

    if (!nombre || !puesto || !empresa) {
        alert("Por favor, completa los campos de Nombre, Puesto y Empresa.");
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
            console.warn("No se ha seleccionado una foto. Se deja un cuadro en blanco.");
        }

        // Dibujar los datos personales (centrados)
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.font = "20px Arial";
        ctx.fillText(`Nombre: ${nombre}`, credencialCanvas.width / 2, 500);
        ctx.fillText(`Puesto: ${puesto}`, credencialCanvas.width / 2, 530);
        ctx.fillText(`Empresa: ${empresa}`, credencialCanvas.width / 2, 560);

        // Dibujar el QR (3x3 cm -> 300x300 px)
        if (codigoQR) {
            const qrImage = new Image();
            qrImage.src = qrContainer.querySelector("canvas")?.toDataURL() || "";
            qrImage.onload = () => {
                ctx.drawImage(qrImage, 222, 600, 300, 300); // Centrado horizontalmente (744 - 300)/2 = 222
                console.log("Credencial generada correctamente con el QR.");
            };

            qrImage.onerror = () => {
                console.warn("No se pudo cargar el QR en la credencial.");
            };
        } else {
            console.warn("No se generó el QR. Se deja el espacio vacío.");
        }
    };

    logo.onerror = () => {
        alert("No se pudo cargar el logo. Asegúrate de que el archivo logo.png está disponible.");
    };
});

  
    /**
     * Módulo 5: Descargar la credencial
     */
   autorizarDescargarBtn.addEventListener("click", () => {
    // Canvas combinado
    const combinedCanvas = document.createElement("canvas");
    combinedCanvas.width = 744 * 2; // Doble ancho para colocar las partes lado a lado
    combinedCanvas.height = 1050; // Mismo alto para ambas partes
    const combinedCtx = combinedCanvas.getContext("2d");

    // Dibujar la parte delantera a la izquierda
    combinedCtx.drawImage(credencialCanvas, 0, 0);

    // Generar la parte trasera
    const parteTraseraCanvas = document.createElement("canvas");
    parteTraseraCanvas.width = 744;
    parteTraseraCanvas.height = 1050;
    const traseraCtx = parteTraseraCanvas.getContext("2d");
    generarParteTrasera(traseraCtx);

    // Dibujar la parte trasera a la derecha
    combinedCtx.drawImage(parteTraseraCanvas, 744, 0);

    // Descargar la imagen combinada
    const link = document.createElement("a");
    link.href = combinedCanvas.toDataURL("image/png");
    link.download = `Credencial-Combinada-${document.getElementById("codigoQR").value}.png`;
    link.click();
});


// MODULO 6: Seleccionar el botón de descargar parte trasera
const descargarParteTraseraBtn = document.getElementById("descargarParteTrasera");

// Agregar evento al botón
descargarParteTraseraBtn.addEventListener("click", () => {
    // Crear un canvas para la parte trasera
    const parteTraseraCanvas = document.createElement("canvas");
    parteTraseraCanvas.width = 744; // Ancho estándar
    parteTraseraCanvas.height = 1050; // Alto estándar
    const ctx = parteTraseraCanvas.getContext("2d");

    // Generar el contenido de la parte trasera
    generarParteTrasera(ctx);

    // Descargar la parte trasera
    const codigoQR = document.getElementById("codigoQR").value.trim();
    const link = document.createElement("a");
    link.href = parteTraseraCanvas.toDataURL("image/png");
    link.download = `CredencialBack-${codigoQR || "sinQR"}.png`;
    link.click();
});

// Función para generar el contenido de la parte trasera
function generarParteTrasera(ctx) {
    // Fondo blanco
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, 744, 1050);

    // Texto de advertencia
    ctx.fillStyle = "#000";
    ctx.font = "18px Arial";
    ctx.textAlign = "center";
    ctx.fillText("El Gafete de seguridad deberá portarse todo el tiempo", 744 / 2, 100);
    ctx.fillText("y de manera visible durante el tiempo que se permanezca en obra.", 744 / 2, 130);
    ctx.fillText("En caso de incumplimiento, la persona será expulsada y se tomarán las", 744 / 2, 160);
    ctx.fillText("medidas disciplinarias necesarias.", 744 / 2, 190);

    // No. IMSS
    const numeroIMSS = "No. IMSS: 2296790174-9";
    ctx.font = "20px Arial";
    ctx.fillText(numeroIMSS, 744 / 2, 250);

    // Línea de firma
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, 700);
    ctx.lineTo(644, 700);
    ctx.stroke();

    // Texto de firma
    ctx.font = "18px Arial";
    ctx.fillText("Firma del Portador", 744 / 2, 730);

    // Supervisión
    ctx.fillText("Supervisión HSE BPD", 744 / 2, 770);

    // Válidos
    ctx.textAlign = "left";
    ctx.font = "16px Arial";
    ctx.fillText("Válido desde: 12/12/2024", 50, 970);
    ctx.fillText("Válido hasta: 12/6/2025", 50, 1000);
}
