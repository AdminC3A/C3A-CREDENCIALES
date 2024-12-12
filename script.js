document.addEventListener("DOMContentLoaded", () => {
    const qrContainer = document.getElementById("imagenQRPreview");
    const generarQRBtn = document.getElementById("generarQR");
    const codigoQRInput = document.getElementById("codigoQR");

    generarQRBtn.addEventListener("click", () => {
        const nombre = document.getElementById("nombre").value.trim();
        const puesto = document.getElementById("puesto").value.trim();
        const empresa = document.getElementById("empresa").value.trim();

        if (!nombre || !puesto || !empresa) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        // Generar las iniciales del nombre y apellido
        const nombres = nombre.split(" ");
        const primerNombre = nombres[0]?.charAt(0) || ""; // Primera letra del nombre
        const primerApellido = nombres[1]?.charAt(0) || ""; // Primera letra del apellido
        const iniciales = `${primerNombre}${primerApellido}`.toUpperCase();

        // Generar el código ASCII de la primera letra del nombre
        const codigoASCII = primerNombre.charCodeAt(0)?.toString() || "0";

        // Combinar las iniciales y el código ASCII para formar el QR
        const codigoQR = `${iniciales}${codigoASCII.padStart(6, "0")}`.slice(0, 8);

        // Mostrar el código QR en el campo opcional
        codigoQRInput.value = codigoQR;

        // Generar el QR visual automáticamente
        qrContainer.innerHTML = ""; // Limpiar cualquier QR anterior
        new QRCode(qrContainer, {
            text: codigoQR,
            width: 150,
            height: 150,
        });

        console.log(`Código QR generado: ${codigoQR}`);
    });
});
