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

export type CartItem = {
  disco: Disco;
  cantidad: number;
};

export type FacturaItem = {
  discoId: number;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
};

export type Factura = {
  id: string;
  folio: string;
  fecha: string;
  items: FacturaItem[];
  subtotal: number;
  impuestos: number;
  total: number;
};