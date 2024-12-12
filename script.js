<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generador de Credenciales</title>
    <script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"></script>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>Generador de Credenciales</h1>
    </header>
    <main>
        <section>
            <h2>Generar Credenciales Individualmente</h2>
            <div>
                <label for="nombre">Nombre Completo:</label>
                <input type="text" id="nombre" placeholder="Ingresa el nombre completo">
            </div>
            <div>
                <label for="puesto">Puesto:</label>
                <input type="text" id="puesto" placeholder="Ingresa el puesto">
            </div>
            <div>
                <label for="empresa">Empresa:</label>
                <input type="text" id="empresa" placeholder="Ingresa la empresa" value="Elemento Arquitectura Interior">
            </div>
            <div>
                <label for="codigoQR">Código QR (opcional):</label>
                <input type="text" id="codigoQR" placeholder="Ingresa el código QR">
            </div>
            <button id="generarQR">Generar QR</button>
            <button id="generarUno">Generar Credencial</button>
        </section>
        <div id="output"></div>
    </main>
    <footer>
        <p>© 2024 Elemento Arquitectura Interior</p>
    </footer>
    <script src="script.js"></script>
</body>
</html>
