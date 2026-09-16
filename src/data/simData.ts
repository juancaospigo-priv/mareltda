// Simulated data layer for MARE Control IA
// All data is fictitious but internally consistent across screens.

export type SedeId = 'siberia' | 'la-caro' | 'ubate' | 'simijaca';

export interface Sede {
  id: SedeId;
  nombre: string;
  municipio: string;
}

export const sedes: Sede[] = [
  { id: 'siberia', nombre: 'Siberia', municipio: 'Bogotá' },
  { id: 'la-caro', nombre: 'La Caro', municipio: 'Chía' },
  { id: 'ubate', nombre: 'Ubaté', municipio: 'Ubaté' },
  { id: 'simijaca', nombre: 'Simijaca', municipio: 'Simijacá' },
];

export type ProductoCategoria =
  | 'Medicamentos veterinarios'
  | 'Antiparasitarios'
  | 'Vacunas'
  | 'Antiinflamatorios'
  | 'Nutrición y suplementos'
  | 'Sales mineralizadas'
  | 'Alimentos concentrados'
  | 'Equipos e insumos pecuarios';

export type EstadoInventario = 'Disponible' | 'Inventario bajo' | 'Agotado' | 'Baja rotación';
export type Rotacion = 'Alta' | 'Media' | 'Baja';

export interface Producto {
  codigo: string;
  nombre: string;
  categoria: ProductoCategoria;
  presentacion: string;
  especie: 'Bovinos' | 'Equinos' | 'Ambos';
  laboratorio: string;
  stock: Record<SedeId, number>;
  rotacion: Rotacion;
  ultimoMovimiento: string; // ISO date
  estado: EstadoInventario;
}

function estadoFromStock(stock: Record<SedeId, number>, rotacion: Rotacion): EstadoInventario {
  const total = Object.values(stock).reduce((a, b) => a + b, 0);
  if (total === 0) return 'Agotado';
  if (rotacion === 'Baja') return 'Baja rotación';
  if (total < 20) return 'Inventario bajo';
  return 'Disponible';
}

// 24 fictitious products
const rawProductos: Omit<Producto, 'estado'>[] = [
  // Medicamentos veterinarios
  { codigo: 'MD-1001', nombre: 'Oxitetravet 10% Inyectable', categoria: 'Medicamentos veterinarios', presentacion: 'Frasco 100ml', especie: 'Bovinos', laboratorio: 'VetPharma', stock: { siberia: 48, 'la-caro': 12, ubate: 0, simijaca: 5 }, rotacion: 'Alta', ultimoMovimiento: '2026-09-12' },
  { codigo: 'MD-1002', nombre: 'Penivet L.A. 15%', categoria: 'Medicamentos veterinarios', presentacion: 'Frasco 250ml', especie: 'Bovinos', laboratorio: 'AgroLab', stock: { siberia: 30, 'la-caro': 25, ubate: 18, simijaca: 0 }, rotacion: 'Media', ultimoMovimiento: '2026-09-08' },
  { codigo: 'MD-1003', nombre: 'Sulfavet Solución Oral', categoria: 'Medicamentos veterinarios', presentacion: 'Frasco 1L', especie: 'Ambos', laboratorio: 'VetPharma', stock: { siberia: 0, 'la-caro': 0, ubate: 0, simijaca: 0 }, rotacion: 'Media', ultimoMovimiento: '2026-08-28' },
  // Antiparasitarios
  { codigo: 'AP-2001', nombre: 'Ivermectivet 1% Inyectable', categoria: 'Antiparasitarios', presentacion: 'Frasco 50ml', especie: 'Bovinos', laboratorio: 'Parasol', stock: { siberia: 60, 'la-caro': 40, ubate: 15, simijaca: 22 }, rotacion: 'Alta', ultimoMovimiento: '2026-09-14' },
  { codigo: 'AP-2002', nombre: 'Dectomax Genérico Pour-On', categoria: 'Antiparasitarios', presentacion: 'Bidón 5L', especie: 'Bovinos', laboratorio: 'Parasol', stock: { siberia: 8, 'la-caro': 0, ubate: 0, simijaca: 3 }, rotacion: 'Alta', ultimoMovimiento: '2026-09-10' },
  { codigo: 'AP-2003', nombre: 'Fenbendazol Equino 10%', categoria: 'Antiparasitarios', presentacion: 'Bolsa 1kg', especie: 'Equinos', laboratorio: 'EquiCare', stock: { siberia: 20, 'la-caro': 6, ubate: 0, simijaca: 0 }, rotacion: 'Media', ultimoMovimiento: '2026-09-05' },
  // Vacunas
  { codigo: 'VC-3001', nombre: 'Vacuvet Triple Bovina', categoria: 'Vacunas', presentacion: 'Caja 10 dosis', especie: 'Bovinos', laboratorio: 'BioVacunas', stock: { siberia: 35, 'la-caro': 18, ubate: 10, simijaca: 8 }, rotacion: 'Alta', ultimoMovimiento: '2026-09-13' },
  { codigo: 'VC-3002', nombre: 'Vacuvet Antirrábica', categoria: 'Vacunas', presentacion: 'Caja 10 dosis', especie: 'Ambos', laboratorio: 'BioVacunas', stock: { siberia: 12, 'la-caro': 0, ubate: 0, simijaca: 0 }, rotacion: 'Media', ultimoMovimiento: '2026-09-01' },
  { codigo: 'VC-3003', nombre: 'Vacuvet Equina Influenza', categoria: 'Vacunas', presentacion: 'Caja 5 dosis', especie: 'Equinos', laboratorio: 'BioVacunas', stock: { siberia: 0, 'la-caro': 0, ubate: 0, simijaca: 0 }, rotacion: 'Baja', ultimoMovimiento: '2026-07-20' },
  // Antiinflamatorios
  { codigo: 'AI-4001', nombre: 'Meloxivet 2% Inyectable', categoria: 'Antiinflamatorios', presentacion: 'Frasco 100ml', especie: 'Ambos', laboratorio: 'VetPharma', stock: { siberia: 25, 'la-caro': 10, ubate: 8, simijaca: 4 }, rotacion: 'Media', ultimoMovimiento: '2026-09-11' },
  { codigo: 'AI-4002', nombre: 'Flunixivet 10% Inyectable', categoria: 'Antiinflamatorios', presentacion: 'Frasco 50ml', especie: 'Bovinos', laboratorio: 'AgroLab', stock: { siberia: 0, 'la-caro': 0, ubate: 0, simijaca: 0 }, rotacion: 'Media', ultimoMovimiento: '2026-08-25' },
  // Nutrición y suplementos
  { codigo: 'NS-5001', nombre: 'VitaBovino Inyectable B12', categoria: 'Nutrición y suplementos', presentacion: 'Caja 10 amp', especie: 'Bovinos', laboratorio: 'NutriVet', stock: { siberia: 40, 'la-caro': 22, ubate: 15, simijaca: 10 }, rotacion: 'Alta', ultimoMovimiento: '2026-09-14' },
  { codigo: 'NS-5002', nombre: 'EquiPower Suplemento Energético', categoria: 'Nutrición y suplementos', presentacion: 'Bolsa 2kg', especie: 'Equinos', laboratorio: 'EquiCare', stock: { siberia: 15, 'la-caro': 8, ubate: 0, simijaca: 0 }, rotacion: 'Media', ultimoMovimiento: '2026-09-06' },
  { codigo: 'NS-5003', nombre: 'CalcioBovino Plus Inyectable', categoria: 'Nutrición y suplementos', presentacion: 'Frasco 100ml', especie: 'Bovinos', laboratorio: 'NutriVet', stock: { siberia: 5, 'la-caro': 0, ubate: 0, simijaca: 0 }, rotacion: 'Baja', ultimoMovimiento: '2026-06-15' },
  // Sales mineralizadas
  { codigo: 'SM-6001', nombre: 'Sal Mineralizada Bovina 12%', categoria: 'Sales mineralizadas', presentacion: 'Saco 25kg', especie: 'Bovinos', laboratorio: 'MineralAndes', stock: { siberia: 80, 'la-caro': 50, ubate: 30, simijaca: 25 }, rotacion: 'Alta', ultimoMovimiento: '2026-09-15' },
  { codigo: 'SM-6002', nombre: 'Sal Mineralizada Equina Premium', categoria: 'Sales mineralizadas', presentacion: 'Saco 25kg', especie: 'Equinos', laboratorio: 'MineralAndes', stock: { siberia: 10, 'la-caro': 0, ubate: 0, simijaca: 0 }, rotacion: 'Baja', ultimoMovimiento: '2026-05-30' },
  // Alimentos concentrados
  { codigo: 'AC-7001', nombre: 'Concentrado Lechero Premium 18%', categoria: 'Alimentos concentrados', presentacion: 'Saco 40kg', especie: 'Bovinos', laboratorio: 'NutriBov', stock: { siberia: 120, 'la-caro': 60, ubate: 0, simijaca: 40 }, rotacion: 'Alta', ultimoMovimiento: '2026-09-15' },
  { codigo: 'AC-7002', nombre: 'Concentrado Engorde 16%', categoria: 'Alimentos concentrados', presentacion: 'Saco 40kg', especie: 'Bovinos', laboratorio: 'NutriBov', stock: { siberia: 90, 'la-caro': 45, ubate: 20, simijaca: 30 }, rotacion: 'Alta', ultimoMovimiento: '2026-09-14' },
  { codigo: 'AC-7003', nombre: 'Concentrado Equino Deportivo 14%', categoria: 'Alimentos concentrados', presentacion: 'Saco 40kg', especie: 'Equinos', laboratorio: 'EquiCare', stock: { siberia: 25, 'la-caro': 0, ubate: 0, simijaca: 0 }, rotacion: 'Baja', ultimoMovimiento: '2026-07-10' },
  // Equipos e insumos pecuarios
  { codigo: 'EQ-8001', nombre: 'Jeringa Dosificadora Automática 5ml', categoria: 'Equipos e insumos pecuarios', presentacion: 'Unidad', especie: 'Ambos', laboratorio: 'AgroTools', stock: { siberia: 30, 'la-caro': 15, ubate: 8, simijaca: 6 }, rotacion: 'Media', ultimoMovimiento: '2026-09-09' },
  { codigo: 'EQ-8002', nombre: 'Báscula Digital Ganadera Portátil', categoria: 'Equipos e insumos pecuarios', presentacion: 'Unidad', especie: 'Bovinos', laboratorio: 'AgroTools', stock: { siberia: 4, 'la-caro': 2, ubate: 0, simijaca: 0 }, rotacion: 'Baja', ultimoMovimiento: '2026-06-20' },
  { codigo: 'EQ-8003', nombre: 'Brucelógrafo Marcador Auricular', categoria: 'Equipos e insumos pecuarios', presentacion: 'Caja 100un', especie: 'Bovinos', laboratorio: 'AgroTools', stock: { siberia: 20, 'la-caro': 10, ubate: 5, simijaca: 3 }, rotacion: 'Media', ultimoMovimiento: '2026-08-30' },
  { codigo: 'EQ-8004', nombre: 'Kit Reparación Cerco Eléctrico', categoria: 'Equipos e insumos pecuarios', presentacion: 'Kit', especie: 'Ambos', laboratorio: 'AgroTools', stock: { siberia: 0, 'la-caro': 0, ubate: 0, simijaca: 0 }, rotacion: 'Baja', ultimoMovimiento: '2026-04-12' },
  { codigo: 'EQ-8005', nombre: 'Termómetro Digital Veterinario', categoria: 'Equipos e insumos pecuarios', presentacion: 'Unidad', especie: 'Ambos', laboratorio: 'AgroTools', stock: { siberia: 12, 'la-caro': 6, ubate: 0, simijaca: 0 }, rotacion: 'Baja', ultimoMovimiento: '2026-07-05' },
];

