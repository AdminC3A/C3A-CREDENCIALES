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

        // Generar iniciales del nombre completo
        const nombres = nombre.split(" ");
        const inicialesNombre = nombres.map(word => word.charAt(0).toUpperCase()).join("");

        // Inicial del puesto
        const inicialPuesto = puesto.charAt(0).toUpperCase();

        // Código ASCII de la primera letra del nombre
        const codigoASCII = nombres[0]?.charCodeAt(0)?.toString() || "0";

        // Combinar iniciales y código ASCII
        const codigoQR = `${inicialesNombre}${inicialPuesto}${codigoASCII.padStart(6, "0")}`.slice(0, 8);

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
