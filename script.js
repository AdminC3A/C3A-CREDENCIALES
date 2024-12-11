document.getElementById("generarUno").addEventListener("click", generateOneCredential);
document.getElementById("generarArchivo").addEventListener("click", handleFile);

// Generar credencial individual
function generateOneCredential() {
    const name = document.getElementById("nombre").value.trim();
    const position = document.getElementById("puesto").value.trim();
    const company = document.getElementById("empresa").value.trim();

    if (!name || !position || !company) {
        alert("Por favor, llena todos los campos.");
        return;
    }

    const qrCode = `${name.split(" ").map(w => w[0]).join("")}${Math.random().toString().slice(2, 8)}`;
    generateCredential(name, position, company, qrCode, 0);
}

// Manejar archivo Excel/CSV y generar credenciales en lote
function handleFile() {
    const fileInput = document.getElementById("fileInput").files[0];
    if (!fileInput) {
        alert("Por favor, carga un archivo Excel o CSV.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = XLSX.utils.sheet_to_json(sheet);

        if (rows.length === 0) {
            alert("El archivo está vacío.");
            return;
        }

        rows.forEach((row, index) => {
            const name = row["Nombre Completo"];
            const position = row["Puesto"];
            const company = row["Empresa"] || "Elemento Arquitectura Interior";
            const qrCode = `${name.split(" ").map(w => w[0]).join("")}${Math.random().toString().slice(2, 8)}`;
            generateCredential(name, position, company, qrCode, index);
        });

        alert("Credenciales generadas.");
    };

    reader.readAsArrayBuffer(fileInput);
}

// Función para generar la credencial
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
    logo.src = "logo.png"; // Asegúrate de tener este archivo en tu proyecto
    logo.onload = function () {
        ctx.drawImage(logo, canvas.width / 2 - 75, 30, 150, 150);

        // Texto centrado
        ctx.fillStyle = "#333";
        ctx.font = "bold 30px Arial";
        ctx.textAlign = "center";

        ctx.fillText("Credencial de Acceso", canvas.width / 2, 220);
        ctx.font = "20px Arial";
        ctx.fillText(`Nombre: ${name}`, canvas.width / 2, 300);
        ctx.fillText(`Puesto: ${position}`, canvas.width / 2, 350);
        ctx.fillText(`Empresa: ${company}`, canvas.width / 2, 400);

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
            link.download = `credencial_${index + 1}.png`;
            link.click();

            // Mostrar credencial generada en la página
            document.getElementById("output").appendChild(canvas);
        };
    };
}