export const productos: Producto[] = rawProductos.map((p) => ({
  ...p,
  estado: estadoFromStock(p.stock, p.rotacion),
}));

export function stockTotal(p: Producto): number {
  return Object.values(p.stock).reduce((a, b) => a + b, 0);
}

export type TipoExplotacion = 'Ganadería de leche' | 'Ganadería de carne' | 'Doble propósito' | 'Cría de equinos' | 'Equinos deportivos' | 'Cria bovina';
export type EspeciePrincipal = 'Bovinos' | 'Equinos';
export type EstadoComercial = 'Activo' | 'En seguimiento' | 'Sin contacto' | 'En riesgo' | 'Nuevo';
export type NivelRiesgo = 'Alto' | 'Medio' | 'Bajo';

export interface VisitaHistorial {
  fecha: string;
  vendedor: string;
  notas: string;
  productosInteres: string[];
  realizada: boolean;
}

export interface PedidoHistorial {
  id: string;
  fecha: string;
  productos: { codigo: string; nombre: string; cantidad: number }[];
  total: number;
  estado: string;
}

export interface Tarea {
  id: string;
  descripcion: string;
  fechaLimite: string;
  completada: boolean;
}

export interface Cliente {
  id: string;
  nombre: string;
  tipoExplotacion: TipoExplotacion;
  municipio: string;
  especiePrincipal: EspeciePrincipal;
  vendedor: string;
  ultimaVisita: string;
  ultimaCompra: string;
  estadoComercial: EstadoComercial;
  proximaAccion: string;
  nivelRiesgo: NivelRiesgo;
  telefono: string;
  hectareas: number;
  numAnimales: number;
  historialVisitas: VisitaHistorial[];
  historialPedidos: PedidoHistorial[];
  categoriasCompradas: ProductoCategoria[];
  tareas: Tarea[];
  notasVendedor: string;
  recomendacionesIA: string[];
}

