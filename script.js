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

        // Generar iniciales y código QR
        const nombres = nombre.split(" ");
        const iniciales = `${nombres[0]?.charAt(0) || ""}${nombres[1]?.charAt(0) || ""}${empresa.charAt(0) || ""}`.toUpperCase();
        const codigoASCII = nombres[0]?.charCodeAt(0)?.toString() || "0";

        // Formato: 0000DE68
        const codigoQR = `${"0000"}${iniciales}${codigoASCII.slice(-2)}`.slice(0, 8);

        // Mostrar en el campo opcional
        codigoQRInput.value = codigoQR;

        // Generar QR visual
        qrContainer.innerHTML = "";
        new QRCode(qrContainer, {
            text: codigoQR,
            width: 150,
            height: 150,
        });
    });
});
