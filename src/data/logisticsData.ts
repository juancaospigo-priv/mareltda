import type { SedeId } from '@/data/simData';

export type EstadoCamion = 'En ruta' | 'Cargando' | 'Disponible' | 'Con novedad';
export type EstadoParada = 'Entregada' | 'Próxima' | 'Pendiente';

export interface PuntoRuta {
  nombre: string;
  lat: number;
  lng: number;
}

export interface ParadaRuta extends PuntoRuta {
  orden: number;
  horaEstimada: string;
  cliente: string;
  estado: EstadoParada;
  pedidos: string[];
}

export interface ItemCarga {
  id: string;
  pedido: string;
  cliente: string;
  codigo: string;
  producto: string;
  cantidad: number;
  unidad: string;
  pesoKg: number;
  origen: SedeId;
  destino: string;
  estado: 'Cargado' | 'En tránsito' | 'Entregado';
}

export interface CamionRuta {
  id: string;
  placa: string;
  tipo: string;
  conductor: string;
  telefono: string;
  capacidadKg: number;
  cargaKg: number;
  estado: EstadoCamion;
  salida: string;
  llegadaEstimada: string;
  ubicacionActual: string;
  progreso: number;
  color: string;
  posicion: PuntoRuta;
  ruta: PuntoRuta[];
  paradas: ParadaRuta[];
  carga: ItemCarga[];
  alerta?: string;
}