export const clientes: Cliente[] = [
  {
    id: 'C-001', nombre: 'Hacienda El Porvenir', tipoExplotacion: 'Ganadería de leche', municipio: 'Ubaté',
    especiePrincipal: 'Bovinos', vendedor: 'Carlos Mendoza', ultimaVisita: '2026-07-28', ultimaCompra: '2026-08-15',
    estadoComercial: 'En riesgo', proximaAccion: 'Llamar para programar visita', nivelRiesgo: 'Alto',
    telefono: '310 555 0101', hectareas: 120, numAnimales: 85,
    historialVisitas: [
      { fecha: '2026-07-28', vendedor: 'Carlos Mendoza', notas: 'Cliente interesado en antiparasitarios. Solicita cotización de sal mineralizada.', productosInteres: ['AP-2001', 'SM-6001'], realizada: true },
      { fecha: '2026-06-15', vendedor: 'Carlos Mendoza', notas: 'Entrega de concentrado lechero. Revisa estado general del hato.', productosInteres: ['AC-7001'], realizada: true },
    ],
    historialPedidos: [
      { id: 'P-1042', fecha: '2026-08-15', productos: [{ codigo: 'AC-7001', nombre: 'Concentrado Lechero Premium 18%', cantidad: 20 }], total: 1800000, estado: 'Despachado' },
      { id: 'P-1038', fecha: '2026-07-20', productos: [{ codigo: 'AP-2001', nombre: 'Ivermectivet 1% Inyectable', cantidad: 15 }], total: 450000, estado: 'Despachado' },
    ],
    categoriasCompradas: ['Alimentos concentrados', 'Antiparasitarios', 'Sales mineralizadas'],
    tareas: [{ id: 'T-001', descripcion: 'Enviar cotización sal mineralizada 12%', fechaLimite: '2026-09-18', completada: false }],
    notasVendedor: 'Cliente histórico. Ha reducido frecuencia de compras en los últimos 2 meses. Posible competencia de otro proveedor.',
    recomendacionesIA: [
      'Cliente sin contacto en 50 días. Su historial muestra compras bimestrales — se recomienda llamada inmediata.',
      'Compró sal mineralizada en marzo y julio. Septiembre coincide con su ciclo de reposición habitual.',
      'Se detectó interés en antiparasitarios en la última visita sin compra concretada — oportunidad de recuperación.',
    ],
  },
  {
    id: 'C-002', nombre: 'Finca La Esperanza', tipoExplotacion: 'Doble propósito', municipio: 'Simijacá',
    especiePrincipal: 'Bovinos', vendedor: 'Ana Ríos', ultimaVisita: '2026-09-01', ultimaCompra: '2026-09-05',
    estadoComercial: 'Activo', proximaAccion: 'Confirmar reposición de concentrado', nivelRiesgo: 'Bajo',
    telefono: '310 555 0102', hectareas: 200, numAnimales: 150,
    historialVisitas: [
      { fecha: '2026-09-01', vendedor: 'Ana Ríos', notas: 'Revisión de rutina. Cliente satisfecho. Solicita programa de vacunación.', productosInteres: ['VC-3001'], realizada: true },
      { fecha: '2026-08-05', vendedor: 'Ana Ríos', notas: 'Entrega de sal mineralizada y antiparasitario.', productosInteres: ['SM-6001', 'AP-2001'], realizada: true },
    ],
    historialPedidos: [
      { id: 'P-1050', fecha: '2026-09-05', productos: [{ codigo: 'SM-6001', nombre: 'Sal Mineralizada Bovina 12%', cantidad: 10 }, { codigo: 'AP-2001', nombre: 'Ivermectivet 1% Inyectable', cantidad: 20 }], total: 1200000, estado: 'Despachado' },
    ],
    categoriasCompradas: ['Sales mineralizadas', 'Antiparasitarios', 'Vacunas'],
    tareas: [],
    notasVendedor: 'Cliente leal. Buenos volúmenes. Potencial para ampliar a línea de nutrición.',
    recomendacionesIA: [
      'Cliente activo con buen historial. Se recomienda ofrecer suplementos vitamínicos complementarios a su compra habitual.',
      'Su ciclo de compra de sal mineralizada sugiere reposición en octubre — programar visita preventa.',
    ],
  },
  {
    id: 'C-003', nombre: 'Ganadería Santa Clara', tipoExplotacion: 'Ganadería de carne', municipio: 'Chía',
    especiePrincipal: 'Bovinos', vendedor: 'Carlos Mendoza', ultimaVisita: '2026-08-10', ultimaCompra: '2026-08-20',
    estadoComercial: 'En seguimiento', proximaAccion: 'Enviar cotización de vacunas', nivelRiesgo: 'Medio',
    telefono: '310 555 0103', hectareas: 350, numAnimales: 220,
    historialVisitas: [
      { fecha: '2026-08-10', vendedor: 'Carlos Mendoza', notas: 'Cliente solicita información sobre vacuna triple. Posible compra grande.', productosInteres: ['VC-3001'], realizada: true },
    ],
    historialPedidos: [
      { id: 'P-1045', fecha: '2026-08-20', productos: [{ codigo: 'AP-2002', nombre: 'Dectomax Genérico Pour-On', cantidad: 8 }], total: 960000, estado: 'Despachado' },
    ],
    categoriasCompradas: ['Antiparasitarios'],
    tareas: [{ id: 'T-002', descripcion: 'Enviar cotización vacuna triple bovina (50 dosis)', fechaLimite: '2026-09-17', completada: false }],
    notasVendedor: 'Ganadería grande con potencial de expansión. Pendiente respuesta a cotización de vacunas.',
    recomendacionesIA: [
      'Cotización de vacunas enviada hace 12 días sin respuesta. Se recomienda llamada de seguimiento.',
      'Cliente de carne que no ha comprado suplementos nutricionales — oportunidad de venta cruzada.',
    ],
  },
  {
    id: 'C-004', nombre: 'Criadero Los Arrayanes', tipoExplotacion: 'Cría de equinos', municipio: 'Ubaté',
    especiePrincipal: 'Equinos', vendedor: 'Laura Vega', ultimaVisita: '2026-06-20', ultimaCompra: '2026-07-01',
    estadoComercial: 'Sin contacto', proximaAccion: 'Reactivar contacto', nivelRiesgo: 'Alto',
    telefono: '310 555 0104', hectareas: 45, numAnimales: 30,
    historialVisitas: [
      { fecha: '2026-06-20', vendedor: 'Laura Vega', notas: 'Cliente interesado en suplementos equinos. Se envió muestra.', productosInteres: ['NS-5002'], realizada: true },
    ],
    historialPedidos: [
      { id: 'P-1020', fecha: '2026-07-01', productos: [{ codigo: 'NS-5002', nombre: 'EquiPower Suplemento Energético', cantidad: 5 }], total: 350000, estado: 'Despachado' },
    ],
    categoriasCompradas: ['Nutrición y suplementos'],
    tareas: [{ id: 'T-003', descripcion: 'Llamar para verificar satisfacción con muestra enviada', fechaLimite: '2026-09-16', completada: false }],
    notasVendedor: 'Cliente sin contacto desde junio. Criadero de prestige con potencial de compra recurrente.',
    recomendacionesIA: [
      'Cliente sin contacto en 88 días. Su última compra fue de suplementos equinos — se recomienda visita de reactivación.',
      'El criadero tiene 30 equinos. No ha comprado antiparasitarios equinos ni vacunas — oportunidad de portafolio completo.',
    ],
  },
  {
    id: 'C-005', nombre: 'Hacienda El Roble', tipoExplotacion: 'Ganadería de leche', municipio: 'Ubaté',
    especiePrincipal: 'Bovinos', vendedor: 'Ana Ríos', ultimaVisita: '2026-09-10', ultimaCompra: '2026-09-12',
    estadoComercial: 'Activo', proximaAccion: 'Programar visita de seguimiento', nivelRiesgo: 'Bajo',
    telefono: '310 555 0105', hectareas: 150, numAnimales: 110,
    historialVisitas: [
      { fecha: '2026-09-10', vendedor: 'Ana Ríos', notas: 'Visa de seguimiento. Cliente solicita programa antiparasitario completo.', productosInteres: ['AP-2001', 'AP-2002'], realizada: true },
      { fecha: '2026-08-15', vendedor: 'Ana Ríos', notas: 'Entrega de concentrado lechero.', productosInteres: ['AC-7001'], realizada: true },
    ],
    historialPedidos: [
      { id: 'P-1052', fecha: '2026-09-12', productos: [{ codigo: 'AC-7001', nombre: 'Concentrado Lechero Premium 18%', cantidad: 30 }], total: 2700000, estado: 'Despachado' },
    ],
    categoriasCompradas: ['Alimentos concentrados', 'Antiparasitarios'],
    tareas: [],
    notasVendedor: 'Cliente muy activo. Buenos volúmenes de concentrado. Potencial para programa sanitario completo.',
    recomendacionesIA: [
      'Cliente activo con alta frecuencia de compra de concentrado lechero. Se recomienda ofrecer programa sanitario preventivo.',
      'Su tamaño de hato (110 animales) sugiere necesidad recurrente de antiparasitarios — programar preventa.',
    ],
  },
  {
    id: 'C-006', nombre: 'Finca Las Brisas', tipoExplotacion: 'Ganadería de carne', municipio: 'Simijacá',
    especiePrincipal: 'Bovinos', vendedor: 'Carlos Mendoza', ultimaVisita: '2026-05-30', ultimaCompra: '2026-06-10',
    estadoComercial: 'Sin contacto', proximaAccion: 'Llamar urgentemente', nivelRiesgo: 'Alto',
    telefono: '310 555 0106', hectareas: 280, numAnimales: 180,
    historialVisitas: [
      { fecha: '2026-05-30', vendedor: 'Carlos Mendoza', notas: 'Cliente compró antiparasitario. Mencionó interés en sal mineralizada.', productosInteres: ['AP-2001', 'SM-6001'], realizada: true },
    ],
    historialPedidos: [
      { id: 'P-1010', fecha: '2026-06-10', productos: [{ codigo: 'AP-2001', nombre: 'Ivermectivet 1% Inyectable', cantidad: 25 }], total: 750000, estado: 'Despachado' },
    ],
    categoriasCompradas: ['Antiparasitarios'],
    tareas: [{ id: 'T-004', descripcion: 'Llamar para reactivar relación comercial', fechaLimite: '2026-09-16', completada: false }],
    notasVendedor: 'Cliente grande sin contacto desde mayo. Riesgo de pérdida a la competencia.',
    recomendacionesIA: [
      'Cliente sin contacto en 109 días. Su historial de compra semestral indica que ya debería haber reordenado — llamada prioritaria.',
      'Ganadería de 180 animales con potencial de venta de sal mineralizada y concentrado — no se han comprado estas categorías.',
    ],
  },
  {
    id: 'C-007', nombre: 'Equinos Don Diego', tipoExplotacion: 'Equinos deportivos', municipio: 'Chía',
    especiePrincipal: 'Equinos', vendedor: 'Laura Vega', ultimaVisita: '2026-08-25', ultimaCompra: '2026-09-01',
    estadoComercial: 'Activo', proximaAccion: 'Enviar catálogo de suplementos equinos', nivelRiesgo: 'Bajo',
    telefono: '310 555 0107', hectareas: 25, numAnimales: 18,
    historialVisitas: [
      { fecha: '2026-08-25', vendedor: 'Laura Vega', notas: 'Cliente muy interesado en línea equina completa. Caballos de salto.', productosInteres: ['NS-5002', 'AC-7003'], realizada: true },
    ],
    historialPedidos: [
      { id: 'P-1048', fecha: '2026-09-01', productos: [{ codigo: 'NS-5002', nombre: 'EquiPower Suplemento Energético', cantidad: 8 }], total: 560000, estado: 'Despachado' },
    ],
    categoriasCompradas: ['Nutrición y suplementos', 'Alimentos concentrados'],
    tareas: [],
    notasVendedor: 'Cliente premium equino. Potencial alto para línea completa de cuidado equino.',
    recomendacionesIA: [
      'Cliente equino activo que no ha comprado antiparasitarios específicos para equinos — oportunidad de venta cruzada.',
      'Su enfoque deportivo sugiere necesidad de suplementos energéticos de reposición mensual.',
    ],
  },
  {
    id: 'C-008', nombre: 'Hacienda La Trinidad', tipoExplotacion: 'Doble propósito', municipio: 'Ubaté',
    especiePrincipal: 'Bovinos', vendedor: 'Ana Ríos', ultimaVisita: '2026-08-01', ultimaCompra: '2026-08-10',
    estadoComportunidad: 'En seguimiento' as any, proximaAccion: 'Confirmar interés en vacunas', nivelRiesgo: 'Medio',
    telefono: '310 555 0108', hectareas: 180, numAnimales: 130,
    historialVisitas: [
      { fecha: '2026-08-01', vendedor: 'Ana Ríos', notas: 'Cliente evalúa cambiar de proveedor de sal mineralizada. Oportunidad de retención.', productosInteres: ['SM-6001'], realizada: true },
    ],
    historialPedidos: [
      { id: 'P-1040', fecha: '2026-08-10', productos: [{ codigo: 'SM-6001', nombre: 'Sal Mineralizada Bovina 12%', cantidad: 15 }], total: 675000, estado: 'Despachado' },
    ],
    categoriasCompradas: ['Sales mineralizadas'],
    tareas: [{ id: 'T-005', descripcion: 'Preparar propuesta de fidelización con descuento por volumen', fechaLimite: '2026-09-20', completada: false }],
    notasVendedor: 'Cliente evaluando competencia. Necesitamos propuesta de retención.',
    recomendacionesIA: [
      'Cliente en riesgo de migración a competencia. Se recomienda visita con propuesta de fidelización por volumen.',
      'Compra sal mineralizada pero no concentrado — oportunidad de ampliar portafolio si se retiene.',
    ],
  },
  {
    id: 'C-009', nombre: 'Finca El Mirador', tipoExplotacion: 'Ganadería de leche', municipio: 'Simijacá',
    especiePrincipal: 'Bovinos', vendedor: 'Carlos Mendoza', ultimaVisita: '2026-09-05', ultimaCompra: '2026-09-08',
    estadoComercial: 'Activo', proximaAccion: 'Visita programada para 20 sept', nivelRiesgo: 'Bajo',
    telefono: '310 555 0109', hectareas: 90, numAnimales: 65,
    historialVisitas: [
      { fecha: '2026-09-05', vendedor: 'Carlos Mendoza', notas: 'Cliente satisfecho. Programa visita para revisar programa sanitario.', productosInteres: ['VC-3001', 'AP-2001'], realizada: true },
    ],
    historialPedidos: [
      { id: 'P-1051', fecha: '2026-09-08', productos: [{ codigo: 'AC-7002', nombre: 'Concentrado Engorde 16%', cantidad: 12 }], total: 960000, estado: 'Despachado' },
    ],
    categoriasCompradas: ['Alimentos concentrados', 'Vacunas', 'Antiparasitarios'],
    tareas: [],
    notasVendedor: 'Cliente pequeño pero constante. Buena relación.',
    recomendacionesIA: [
      'Cliente constante con compras mensuales. Se recomienda programa sanitario preventivo para fidelizar.',
    ],
  },
  {
    id: 'C-010', nombre: 'Ganadería Río Verde', tipoExplotacion: 'Ganadería de carne', municipio: 'Ubaté',
    especiePrincipal: 'Bovinos', vendedor: 'Ana Ríos', ultimaVisita: '2026-04-15', ultimaCompra: '2026-05-01',
    estadoComercial: 'Sin contacto', proximaAccion: 'Reactivar cuenta', nivelRiesgo: 'Alto',
    telefono: '310 555 0110', hectareas: 400, numAnimales: 250,
    historialVisitas: [
      { fecha: '2026-04-15', vendedor: 'Ana Ríos', notas: 'Última visita. Cliente compró vacunas y antiparasitarios.', productosInteres: ['VC-3001', 'AP-2001'], realizada: true },
    ],
    historialPedidos: [
      { id: 'P-1005', fecha: '2026-05-01', productos: [{ codigo: 'VC-3001', nombre: 'Vacuvet Triple Bovina', cantidad: 30 }], total: 1350000, estado: 'Despachado' },
    ],
    categoriasCompradas: ['Vacunas', 'Antiparasitarios'],
    tareas: [{ id: 'T-006', descripcion: 'Llamar para reactivar relación comercial', fechaLimite: '2026-09-17', completada: false }],
    notasVendedor: 'Ganadería grande perdida. Sin contacto desde abril. Intentar recuperación.',
    recomendacionesIA: [
      'Cliente sin contacto en 154 días. Es una ganadería grande (250 animales) con historial de compras significativas — prioridad de recuperación.',
      'Su patrón de compra de vacunas en mayo sugiere necesidad de refuerzo en octubre — ventana de reactivación.',
    ],
  },
  {
    id: 'C-011', nombre: 'Finca La Sabana', tipoExplotacion: 'Ganadería de leche', municipio: 'Chía',
    especiePrincipal: 'Bovinos', vendedor: 'Laura Vega', ultimaVisita: '2026-09-12', ultimaCompra: '2026-09-14',
    estadoComercial: 'Activo', proximaAccion: 'Entrega programada 18 sept', nivelRiesgo: 'Bajo',
    telefono: '310 555 0111', hectareas: 75, numAnimales: 55,
    historialVisitas: [
      { fecha: '2026-09-12', vendedor: 'Laura Vega', notas: 'Cliente solicita entrega de concentrado y antiparasitario.', productosInteres: ['AC-7001', 'AP-2001'], realizada: true },
    ],
    historialPedidos: [
      { id: 'P-1053', fecha: '2026-09-14', productos: [{ codigo: 'AC-7001', nombre: 'Concentrado Lechero Premium 18%', cantidad: 15 }], total: 1350000, estado: 'En preparación' },
    ],
    categoriasCompradas: ['Alimentos concentrados', 'Antiparasitarios'],
    tareas: [],
    notasVendedor: 'Cliente nuevo muy receptivo. Primera compra en agosto.',
    recomendacionesIA: [
      'Cliente nuevo activo. Se recomienda programa de bienvenida con visita de seguimiento en 30 días.',
    ],
  },
  {
    id: 'C-012', nombre: 'Criadero Altos de Cogua', tipoExplotacion: 'Cría de equinos', municipio: 'Chía',
    especiePrincipal: 'Equinos', vendedor: 'Laura Vega', ultimaVisita: '2026-07-10', ultimaCompra: '2026-07-15',
    estadoComercial: 'En seguimiento', proximaAccion: 'Enviar información de vacunas equinas', nivelRiesgo: 'Medio',
    telefono: '310 555 0112', hectareas: 35, numAnimales: 22,
    historialVisitas: [
      { fecha: '2026-07-10', vendedor: 'Laura Vega', notas: 'Cliente interesado en vacuna equina influenza. Producto agotado en ese momento.', productosInteres: ['VC-3003'], realizada: true },
    ],
    historialPedidos: [
      { id: 'P-1025', fecha: '2026-07-15', productos: [{ codigo: 'AP-2003', nombre: 'Fenbendazol Equino 10%', cantidad: 10 }], total: 400000, estado: 'Despachado' },
    ],
    categoriasCompradas: ['Antiparasitarios'],
    tareas: [{ id: 'T-007', descripcion: 'Notificar disponibilidad de vacuna equina influenza', fechaLimite: '2026-09-19', completada: false }],
    notasVendedor: 'Cliente interesado en vacuna equina que estuvo agotada. Revisar disponibilidad.',
    recomendacionesIA: [
      'Cliente solicitó vacuna equina influenza que sigue agotada en todas las sedes — oportunidad de traslado o pedido urgente.',
      'Criadero de 22 equinos que solo ha comprado antiparasitarios — oportunidad de portafolio completo equino.',
    ],
  },
  {
    id: 'C-013', nombre: 'Hacienda Buenos Aires', tipoExplotacion: 'Doble propósito', municipio: 'Simijacá',
    especiePrincipal: 'Bovinos', vendedor: 'Carlos Mendoza', ultimaVisita: '2026-08-20', ultimaCompra: '2026-08-25',
    estadoComercial: 'En seguimiento', proximaAccion: 'Confirmar pedido de sal mineralizada', nivelRiesgo: 'Medio',
    telefono: '310 555 0113', hectareas: 220, numAnimales: 160,
    historialVisitas: [
      { fecha: '2026-08-20', vendedor: 'Carlos Mendoza', notas: 'Cliente solicita cotización de sal mineralizada y concentrado.', productosInteres: ['SM-6001', 'AC-7002'], realizada: true },
    ],
    historialPedidos: [
      { id: 'P-1046', fecha: '2026-08-25', productos: [{ codigo: 'SM-6001', nombre: 'Sal Mineralizada Bovina 12%', cantidad: 20 }], total: 900000, estado: 'Despachado' },
    ],
    categoriasCompradas: ['Sales mineralizadas', 'Alimentos concentrados'],
    tareas: [],
    notasVendedor: 'Cliente mediano con potencial de crecimiento. Cotización de concentrado pendiente.',
    recomendacionesIA: [
      'Cliente con cotización de concentrado pendiente. Se recomienda seguimiento para cerrar venta.',
      'Compra sal mineralizada pero no antiparasitarios — oportunidad de venta cruzada.',
    ],
  },
  {
    id: 'C-014', nombre: 'Finca Villa Helena', tipoExplotacion: 'Ganadería de leche', municipio: 'Ubaté',
    especiePrincipal: 'Bovinos', vendedor: 'Ana Ríos', ultimaVisita: '2026-09-14', ultimaCompra: '2026-09-15',
    estadoComercial: 'Activo', proximaAccion: 'Visita preventa programada 22 sept', nivelRiesgo: 'Bajo',
    telefono: '310 555 0114', hectareas: 100, numAnimales: 70,
    historialVisitas: [
      { fecha: '2026-09-14', vendedor: 'Ana Ríos', notas: 'Cliente muy activo. Compra quincenal de concentrado.', productosInteres: ['AC-7001'], realizada: true },
    ],
    historialPedidos: [
      { id: 'P-1054', fecha: '2026-09-15', productos: [{ codigo: 'AC-7001', nombre: 'Concentrado Lechero Premium 18%', cantidad: 25 }], total: 2250000, estado: 'Pendiente de confirmar' },
    ],
    categoriasCompradas: ['Alimentos concentrados', 'Sales mineralizadas'],
    tareas: [],
    notasVendedor: 'Cliente muy constante. Compras quincenales. Excelente relación.',
    recomendacionesIA: [
      'Cliente con patrón de compra quincenal establecido. Se recomienda programa de entrega programada.',
    ],
  },
  {
    id: 'C-015', nombre: 'Ganadería El Palmar', tipoExplotacion: 'Cria bovina', municipio: 'Simijacá',
    especiePrincipal: 'Bovinos', vendedor: 'Carlos Mendoza', ultimaVisita: '2026-06-05', ultimaCompra: '2026-06-15',
    estadoComercial: 'Sin contacto', proximaAccion: 'Llamar para reactivar', nivelRiesgo: 'Alto',
    telefono: '310 555 0115', hectareas: 300, numAnimales: 200,
    historialVisitas: [
      { fecha: '2026-06-05', vendedor: 'Carlos Mendoza', notas: 'Cliente compró vacunas y desparasitante. Mencionó expansión del hato.', productosInteres: ['VC-3001', 'AP-2001'], realizada: true },
    ],
    historialPedidos: [
      { id: 'P-1015', fecha: '2026-06-15', productos: [{ codigo: 'VC-3001', nombre: 'Vacuvet Triple Bovina', cantidad: 40 }, { codigo: 'AP-2001', nombre: 'Ivermectivet 1% Inyectable', cantidad: 30 }], total: 2400000, estado: 'Despachado' },
    ],
    categoriasCompradas: ['Vacunas', 'Antiparasitarios'],
    tareas: [{ id: 'T-008', descripcion: 'Llamar para reactivar — cliente mencionó expansión del hato', fechaLimite: '2026-09-18', completada: false }],
    notasVendedor: 'Cliente grande sin contacto desde junio. Mencionó expansión — gran oportunidad.',
    recomendacionesIA: [
      'Cliente sin contacto en 103 días que mencionó expansión del hato. Es una oportunidad de alta prioridad — llamada inmediata.',
      'Su expansión de hato sugiere necesidad de vacunas, antiparasitarios y suplementos en mayores volúmenes.',
    ],
  },
];

