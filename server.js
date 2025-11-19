const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Servir carpeta PUBLIC para la landing
app.use(express.static(path.join(__dirname, 'public')));

// Solo Facu
const cajero = { nombre: "Facu", numero: "1138219568" };

// Base de datos simple en memoria
let usuarios = {};

// Ruta principal -> tu index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para girar
app.post('/girar', (req, res) => {
  const { usuarioId } = req.body;
  if (!usuarioId) return res.status(400).json({ error: "Falta usuarioId" });

  const now = Date.now();
  const usuario = usuarios[usuarioId];

  // Control cada 24 hs
  if (usuario && now - usuario.lastSpinTime < 24*60*60*1000) {
    const remaining = 24*60*60*1000 - (now - usuario.lastSpinTime);
    const horas = Math.floor(remaining / (1000*60*60));
    const mins = Math.floor((remaining % (1000*60*60)) / (1000*60));

    return res.json({
      yaGiro: true,
      mensaje: `⏳ Podrás volver a girar en ${horas}h ${mins}m`
    });
  }

  // Premios
  const premios = [
    "10% extra (en mi primera carga)",
    "15% extra (en mi primera carga)",
    "20% extra (en mi primera carga)",
    "30% extra (en mi segunda carga)",
    "100 fichas (sin carga, no retirables)",
    "500 fichas (sin carga, no retirables)",
    "300 fichas (sin carga, no retirables)"
  ];

  const premio = premios[Math.floor(Math.random() * premios.length)];

  // Guardar usuario
  usuarios[usuarioId] = {
    lastSpinTime: now
  };

  res.json({
    yaGiro: false,
    cajero,
    premio
  });
});

// Iniciar servidor
app.listen(PORT, () => 
  console.log(`Servidor funcionando en http://localhost:${PORT}`)
);
