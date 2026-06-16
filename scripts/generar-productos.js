#!/usr/bin/env node
// Genera productos.json escaneando la carpeta fotos/
// Formato de nombre: categoria1+categoria2__nombre-del-producto.jpg
const fs = require('fs');
const path = require('path');

const FOTOS_DIR = path.join(__dirname, '..', 'fotos');
const OUTPUT    = path.join(__dirname, '..', 'productos.json');

function toTitleCase(str) {
  const minusculas = new Set(['de','del','el','la','los','las','y','e','o','u','con','en','al','un','una']);
  return str
    .split(' ')
    .map((w, i) => (i === 0 || !minusculas.has(w)) ? w.charAt(0).toUpperCase() + w.slice(1) : w)
    .join(' ');
}

const archivos = fs.readdirSync(FOTOS_DIR)
  .filter(f => /\.(jpg|jpeg|png|webp|avif)$/i.test(f))
  .sort();

const productos = archivos.map(filename => {
  const stem = path.parse(filename).name;
  const parts = stem.split('__');

  let cat, nombre;

  if (parts.length >= 2) {
    // cat1+cat2__nombre-del-producto → cat: "cat1 cat2", nombre: "Nombre Del Producto"
    cat    = parts[0].replace(/\+/g, ' ');
    nombre = toTitleCase(parts.slice(1).join(' ').replace(/-/g, ' '));
  } else {
    cat    = 'varios';
    nombre = toTitleCase(stem.replace(/[-_+]/g, ' '));
  }

  return { img: `fotos/${filename}`, nombre, cat };
});

fs.writeFileSync(OUTPUT, JSON.stringify(productos, null, 2));
console.log(`✓ ${productos.length} productos generados → productos.json`);