// Fix typo in C-008
(clientes[7] as any).estadoComercial = 'En seguimiento';

export type EstadoPedido = 'Por estructurar' | 'Pendiente de confirmar' | 'En preparación' | 'Requiere traslado' | 'Despachado';

export interface LineaPedido {
  codigo: string;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  sedeDespacho: SedeId;
}

export interface Pedido {
  id: string;
  clienteId: string;
  clienteNombre: string;
  fecha: string;
  estado: EstadoPedido;
  lineas: LineaPedido[];
  vendedor: string;
  notas: string;
}

export const pedidos: Pedido[] = [
  {
    id: 'P-2001', clienteId: 'C-014', clienteNombre: 'Finca Villa Helena', fecha: '2026-09-15',
    estado: 'Pendiente de confirmar',
    lineas: [{ codigo: 'AC-7001', nombre: 'Concentrado Lechero Premium 18%', cantidad: 25, precioUnitario: 90000, sedeDespacho: 'siberia' }],
    vendedor: 'Ana Ríos', notas: 'Cliente habitual. Confirmar antes del viernes.',
  },
  {
    id: 'P-2002', clienteId: 'C-011', clienteNombre: 'Finca La Sabana', fecha: '2026-09-14',
    estado: 'En preparación',
    lineas: [{ codigo: 'AC-7001', nombre: 'Concentrado Lechero Premium 18%', cantidad: 15, precioUnitario: 90000, sedeDespacho: 'siberia' }],
    vendedor: 'Laura Vega', notas: 'Preparar para despacho lunes.',
  },
  {
    id: 'P-2003', clienteId: 'C-012', clienteNombre: 'Criadero Altos de Cogua', fecha: '2026-09-13',
    estado: 'Requiere traslado',
    lineas: [{ codigo: 'AP-2003', nombre: 'Fenbendazol Equino 10%', cantidad: 10, precioUnitario: 40000, sedeDespacho: 'la-caro' }],
    vendedor: 'Laura Vega', notas: 'Stock insuficiente en La Caro. Trasladar desde Siberia.',
  },
  {
    id: 'P-2004', clienteId: 'C-001', clienteNombre: 'Hacienda El Porvenir', fecha: '2026-09-12',
    estado: 'Por estructurar',
    lineas: [
      { codigo: 'SM-6001', nombre: 'Sal Mineralizada Bovina 12%', cantidad: 20, precioUnitario: 45000, sedeDespacho: 'ubate' },
      { codigo: 'AP-2001', nombre: 'Ivermectivet 1% Inyectable', cantidad: 15, precioUnitario: 30000, sedeDespacho: 'ubate' },
    ],
    vendedor: 'Carlos Mendoza', notas: 'Pedido en estructura. Falta confirmar cantidades con el cliente.',
  },
  {
    id: 'P-2005', clienteId: 'C-013', clienteNombre: 'Hacienda Buenos Aires', fecha: '2026-09-11',
    estado: 'Pendiente de confirmar',
    lineas: [{ codigo: 'AC-7002', nombre: 'Concentrado Engorde 16%', cantidad: 30, precioUnitario: 80000, sedeDespacho: 'simijaca' }],
    vendedor: 'Carlos Mendoza', notas: 'Esperando confirmación de cliente.',
  },
  {
    id: 'P-2006', clienteId: 'C-005', clienteNombre: 'Hacienda El Roble', fecha: '2026-09-10',
    estado: 'Despachado',
    lineas: [{ codigo: 'AC-7001', nombre: 'Concentrado Lechero Premium 18%', cantidad: 30, precioUnitario: 90000, sedeDespacho: 'ubate' }],
    vendedor: 'Ana Ríos', notas: 'Despachado. Cliente satisfecho.',
  },
  {
    id: 'P-2007', clienteId: 'C-009', clienteNombre: 'Finca El Mirador', fecha: '2026-09-09',
    estado: 'Despachado',
    lineas: [{ codigo: 'AC-7002', nombre: 'Concentrado Engorde 16%', cantidad: 12, precioUnitario: 80000, sedeDespacho: 'simijaca' }],
    vendedor: 'Carlos Mendoza', notas: 'Entregado.',
  },
  {
    id: 'P-2008', clienteId: 'C-007', clienteNombre: 'Equinos Don Diego', fecha: '2026-09-08',
    estado: 'Por estructurar',
    lineas: [
      { codigo: 'NS-5002', nombre: 'EquiPower Suplemento Energético', cantidad: 10, precioUnitario: 70000, sedeDespacho: 'siberia' },
      { codigo: 'AP-2003', nombre: 'Fenbendazol Equino 10%', cantidad: 5, precioUnitario: 40000, sedeDespacho: 'siberia' },
    ],
    vendedor: 'Laura Vega', notas: 'Cliente equino. Estructurar pedido completo.',
  },
];

