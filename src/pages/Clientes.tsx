import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Users, Search, ChevronRight, Phone, MapPin, Calendar,
  ShoppingCart, Sparkles, ClipboardList, StickyNote, Plus,
  CheckCircle2, Circle, X, User, Building2,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { useSessionData } from '@/context/SessionData';
import {
  vendedores, formatCOP, diasDesde,
  type Cliente, type EstadoComercial, type NivelRiesgo, type EspeciePrincipal,
} from '@/data/simData';

const estadoTone: Record<EstadoComercial, 'success' | 'cyan' | 'warning' | 'error' | 'navy'> = {
  Activo: 'success',
  'En seguimiento': 'cyan',
  'Sin contacto': 'warning',
  'En riesgo': 'error',
  Nuevo: 'navy',
};

const riesgoTone: Record<NivelRiesgo, 'error' | 'warning' | 'success'> = {
  Alto: 'error',
  Medio: 'warning',
  Bajo: 'success',
};

export function Clientes() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showToast } = useToast();
  const { clientes, setClientes } = useSessionData();
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<EstadoComercial | 'todos'>('todos');
  const [filtroEspecie, setFiltroEspecie] = useState<EspeciePrincipal | 'todos'>('todos');
  const [filtroVendedor, setFiltroVendedor] = useState<string | 'todos'>('todos');
  const [clienteSeleccionado, setClienteSeleccionado] = useState<Cliente | null>(null);
  const [modalVisita, setModalVisita] = useState(false);
  const [modalSeguimiento, setModalSeguimiento] = useState(false);
  const [nuevaVisita, setNuevaVisita] = useState({ fecha: '', notas: '' });
  const [nuevoSeguimiento, setNuevoSeguimiento] = useState({ descripcion: '', fechaLimite: '' });

  // Open from URL param
  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      const c = clientes.find((cl) => cl.id === id);
      if (c) setClienteSeleccionado(c);
    }
  }, [searchParams, clientes]);

  const filtrados = useMemo(() => {
    return clientes
      .filter((c) => filtroEstado === 'todos' || c.estadoComercial === filtroEstado)
      .filter((c) => filtroEspecie === 'todos' || c.especiePrincipal === filtroEspecie)
      .filter((c) => filtroVendedor === 'todos' || c.vendedor === filtroVendedor)
      .filter((c) => {
        if (!busqueda) return true;
        const q = busqueda.toLowerCase();
        return c.nombre.toLowerCase().includes(q) || c.municipio.toLowerCase().includes(q) || c.tipoExplotacion.toLowerCase().includes(q);
      });
  }, [clientes, busqueda, filtroEstado, filtroEspecie, filtroVendedor]);

  const handleRegistrarVisita = () => {
    if (!clienteSeleccionado || !nuevaVisita.fecha) return;
    const visita = {
      fecha: nuevaVisita.fecha,
      vendedor: clienteSeleccionado.vendedor,
      notas: nuevaVisita.notas || 'Visita registrada desde ficha de cliente',
      productosInteres: [],
      realizada: false,
    };
    setClientes((prev) => prev.map((c) =>
      c.id === clienteSeleccionado.id
        ? { ...c, historialVisitas: [visita, ...c.historialVisitas], ultimaVisita: nuevaVisita.fecha, estadoComercial: 'En seguimiento' }
        : c
    ));
    setClienteSeleccionado((prev) => prev ? { ...prev, historialVisitas: [visita, ...prev.historialVisitas], ultimaVisita: nuevaVisita.fecha } : null);
    showToast(`Visita registrada para ${clienteSeleccionado.nombre} el ${nuevaVisita.fecha}`, 'success');
    setModalVisita(false);
    setNuevaVisita({ fecha: '', notas: '' });
  };

  const handleCrearSeguimiento = () => {
    if (!clienteSeleccionado || !nuevoSeguimiento.descripcion) return;
    const tarea = {
      id: `T-${Math.random().toString(36).slice(2, 7)}`,
      descripcion: nuevoSeguimiento.descripcion,
      fechaLimite: nuevoSeguimiento.fechaLimite || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      completada: false,
    };
    setClientes((prev) => prev.map((c) =>
      c.id === clienteSeleccionado.id ? { ...c, tareas: [...c.tareas, tarea] } : c
    ));
    setClienteSeleccionado((prev) => prev ? { ...prev, tareas: [...prev.tareas, tarea] } : null);
    showToast(`Seguimiento creado: ${nuevoSeguimiento.descripcion}`, 'success');
    setModalSeguimiento(false);
    setNuevoSeguimiento({ descripcion: '', fechaLimite: '' });
  };

  const toggleTarea = (tareaId: string) => {
    if (!clienteSeleccionado) return;
    setClientes((prev) => prev.map((c) =>
      c.id === clienteSeleccionado.id
        ? { ...c, tareas: c.tareas.map((t) => t.id === tareaId ? { ...t, completada: !t.completada } : t) }
        : c
    ));
    setClienteSeleccionado((prev) => prev ? { ...prev, tareas: prev.tareas.map((t) => t.id === tareaId ? { ...t, completada: !t.completada } : t) } : null);
  };

  const closeDetail = () => {
    setClienteSeleccionado(null);
    if (searchParams.get('id')) setSearchParams({});
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-800 flex items-center gap-2">
          <Users className="w-6 h-6 text-cyan-500" />
          Clientes
        </h1>
        <p className="text-sm text-gray-500 mt-1">{clientes.length} clientes registrados · Haciendas, fincas y criaderos</p>
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre, municipio o tipo..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500"
            />
          </div>
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value as EstadoComercial | 'todos')} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30">
            <option value="todos">Todos los estados</option>
            <option value="Activo">Activo</option>
            <option value="En seguimiento">En seguimiento</option>
            <option value="Sin contacto">Sin contacto</option>
            <option value="En riesgo">En riesgo</option>
            <option value="Nuevo">Nuevo</option>
          </select>
          <select value={filtroEspecie} onChange={(e) => setFiltroEspecie(e.target.value as EspeciePrincipal | 'todos')} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30">
            <option value="todos">Todas las especies</option>
            <option value="Bovinos">Bovinos</option>
            <option value="Equinos">Equinos</option>
          </select>
          <select value={filtroVendedor} onChange={(e) => setFiltroVendedor(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30">
            <option value="todos">Todos los vendedores</option>
            {vendedores.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
          {(busqueda || filtroEstado !== 'todos' || filtroEspecie !== 'todos' || filtroVendedor !== 'todos') && (
            <Button size="sm" variant="ghost" onClick={() => { setBusqueda(''); setFiltroEstado('todos'); setFiltroEspecie('todos'); setFiltroVendedor('todos'); }}>
              Limpiar
            </Button>
          )}
          <span className="text-sm text-gray-400 ml-auto">{filtrados.length} resultados</span>
        </CardBody>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-gray-500 border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Tipo</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">Municipio</th>
                <th className="px-4 py-3 font-medium hidden md:table-cell">Especie</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">Vendedor</th>
                <th className="px-4 py-3 font-medium hidden xl:table-cell">Última visita</th>
                <th className="px-4 py-3 font-medium hidden xl:table-cell">Última compra</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium hidden lg:table-cell">Próxima acción</th>
                <th className="px-4 py-3 font-medium">Riesgo</th>
                <th className="px-4 py-3 font-medium text-right"></th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setClienteSeleccionado(c)}
                  className="border-b border-gray-100 hover:bg-cyan-50/30 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-navy-800">{c.nombre}</p>
                    <p className="text-xs text-gray-400">{c.id}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{c.tipoExplotacion}</td>
                  <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{c.municipio}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <Badge tone={c.especiePrincipal === 'Bovinos' ? 'navy' : 'cyan'}>{c.especiePrincipal}</Badge>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{c.vendedor}</td>
                  <td className="px-4 py-3 text-gray-600 hidden xl:table-cell">
                    <span className={diasDesde(c.ultimaVisita) > 90 ? 'text-error-600 font-medium' : ''}>{c.ultimaVisita}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden xl:table-cell">{c.ultimaCompra}</td>
                  <td className="px-4 py-3"><Badge tone={estadoTone[c.estadoComercial]}>{c.estadoComercial}</Badge></td>
                  <td className="px-4 py-3 text-gray-600 hidden lg:table-cell text-xs">{c.proximaAccion}</td>
                  <td className="px-4 py-3"><Badge tone={riesgoTone[c.nivelRiesgo]}>{c.nivelRiesgo}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    <ChevronRight className="w-4 h-4 text-gray-400 inline" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtrados.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No se encontraron clientes con los filtros seleccionados</p>
          </div>
        )}
      </Card>

      {/* Detail drawer */}
      {clienteSeleccionado && (
        <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
          <div className="absolute inset-0 bg-navy-950/40 backdrop-blur-sm" onClick={closeDetail} />
          <div className="relative w-full max-w-2xl bg-white shadow-modal h-full overflow-y-auto animate-slide-in-right">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-5 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-navy-50 text-navy-600 flex items-center justify-center">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-navy-800">{clienteSeleccionado.nombre}</h2>
                      <p className="text-xs text-gray-500">{clienteSeleccionado.id} · {clienteSeleccionado.tipoExplotacion}</p>
                    </div>
                  </div>
                </div>
                <button onClick={closeDetail} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge tone={estadoTone[clienteSeleccionado.estadoComercial]}>{clienteSeleccionado.estadoComercial}</Badge>
                <Badge tone={riesgoTone[clienteSeleccionado.nivelRiesgo]}>Riesgo {clienteSeleccionado.nivelRiesgo}</Badge>
                <Badge tone={clienteSeleccionado.especiePrincipal === 'Bovinos' ? 'navy' : 'cyan'}>{clienteSeleccionado.especiePrincipal}</Badge>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 space-y-6">
              {/* Perfil */}
              <section>
                <h3 className="text-sm font-semibold text-navy-800 mb-3 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-cyan-600" /> Perfil de la finca
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Municipio</p>
                    <p className="text-sm font-medium text-navy-700 flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-gray-400" />{clienteSeleccionado.municipio}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Teléfono</p>
                    <p className="text-sm font-medium text-navy-700 flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-gray-400" />{clienteSeleccionado.telefono}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Hectáreas</p>
                    <p className="text-sm font-medium text-navy-700">{clienteSeleccionado.hectareas} ha</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Animales</p>
                    <p className="text-sm font-medium text-navy-700">{clienteSeleccionado.numAnimales} cabezas</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Vendedor responsable</p>
                    <p className="text-sm font-medium text-navy-700 flex items-center gap-1"><User className="w-3.5 h-3.5 text-gray-400" />{clienteSeleccionado.vendedor}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">Días sin visita</p>
                    <p className={`text-sm font-medium ${diasDesde(clienteSeleccionado.ultimaVisita) > 90 ? 'text-error-600' : 'text-navy-700'}`}>
                      {diasDesde(clienteSeleccionado.ultimaVisita)} días
                    </p>
                  </div>
                </div>
              </section>

              {/* Categorías compradas */}
              <section>
                <h3 className="text-sm font-semibold text-navy-800 mb-3">Categorías compradas</h3>
                <div className="flex flex-wrap gap-2">
                  {clienteSeleccionado.categoriasCompradas.map((cat) => (
                    <Badge key={cat} tone="navy">{cat}</Badge>
                  ))}
                </div>
              </section>

              {/* Recomendaciones IA */}
              <section className="bg-cyan-50/40 rounded-xl p-4 border border-cyan-100">
                <h3 className="text-sm font-semibold text-navy-800 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-600" /> Recomendaciones comerciales de IA
                </h3>
                <div className="space-y-2">
                  {clienteSeleccionado.recomendacionesIA.map((r, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-navy-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 flex-shrink-0" />
                      <p>{r}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Historial pedidos */}
              <section>
                <h3 className="text-sm font-semibold text-navy-800 mb-3 flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4 text-cyan-600" /> Historial comercial
                </h3>
                <div className="space-y-2">
                  {clienteSeleccionado.historialPedidos.map((p) => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-navy-700">{p.id} · {p.fecha}</p>
                        <p className="text-xs text-gray-500">{p.productos.map((pr) => `${pr.nombre} (${pr.cantidad})`).join(', ')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-navy-800">{formatCOP(p.total)}</p>
                        <Badge tone="gray">{p.estado}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Visitas */}
              <section>
                <h3 className="text-sm font-semibold text-navy-800 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-600" /> Visitas
                </h3>
                <div className="space-y-2">
                  {clienteSeleccionado.historialVisitas.map((v, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-navy-700">{v.fecha} · {v.vendedor}</p>
                        {v.realizada ? <Badge tone="success">Realizada</Badge> : <Badge tone="warning">Pendiente</Badge>}
                      </div>
                      <p className="text-xs text-gray-600">{v.notas}</p>
                      {v.productosInteres.length > 0 && (
                        <p className="text-xs text-gray-400 mt-1">Productos de interés: {v.productosInteres.join(', ')}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Tareas */}
              <section>
                <h3 className="text-sm font-semibold text-navy-800 mb-3 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-cyan-600" /> Tareas pendientes
                </h3>
                {clienteSeleccionado.tareas.length === 0 ? (
                  <p className="text-sm text-gray-400">No hay tareas pendientes</p>
                ) : (
                  <div className="space-y-2">
                    {clienteSeleccionado.tareas.map((t) => (
                      <div key={t.id} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg cursor-pointer" onClick={() => toggleTarea(t.id)}>
                        {t.completada ? <CheckCircle2 className="w-4 h-4 text-success-500 mt-0.5" /> : <Circle className="w-4 h-4 text-gray-300 mt-0.5" />}
                        <div className="flex-1">
                          <p className={`text-sm ${t.completada ? 'line-through text-gray-400' : 'text-navy-700'}`}>{t.descripcion}</p>
                          <p className="text-xs text-gray-400">Límite: {t.fechaLimite}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Notas */}
              <section>
                <h3 className="text-sm font-semibold text-navy-800 mb-3 flex items-center gap-2">
                  <StickyNote className="w-4 h-4 text-cyan-600" /> Notas del vendedor
                </h3>
                <div className="bg-warning-50/50 border border-warning-100 rounded-lg p-3">
                  <p className="text-sm text-navy-700 italic">"{clienteSeleccionado.notasVendedor}"</p>
                </div>
              </section>
            </div>

            {/* Footer actions */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex gap-3">
              <Button variant="primary" className="flex-1" onClick={() => setModalVisita(true)} icon={<Calendar className="w-4 h-4" />}>
                Registrar visita
              </Button>
              <Button variant="secondary" className="flex-1" onClick={() => setModalSeguimiento(true)} icon={<Plus className="w-4 h-4" />}>
                Crear seguimiento
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal registrar visita */}
      <Modal
        open={modalVisita}
        onClose={() => setModalVisita(false)}
        title="Registrar visita"
        subtitle={clienteSeleccionado?.nombre}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalVisita(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleRegistrarVisita} disabled={!nuevaVisita.fecha}>Registrar</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-navy-700 block mb-1">Fecha de visita</label>
            <input type="date" value={nuevaVisita.fecha} onChange={(e) => setNuevaVisita({ ...nuevaVisita, fecha: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30" />
          </div>
          <div>
            <label className="text-sm font-medium text-navy-700 block mb-1">Notas</label>
            <textarea value={nuevaVisita.notas} onChange={(e) => setNuevaVisita({ ...nuevaVisita, notas: e.target.value })} rows={3} placeholder="Observaciones de la visita..." className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30 resize-none" />
          </div>
        </div>
      </Modal>

      {/* Modal crear seguimiento */}
      <Modal
        open={modalSeguimiento}
        onClose={() => setModalSeguimiento(false)}
        title="Crear seguimiento"
        subtitle={clienteSeleccionado?.nombre}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalSeguimiento(false)}>Cancelar</Button>
            <Button variant="primary" onClick={handleCrearSeguimiento} disabled={!nuevoSeguimiento.descripcion}>Crear tarea</Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-navy-700 block mb-1">Descripción</label>
            <input type="text" value={nuevoSeguimiento.descripcion} onChange={(e) => setNuevoSeguimiento({ ...nuevoSeguimiento, descripcion: e.target.value })} placeholder="Ej: Llamar para confirmar cotización..." className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30" />
          </div>
          <div>
            <label className="text-sm font-medium text-navy-700 block mb-1">Fecha límite</label>
            <input type="date" value={nuevoSeguimiento.fechaLimite} onChange={(e) => setNuevoSeguimiento({ ...nuevoSeguimiento, fechaLimite: e.target.value })} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30" />
          </div>
        </div>
      </Modal>
    </div>
  );
}
