import { Artista, Disco } from '../types';

export const artistas: Artista[] = [
  {
    id: 1,
    nombre: 'The Weeknd',
    genero: 'R&B / Pop',
    imagen: 'https://i.pinimg.com/1200x/7e/f5/79/7ef579549eeee0d7b668f922dc2d1758.jpg',
    pais: 'Canadá',
  },
  {
    id: 2,
    nombre: 'Oasis',
    genero: 'Britpop',
    imagen: 'https://i.pinimg.com/736x/1d/02/9b/1d029b04b42cfed2080964f0985dbdcc.jpg',
    pais: 'Reino Unido',
  },
  {
    id: 3,
    nombre: 'Hoobastank',
    genero: 'Rock Alternativo',
    imagen: 'https://i.pinimg.com/1200x/67/e9/c4/67e9c48bb201660cb592e9c77177852f.jpg',
    pais: 'Estados Unidos',
  },
  {
    id: 4,
    nombre: 'The Fray',
    genero: 'Rock Alternativo',
    imagen: 'https://i.pinimg.com/736x/47/0e/c6/470ec68a4fc71260173e23499150cf43.jpg',
    pais: 'Estados Unidos',
  },
  {
    id: 5,
    nombre: 'Green Day',
    genero: 'Punk Rock',
    imagen: 'https://i.pinimg.com/736x/fc/22/6c/fc226cd9f6231dd47fda0ff17b4481d9.jpg',
    pais: 'Estados Unidos',
  },
  {
    id: 6,
    nombre: 'Charles Ans',
    genero: 'Rap',
    imagen: 'https://i.pinimg.com/1200x/76/f5/7f/76f57f109397d81a428a659e894ce23e.jpg',
    pais: 'México',
  },
  {
    id: 7,
    nombre: 'Metro Boomin',
    genero: 'Hip Hop',
    imagen: 'https://i.pinimg.com/736x/6c/2a/46/6c2a46371ade6b3cd0aeb46928a0e995.jpg',
    pais: 'Estados Unidos',
  },
  {
    id: 8,
    nombre: 'Asyd G',
    genero: 'Hip-Hop', // ✅ CORREGIDO
    imagen: require('../../assets/ytuno.jpg'),
    pais: 'México',
  },
  {
    id: 9,
    nombre: 'Alec Benjamin',
    genero: 'Pop',
    imagen: 'https://i.pinimg.com/736x/27/ae/9c/27ae9c2d75b51f532eac1c2feecc9e7b.jpg',
    pais: 'Estados Unidos',
  },
  {
    id: 10,
    nombre: 'Jaden Smith ft. Taylor Felt',
    genero: 'Hip Hop',
    imagen: 'https://i.pinimg.com/1200x/27/b3/81/27b381803918a1fc76f7b95175102a0a.jpg',
    pais: 'Estados Unidos',
  },
];

export const discos: Disco[] = [
  // ... TODOS IGUAL

  {
    id: 16,
    nombre: 'Y TÚ NO',
    descripcion: 'Álbum de Asyd G.',
    imagen: require('../../assets/ytuno.jpg'),
    precioInicial: 180,
    precioActual: 240,
    artistaId: 8,
    fechaFin: '2026-07-16',
  },

  // ... LOS DEMÁS IGUAL
];