export interface Visita {
  id: string;
  clienteId: string;
  clienteNombre: string;
  fecha: string;
  hora: string;
  vendedor: string;
  municipio: string;
  estado: 'Programada' | 'Realizada' | 'Cancelada';
  notas: string;
  productosInteres: string[];
  tareaSeguimiento?: string;
}

export const visitas: Visita[] = [
  { id: 'V-001', clienteId: 'C-009', clienteNombre: 'Finca El Mirador', fecha: '2026-09-17', hora: '09:00', vendedor: 'Carlos Mendoza', municipio: 'Simijacá', estado: 'Programada', notas: 'Revisión de programa sanitario.', productosInteres: ['VC-3001', 'AP-2001'] },
  { id: 'V-002', clienteId: 'C-005', clienteNombre: 'Hacienda El Roble', fecha: '2026-09-17', hora: '14:00', vendedor: 'Ana Ríos', municipio: 'Ubaté', estado: 'Programada', notas: 'Seguimiento post-venta.', productosInteres: ['AP-2002'] },
  { id: 'V-003', clienteId: 'C-014', clienteNombre: 'Finca Villa Helena', fecha: '2026-09-18', hora: '10:30', vendedor: 'Ana Ríos', municipio: 'Ubaté', estado: 'Programada', notas: 'Visita preventa programa sanitario.', productosInteres: ['VC-3001'] },
  { id: 'V-004', clienteId: 'C-002', clienteNombre: 'Finca La Esperanza', fecha: '2026-09-19', hora: '08:00', vendedor: 'Ana Ríos', municipio: 'Simijacá', estado: 'Programada', notas: 'Confirmar reposición de concentrado.', productosInteres: ['SM-6001'] },
  { id: 'V-005', clienteId: 'C-007', clienteNombre: 'Equinos Don Diego', fecha: '2026-09-19', hora: '15:00', vendedor: 'Laura Vega', municipio: 'Chía', estado: 'Programada', notas: 'Presentar catálogo equino completo.', productosInteres: ['NS-5002', 'AC-7003', 'AP-2003'] },
  { id: 'V-006', clienteId: 'C-011', clienteNombre: 'Finca La Sabana', fecha: '2026-09-20', hora: '11:00', vendedor: 'Laura Vega', municipio: 'Chía', estado: 'Programada', notas: 'Entrega y revisión de concentrado.', productosInteres: ['AC-7001'] },
];

