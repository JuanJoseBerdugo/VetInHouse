const map = L.map('map').setView([6.2442, -75.5812], 12); // Medellín

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Lista de agentes con coordenadas aproximadas
const agentes = [
  {
    nombre: "Martina Vargas",
    coords: [6.2632, -75.5802],
    edad: 24
  },
  {
    nombre: "Laura Blanco",
    coords: [6.2512, -75.5652],
    edad: 26
  },
  {
    nombre: "Julián Gómez",
    coords: [6.2565, -75.5859],
    edad: 30
  }
];

agentes.forEach(agente => {
  L.marker(agente.coords)
    .addTo(map)
    .bindPopup(`<strong>${agente.nombre}</strong><br>${agente.edad} años`);
});
