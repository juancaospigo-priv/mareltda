import { useState, useMemo } from 'react';
import {
  ShoppingCart, ChevronRight, Package, MapPin,
  Minus, Plus, CheckCircle2, Clock, AlertTriangle, FileEdit,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { useSessionData } from '@/context/SessionData';
import {
  sedes, formatCOP,
  type Pedido, type EstadoPedido, type SedeId,
} from '@/data/simData';

const estadoTone: Record<EstadoPedido, 'gray' | 'warning' | 'cyan' | 'accent' | 'success'> = {
  'Por estructurar': 'gray',
  'Pendiente de confirmar': 'warning',
  'En preparación': 'cyan',
  'Requiere traslado': 'accent',
  'Despachado': 'success',
};

const estadoIcons: Record<EstadoPedido, typeof Clock> = {
  'Por estructurar': FileEdit,
  'Pendiente de confirmar': Clock,
  'En preparación': Package,
  'Requiere traslado': AlertTriangle,
  'Despachado': CheckCircle2,
};

const estados: EstadoPedido[] = ['Por estructurar', 'Pendiente de confirmar', 'En preparación', 'Requiere traslado', 'Despachado'];

export function Pedidos() {
  const { showToast } = useToast();
  const { pedidos, setPedidos } = useSessionData();
  const [filtroEstado, setFiltroEstado] = useState<EstadoPedido | 'todos'>('todos');
  const [pedidoSel, setPedidoSel] = useState<Pedido | null>(null);
  const [editando, setEditando] = useState(false);

  const filtrados = useMemo(() => {
    return pedidos
      .filter((p) => filtroEstado === 'todos' || p.estado === filtroEstado)
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [pedidos, filtroEstado]);

  const totalPedido = (p: Pedido) => p.lineas.reduce((sum, l) => sum + l.cantidad * l.precioUnitario, 0);

  const cambiarEstado = (pedido: Pedido, nuevoEstado: EstadoPedido) => {
    setPedidos((prev) => prev.map((p) => (p.id === pedido.id ? { ...p, estado: nuevoEstado } : p)));
    setPedidoSel((prev) => (prev && prev.id === pedido.id ? { ...prev, estado: nuevoEstado } : prev));
    showToast(`Pedido ${pedido.id} cambiado a "${nuevoEstado}"`, 'success');
  };

  const actualizarCantidad = (idx: number, delta: number) => {
    if (!pedidoSel) return;
    const nuevasLineas = pedidoSel.lineas.map((l, i) =>
      i === idx ? { ...l, cantidad: Math.max(1, l.cantidad + delta) } : l
    );
    const actualizado = { ...pedidoSel, lineas: nuevasLineas };
    setPedidoSel(actualizado);
    setPedidos((prev) => prev.map((p) => (p.id === actualizado.id ? actualizado : p)));
  };

  const cambiarSedeDespacho = (idx: number, sede: SedeId) => {
    if (!pedidoSel) return;
    const nuevasLineas = pedidoSel.lineas.map((l, i) =>
      i === idx ? { ...l, sedeDespacho: sede } : l
    );
    const actualizado = { ...pedidoSel, lineas: nuevasLineas };
    setPedidoSel(actualizado);
    setPedidos((prev) => prev.map((p) => (p.id === actualizado.id ? actualizado : p)));
  };

  const guardarCambios = () => {
    setEditando(false);
    showToast(`Pedido ${pedidoSel?.id} actualizado`, 'success');
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-800 flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-cyan-500" />
          Pedidos
        </h1>
        <p className="text-sm text-gray-500 mt-1">Bandeja de pedidos y solicitudes · {pedidos.length} pedidos</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFiltroEstado('todos')}
          className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${filtroEstado === 'todos' ? 'bg-navy-700 text-white' : 'bg-white text-navy-600 border border-gray-200 hover:bg-gray-50'}`}
        >
          Todos ({pedidos.length})
        </button>
        {estados.map((est) => {
          const count = pedidos.filter((p) => p.estado === est).length;
          const Icon = estadoIcons[est];
          return (
            <button
              key={est}
              onClick={() => setFiltroEstado(est)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${filtroEstado === est ? 'bg-navy-700 text-white' : 'bg-white text-navy-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {est} ({count})
            </button>
          );
        })}
      </div>

      {/* Pedidos table/cards */}
      <div className="grid gap-3">
        {filtrados.map((p) => {
          const Icon = estadoIcons[p.estado];
          return (
            <Card key={p.id} hover className="cursor-pointer" >
              <div onClick={() => { setPedidoSel(p); setEditando(false); }} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-navy-50 text-navy-600 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-navy-800">{p.id}</p>
                    <Badge tone={estadoTone[p.estado]}>{p.estado}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{p.clienteNombre} · {p.fecha}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {p.lineas.length} {p.lineas.length === 1 ? 'producto' : 'productos'} · {p.vendedor}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-navy-800">{formatCOP(totalPedido(p))}</p>
                  <p className="text-xs text-gray-400">{p.lineas.length} líneas</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
              </div>
            </Card>
          );
        })}
      </div>

      {filtrados.length === 0 && (
        <div className="text-center py-12">
          <ShoppingCart className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No hay pedidos con el estado seleccionado</p>
        </div>
      )}

      {/* Detail modal */}
      <Modal
        open={!!pedidoSel}
        onClose={() => setPedidoSel(null)}
        title={pedidoSel ? `Pedido ${pedidoSel.id}` : ''}
        subtitle={pedidoSel?.clienteNombre}
        size="lg"
        footer={
          pedidoSel && (
            <div className="flex items-center justify-between w-full">
              <div className="text-sm">
                <span className="text-gray-500">Total: </span>
                <span className="font-semibold text-navy-800">{formatCOP(totalPedido(pedidoSel))}</span>
              </div>
              <div className="flex gap-2">
                {editando ? (
                  <Button variant="primary" onClick={guardarCambios}>Guardar cambios</Button>
                ) : (
                  <>
                    <Button variant="secondary" onClick={() => setEditando(true)} icon={<FileEdit className="w-4 h-4" />}>Editar</Button>
                    <div className="relative">
                      <select
                        value={pedidoSel.estado}
                        onChange={(e) => cambiarEstado(pedidoSel, e.target.value as EstadoPedido)}
                        className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30 font-medium text-navy-700"
                      >
                        {estados.map((est) => <option key={est} value={est}>{est}</option>)}
                      </select>
                    </div>
                  </>
                )}
              </div>
            </div>
          )
        }
      >
        {pedidoSel && (
          <div className="space-y-4">
            {/* Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">Cliente</p>
                <p className="text-sm font-medium text-navy-700">{pedidoSel.clienteNombre}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">Fecha</p>
                <p className="text-sm font-medium text-navy-700">{pedidoSel.fecha}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">Vendedor</p>
                <p className="text-sm font-medium text-navy-700">{pedidoSel.vendedor}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">Estado</p>
                <Badge tone={estadoTone[pedidoSel.estado]}>{pedidoSel.estado}</Badge>
              </div>
            </div>

            {/* Notas */}
            {pedidoSel.notas && (
              <div className="bg-warning-50/50 border border-warning-100 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Notas</p>
                <p className="text-sm text-navy-700">{pedidoSel.notas}</p>
              </div>
            )}

            {/* Lineas */}
            <div>
              <h4 className="text-sm font-semibold text-navy-800 mb-2">Productos del pedido</h4>
              <div className="space-y-2">
                {pedidoSel.lineas.map((l, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy-700 truncate">{l.nombre}</p>
                      <p className="text-xs text-gray-400">{l.codigo} · {formatCOP(l.precioUnitario)}/u</p>
                    </div>
                    {editando ? (
                      <>
                        <div className="flex items-center gap-1">
                          <button onClick={() => actualizarCantidad(idx, -1)} className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100">
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center text-sm font-medium text-navy-700">{l.cantidad}</span>
                          <button onClick={() => actualizarCantidad(idx, 1)} className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <select
                          value={l.sedeDespacho}
                          onChange={(e) => cambiarSedeDespacho(idx, e.target.value as SedeId)}
                          className="px-2 py-1.5 text-xs border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                        >
                          {sedes.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
                        </select>
                      </>
                    ) : (
                      <div className="text-right">
                        <p className="text-sm font-medium text-navy-700">{l.cantidad} u</p>
                        <p className="text-xs text-gray-400 flex items-center gap-1 justify-end"><MapPin className="w-3 h-3" />{sedes.find((s) => s.id === l.sedeDespacho)?.nombre}</p>
                      </div>
                    )}
                    <div className="text-right w-24">
                      <p className="text-sm font-semibold text-navy-800">{formatCOP(l.cantidad * l.precioUnitario)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
              <span className="text-sm text-gray-500">Total del pedido</span>
              <span className="text-lg font-bold text-navy-800">{formatCOP(totalPedido(pedidoSel))}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