export type TipoOportunidad =
  | 'Contacto pendiente'
  | 'Visita sugerida'
  | 'Cotización sin respuesta'
  | 'Traslado de inventario'
  | 'Venta cruzada'
  | 'Baja rotación'
  | 'Reposición predicha';

export type Prioridad = 'Alta' | 'Media' | 'Baja';

export interface Oportunidad {
  id: string;
  tipo: TipoOportunidad;
  clienteId?: string;
  clienteNombre: string;
  sedeInvolucrada?: SedeId;
  valorPotencial: number;
  prioridad: Prioridad;
  motivo: string;
  confianza: number; // 0-100
  accion: string;
  responsable: string;
  estado: 'Abierta' | 'En gestión' | 'Cerrada';
}

export const oportunidades: Oportunidad[] = [
  { id: 'O-001', tipo: 'Contacto pendiente', clienteId: 'C-006', clienteNombre: 'Finca Las Brisas', valorPotencial: 1800000, prioridad: 'Alta', motivo: 'Sin contacto en 109 días. Ganadería de 180 animales con historial de compras significativas.', confianza: 92, accion: 'Llamar hoy para reactivar relación', responsable: 'Carlos Mendoza', estado: 'Abierta' },
  { id: 'O-002', tipo: 'Contacto pendiente', clienteId: 'C-010', clienteNombre: 'Ganadería Río Verde', valorPotencial: 2400000, prioridad: 'Alta', motivo: 'Sin contacto en 154 días. Cliente grande (250 animales) con compras históricas de vacunas.', confianza: 95, accion: 'Llamar para reactivar cuenta', responsable: 'Ana Ríos', estado: 'Abierta' },
  { id: 'O-003', tipo: 'Traslado de inventario', clienteNombre: 'Ubaté', sedeInvolucrada: 'ubate', valorPotencial: 0, prioridad: 'Alta', motivo: 'Ubaté tiene 3 productos agotados que están disponibles en Siberia.', confianza: 100, accion: 'Aprobar traslado desde Siberia', responsable: 'Coordinación logística', estado: 'Abierta' },
  { id: 'O-004', tipo: 'Cotización sin respuesta', clienteId: 'C-003', clienteNombre: 'Ganadería Santa Clara', valorPotencial: 1350000, prioridad: 'Media', motivo: 'Cotización de vacunas enviada hace 12 días sin respuesta.', confianza: 78, accion: 'Llamar para dar seguimiento a cotización', responsable: 'Carlos Mendoza', estado: 'Abierta' },
  { id: 'O-005', tipo: 'Visita sugerida', clienteId: 'C-004', clienteNombre: 'Criadero Los Arrayanes', valorPotencial: 800000, prioridad: 'Alta', motivo: 'Sin contacto en 88 días. Criadero equino con potencial de portafolio completo.', confianza: 88, accion: 'Programar visita de reactivación', responsable: 'Laura Vega', estado: 'Abierta' },
  { id: 'O-006', tipo: 'Baja rotación', clienteNombre: 'La Caro', sedeInvolucrada: 'la-caro', valorPotencial: 0, prioridad: 'Media', motivo: '8 referencias presentan baja rotación en La Caro. Capital inmovilizado estimado.', confianza: 90, accion: 'Revisar referencias de baja rotación', responsable: 'Gerencia', estado: 'Abierta' },
  { id: 'O-007', tipo: 'Reposición predicha', clienteId: 'C-001', clienteNombre: 'Hacienda El Porvenir', valorPotencial: 1200000, prioridad: 'Alta', motivo: 'Cliente en riesgo. Su ciclo de compra bimestral indica reposición inmediata de sal mineralizada.', confianza: 85, accion: 'Llamar para ofrecer reposición', responsable: 'Carlos Mendoza', estado: 'Abierta' },
  { id: 'O-008', tipo: 'Venta cruzada', clienteId: 'C-007', clienteNombre: 'Equinos Don Diego', valorPotencial: 450000, prioridad: 'Media', motivo: 'Cliente equino activo que no ha comprado antiparasitarios específicos para equinos.', confianza: 75, accion: 'Ofrecer antiparasitario equino en próxima visita', responsable: 'Laura Vega', estado: 'Abierta' },
  { id: 'O-009', tipo: 'Reposición predicha', clienteId: 'C-002', clienteNombre: 'Finca La Esperanza', valorPotencial: 900000, prioridad: 'Media', motivo: 'Su ciclo de compra de sal mineralizada sugiere reposición en octubre.', confianza: 80, accion: 'Programar visita preventa', responsable: 'Ana Ríos', estado: 'Abierta' },
  { id: 'O-010', tipo: 'Contacto pendiente', clienteId: 'C-015', clienteNombre: 'Ganadería El Palmar', valorPotencial: 3000000, prioridad: 'Alta', motivo: 'Sin contacto en 103 días. Cliente mencionó expansión del hato — gran oportunidad.', confianza: 91, accion: 'Llamar para reactivar y explorar expansión', responsable: 'Carlos Mendoza', estado: 'Abierta' },
  { id: 'O-011', tipo: 'Venta cruzada', clienteId: 'C-008', clienteNombre: 'Hacienda La Trinidad', valorPotencial: 600000, prioridad: 'Media', motivo: 'Compra sal mineralizada pero no concentrado. Oportunidad de ampliar portafolio.', confianza: 72, accion: 'Ofrecer concentrado en visita de retención', responsable: 'Ana Ríos', estado: 'Abierta' },
  { id: 'O-012', tipo: 'Cotización sin respuesta', clienteId: 'C-013', clienteNombre: 'Hacienda Buenos Aires', valorPotencial: 960000, prioridad: 'Media', motivo: 'Cotización de concentrado engorde pendiente de confirmación.', confianza: 76, accion: 'Llamar para cerrar cotización', responsable: 'Carlos Mendoza', estado: 'Abierta' },
];

