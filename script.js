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
        const iniciales = (inicialesNombre + inicialPuesto).substring(0, 4);
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
 * Módulo 3: Cargar foto desde cámara
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

        // Dibujar la foto (3x3 cm -> 200x200 px)
        if (imagenSeleccionada) {
            ctx.drawImage(imagenSeleccionada, 222, 250, 300, 300); // Centrado horizontalmente
        } else {
            ctx.strokeStyle = "#000";
            ctx.lineWidth = 2;
            ctx.strokeRect(272, 250, 200, 200); // Cuadro vacío para la foto
            console.warn("No se ha seleccionado una foto. Se deja un cuadro en blanco.");
        }

        // Dibujar los datos personales (centrados)
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.font = "38px Arial";
        ctx.fillText(`Nombre: ${nombre}`, credencialCanvas.width / 2, 600);
        ctx.fillText(`Puesto: ${puesto}`, credencialCanvas.width / 2, 640);
        ctx.fillText(`Empresa: ${empresa}`, credencialCanvas.width / 2, 680);

        // Dibujar el QR (3x3 cm -> 300x300 px)
        if (codigoQR) {
            const qrImage = new Image();
            qrImage.src = qrContainer.querySelector("canvas")?.toDataURL() || "";
            qrImage.onload = () => {
                ctx.drawImage(qrImage, 222, 700, 300, 300); // Centrado horizontalmente (744 - 300)/2 = 222
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
        const link = document.createElement("a");
        link.href = credencialCanvas.toDataURL("image/png");
        link.download = `CredencialFrontal-${document.getElementById("codigoQR").value}.png`;
        link.click();
    });
});
// Módulo 6: Generar la parte trasera de la credencial
function generarParteTrasera() {
    // Capturar el número de IMSS desde el formulario
    const numeroIMSS = document.getElementById("nss").value.trim();

    // Crear un nuevo canvas para la parte trasera
    const parteTraseraCanvas = document.createElement("canvas");
    parteTraseraCanvas.width = 744; // 7.4 cm
    parteTraseraCanvas.height = 1050; // 10.5 cm
    const ctx = parteTraseraCanvas.getContext("2d");

    // Fondo blanco
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, parteTraseraCanvas.width, parteTraseraCanvas.height);

    // Texto de advertencia
    ctx.fillStyle = "#000";
    ctx.font = "18px Arial";
    ctx.textAlign = "center";
    ctx.fillText("El Gafete de seguridad deberá portarse todo el tiempo", parteTraseraCanvas.width / 2, 100);
    ctx.fillText("y de manera visible durante el tiempo que se permanezca en obra.", parteTraseraCanvas.width / 2, 130);
    ctx.fillText("En caso de incumplimiento, la persona será expulsada y se tomarán las", parteTraseraCanvas.width / 2, 160);
    ctx.fillText("medidas disciplinarias necesarias.", parteTraseraCanvas.width / 2, 190);

    // Número de IMSS dinámico
    ctx.font = "20px Arial";
    ctx.fillText(`No. IMSS: ${numeroIMSS || "Sin IMSS"}`, parteTraseraCanvas.width / 2, 250);

   // Línea superior para Firma del Portador (subida 8 cm adicionales)
    ctx.beginPath();
    ctx.moveTo(100, 510); // Subido de 590 a 510
    ctx.lineTo(parteTraseraCanvas.width - 100, 510);
    ctx.stroke();

    // Texto de firma superior (subido 8 cm adicionales)
    ctx.fillText("Firma del Portador", parteTraseraCanvas.width / 2, 540); // Subido de 620 a 540



    // Línea inferior para Supervisión HSE BPD
    ctx.beginPath();
    ctx.moveTo(100, 750);
    ctx.lineTo(parteTraseraCanvas.width - 100, 750);
    ctx.stroke();

    // Texto de supervisión
    ctx.fillText("Supervisión HSE BPD", parteTraseraCanvas.width / 2, 780);

    // Validez
    ctx.textAlign = "left";
    ctx.font = "16px Arial";
    ctx.fillText("Válido desde: 12/12/2024", 50, 970);
    ctx.fillText("Válido hasta: 12/6/2025", 50, 1000);

    return parteTraseraCanvas;
}

// Evento para descargar la parte trasera
const descargarParteTraseraBtn = document.getElementById("descargarParteTrasera");
descargarParteTraseraBtn.addEventListener("click", () => {
    const parteTraseraCanvas = generarParteTrasera(); // Generar la parte trasera
    const codigoQR = document.getElementById("codigoQR").value.trim(); // Capturar el código QR
    const link = document.createElement("a");
    link.href = parteTraseraCanvas.toDataURL("image/png");
    link.download = `${codigoQR || "sinQR"}-CredencialPosterior.png`; // Ajuste del nombre del archivo
    link.click();
});
// Módulo 7: Registrar Trabajador
const registrarTrabajadorBtn = document.getElementById("registrarTrabajador");

registrarTrabajadorBtn.addEventListener("click", async () => {
    const webAppURL = "https://script.google.com/macros/s/AKfycbwZYrGzmWUQCjT7MCSmemPm5eXu_HYPTnFvxIDKOhyyao9GW6zAUvnbRsp7Y0VluQ0/exec"; // Reemplaza con tu URL real

    // Capturar datos del formulario
    const data = {
        operation: "credenciales", // Operación específica para registrar credenciales
        Nombre: document.getElementById("nombre").value.trim(),
        Puesto: document.getElementById("puesto").value.trim(),
        NSS: document.getElementById("nss").value.trim(),
        FechaNacimiento: document.getElementById("fechaNacimiento").value.trim(),
        Empresa: document.getElementById("empresa").value.trim(),
        CodigoQR: document.getElementById("codigoQR").value.trim(),
    };

    // Validar que todos los campos necesarios estén completos
    if (!data.Nombre || !data.Puesto || !data.NSS || !data.FechaNacimiento || !data.Empresa || !data.CodigoQR) {
        alert("Por favor, completa todos los campos del formulario.");
        return;
    }

    try {
        // Enviar datos al servidor mediante POST
        await fetch(webAppURL, {
            method: "POST",
            mode: "no-cors", // Configuración para evitar problemas de CORS
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        // Notificar éxito al usuario
        alert("Datos enviados correctamente. Verifica en la hoja Registradas.");
    } catch (error) {
        console.error("Error al enviar los datos:", error);
        alert("No se pudo enviar la información. Revisa la consola para más detalles.");
    }
});
