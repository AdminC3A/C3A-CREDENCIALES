function generateCredential(name, position, company, qrCode, index) {
    const canvas = document.createElement("canvas");
    canvas.width = 600; // Formato vertical
    canvas.height = 1000;
    const ctx = canvas.getContext("2d");

    // Fondo blanco
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Logo centrado arriba
    const logo = new Image();
    logo.src = "logo.png";
    logo.onload = function () {
        ctx.drawImage(logo, canvas.width / 2 - 75, 30, 150, 150);

        // Texto centrado
        ctx.fillStyle = "#333";
        ctx.font = "bold 30px Arial";
        ctx.textAlign = "center";

        ctx.fillText("Credencial de Acceso", canvas.width / 2, 220);
        ctx.font = "20px Arial";
        ctx.fillText(Nombre: ${name}, canvas.width / 2, 300);
        ctx.fillText(Puesto: ${position}, canvas.width / 2, 350);
        ctx.fillText(Empresa: ${company}, canvas.width / 2, 400);

        // Generar QR y colocarlo abajo
        const qrCanvas = document.createElement("canvas");
        new QRCode(qrCanvas, {
            text: qrCode,
            width: 150,
            height: 150,
        });

        const qrImg = new Image();
        qrImg.src = qrCanvas.toDataURL("image/png");
        qrImg.onload = function () {
            ctx.drawImage(qrImg, canvas.width / 2 - 75, canvas.height - 200, 150, 150);

            // Descargar automáticamente
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = credencial_${index + 1}.png;
            link.click();

            document.getElementById("output").appendChild(canvas);
        };
    };
}
