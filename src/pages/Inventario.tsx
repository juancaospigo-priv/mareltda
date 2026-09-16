import { useState, useMemo } from 'react';
import {
  Package, Search, Filter, ArrowRightLeft, CheckCircle2,
  AlertTriangle, TrendingDown, PackageX, ChevronRight, MapPin,
  ArrowRight,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import {
  productos, sedes, trasladosSugeridos as trasladosInit, stockTotal,
  type EstadoInventario, type SedeId, type TrasladoSugerido,
} from '@/data/simData';

const estadoTone: Record<EstadoInventario, 'success' | 'warning' | 'error' | 'purple'> = {
  Disponible: 'success',
  'Inventario bajo': 'warning',
  Agotado: 'error',
  'Baja rotación': 'purple',
};

const estadoIcons: Record<EstadoInventario, typeof Package> = {
  Disponible: CheckCircle2,
  'Inventario bajo': AlertTriangle,
  Agotado: PackageX,
  'Baja rotación': TrendingDown,
};

export function Inventario({ sedeSeleccionada }: { sedeSeleccionada: SedeId | 'todas' }) {
  const { showToast } = useToast();
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<EstadoInventario | 'todos'>('todos');
  const [filtroCategoria, setFiltroCategoria] = useState<string | 'todas'>('todas');
  const [traslados, setTraslados] = useState<TrasladoSugerido[]>(trasladosInit);
  const [trasladoAprobar, setTrasladoAprobar] = useState<TrasladoSugerido | null>(null);
  const [vista, setVista] = useState<'inventario' | 'traslados'>('inventario');

  const categorias = Array.from(new Set(productos.map((p) => p.categoria)));

  const filtrados = useMemo(() => {
    return productos
      .filter((p) => filtroEstado === 'todos' || p.estado === filtroEstado)
      .filter((p) => filtroCategoria === 'todos' || p.categoria === filtroCategoria)
      .filter((p) => {
        if (!busqueda) return true;
        const q = busqueda.toLowerCase();
        return p.nombre.toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q);
      });
  }, [busqueda, filtroEstado, filtroCategoria]);

  const aprobarTraslado = () => {
    if (!trasladoAprobar) return;
    setTraslados((prev) => prev.map((t) => (t.id === trasladoAprobar.id ? { ...t, estado: 'Aprobado' } : t)));
    showToast(`Traslado aprobado: ${trasladoAprobar.productoNombre} de ${sedes.find((s) => s.id === trasladoAprobar.sedeOrigen)?.nombre} a ${sedes.find((s) => s.id === trasladoAprobar.sedeDestino)?.nombre}`, 'success');
    setTrasladoAprobar(null);
  };

  const getStockClass = (stock: number) => {
    if (stock === 0) return 'text-error-600 font-semibold';
    if (stock < 10) return 'text-accent-600 font-medium';
    return 'text-navy-700';
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-800 flex items-center gap-2">
            <Package className="w-6 h-6 text-cyan-500" />
            Inventario consolidado
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {sedeSeleccionada === 'todas' ? 'Vista consolidada de las 4 sedes' : `Sede: ${sedes.find((s) => s.id === sedeSeleccionada)?.nombre}`}
          </p>
        </div>
        {/* View toggle */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setVista('inventario')}
            className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${vista === 'inventario' ? 'bg-white text-navy-700 shadow-sm' : 'text-gray-500'}`}
          >
            Inventario
          </button>
          <button
            onClick={() => setVista('traslados')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${vista === 'traslados' ? 'bg-white text-navy-700 shadow-sm' : 'text-gray-500'}`}
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            Traslados sugeridos ({traslados.filter((t) => t.estado === 'Sugerido').length})
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-success-50 text-success-600 flex items-center justify-center"><CheckCircle2 className="w-5 h-5" /></div>
          <div><p className="text-xs text-gray-500">Disponibles</p><p className="text-xl font-bold text-navy-800">{productos.filter((p) => p.estado === 'Disponible').length}</p></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-warning-50 text-warning-600 flex items-center justify-center"><AlertTriangle className="w-5 h-5" /></div>
          <div><p className="text-xs text-gray-500">Inventario bajo</p><p className="text-xl font-bold text-navy-800">{productos.filter((p) => p.estado === 'Inventario bajo').length}</p></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-error-50 text-error-600 flex items-center justify-center"><PackageX className="w-5 h-5" /></div>
          <div><p className="text-xs text-gray-500">Agotados</p><p className="text-xl font-bold text-navy-800">{productos.filter((p) => p.estado === 'Agotado').length}</p></div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 shadow-card p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><TrendingDown className="w-5 h-5" /></div>
          <div><p className="text-xs text-gray-500">Baja rotación</p><p className="text-xl font-bold text-navy-800">{productos.filter((p) => p.estado === 'Baja rotación').length}</p></div>
        </div>
      </div>

      {vista === 'inventario' ? (
        <>
          {/* Filters */}
          <Card>
            <CardBody className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" value={busqueda} onChange={(e) => setBusqueda(e.target.value)} placeholder="Buscar producto o código..." className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500" />
              </div>
              <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value as EstadoInventario | 'todos')} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30">
                <option value="todos">Todos los estados</option>
                <option value="Disponible">Disponible</option>
                <option value="Inventario bajo">Inventario bajo</option>
                <option value="Agotado">Agotado</option>
                <option value="Baja rotación">Baja rotación</option>
              </select>
              <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30">
                <option value="todas">Todas las categorías</option>
                {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {(busqueda || filtroEstado !== 'todos' || filtroCategoria !== 'todas') && (
                <Button size="sm" variant="ghost" onClick={() => { setBusqueda(''); setFiltroEstado('todos'); setFiltroCategoria('todas'); }}>Limpiar</Button>
              )}
              <span className="text-sm text-gray-400 ml-auto">{filtrados.length} productos</span>
            </CardBody>
          </Card>

          {/* Table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 font-medium">Código</th>
                    <th className="px-4 py-3 font-medium">Producto</th>
                    <th className="px-4 py-3 font-medium hidden lg:table-cell">Categoría</th>
                    <th className="px-4 py-3 font-medium hidden xl:table-cell">Presentación</th>
                    {sedes.map((s) => <th key={s.id} className="px-4 py-3 font-medium text-center hidden md:table-cell">{s.nombre}</th>)}
                    <th className="px-4 py-3 font-medium text-center">Total</th>
                    <th className="px-4 py-3 font-medium">Estado</th>
                    <th className="px-4 py-3 font-medium hidden lg:table-cell">Rotación</th>
                    <th className="px-4 py-3 font-medium hidden xl:table-cell">Últ. movimiento</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((p) => {
                    const Icon = estadoIcons[p.estado];
                    return (
                      <tr key={p.codigo} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-gray-500 font-mono text-xs">{p.codigo}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-navy-800">{p.nombre}</p>
                          <p className="text-xs text-gray-400">{p.laboratorio}</p>
                        </td>
                        <td className="px-4 py-3 text-gray-600 hidden lg:table-cell">{p.categoria}</td>
                        <td className="px-4 py-3 text-gray-600 hidden xl:table-cell">{p.presentacion}</td>
                        {sedes.map((s) => (
                          <td key={s.id} className={`px-4 py-3 text-center hidden md:table-cell ${getStockClass(p.stock[s.id])}`}>
                            {p.stock[s.id]}
                          </td>
                        ))}
                        <td className="px-4 py-3 text-center font-semibold text-navy-800">{stockTotal(p)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <Icon className={`w-3.5 h-3.5 ${p.estado === 'Disponible' ? 'text-success-500' : p.estado === 'Inventario bajo' ? 'text-warning-500' : p.estado === 'Agotado' ? 'text-error-500' : 'text-indigo-500'}`} />
                            <Badge tone={estadoTone[p.estado]}>{p.estado}</Badge>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <Badge tone={p.rotacion === 'Alta' ? 'success' : p.rotacion === 'Media' ? 'cyan' : 'gray'}>{p.rotacion}</Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs hidden xl:table-cell">{p.ultimoMovimiento}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {filtrados.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No se encontraron productos</p>
              </div>
            )}
          </Card>
        </>
      ) : (
        /* Traslados sugeridos */
        <Card>
          <CardHeader
            title="Traslados sugeridos entre sedes"
            subtitle="Recomendaciones automáticas para equilibrar inventario"
            icon={<ArrowRightLeft className="w-5 h-5" />}
          />
          <CardBody className="space-y-3">
            {traslados.map((t) => (
              <div key={t.id} className={`flex items-center gap-4 p-4 rounded-lg border ${t.estado === 'Sugerido' ? 'border-gray-200 bg-white' : t.estado === 'Aprobado' ? 'border-success-200 bg-success-50/30' : 'border-cyan-200 bg-cyan-50/30'}`}>
                <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0">
                  <ArrowRightLeft className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-navy-800">{t.productoNombre}</p>
                  <p className="text-xs text-gray-500">{t.motivo}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge tone="navy"><MapPin className="w-3 h-3 mr-1" />{sedes.find((s) => s.id === t.sedeOrigen)?.nombre}</Badge>
                    <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                    <Badge tone="cyan"><MapPin className="w-3 h-3 mr-1" />{sedes.find((s) => s.id === t.sedeDestino)?.nombre}</Badge>
                    <span className="text-xs text-gray-500">{t.cantidad} unidades</span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {t.estado === 'Sugerido' ? (
                    <Button size="sm" variant="accent" onClick={() => setTrasladoAprobar(t)}>Aprobar traslado</Button>
                  ) : (
                    <Badge tone={t.estado === 'Aprobado' ? 'success' : 'cyan'} dot>{t.estado}</Badge>
                  )}
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {/* Approve modal */}
      <Modal
        open={!!trasladoAprobar}
        onClose={() => setTrasladoAprobar(null)}
        title="Aprobar traslado de inventario"
        subtitle={trasladoAprobar?.productoNombre}
        footer={
          <>
            <Button variant="secondary" onClick={() => setTrasladoAprobar(null)}>Cancelar</Button>
            <Button variant="accent" onClick={aprobarTraslado}>Aprobar y ejecutar</Button>
          </>
        }
      >
        {trasladoAprobar && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Sede de origen</p>
                  <p className="text-sm font-medium text-navy-700 flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400" />{sedes.find((s) => s.id === trasladoAprobar.sedeOrigen)?.nombre}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-cyan-500" />
                <div className="text-right">
                  <p className="text-xs text-gray-400">Sede de destino</p>
                  <p className="text-sm font-medium text-navy-700 flex items-center gap-1"><MapPin className="w-4 h-4 text-gray-400" />{sedes.find((s) => s.id === trasladoAprobar.sedeDestino)?.nombre}</p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-400">Cantidad a trasladar</p>
                  <p className="text-lg font-bold text-navy-800">{trasladoAprobar.cantidad} unidades</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Producto</p>
                  <p className="text-sm font-medium text-navy-700">{trasladoAprobar.productoCodigo}</p>
                </div>
              </div>
            </div>
            <div className="bg-cyan-50/40 border border-cyan-100 rounded-lg p-3">
              <p className="text-sm text-navy-700">{trasladoAprobar.motivo}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
