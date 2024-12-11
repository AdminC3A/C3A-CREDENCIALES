document.getElementById("generarUno").addEventListener("click", generateOneCredential);
document.getElementById("generarArchivo").addEventListener("click", handleFile);

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

function generateCredential(name, position, company, qrCode, index) {
    const canvas = document.createElement("canvas");
    canvas.width = 1000;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const logo = new Image();
    logo.src = "logo.png";
    logo.onload = function () {
        ctx.drawImage(logo, 30, 30, 150, 150);

        ctx.fillStyle = "#333";
        ctx.font = "bold 40px Arial";
        ctx.fillText("Credencial de Acceso", 200, 70);
        ctx.font = "30px Arial";
        ctx.fillText(`Nombre: ${name}`, 200, 150);
        ctx.fillText(`Puesto: ${position}`, 200, 200);
        ctx.fillText(`Empresa: ${company}`, 200, 250);

        const qrCanvas = document.createElement("canvas");
        new QRCode(qrCanvas, {
            text: qrCode,
            width: 150,
            height: 150,
        });

        const qrImg = new Image();
        qrImg.src = qrCanvas.toDataURL("image/png");
        qrImg.onload = function () {
            ctx.drawImage(qrImg, 750, 100, 150, 150);

            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = `credencial_${index + 1}.png`;
            link.click();

            document.getElementById("output").appendChild(canvas);
        };
    };
}
