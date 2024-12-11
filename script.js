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
    logo.src = "logo.png"; // Ruta del logo (asegúrate de que este archivo esté en la raíz)
    logo.onload = function () {
        ctx.drawImage(logo, canvas.width / 2 - 75, 30, 150, 150); // Ajusta el tamaño del logo (150x150)

        // Texto del título centrado debajo del logo
        ctx.fillStyle = "#333";
        ctx.font = "bold 30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Credencial de Acceso", canvas.width / 2, 200);

        // Marco negro con centro blanco para la foto
        ctx.lineWidth = 3; // Grosor del borde
        ctx.strokeStyle = "#000"; // Color del borde
        ctx.strokeRect(225, 220, 150, 200); // Dibuja el marco
        ctx.fillStyle = "#fff"; // Fondo blanco del marco
        ctx.fillRect(225 + 3, 220 + 3, 150 - 6, 200 - 6); // Rellena con blanco dejando espacio para el borde

        // Texto centrado (nombre, puesto, empresa)
        ctx.fillStyle = "#333";
        ctx.font = "bold 20px Arial";
        ctx.fillText("Nombre:", canvas.width / 2, 450);
        ctx.font = "normal 18px Arial";
        ctx.fillText(name, canvas.width / 2, 480);

        ctx.font = "bold 20px Arial";
        ctx.fillText("Puesto:", canvas.width / 2, 510);
        ctx.font = "normal 18px Arial";
        ctx.fillText(position, canvas.width / 2, 540);

        ctx.font = "bold 20px Arial";
        ctx.fillText("Empresa:", canvas.width / 2, 570);
        ctx.font = "normal 18px Arial";
        ctx.fillText(company, canvas.width / 2, 600);

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
            ctx.drawImage(qrImg, canvas.width / 2 - 75, 700, 150, 150);

            // Descargar automáticamente
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = `credencial_${index + 1}.png`;
            link.click();

            // Mostrar credencial generada en la página
            document.getElementById("output").appendChild(canvas);
        };
    };
}
