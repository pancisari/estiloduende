#!/usr/bin/env node
// Script de migración único: mueve imágenes existentes a fotos/ con el nuevo nombre
const fs = require('fs');
const path = require('path');

function sanitize(str) {
  return str
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-{2,}/g, '-');
}

function toNewFilename(cat, nombre) {
  const catPart = cat.replace(/ /g, '+');
  const namePart = sanitize(nombre);
  return `${catPart}__${namePart}.jpg`;
}

const productos = [
  {img:"buzo adidas marron.jpg", nombre:"Buzo Adidas Marron", cat:"buzos"},
  {img:"Buzo CABJ.jpg", nombre:"Buzo Boca Juniors", cat:"boca+buzos"},
  {img:"buzo canguro adidas.jpg", nombre:"Buzo Canguro Adidas", cat:"buzos"},
  {img:"buzo CARP.jpg", nombre:"Buzo River Plate", cat:"river+buzos"},
  {img:"buzo con capucha Boca Juniors.jpg", nombre:"Buzo con Capucha Boca Juniors", cat:"boca+buzos"},
  {img:"buzo con capucha CABJ.jpg", nombre:"Buzo con Capucha CABJ", cat:"boca+buzos"},
  {img:"buzo estilo pupero nike verde.jpg", nombre:"Buzo Pupero Nike Verde", cat:"buzos+mujer"},
  {img:"buzo estilo pupero nike.jpg", nombre:"Buzo Pupero Nike", cat:"buzos+mujer"},
  {img:"buzo hombre varios colores.jpg", nombre:"Buzo Hombre Varios Colores", cat:"buzos"},
  {img:"buzo independiente negro.jpg", nombre:"Buzo Independiente Negro", cat:"buzos"},
  {img:"buzo kanguro the North Face.jpg", nombre:"Buzo Canguro The North Face", cat:"buzos"},
  {img:"buzo manga larga Boca Juniors.jpg", nombre:"Buzo Manga Larga Boca Juniors", cat:"boca+buzos"},
  {img:"buzo manga larga river plate.jpg", nombre:"Buzo Manga Larga River Plate", cat:"river+buzos"},
  {img:"buzo mujer nike.jpg", nombre:"Buzo Mujer Nike", cat:"buzos+mujer"},
  {img:"buzo negro barcelona.jpg", nombre:"Buzo Negro Barcelona", cat:"buzos+internacional"},
  {img:"buzo nike.jpg", nombre:"Buzo Nike", cat:"buzos"},
  {img:"buzo rosa mujer.jpg", nombre:"Buzo Rosa Mujer", cat:"buzos+mujer"},
  {img:"buzos varios colores.jpg", nombre:"Buzos Varios Colores", cat:"buzos"},
  {img:"calza bordo mujer.jpg", nombre:"Calza Bordo Mujer", cat:"calzas+mujer"},
  {img:"calza mujer ALO.jpg", nombre:"Calza Mujer ALO", cat:"calzas+mujer"},
  {img:"calza mujer Alo rosa.jpg", nombre:"Calza Mujer ALO Rosa", cat:"calzas+mujer"},
  {img:"calza mujer estilo oxford.jpg", nombre:"Calza Mujer Estilo Oxford", cat:"calzas+mujer"},
  {img:"calza mujer negra adidas.jpg", nombre:"Calza Mujer Negra Adidas", cat:"calzas+mujer"},
  {img:"calza negra nike.jpg", nombre:"Calza Negra Nike", cat:"calzas+mujer"},
  {img:"camiseta argentina mujer.jpg", nombre:"Camiseta Argentina Mujer", cat:"argentina+mujer"},
  {img:"camiseta boca junior manga larga numero 5 Paredes.jpg", nombre:"Camiseta Boca Paredes 5", cat:"boca"},
  {img:"camiseta cristiano ronaldo.jpg", nombre:"Camiseta Cristiano Ronaldo", cat:"internacional"},
  {img:"camiseta dibu martinez.jpg", nombre:"Camiseta Dibu Martinez 23", cat:"argentina"},
  {img:"camiseta liverpool edicion limitada.jpg", nombre:"Camiseta Liverpool Edicion Limitada", cat:"internacional"},
  {img:"camiseta manga larga Boca Juniors.jpg", nombre:"Camiseta Manga Larga Boca Juniors", cat:"boca"},
  {img:"camiseta manga larga CABJ.jpg", nombre:"Camiseta Manga Larga CABJ", cat:"boca"},
  {img:"camiseta manga larga Milan.jpg", nombre:"Camiseta Manga Larga AC Milan", cat:"internacional"},
  {img:"camiseta manga larga meesi 19.jpg", nombre:"Camiseta Manga Larga Messi 19", cat:"argentina"},
  {img:"camiseta retro river.jpg", nombre:"Camiseta Retro River Plate", cat:"river"},
  {img:"camisetas de futbol.jpg", nombre:"Camisetas de Futbol Varios", cat:"internacional"},
  {img:"dibu martinez camiseta.jpg", nombre:"Camiseta Dibu Martinez", cat:"argentina"},
  {img:"CABJ campera.jpg", nombre:"Campera CABJ", cat:"boca"},
  {img:"campera CABJ.jpg", nombre:"Campera Boca Juniors", cat:"boca"},
  {img:"campera Hombre.jpg", nombre:"Campera Hombre", cat:"buzos"},
  {img:"campera pantalon CARP.jpg", nombre:"Campera Pantalon River Plate", cat:"river+conjuntos"},
  {img:"campera Racing.jpg", nombre:"Campera Racing Club", cat:"racing"},
  {img:"camperas varios colores.jpg", nombre:"Camperas Varios Colores", cat:"buzos"},
  {img:"camperon AFA.jpg", nombre:"Camperon AFA", cat:"argentina"},
  {img:"camperones boca juniors.jpg", nombre:"Camperon Boca Juniors", cat:"boca"},
  {img:"camseta retro CARP.jpg", nombre:"Camiseta Retro River Plate Alt", cat:"river"},
  {img:"carp conjunto.jpg", nombre:"Conjunto River Plate", cat:"river+conjuntos"},
  {img:"conjuno deportivo Alo mujer.jpg", nombre:"Conjunto Deportivo ALO Mujer", cat:"conjuntos+mujer"},
  {img:"conjuno deportivo rosado.jpg", nombre:"Conjunto Deportivo Rosado", cat:"conjuntos+mujer"},
  {img:"conjunto AFA pantalon Campera.jpg", nombre:"Conjunto AFA Pantalon Campera", cat:"argentina+conjuntos"},
  {img:"conjunto adidas celeste.jpg", nombre:"Conjunto Adidas Celeste", cat:"conjuntos"},
  {img:"conjunto afa azul celeste.jpg", nombre:"Conjunto AFA Azul Celeste", cat:"argentina+conjuntos"},
  {img:"conjunto afa celeste.jpg", nombre:"Conjunto AFA Celeste", cat:"argentina+conjuntos"},
  {img:"conjunto afa chicos.jpg", nombre:"Conjunto AFA Ninos", cat:"argentina+conjuntos+ninos"},
  {img:"conjunto boca juniors chicos.jpg", nombre:"Conjunto Boca Juniors Ninos", cat:"boca+conjuntos+ninos"},
  {img:"conjunto celeste seleccion argentina.jpg", nombre:"Conjunto Celeste Seleccion Argentina", cat:"argentina+conjuntos"},
  {img:"conjunto deportivo manga larga Gris.jpg", nombre:"Conjunto Deportivo Manga Larga Gris", cat:"conjuntos"},
  {img:"conjunto deportivo mujer negro.jpg", nombre:"Conjunto Deportivo Mujer Negro", cat:"conjuntos+mujer"},
  {img:"conjunto deportivo mujer rosa.jpg", nombre:"Conjunto Deportivo Mujer Rosa", cat:"conjuntos+mujer"},
  {img:"conjunto deportivo mujer zul.jpg", nombre:"Conjunto Deportivo Mujer Azul", cat:"conjuntos+mujer"},
  {img:"conjunto deportivo negro NIKE.jpg", nombre:"Conjunto Deportivo Negro Nike", cat:"conjuntos"},
  {img:"conjunto deportivo nike color negro.jpg", nombre:"Conjunto Deportivo Nike Negro", cat:"conjuntos"},
  {img:"conjunto deportivo nike.jpg", nombre:"Conjunto Deportivo Nike", cat:"conjuntos"},
  {img:"conjunto deportivo nino river plate.jpg", nombre:"Conjunto Deportivo Nino River Plate", cat:"river+conjuntos+ninos"},
  {img:"conjunto deportivo seleccion argentina.jpg", nombre:"Conjunto Deportivo Seleccion Argentina", cat:"argentina+conjuntos"},
  {img:"conjunto gris nike..jpg", nombre:"Conjunto Gris Nike A", cat:"conjuntos"},
  {img:"conjunto gris nike.jpg", nombre:"Conjunto Gris Nike B", cat:"conjuntos"},
  {img:"conjunto inter miami.jpg", nombre:"Conjunto Inter Miami", cat:"conjuntos+internacional"},
  {img:"conjunto mujer rosadas.jpg", nombre:"Conjunto Mujer Rosado", cat:"conjuntos+mujer"},
  {img:"conjunto nike gris.jpg", nombre:"Conjunto Nike Gris", cat:"conjuntos"},
  {img:"deportivo negro mujee.jpg", nombre:"Conjunto Deportivo Negro Mujer Alt", cat:"conjuntos+mujer"},
  {img:"maga larga deportiva mujer.jpg", nombre:"Manga Larga Deportiva Mujer A", cat:"mujer"},
  {img:"maga larga messi 19.jpg", nombre:"Manga Larga Messi 19", cat:"argentina"},
  {img:"manga larga deportiva mujer.jpg", nombre:"Manga Larga Deportiva Mujer B", cat:"mujer"},
  {img:"medias afa.jpg", nombre:"Medias AFA", cat:"medias+argentina"},
  {img:"medias azules adidas.jpg", nombre:"Medias Azules Adidas", cat:"medias"},
  {img:"medias blancas Vans.jpg", nombre:"Medias Blancas Vans", cat:"medias"},
  {img:"medias blancas adidas.jpg", nombre:"Medias Blancas Adidas", cat:"medias"},
  {img:"medias blanco y negro.jpg", nombre:"Medias Blanco y Negro", cat:"medias"},
  {img:"medias largas blanca nike.jpg", nombre:"Medias Largas Blancas Nike", cat:"medias"},
  {img:"medias motivo messi 10..jpg", nombre:"Medias Motivo Messi 10 A", cat:"medias+argentina"},
  {img:"medias motivo messi 10.jpg", nombre:"Medias Motivo Messi 10 B", cat:"medias+argentina"},
  {img:"medias motivo patitas.jpg", nombre:"Medias Motivo Patitas", cat:"medias"},
  {img:"medias motivo unicornio.jpg", nombre:"Medias Motivo Unicornio", cat:"medias"},
  {img:"medias motivos divertidos.jpg", nombre:"Medias Motivos Divertidos", cat:"medias"},
  {img:"medias motivos flores.jpg", nombre:"Medias Motivos Flores", cat:"medias"},
  {img:"medias motivos gatitos.jpg", nombre:"Medias Motivos Gatitos", cat:"medias"},
  {img:"medias motivos varios.jpg", nombre:"Medias Motivos Varios", cat:"medias"},
  {img:"medias negra.jpg", nombre:"Medias Negras", cat:"medias"},
  {img:"medias negras adidas.jpg", nombre:"Medias Negras Adidas", cat:"medias"},
  {img:"medias nike blanca celeste.jpg", nombre:"Medias Nike Blanca Celeste", cat:"medias"},
  {img:"medias nike blancas.jpg", nombre:"Medias Nike Blancas", cat:"medias"},
  {img:"top deportivo mujer.jpg", nombre:"Top Deportivo Mujer", cat:"tops+mujer"},
  {img:"top gris nike.jpg", nombre:"Top Gris Nike", cat:"tops+mujer"},
  {img:"top nike mujer celeste.jpg", nombre:"Top Nike Mujer Celeste", cat:"tops+mujer"},
  {img:"top nike varios colores.jpg", nombre:"Top Nike Varios Colores", cat:"tops+mujer"},
  {img:"top print mujer.jpg", nombre:"Top Print Mujer", cat:"tops+mujer"},
  {img:"IMG-20260613-WA0079(1).jpg", nombre:"Conjunto AFA Celeste Nuevo", cat:"argentina+conjuntos"},
  {img:"IMG-20260613-WA0079.jpg", nombre:"Conjunto AFA Nuevo", cat:"argentina+conjuntos"},
  {img:"IMG-20260613-WA0084(1).jpg", nombre:"Conjunto AFA Pantalon Nuevo", cat:"argentina+conjuntos"},
  {img:"IMG-20260613-WA0085(1).jpg", nombre:"Campera AFA Verde", cat:"argentina"},
];

const ROOT = path.join(__dirname, '..');
const FOTOS = path.join(ROOT, 'fotos');

if (!fs.existsSync(FOTOS)) fs.mkdirSync(FOTOS);

let ok = 0, skip = 0;
const used = new Set();

for (const p of productos) {
  const src = path.join(ROOT, p.img);
  if (!fs.existsSync(src)) {
    console.warn(`⚠  FALTANTE: ${p.img}`);
    skip++;
    continue;
  }

  let newName = toNewFilename(p.cat, p.nombre);

  // Prevent collisions
  if (used.has(newName)) {
    const base = newName.replace(/\.jpg$/, '');
    let n = 2;
    while (used.has(`${base}-${n}.jpg`)) n++;
    newName = `${base}-${n}.jpg`;
  }
  used.add(newName);

  const dest = path.join(FOTOS, newName);
  fs.copyFileSync(src, dest);
  console.log(`✓  ${p.img}\n   → fotos/${newName}`);
  ok++;
}

console.log(`\nMigración completa: ${ok} copiadas, ${skip} faltantes.`);
