export type Artista = {
  id: number;
  nombre: string;
  genero: string;
  imagen: string;
  pais: string;
};

export type Disco = {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: string;
  precioInicial: number;
  precioActual: number;
  artistaId: number;
  fechaFin: string;
};

export type Oferta = {
  id: number;
  discoId: number;
  usuarioId: number;
  monto: number;
  fecha: string;
};