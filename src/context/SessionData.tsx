/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import {
  actividadesRecientes as actividadesIniciales,
  clientes as clientesIniciales,
  pedidos as pedidosIniciales,
  trasladosSugeridos as trasladosIniciales,
  visitas as visitasIniciales,
  type ActividadReciente,
  type Cliente,
  type Pedido,
  type TrasladoSugerido,
  type Visita,
} from '@/data/simData';

interface SessionDataContextValue {
  clientes: Cliente[];
  setClientes: Dispatch<SetStateAction<Cliente[]>>;
  pedidos: Pedido[];
  setPedidos: Dispatch<SetStateAction<Pedido[]>>;
  traslados: TrasladoSugerido[];
  setTraslados: Dispatch<SetStateAction<TrasladoSugerido[]>>;
  visitas: Visita[];
  setVisitas: Dispatch<SetStateAction<Visita[]>>;
  actividades: ActividadReciente[];
  llamadaConvertida: boolean;
  convertirLlamada: (entrada: LlamadaConversionInput) => void;
}

interface LlamadaConversionInput {
  notas: string;
  cantidades: Record<string, number>;
  sugerencias: Array<{ id: string; detalle: string }>;
}

const SessionDataContext = createContext<SessionDataContextValue | null>(null);

const pedidoLlamada: Pedido = {
  id: 'P-IA-001',
  clienteId: 'C-001',
  clienteNombre: 'Hacienda El Porvenir',
  fecha: '2026-09-16',
  estado: 'Pendiente de confirmar',
  lineas: [
    { codigo: 'AP-2001', nombre: 'Antiparasitario Bovino Campo', cantidad: 4, precioUnitario: 30000, sedeDespacho: 'ubate' },
    { codigo: 'AC-7001', nombre: 'Concentrado Lechero Premium', cantidad: 10, precioUnitario: 90000, sedeDespacho: 'ubate' },
    { codigo: 'SM-6001', nombre: 'Sal Mineralizada Bovina', cantidad: 6, precioUnitario: 45000, sedeDespacho: 'ubate' },
  ],
  vendedor: 'Carlos Mendoza',
  notas: 'Pedido estructurado desde llamada con IA. Confirmar sal mineralizada y traslado del concentrado.',
};

const trasladoLlamada: TrasladoSugerido = {
  id: 'TR-IA-001',
  productoCodigo: 'AC-7001',
  productoNombre: 'Concentrado Lechero Premium',
  sedeOrigen: 'siberia',
  sedeDestino: 'ubate',
  cantidad: 10,
  motivo: 'Solicitud de Hacienda El Porvenir: Ubaté agotado y Siberia tiene 120 unidades.',
  estado: 'Sugerido',
};

const visitaLlamada: Visita = {
  id: 'V-IA-001',
  clienteId: 'C-001',
  clienteNombre: 'Hacienda El Porvenir',
  fecha: '2026-09-18',
  hora: '15:30',
  vendedor: 'Carlos Mendoza',
  municipio: 'Ubaté',
  estado: 'Programada',
  notas: 'Visita técnica solicitada durante llamada. Validación profesional pendiente; no incluye diagnóstico ni recomendación terapéutica.',
  productosInteres: ['AP-2001', 'AC-7001', 'SM-6001'],
  tareaSeguimiento: 'Confirmar pedido, traslado y disponibilidad de visita técnica.',
};

export function SessionDataProvider({ children }: { children: ReactNode }) {
  const [clientes, setClientes] = useState<Cliente[]>(clientesIniciales);
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosIniciales);
  const [traslados, setTraslados] = useState<TrasladoSugerido[]>(trasladosIniciales);
  const [visitas, setVisitas] = useState<Visita[]>(visitasIniciales);
  const [actividades, setActividades] = useState<ActividadReciente[]>(actividadesIniciales);
  const [llamadaConvertida, setLlamadaConvertida] = useState(false);

  const convertirLlamada = ({ notas, cantidades, sugerencias }: LlamadaConversionInput) => {
    if (llamadaConvertida) return;

    const pedido = {
      ...pedidoLlamada,
      lineas: pedidoLlamada.lineas.map((linea) => ({
        ...linea,
        cantidad: cantidades[linea.codigo] ?? linea.cantidad,
      })),
    };
    const traslado = {
      ...trasladoLlamada,
      cantidad: cantidades['AC-7001'] ?? trasladoLlamada.cantidad,
    };
    const detalleSeguimiento = sugerencias.find((sugerencia) => sugerencia.id === 'seguimiento')?.detalle
      ?? 'Confirmar pedido, traslado y fecha de entrega.';
    const detalleVisita = sugerencias.find((sugerencia) => sugerencia.id === 'visita')?.detalle
      ?? visitaLlamada.notas;
    const visita = { ...visitaLlamada, notas: detalleVisita };

    setPedidos((prev) => [pedido, ...prev]);
    setTraslados((prev) => [traslado, ...prev]);
    setVisitas((prev) => [visita, ...prev]);
    setClientes((prev) => prev.map((cliente) => {
      if (cliente.id !== 'C-001') return cliente;
      return {
        ...cliente,
        estadoComercial: 'En seguimiento',
        proximaAccion: 'Confirmar pedido generado desde llamada',
        historialPedidos: [
          {
            id: pedido.id,
            fecha: pedido.fecha,
            productos: pedido.lineas.map(({ codigo, nombre, cantidad }) => ({ codigo, nombre, cantidad })),
            total: pedido.lineas.reduce((total, linea) => total + linea.cantidad * linea.precioUnitario, 0),
            estado: pedido.estado,
          },
          ...cliente.historialPedidos,
        ],
        historialVisitas: [
          {
            fecha: visita.fecha,
            vendedor: visita.vendedor,
            notas: visita.notas,
            productosInteres: visita.productosInteres,
            realizada: false,
          },
          ...cliente.historialVisitas,
        ],
        tareas: [
          {
            id: 'T-IA-001',
            descripcion: detalleSeguimiento,
            fechaLimite: '2026-09-17',
            completada: false,
          },
          ...cliente.tareas,
        ],
        notasVendedor: `${cliente.notasVendedor} Llamada registrada con IA: ${notas}`,
      };
    }));
    setActividades((prev) => [
      {
        id: 'A-IA-001',
        usuario: 'Carlos Mendoza',
        accion: 'Convirtió llamada con IA',
        detalle: 'P-IA-001 · Hacienda El Porvenir · pedido, traslado y visita creados',
        hora: 'Ahora',
      },
      ...prev,
    ]);
    setLlamadaConvertida(true);
  };

  return (
    <SessionDataContext.Provider value={{
      clientes,
      setClientes,
      pedidos,
      setPedidos,
      traslados,
      setTraslados,
      visitas,
      setVisitas,
      actividades,
      llamadaConvertida,
      convertirLlamada,
    }}>
      {children}
    </SessionDataContext.Provider>
  );
}

export function useSessionData() {
  const context = useContext(SessionDataContext);
  if (!context) throw new Error('useSessionData must be used within SessionDataProvider');
  return context;
}