export interface Notificacion {
  id: string;
  tipo: 'alerta' | 'info' | 'oportunidad';
  titulo: string;
  mensaje: string;
  fecha: string;
  leida: boolean;
}

export const notificaciones: Notificacion[] = [
  { id: 'N-001', tipo: 'alerta', titulo: 'Producto agotado', mensaje: 'Vacuvet Antirrábica agotado en todas las sedes', fecha: '2026-09-15', leida: false },
  { id: 'N-002', tipo: 'oportunidad', titulo: 'Nueva oportunidad IA', mensaje: 'Ganadería El Palmar: oportunidad de reposición detectada', fecha: '2026-09-15', leida: false },
  { id: 'N-003', tipo: 'alerta', titulo: 'Cliente sin contacto', mensaje: 'Ganadería Río Verde sin contacto hace 154 días', fecha: '2026-09-14', leida: false },
  { id: 'N-004', tipo: 'info', titulo: 'Pedido despachado', mensaje: 'Pedido P-2006 despachado a Hacienda El Roble', fecha: '2026-09-10', leida: true },
  { id: 'N-005', tipo: 'alerta', titulo: 'Inventario bajo', mensaje: 'Dectomax Genérico Pour-On con stock crítico', fecha: '2026-09-14', leida: false },
];

export interface ActividadReciente {
  id: string;
  usuario: string;
  accion: string;
  detalle: string;
  hora: string;
}

