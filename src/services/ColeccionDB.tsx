import * as SQLite from 'expo-sqlite';

// Abre (o crea) la base de datos. El archivo persiste entre sesiones.
const db = SQLite.openDatabaseSync('coleccion.db');

export type DiscoColeccion = {
  id: number;
  nombre: string;
  artista: string;
  genero: string;
  año: number;
  nota: string;
};

/** Crea la tabla si no existe — se llama al arrancar la app */
export function inicializarDB() {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS coleccion (
      id      INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre  TEXT    NOT NULL,
      artista TEXT    NOT NULL,
      genero  TEXT    NOT NULL,
      año     INTEGER NOT NULL,
      nota    TEXT    DEFAULT ''
    );
  `);
}

/** Inserta un disco y devuelve el id generado */
export function insertarDisco(
  nombre: string,
  artista: string,
  genero: string,
  año: number,
  nota: string
): number {
  const result = db.runSync(
    'INSERT INTO coleccion (nombre, artista, genero, año, nota) VALUES (?, ?, ?, ?, ?);',
    [nombre, artista, genero, año, nota]
  );
  return result.lastInsertRowId;
}

/** Devuelve todos los discos ordenados por id desc */
export function obtenerDiscos(): DiscoColeccion[] {
  return db.getAllSync<DiscoColeccion>(
    'SELECT * FROM coleccion ORDER BY id DESC;'
  );
}

/** Actualiza un disco existente */
export function actualizarDisco(
  id: number,
  nombre: string,
  artista: string,
  genero: string,
  año: number,
  nota: string
) {
  db.runSync(
    'UPDATE coleccion SET nombre=?, artista=?, genero=?, año=?, nota=? WHERE id=?;',
    [nombre, artista, genero, año, nota, id]
  );
}

/** Elimina un disco por id */
export function eliminarDisco(id: number) {
  db.runSync('DELETE FROM coleccion WHERE id=?;', [id]);
}