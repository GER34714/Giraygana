const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

// Lista de cajeros
const cajeros = [
  { nombre: "Joaki", numero: "1123365501" },
  { nombre: "Facu", numero: "1125127839" }
];

// Base de datos en memoria (puede ser reemplazada por un JSON o DB real)
let usuarios = {}; // { usuarioId: { cajeroIndex, lastSpinTime } }
let currentCajeroIndex = 0;

// Ruta para obtener cajero y premio
app.post('/girar', (req, res) => {
  const { usuarioId } = req.body;
  if (!usuarioId) return res.status(400).json({ error: "Falta usuarioId" });

  const now = Date.now();
  let usuario = usuarios[usuarioId];

  // Si ya giró en 24 hs
  if (usuario && now - usuario.lastSpinTime < 24*60*60*1000) {
    const remaining = 24*60*60*1000 - (now - usuario.lastSpinTime);
    const horas = Math.floor(remaining / (1000*60*60));
    const mins = Math.floor((remaining % (1000*60*60)) / (1000*60));
    return res.json({ yaGiro: true, mensaje: `⏳ Podrás volver a girar en ${horas}h ${mins}m` });
  }

  // Asignar siguiente cajero rotativo
  const cajero = cajeros[currentCajeroIndex % cajeros.length];
  currentCajeroIndex++;

  // Guardar al usuario
  usuarios[usuarioId] = {
    cajeroIndex: currentCajeroIndex - 1,
    lastSpinTime: now
  };

  // Generar premio aleatorio
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

  res.json({ yaGiro: false, cajero, premio });
});

app.listen(PORT, () => console.log(`Backend corriendo en http://localhost:${PORT}`));
