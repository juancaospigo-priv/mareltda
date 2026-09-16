import { useState, useMemo } from 'react';
import {
  CalendarDays, Plus, MapPin, Clock, CheckCircle2, Circle,
  Package, Sparkles, ChevronRight, User, Save,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import {
  visitas as visitasInit, clientes, productos,
  type Visita,
} from '@/data/simData';

const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function getSemanaFechas(): string[] {
  // Week containing the demo date: Sept 14-20, 2026.
  const base = new Date('2026-09-14T12:00:00');
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

export function Visitas() {
  const { showToast } = useToast();
  const [visitas, setVisitas] = useState<Visita[]>(visitasInit);
  const [modalNueva, setModalNueva] = useState(false);
  const [modalDetalle, setModalDetalle] = useState<Visita | null>(null);
  const [nuevaVisita, setNuevaVisita] = useState({
    clienteId: '',
    fecha: '',
    hora: '09:00',
    notas: '',
    productosInteres: [] as string[],
  });
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [notaEdit, setNotaEdit] = useState('');

  const semanaFechas = getSemanaFechas();

  const visitasPorDia = useMemo(() => {
    const map: Record<string, Visita[]> = {};
    semanaFechas.forEach((f) => (map[f] = []));
    visitas.forEach((v) => {
      if (map[v.fecha]) map[v.fecha].push(v);
    });
    Object.values(map).forEach((arr) => arr.sort((a, b) => a.hora.localeCompare(b.hora)));
    return map;
  }, [visitas, semanaFechas]);

  const marcarRealizada = (id: string) => {
    setVisitas((prev) => prev.map((v) => (v.id === id ? { ...v, estado: 'Realizada' } : v)));
    setModalDetalle((prev) => (prev && prev.id === id ? { ...prev, estado: 'Realizada' } : prev));
    showToast('Visita marcada como realizada', 'success');
  };

  const convertirOportunidad = (id: string) => {
    showToast('Necesidad detectada convertida en oportunidad comercial', 'success');
    setModalDetalle((prev) => (prev && prev.id === id ? { ...prev, tareaSeguimiento: 'Oportunidad creada desde visita' } : prev));
  };

  const crearTarea = () => {
    if (!nuevaTarea || !modalDetalle) return;
    showToast(`Tarea de seguimiento creada: ${nuevaTarea}`, 'success');
    setVisitas((prev) => prev.map((v) => (v.id === modalDetalle.id ? { ...v, tareaSeguimiento: nuevaTarea } : v)));
    setModalDetalle((prev) => (prev ? { ...prev, tareaSeguimiento: nuevaTarea } : null));
    setNuevaTarea('');
  };

  const guardarNotas = () => {
    if (!modalDetalle) return;
    setVisitas((prev) => prev.map((v) => (v.id === modalDetalle.id ? { ...v, notas: notaEdit } : v)));
    setModalDetalle((prev) => (prev ? { ...prev, notas: notaEdit } : null));
    showToast('Notas de la visita actualizadas', 'success');
  };

  const registrarNuevaVisita = () => {
    if (!nuevaVisita.clienteId || !nuevaVisita.fecha) return;
    const cliente = clientes.find((c) => c.id === nuevaVisita.clienteId);
    if (!cliente) return;
    const visita: Visita = {
      id: `V-${Math.random().toString(36).slice(2, 7)}`,
      clienteId: cliente.id,
      clienteNombre: cliente.nombre,
      fecha: nuevaVisita.fecha,
      hora: nuevaVisita.hora,
      vendedor: cliente.vendedor,
      municipio: cliente.municipio,
      estado: 'Programada',
      notas: nuevaVisita.notas || 'Visita programada',
      productosInteres: nuevaVisita.productosInteres,
    };
    setVisitas((prev) => [...prev, visita]);
    showToast(`Visita programada para ${cliente.nombre} el ${nuevaVisita.fecha} a las ${nuevaVisita.hora}`, 'success');
    setModalNueva(false);
    setNuevaVisita({ clienteId: '', fecha: '', hora: '09:00', notas: '', productosInteres: [] });
  };

  const toggleProducto = (codigo: string) => {
    setNuevaVisita((prev) => ({
      ...prev,
      productosInteres: prev.productosInteres.includes(codigo)
        ? prev.productosInteres.filter((c) => c !== codigo)
        : [...prev.productosInteres, codigo],
    }));
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-800 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-cyan-500" />
            Visitas
          </h1>
          <p className="text-sm text-gray-500 mt-1">Agenda semanal · Semana del 14 al 20 de septiembre</p>
        </div>
        <Button variant="primary" icon={<Plus className="w-4 h-4" />} onClick={() => setModalNueva(true)}>
          Registrar visita
        </Button>
      </div>

      {/* Weekly calendar */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {semanaFechas.map((fecha, idx) => {
          const visitasDia = visitasPorDia[fecha] || [];
          const d = new Date(fecha);
          const esHoy = fecha === '2026-09-16';
          return (
            <div key={fecha} className={`bg-white rounded-xl border ${esHoy ? 'border-cyan-400 ring-1 ring-cyan-200' : 'border-gray-200'} shadow-card flex flex-col min-h-[200px]`}>
              {/* Day header */}
              <div className={`px-3 py-2 border-b border-gray-100 rounded-t-xl ${esHoy ? 'bg-cyan-50' : 'bg-gray-50'}`}>
                <p className="text-xs text-gray-500">{diasSemana[idx]}</p>
                <p className={`text-lg font-bold ${esHoy ? 'text-cyan-600' : 'text-navy-800'}`}>{d.getDate()}</p>
              </div>
              {/* Visits */}
              <div className="p-2 space-y-2 flex-1">
                {visitasDia.length === 0 ? (
                  <p className="text-xs text-gray-300 text-center pt-4">Sin visitas</p>
                ) : (
                  visitasDia.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => { setModalDetalle(v); setNotaEdit(v.notas); }}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all hover:shadow-sm ${
                        v.estado === 'Realizada' ? 'bg-success-50/40 border-success-200' :
                        v.estado === 'Cancelada' ? 'bg-error-50/40 border-error-200 opacity-60' :
                        'bg-cyan-50/30 border-cyan-200 hover:bg-cyan-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        {v.estado === 'Realizada' ? <CheckCircle2 className="w-3 h-3 text-success-500" /> : <Circle className="w-3 h-3 text-gray-300" />}
                        <span className="text-xs font-medium text-gray-500">{v.hora}</span>
                      </div>
                      <p className="text-xs font-medium text-navy-800 truncate">{v.clienteNombre}</p>
                      <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5"><MapPin className="w-2.5 h-2.5" />{v.municipio}</p>
                    </button>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* List view for mobile / detailed */}
      <Card>
        <CardHeader title="Todas las visitas" subtitle={`${visitas.length} visitas registradas`} icon={<CalendarDays className="w-5 h-5" />} />
        <CardBody>
          <div className="space-y-2">
            {visitas.map((v) => (
              <div
                key={v.id}
                onClick={() => { setModalDetalle(v); setNotaEdit(v.notas); }}
                className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-cyan-200 hover:bg-cyan-50/30 transition-colors cursor-pointer"
              >
                <div className="w-10 h-10 rounded-lg bg-navy-50 text-navy-600 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-medium">{new Date(v.fecha).toLocaleDateString('es-CO', { month: 'short' })}</span>
                  <span className="text-sm font-bold leading-none">{new Date(v.fecha).getDate()}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-800 truncate">{v.clienteNombre}</p>
                  <p className="text-xs text-gray-500">{v.hora} · {v.municipio} · {v.vendedor}</p>
                </div>
                {v.estado === 'Realizada' ? <Badge tone="success" dot>Realizada</Badge> : <Badge tone="cyan" dot>{v.estado}</Badge>}
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Detail modal */}
      <Modal
        open={!!modalDetalle}
        onClose={() => setModalDetalle(null)}
        title={modalDetalle?.clienteNombre || ''}
        subtitle={modalDetalle ? `${modalDetalle.fecha} · ${modalDetalle.hora}` : ''}
        size="lg"
        footer={
          modalDetalle && modalDetalle.estado === 'Programada' ? (
            <div className="flex items-center gap-2 w-full">
              <Button variant="secondary" className="flex-1" icon={<Sparkles className="w-4 h-4" />} onClick={() => convertirOportunidad(modalDetalle.id)}>
                Convertir en oportunidad
              </Button>
              <Button variant="primary" className="flex-1" icon={<CheckCircle2 className="w-4 h-4" />} onClick={() => marcarRealizada(modalDetalle.id)}>
                Marcar como realizada
              </Button>
            </div>
          ) : null
        }
      >
        {modalDetalle && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">Fecha</p>
                <p className="text-sm font-medium text-navy-700">{modalDetalle.fecha}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">Hora</p>
                <p className="text-sm font-medium text-navy-700 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gray-400" />{modalDetalle.hora}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">Vendedor</p>
                <p className="text-sm font-medium text-navy-700 flex items-center gap-1"><User className="w-3.5 h-3.5 text-gray-400" />{modalDetalle.vendedor}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">Municipio</p>
                <p className="text-sm font-medium text-navy-700 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-400" />{modalDetalle.municipio}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">Estado</p>
                {modalDetalle.estado === 'Realizada' ? <Badge tone="success" dot>Realizada</Badge> : <Badge tone="cyan" dot>{modalDetalle.estado}</Badge>}
              </div>
            </div>

            {/* Notas */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-navy-700">Notas de la visita</label>
                <Button size="sm" variant="ghost" icon={<Save className="w-3.5 h-3.5" />} onClick={guardarNotas} disabled={notaEdit === modalDetalle.notas}>
                  Guardar notas
                </Button>
              </div>
              <textarea
                value={notaEdit}
                onChange={(e) => setNotaEdit(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30 resize-none"
              />
            </div>

            {/* Productos de interés */}
            {modalDetalle.productosInteres.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-navy-800 mb-2 flex items-center gap-2"><Package className="w-4 h-4 text-cyan-600" />Productos de interés</h4>
                <div className="flex flex-wrap gap-2">
                  {modalDetalle.productosInteres.map((cod) => {
                    const p = productos.find((pr) => pr.codigo === cod);
                    return <Badge key={cod} tone="navy">{p?.nombre || cod}</Badge>;
                  })}
                </div>
              </div>
            )}

            {/* Tarea de seguimiento */}
            {modalDetalle.tareaSeguimiento && (
              <div className="bg-cyan-50/40 border border-cyan-100 rounded-lg p-3">
                <p className="text-xs text-gray-400 mb-1">Tarea de seguimiento</p>
                <p className="text-sm text-navy-700">{modalDetalle.tareaSeguimiento}</p>
              </div>
            )}

            {/* Create task */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={nuevaTarea}
                onChange={(e) => setNuevaTarea(e.target.value)}
                placeholder="Crear tarea de seguimiento..."
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              />
              <Button variant="secondary" onClick={crearTarea} disabled={!nuevaTarea}>Crear tarea</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* New visit modal */}
      <Modal
        open={modalNueva}
        onClose={() => setModalNueva(false)}
        title="Registrar visita"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalNueva(false)}>Cancelar</Button>
            <Button variant="primary" onClick={registrarNuevaVisita} disabled={!nuevaVisita.clienteId || !nuevaVisita.fecha}>Registrar visita</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-navy-700 block mb-1">Cliente</label>
            <select
              value={nuevaVisita.clienteId}
              onChange={(e) => setNuevaVisita({ ...nuevaVisita, clienteId: e.target.value })}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            >
              <option value="">Seleccionar cliente...</option>
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.nombre} — {c.municipio}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-navy-700 block mb-1">Fecha</label>
              <input type="date" value={nuevaVisita.fecha} onChange={(e) => setNuevaVisita({ ...nuevaVisita, fecha: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30" />
            </div>
            <div>
              <label className="text-sm font-medium text-navy-700 block mb-1">Hora</label>
              <input type="time" value={nuevaVisita.hora} onChange={(e) => setNuevaVisita({ ...nuevaVisita, hora: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-navy-700 block mb-1">Notas</label>
            <textarea value={nuevaVisita.notas} onChange={(e) => setNuevaVisita({ ...nuevaVisita, notas: e.target.value })} rows={2} placeholder="Observaciones de la visita..." className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30 resize-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-navy-700 block mb-2">Productos de interés</label>
            <div className="max-h-40 overflow-y-auto space-y-1 border border-gray-200 rounded-lg p-2">
              {productos.map((p) => (
                <label key={p.codigo} className="flex items-center gap-2 p-1.5 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={nuevaVisita.productosInteres.includes(p.codigo)}
                    onChange={() => toggleProducto(p.codigo)}
                    className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-500"
                  />
                  <span className="text-sm text-navy-700 flex-1">{p.nombre}</span>
                  <span className="text-xs text-gray-400">{p.codigo}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