export const camionesRutas: CamionRuta[] = [
  {
    id: 'CAM-01',
    placa: 'JTX-418',
    tipo: 'Chevrolet NPR',
    conductor: 'Jorge Ramírez',
    telefono: '310 555 0211',
    capacidadKg: 4200,
    cargaKg: 3440,
    estado: 'En ruta',
    salida: '16 sept · 6:30 a. m.',
    llegadaEstimada: '16 sept · 3:40 p. m.',
    ubicacionActual: 'Corredor La Caro–Ubaté',
    progreso: 54,
    color: '#06b6d4',
    posicion: { nombre: 'En tránsito', lat: 5.065, lng: -73.93 },
    ruta: [
      { nombre: 'Siberia', lat: 4.744, lng: -74.181 },
      { nombre: 'La Caro', lat: 4.866, lng: -74.035 },
      { nombre: 'Ubaté', lat: 5.309, lng: -73.815 },
    ],
    paradas: [
      { orden: 1, nombre: 'La Caro', lat: 4.866, lng: -74.035, horaEstimada: '8:10 a. m.', cliente: 'Sede La Caro', estado: 'Entregada', pedidos: ['TR-003'] },
      { orden: 2, nombre: 'Hacienda El Porvenir', lat: 5.281, lng: -73.837, horaEstimada: '12:20 p. m.', cliente: 'Hacienda El Porvenir', estado: 'Próxima', pedidos: ['P-2004'] },
      { orden: 3, nombre: 'Hacienda El Roble', lat: 5.325, lng: -73.792, horaEstimada: '1:45 p. m.', cliente: 'Hacienda El Roble', estado: 'Pendiente', pedidos: ['P-2006'] },
      { orden: 4, nombre: 'Sede Ubaté', lat: 5.309, lng: -73.815, horaEstimada: '3:10 p. m.', cliente: 'Sede Ubaté', estado: 'Pendiente', pedidos: ['TR-004'] },
    ],
    carga: [
      { id: 'CG-001', pedido: 'P-2004', cliente: 'Hacienda El Porvenir', codigo: 'SM-6001', producto: 'Sal Mineralizada Bovina', cantidad: 20, unidad: 'bultos', pesoKg: 500, origen: 'siberia', destino: 'Ubaté', estado: 'En tránsito' },
      { id: 'CG-002', pedido: 'P-2004', cliente: 'Hacienda El Porvenir', codigo: 'AP-2001', producto: 'Antiparasitario Bovino Campo', cantidad: 15, unidad: 'unidades', pesoKg: 18, origen: 'siberia', destino: 'Ubaté', estado: 'En tránsito' },
      { id: 'CG-003', pedido: 'P-2006', cliente: 'Hacienda El Roble', codigo: 'AC-7001', producto: 'Concentrado Lechero Premium', cantidad: 30, unidad: 'bultos', pesoKg: 1200, origen: 'siberia', destino: 'Ubaté', estado: 'En tránsito' },
      { id: 'CG-004', pedido: 'TR-004', cliente: 'Sede Ubaté', codigo: 'AC-7001', producto: 'Concentrado Lechero Premium', cantidad: 30, unidad: 'bultos', pesoKg: 1200, origen: 'siberia', destino: 'Sede Ubaté', estado: 'En tránsito' },
      { id: 'CG-005', pedido: 'TR-003', cliente: 'Sede La Caro', codigo: 'VC-3002', producto: 'Vacuna Mixta Línea Campo', cantidad: 5, unidad: 'cajas', pesoKg: 12, origen: 'siberia', destino: 'La Caro', estado: 'Entregado' },
      { id: 'CG-006', pedido: 'INS-0916', cliente: 'Operación Ubaté', codigo: 'EQ-8003', producto: 'Marcadores auriculares', cantidad: 5, unidad: 'cajas', pesoKg: 510, origen: 'siberia', destino: 'Sede Ubaté', estado: 'En tránsito' },
    ],
  },
  {
    id: 'CAM-02',
    placa: 'KPV-703',
    tipo: 'Chevrolet NHR',
    conductor: 'Diego Torres',
    telefono: '310 555 0212',
    capacidadKg: 2800,
    cargaKg: 1960,
    estado: 'Con novedad',
    salida: '16 sept · 7:15 a. m.',
    llegadaEstimada: '16 sept · 4:25 p. m.',
    ubicacionActual: 'Simijacá, vía principal',
    progreso: 68,
    color: '#f97316',
    posicion: { nombre: 'Simijacá', lat: 5.498, lng: -73.851 },
    ruta: [
      { nombre: 'Ubaté', lat: 5.309, lng: -73.815 },
      { nombre: 'Simijacá', lat: 5.502, lng: -73.852 },
      { nombre: 'Buenos Aires', lat: 5.545, lng: -73.885 },
    ],
    paradas: [
      { orden: 1, nombre: 'Finca El Mirador', lat: 5.474, lng: -73.834, horaEstimada: '9:15 a. m.', cliente: 'Finca El Mirador', estado: 'Entregada', pedidos: ['P-2007'] },
      { orden: 2, nombre: 'Finca La Esperanza', lat: 5.514, lng: -73.856, horaEstimada: '11:30 a. m.', cliente: 'Finca La Esperanza', estado: 'Entregada', pedidos: ['P-1050'] },
      { orden: 3, nombre: 'Hacienda Buenos Aires', lat: 5.545, lng: -73.885, horaEstimada: '2:10 p. m.', cliente: 'Hacienda Buenos Aires', estado: 'Próxima', pedidos: ['P-2005'] },
    ],
    carga: [
      { id: 'CG-007', pedido: 'P-2007', cliente: 'Finca El Mirador', codigo: 'AC-7002', producto: 'Concentrado para Engorde', cantidad: 12, unidad: 'bultos', pesoKg: 480, origen: 'ubate', destino: 'Simijacá', estado: 'Entregado' },
      { id: 'CG-008', pedido: 'P-1050', cliente: 'Finca La Esperanza', codigo: 'SM-6001', producto: 'Sal Mineralizada Bovina', cantidad: 10, unidad: 'bultos', pesoKg: 250, origen: 'ubate', destino: 'Simijacá', estado: 'Entregado' },
      { id: 'CG-009', pedido: 'P-1050', cliente: 'Finca La Esperanza', codigo: 'AP-2001', producto: 'Antiparasitario Bovino Campo', cantidad: 20, unidad: 'unidades', pesoKg: 24, origen: 'ubate', destino: 'Simijacá', estado: 'Entregado' },
      { id: 'CG-010', pedido: 'P-2005', cliente: 'Hacienda Buenos Aires', codigo: 'AC-7002', producto: 'Concentrado para Engorde', cantidad: 30, unidad: 'bultos', pesoKg: 1200, origen: 'ubate', destino: 'Simijacá', estado: 'En tránsito' },
      { id: 'CG-011', pedido: 'P-2005', cliente: 'Hacienda Buenos Aires', codigo: 'SM-6001', producto: 'Sal Mineralizada Bovina', cantidad: 6, unidad: 'bultos', pesoKg: 6, origen: 'ubate', destino: 'Simijacá', estado: 'En tránsito' },
    ],
    alerta: 'Retraso estimado de 25 minutos por cierre parcial de la vía.',
  },
  {
    id: 'CAM-03',
    placa: 'TLM-592',
    tipo: 'Foton Aumark',
    conductor: 'Andrés Pardo',
    telefono: '310 555 0213',
    capacidadKg: 5000,
    cargaKg: 1380,
    estado: 'Cargando',
    salida: '16 sept · 2:00 p. m.',
    llegadaEstimada: '16 sept · 6:30 p. m.',
    ubicacionActual: 'Centro de distribución Siberia',
    progreso: 0,
    color: '#334155',
    posicion: { nombre: 'Siberia', lat: 4.744, lng: -74.181 },
    ruta: [
      { nombre: 'Siberia', lat: 4.744, lng: -74.181 },
      { nombre: 'Chía', lat: 4.86, lng: -74.058 },
      { nombre: 'La Caro', lat: 4.866, lng: -74.035 },
    ],
    paradas: [
      { orden: 1, nombre: 'Finca La Sabana', lat: 4.884, lng: -74.047, horaEstimada: '4:10 p. m.', cliente: 'Finca La Sabana', estado: 'Pendiente', pedidos: ['P-2002'] },
      { orden: 2, nombre: 'Criadero Altos de Cogua', lat: 5.061, lng: -73.982, horaEstimada: '5:20 p. m.', cliente: 'Criadero Altos de Cogua', estado: 'Pendiente', pedidos: ['P-2003'] },
    ],
    carga: [
      { id: 'CG-012', pedido: 'P-2002', cliente: 'Finca La Sabana', codigo: 'AC-7001', producto: 'Concentrado Lechero Premium', cantidad: 15, unidad: 'bultos', pesoKg: 600, origen: 'siberia', destino: 'Chía', estado: 'Cargado' },
      { id: 'CG-013', pedido: 'P-2003', cliente: 'Criadero Altos de Cogua', codigo: 'AP-2003', producto: 'Antiparasitario Equino Campo', cantidad: 10, unidad: 'unidades', pesoKg: 30, origen: 'siberia', destino: 'Cogua', estado: 'Cargado' },
      { id: 'CG-014', pedido: 'TR-001', cliente: 'Sede Ubaté', codigo: 'MD-1001', producto: 'Producto Veterinario Bovino A', cantidad: 15, unidad: 'unidades', pesoKg: 750, origen: 'siberia', destino: 'Ubaté', estado: 'Cargado' },
    ],
  },
];
