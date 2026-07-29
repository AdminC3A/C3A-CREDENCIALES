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
    
// Módulo 4: Generar la credencial (DISEÑO CLÁSICO - SIN COLOR, SIN LEYENDA)
    generarCredencialBtn.addEventListener("click", () => {
        // Tamaño del canvas 7.4 cm x 10.5 cm (744 x 1050 px)
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

        // Fondo blanco
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, credencialCanvas.width, credencialCanvas.height);

        // Foto CUADRADA 300x300 con reborde delgado gris oscuro
        const fx = 222, fy = 250, fs = 300;
        if (imagenSeleccionada) {
            ctx.drawImage(imagenSeleccionada, fx, fy, fs, fs);
        } else {
            ctx.fillStyle = "#eeeeee";
            ctx.fillRect(fx, fy, fs, fs);
            ctx.fillStyle = "#999999";
            ctx.textAlign = "center";
            ctx.font = "26px Arial";
            ctx.fillText("FOTO", fx + fs / 2, fy + fs / 2 + 8);
        }
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#FFFFFF";
        ctx.strokeRect(fx, fy, fs, fs);

        // Nombre y Puesto (texto negro, con etiqueta)
        ctx.textAlign = "center";
        ctx.font = "38px Arial";
        ctx.fillStyle = "#000000";
        ctx.fillText(`Nombre: ${nombre}`, credencialCanvas.width / 2, 600);
        ctx.fillText(`Puesto: ${puesto}`, credencialCanvas.width / 2, 640);

        // Empresa (en blanco / invisible por decisión interna)
        ctx.fillStyle = "#FFFFFF";
        ctx.fillText(`Empresa: ${empresa}`, credencialCanvas.width / 2, 680);

        // QR + semáforos
        const qrX = 222, qrY = 700, qrSize = 300;
        if (codigoQR) {
            const qrImage = new Image();
            qrImage.src = qrContainer.querySelector("canvas")?.toDataURL() || "";
            qrImage.onload = () => {
                ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

                const circleRadius = 25;
                const circleX = qrX + qrSize + 60;
                const circlePositions = [
                    { y: qrY + 50, color: 'green' },
                    { y: qrY + qrSize / 2, color: 'yellow' },
                    { y: qrY + qrSize - 50, color: 'red' }
                ];
                circlePositions.forEach(position => {
                    ctx.beginPath();
                    ctx.arc(circleX, position.y, circleRadius, 0, 2 * Math.PI);
                    ctx.fillStyle = position.color;
                    ctx.fill();
                });

                console.log("Credencial (frente clásico) generada correctamente.");
            };
            qrImage.onerror = () => {
                console.warn("No se pudo cargar el QR en la credencial.");
            };
        } else {
            console.warn("No se generó el QR. Se deja el espacio vacío.");
        }

        // Logo centrado arriba (2x2 cm -> 200x200). Si falta, no rompe la credencial.
        const logo = new Image();
        logo.src = "logo.png";
        logo.onload = () => {
            ctx.drawImage(logo, 272, 20, 200, 200);
        };
        logo.onerror = () => {
            console.warn("No se pudo cargar logo.png; se omite el logo.");
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
    // Capturar datos desde el formulario
    const numeroIMSS = document.getElementById("nss").value.trim();
    const tipoSangre = document.getElementById("tipoSangre").value.trim();
    const contactoNombre = document.getElementById("contactoNombre").value.trim();
    const contactoTel = document.getElementById("contactoTelefono").value.trim();

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

    // Datos de emergencia (resaltados en ámbar)
    const resaltar = (texto, y) => {
        const padX = 14, h = 30, rad = 6;
        const w = ctx.measureText(texto).width + padX * 2;
        const x = parteTraseraCanvas.width / 2 - w / 2;
        const top = y - 21;
        ctx.beginPath();
        ctx.moveTo(x + rad, top);
        ctx.arcTo(x + w, top, x + w, top + h, rad);
        ctx.arcTo(x + w, top + h, x, top + h, rad);
        ctx.arcTo(x, top + h, x, top, rad);
        ctx.arcTo(x, top, x + w, top, rad);
        ctx.closePath();
        ctx.fillStyle = "#FAEEDA"; // fondo ámbar claro
        ctx.fill();
        ctx.fillStyle = "#633806"; // texto ámbar oscuro
        ctx.fillText(texto, parteTraseraCanvas.width / 2, y);
    };
    resaltar(`Tipo de Sangre: ${tipoSangre || "N/D"}`, 292);
    resaltar(`Contacto de Emergencia: ${contactoNombre || "N/D"}`, 335);
    resaltar(`Teléfono: ${contactoTel || "N/D"}`, 378);

    // Restaurar color negro para el resto del texto
    ctx.fillStyle = "#000";

    // Línea superior para Firma del Portador
    ctx.beginPath();
    ctx.moveTo(100, 510);
    ctx.lineTo(parteTraseraCanvas.width - 100, 510);
    ctx.stroke();

    // Texto de firma superior
    ctx.fillText("Firma del Portador", parteTraseraCanvas.width / 2, 540);

    // Agregar la primera leyenda dividida en 6 líneas justificadas
    ctx.font = "16px Arial";
    const leyendaNOM = [
        "Me comprometo a seguir todas y cada una de las determinaciones",
        "referentes a las NOM de Seguridad, Higiene y Ecología, así como",
        "el Manual de Políticas y Procedimientos del Proyecto en Obra.",
        "En caso de no cumplirlas, me responsabilizo de acatar las sanciones",
        "que se me imputen. En caso de no estar firmada la credencial, se dará",
        "por entendido que se aceptan las presentes cláusulas impresas."
    ];
    leyendaNOM.forEach((line, index) => {
        ctx.fillText(line, parteTraseraCanvas.width / 2, 590 + index * 20); // Espaciado de 20px entre líneas
    });

    // Línea inferior para Supervisión HSE BPD
    ctx.beginPath();
    ctx.moveTo(100, 820); // Coordenadas ajustadas para bajar la firma de supervisión
    ctx.lineTo(parteTraseraCanvas.width - 100, 820);
    ctx.stroke();

    // Texto de supervisión
    ctx.fillText("Supervisión HSE BPD", parteTraseraCanvas.width / 2, 850);

   // Validez
    ctx.textAlign = "left";
    ctx.font = "16px Arial";

    // "Válido desde" = fecha de expedición (el día en que se genera la credencial)
    const hoy = new Date();
    const dd = String(hoy.getDate()).padStart(2, "0");
    const mm = String(hoy.getMonth() + 1).padStart(2, "0");
    const aaaa = hoy.getFullYear();
    const fechaExpedicion = `${dd}/${mm}/${aaaa}`;

    ctx.fillText(`Válido desde: ${fechaExpedicion}`, 50, 970);
    ctx.fillText("Válido hasta: 31/12/2026", 50, 1000);

    return parteTraseraCanvas;
}

// Evento para descargar la parte trasera
const descargarParteTraseraBtn = document.getElementById("descargarParteTrasera");
descargarParteTraseraBtn.addEventListener("click", () => {
    try {
        const parteTraseraCanvas = generarParteTrasera(); // Generar la parte trasera
        const codigoQR = document.getElementById("codigoQR").value.trim(); // Capturar el código QR
        const link = document.createElement("a");
        link.href = parteTraseraCanvas.toDataURL("image/png");
        link.download = `${codigoQR || "sinQR"}-CredencialPosterior.png`; // Ajuste del nombre del archivo
        link.click();
    } catch (error) {
        console.error("Error al generar o descargar la parte trasera:", error);
    }
});



// Módulo 7: Registrar Trabajador
const registrarTrabajadorBtn = document.getElementById("registrarTrabajador");

registrarTrabajadorBtn.addEventListener("click", async () => {
    const webAppURL = "https://script.google.com/macros/s/AKfycbzOaevBtNX7WVFk97cBK_alE4NCWDVDSYIe63vQpUPZ5cWyQs_2aer9ZIeYmvwz2RJJ/exec"; // Reemplaza con tu URL real

    // Capturar datos del formulario
    const data = {
        operation: "credenciales", // Operación específica para registrar credenciales
        Nombre: document.getElementById("nombre").value.trim(),
        Puesto: document.getElementById("puesto").value.trim(),
        NSS: document.getElementById("nss").value.trim(),
        FechaNacimiento: document.getElementById("fechaNacimiento").value.trim(),
        Empresa: document.getElementById("empresa").value.trim(),
        TipoSangre: document.getElementById("tipoSangre").value.trim(),
        ContactoNombre: document.getElementById("contactoNombre").value.trim(),
        ContactoTel: document.getElementById("contactoTelefono").value.trim(),
        CodigoQR: document.getElementById("codigoQR").value.trim(),
    };

    // Validar que todos los campos necesarios estén completos
    if (!data.Nombre || !data.Puesto || !data.NSS || !data.FechaNacimiento || !data.Empresa || !data.TipoSangre || !data.ContactoNombre || !data.ContactoTel || !data.CodigoQR) {
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