export const actividadesRecientes: ActividadReciente[] = [
  { id: 'A-001', usuario: 'Ana Ríos', accion: 'Registró visita', detalle: 'Hacienda El Roble — 14 sept', hora: 'Hace 2 horas' },
  { id: 'A-002', usuario: 'Carlos Mendoza', accion: 'Creó pedido', detalle: 'P-2004 — Hacienda El Porvenir', hora: 'Hace 3 horas' },
  { id: 'A-003', usuario: 'Laura Vega', accion: 'Actualizó inventario', detalle: 'Ingreso de stock en Siberia', hora: 'Hace 5 horas' },
  { id: 'A-004', usuario: 'Ana Ríos', accion: 'Despachó pedido', detalle: 'P-2006 — Finca Villa Helena', hora: 'Ayer' },
  { id: 'A-005', usuario: 'Carlos Mendoza', accion: 'Registró llamada', detalle: 'Ganadería Santa Clara — seguimiento cotización', hora: 'Ayer' },
];

// Transfer recommendations
export interface TrasladoSugerido {
  id: string;
  productoCodigo: string;
  productoNombre: string;
  sedeOrigen: SedeId;
  sedeDestino: SedeId;
  cantidad: number;
  motivo: string;
  estado: 'Sugerido' | 'Aprobado' | 'En tránsito';
}

export const trasladosSugeridos: TrasladoSugerido[] = [
  { id: 'TR-001', productoCodigo: 'MD-1001', productoNombre: 'Oxitetravet 10% Inyectable', sedeOrigen: 'siberia', sedeDestino: 'ubate', cantidad: 15, motivo: 'Ubaté agotado, Siberia tiene 48 unidades', estado: 'Sugerido' },
  { id: 'TR-002', productoCodigo: 'MD-1002', productoNombre: 'Penivet L.A. 15%', sedeOrigen: 'siberia', sedeDestino: 'simijaca', cantidad: 10, motivo: 'Simijacá agotado, Siberia tiene 30 unidades', estado: 'Sugerido' },
  { id: 'TR-003', productoCodigo: 'VC-3002', productoNombre: 'Vacuvet Antirrábica', sedeOrigen: 'siberia', sedeDestino: 'la-caro', cantidad: 5, motivo: 'La Caro agotado, Siberia tiene 12 unidades', estado: 'Sugerido' },
  { id: 'TR-004', productoCodigo: 'AC-7001', productoNombre: 'Concentrado Lechero Premium 18%', sedeOrigen: 'siberia', sedeDestino: 'ubate', cantidad: 30, motivo: 'Ubaté agotado, alta demanda en zona lechera', estado: 'Sugerido' },
  { id: 'TR-005', productoCodigo: 'NS-5002', productoNombre: 'EquiPower Suplemento Energético', sedeOrigen: 'siberia', sedeDestino: 'ubate', cantidad: 8, motivo: 'Ubaté agotado, Criadero Los Arrayanes espera reposición', estado: 'Sugerido' },
];

// KPIs
export function getKPIs() {
  const clientesActivos = clientes.filter((c) => c.estadoComercial === 'Activo').length;
  const clientesSinContacto = clientes.filter((c) => {
    const dias = Math.floor((Date.now() - new Date(c.ultimaVisita).getTime()) / 86400000);
    return dias > 30;
  }).length;
  const oportunidadesAbiertas = oportunidades.filter((o) => o.estado === 'Abierta').length;
  const pedidosPendientes = pedidos.filter((p) => p.estado !== 'Despachado').length;
  const productosAgotados = productos.filter((p) => p.estado === 'Agotado').length;
  const bajaRotacion = productos.filter((p) => p.estado === 'Baja rotación').length;
  const trasladosPendientes = trasladosSugeridos.filter((t) => t.estado === 'Sugerido').length;
  const valorOportunidades = oportunidades
    .filter((o) => o.estado === 'Abierta')
    .reduce((sum, o) => sum + o.valorPotencial, 0);

  return {
    clientesActivos,
    clientesSinContacto,
    oportunidadesAbiertas,
    pedidosPendientes,
    productosAgotados,
    bajaRotacion,
    trasladosPendientes,
    valorOportunidades,
  };
}

// Chart data
export function getOportunidadesPorSede() {
  const sedeMap: Record<string, number> = {};
  oportunidades.forEach((o) => {
    if (o.valorPotencial > 0) {
      const sede = o.sedeInvolucrada || o.clienteId ? clienteSede(o.clienteId!) : 'siberia';
      const nombre = sedes.find((s) => s.id === sede)?.nombre || 'Siberia';
      sedeMap[nombre] = (sedeMap[nombre] || 0) + o.valorPotencial;
    }
  });
  // Ensure all sedes appear
  sedes.forEach((s) => {
    if (!sedeMap[s.nombre]) sedeMap[s.nombre] = 0;
  });
  return Object.entries(sedeMap).map(([sede, valor]) => ({ sede, valor }));
}

function clienteSede(clienteId: string): SedeId {
  const c = clientes.find((cl) => cl.id === clienteId);
  if (!c) return 'siberia';
  const muni = c.municipio;
  if (muni === 'Ubaté') return 'ubate';
  if (muni === 'Simijacá') return 'simijaca';
  if (muni === 'Chía') return 'la-caro';
  return 'siberia';
}

export function getInventarioStatusData() {
  return [
    { name: 'Saludable', value: productos.filter((p) => p.estado === 'Disponible').length, color: '#22c55e' },
    { name: 'Bajo', value: productos.filter((p) => p.estado === 'Inventario bajo').length, color: '#f59e0b' },
    { name: 'Agotado', value: productos.filter((p) => p.estado === 'Agotado').length, color: '#ef4444' },
    { name: 'Baja rotación', value: productos.filter((p) => p.estado === 'Baja rotación').length, color: '#6366f1' },
  ];
}

export function getPrioridadesIA() {
  return [
    {
      id: 'PR-001',
      titulo: '12 clientes importantes no han recibido seguimiento durante los últimos 45 días',
      explicacion: 'Clientes con historial de compras significativas que superan el umbral de contacto recomendado. Riesgo de migración a la competencia.',
      accion: 'Ver clientes',
      tipo: 'clientes' as const,
    },
    {
      id: 'PR-002',
      titulo: 'Ubaté tiene 3 productos agotados que están disponibles en Siberia',
      explicacion: 'El traslado entre sedes puede resolver desabastecimiento en menos de 24 horas sin requerir compra a laboratorio.',
      accion: 'Revisar traslado',
      tipo: 'traslado' as const,
    },
    {
      id: 'PR-003',
      titulo: '8 referencias presentan baja rotación en La Caro',
      explicacion: 'Capital inmovilizado en productos sin movimiento durante más de 90 días. Se recomienda revisar política de inventario.',
      accion: 'Ver inventario',
      tipo: 'inventario' as const,
    },
    {
      id: 'PR-004',
      titulo: '5 fincas podrían necesitar reposición según su historial simulado',
      explicacion: 'El análisis de ciclos de compra indica que estos clientes están en ventana de reposición. Contacto preventa recomendado.',
      accion: 'Crear tarea',
      tipo: 'oportunidades' as const,
    },
  ];
}

export const vendedores = ['Carlos Mendoza', 'Ana Ríos', 'Laura Vega'];

export function formatCOP(value: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
}

export function diasDesde(fecha: string): number {
  return Math.floor((Date.now() - new Date(fecha).getTime()) / 86400000);
}
