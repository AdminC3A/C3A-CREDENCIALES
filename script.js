document.addEventListener("DOMContentLoaded", () => {
    const qrContainer = document.getElementById("qrcode");
    const generarQRBtn = document.getElementById("generarQR");

    generarQRBtn.addEventListener("click", () => {
        const nombre = document.getElementById("nombre").value.trim();
        const empresa = document.getElementById("empresa").value.trim();

        if (!nombre || !empresa) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        // Generar las iniciales y el código QR
        const nombres = nombre.split(" ");
        const primerNombre = nombres[0] || "";
        const primerApellido = nombres[1] || "";
        const primeraLetraEmpresa = empresa.charAt(0) || "";

        const iniciales = `${primerNombre.charAt(0)}${primerApellido.charAt(0)}${primeraLetraEmpresa}`.toUpperCase();
        const codigoASCII = primerNombre.charCodeAt(0).toString(); // Código ASCII de la primera letra del nombre

        // Formato 0000DE68
        const codigoQR = `${iniciales}${codigoASCII.padStart(5, "0")}`.substring(0, 8);

        // Limpiar QR anterior
        qrContainer.innerHTML = "";

        // Generar nuevo QR
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
});
