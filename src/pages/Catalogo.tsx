import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BookOpen, Search, Filter, Package, MapPin, ChevronRight, Layers, Info,
  Globe2, Sparkles, LoaderCircle, ArrowRight, Building2, CheckCircle2,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import {
  productos, sedes, stockTotal,
  type EstadoInventario, type Producto,
} from '@/data/simData';

const estadoTone: Record<EstadoInventario, 'success' | 'warning' | 'error' | 'purple'> = {
  Disponible: 'success',
  'Inventario bajo': 'warning',
  Agotado: 'error',
  'Baja rotación': 'purple',
};

const ejemplosBusqueda = [
  'productos para ganado de leche disponibles en Ubaté',
  'suplementos para equinos',
  'referencias agotadas en Simijaca',
  'Marca externa antiparasitario bovino',
  'Referencia especializada para ovinos',
];

type EstadoInvestigacion = 'idle' | 'loading' | 'done';

interface SolicitudProveedor {
  id: string;
  producto: string;
  cantidad: number;
  cliente: string;
  prioridad: string;
  observaciones: string;
  proveedor: string;
  ciudadProveedor: string;
}

const proveedoresSimulados = [
  {
    id: 'PV-001',
    nombre: 'Distribuciones Veterinarias Andinas S.A.S.',
    ciudad: 'Bogotá, D. C.',
    cobertura: 'Despacho nacional',
    tiempoEntrega: 'Entrega estimada entre 24 y 48 horas',
  },
  {
    id: 'PV-002',
    nombre: 'Agroinsumos La Sabana S.A.S.',
    ciudad: 'Cota, Cundinamarca',
    cobertura: 'Bogotá y Sabana Centro',
    tiempoEntrega: 'Entrega estimada entre 2 y 3 días hábiles',
  },
];

const normalizar = (texto: string) => texto
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase();

const palabrasVacias = new Set([
  'producto', 'productos', 'referencia', 'referencias', 'para', 'de', 'del',
  'en', 'la', 'el', 'los', 'las', 'disponible', 'disponibles', 'ganado',
]);

export function Catalogo() {
  const [searchParams] = useSearchParams();
  const initialQ = searchParams.get('q') || '';
  const { showToast } = useToast();
  const [busqueda, setBusqueda] = useState(initialQ);
  const [filtroEspecie, setFiltroEspecie] = useState<string | 'todas'>('todas');
  const [filtroCategoria, setFiltroCategoria] = useState<string | 'todas'>('todas');
  const [filtroLaboratorio, setFiltroLaboratorio] = useState<string | 'todas'>('todas');
  const [filtroDisponibilidad, setFiltroDisponibilidad] = useState<string | 'todas'>('todas');
  const [productoSel, setProductoSel] = useState<Producto | null>(null);
  const [estadoInvestigacion, setEstadoInvestigacion] = useState<EstadoInvestigacion>('idle');
  const [solicitudAbierta, setSolicitudAbierta] = useState(false);
  const [solicitudCreada, setSolicitudCreada] = useState<SolicitudProveedor | null>(null);
  const [cantidadSolicitada, setCantidadSolicitada] = useState(1);
  const [clienteSolicitud, setClienteSolicitud] = useState('');
  const [prioridadSolicitud, setPrioridadSolicitud] = useState('Normal');
  const [observacionesSolicitud, setObservacionesSolicitud] = useState('');
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(proveedoresSimulados[0].id);

  const categorias = Array.from(new Set(productos.map((p) => p.categoria)));
  const laboratorios = Array.from(new Set(productos.map((p) => p.laboratorio)));

  const filtrados = useMemo(() => {
    const q = normalizar(busqueda).trim();
    return productos
      .filter((p) => {
        if (!q) return true;
        const haystack = normalizar(`${p.nombre} ${p.codigo} ${p.categoria} ${p.especie} ${p.laboratorio} ${p.presentacion}`);
        const sedeMencionada = sedes.find((s) => q.includes(normalizar(s.nombre)));
        if (sedeMencionada) {
          const pideAgotado = q.includes('agotad');
          if (pideAgotado ? p.stock[sedeMencionada.id] !== 0 : p.stock[sedeMencionada.id] === 0) return false;
        }
        if ((q.includes('equino') || q.includes('caballo')) && p.especie !== 'Equinos' && p.especie !== 'Ambos') return false;
        if ((q.includes('bovino') || q.includes('ganado') || q.includes('leche')) && p.especie !== 'Bovinos' && p.especie !== 'Ambos') return false;
        if (q.includes('suplement') && !normalizar(p.categoria).includes('suplement')) return false;

        const terms = q.split(/\s+/).filter((t) => t.length > 2 && !palabrasVacias.has(t));
        const intentTerms = terms.filter((t) => !['ubate', 'simijaca', 'siberia', 'caro', 'agotadas', 'agotados', 'equinos', 'equino', 'bovinos', 'bovino', 'leche', 'suplementos'].includes(t));
        return intentTerms.every((t) => haystack.includes(t));
      })
      .filter((p) => filtroEspecie === 'todas' || p.especie === filtroEspecie || p.especie === 'Ambos')
      .filter((p) => filtroCategoria === 'todas' || p.categoria === filtroCategoria)
      .filter((p) => filtroLaboratorio === 'todas' || p.laboratorio === filtroLaboratorio)
      .filter((p) => {
        if (filtroDisponibilidad === 'todas') return true;
        if (filtroDisponibilidad === 'Disponible') return p.estado === 'Disponible';
        if (filtroDisponibilidad === 'Agotado') return p.estado === 'Agotado';
        if (filtroDisponibilidad === 'Bajo') return p.estado === 'Inventario bajo';
        if (filtroDisponibilidad === 'Baja rotación') return p.estado === 'Baja rotación';
        return true;
      });
  }, [busqueda, filtroEspecie, filtroCategoria, filtroLaboratorio, filtroDisponibilidad]);

  const relacionados = useMemo(() => {
    if (!productoSel) return [];
    return productos
      .filter((p) => p.categoria === productoSel.categoria && p.codigo !== productoSel.codigo)
      .slice(0, 4);
  }, [productoSel]);

  const analisisExterno = useMemo(() => {
    const q = normalizar(busqueda);
    const categoria = q.includes('antiparas')
      ? 'Antiparasitarios'
      : q.includes('vacun')
        ? 'Vacunas'
        : q.includes('inflam')
          ? 'Antiinflamatorios'
          : q.includes('suplement') || q.includes('vitamin') || q.includes('mineral')
            ? 'Nutrición y suplementos'
            : q.includes('medic') || q.includes('veterin')
              ? 'Medicamentos veterinarios'
              : null;
    const especie = q.includes('ovino')
      ? 'Ovinos'
      : q.includes('equino') || q.includes('caballo')
        ? 'Equinos'
        : q.includes('bovino') || q.includes('ganado')
          ? 'Bovinos'
          : null;
    const especieCompatible = especie !== 'Ovinos';
    const alternativas = categoria && especieCompatible
      ? productos
        .filter((producto) => producto.categoria === categoria)
        .filter((producto) => !especie || producto.especie === especie || producto.especie === 'Ambos')
        .sort((a, b) => stockTotal(b) - stockTotal(a))
        .slice(0, 3)
      : [];

    return { categoria, especie, alternativas };
  }, [busqueda]);

  const aplicarEjemplo = (ej: string) => {
    setBusqueda(ej);
    setEstadoInvestigacion('idle');
    setSolicitudCreada(null);
    showToast('Búsqueda de ejemplo aplicada', 'info');
  };

  const investigarEnInternet = () => {
    setEstadoInvestigacion('loading');
    setSolicitudCreada(null);
    window.setTimeout(() => setEstadoInvestigacion('done'), 1400);
  };

  const crearSolicitudProveedor = () => {
    const proveedor = proveedoresSimulados.find((item) => item.id === proveedorSeleccionado) ?? proveedoresSimulados[0];
    const solicitud: SolicitudProveedor = {
      id: `OC-SIM-${String(Date.now()).slice(-5)}`,
      producto: busqueda.trim(),
      cantidad: cantidadSolicitada,
      cliente: clienteSolicitud.trim() || 'Cliente por confirmar',
      prioridad: prioridadSolicitud,
      observaciones: observacionesSolicitud.trim(),
      proveedor: proveedor.nombre,
      ciudadProveedor: proveedor.ciudad,
    };
    setSolicitudCreada(solicitud);
    setSolicitudAbierta(false);
    showToast(`Orden simulada ${solicitud.id} enviada al proveedor`, 'success');
  };

  return (
    <div id="demo-catalogo" className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-800 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-cyan-500" />
          Catálogo inteligente
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {productos.length} referencias en demostración · Interfaz preparada para buscar entre miles de referencias
        </p>
      </div>

      {/* Prominent search */}
      <Card className="border-l-4 border-l-cyan-500">
        <CardBody className="space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setEstadoInvestigacion('idle');
                setSolicitudCreada(null);
              }}
              placeholder="Buscar productos por nombre, código, categoría, especie o laboratorio..."
              className="w-full pl-12 pr-4 py-3 text-base border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500"
              autoFocus
            />
          </div>
          {/* Example searches */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-gray-400 flex items-center gap-1"><Info className="w-3.5 h-3.5" />Prueba:</span>
            {ejemplosBusqueda.map((ej) => (
              <button
                key={ej}
                onClick={() => aplicarEjemplo(ej)}
                className="text-xs px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-full hover:bg-cyan-100 transition-colors border border-cyan-100"
              >
                "{ej}"
              </button>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Filters */}
      <Card>
        <CardBody className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Filter className="w-4 h-4" />
            <span>Filtros:</span>
          </div>
          <select value={filtroEspecie} onChange={(e) => setFiltroEspecie(e.target.value)} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30">
            <option value="todas">Todas las especies</option>
            <option value="Bovinos">Bovinos</option>
            <option value="Equinos">Equinos</option>
          </select>
          <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30">
            <option value="todas">Todas las categorías</option>
            {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filtroLaboratorio} onChange={(e) => setFiltroLaboratorio(e.target.value)} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30">
            <option value="todas">Todos los laboratorios</option>
            {laboratorios.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
          <select value={filtroDisponibilidad} onChange={(e) => setFiltroDisponibilidad(e.target.value)} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30">
            <option value="todas">Toda disponibilidad</option>
            <option value="Disponible">Disponible</option>
            <option value="Bajo">Inventario bajo</option>
            <option value="Agotado">Agotado</option>
            <option value="Baja rotación">Baja rotación</option>
          </select>
          {(busqueda || filtroEspecie !== 'todas' || filtroCategoria !== 'todas' || filtroLaboratorio !== 'todas' || filtroDisponibilidad !== 'todas') && (
            <Button size="sm" variant="ghost" onClick={() => { setBusqueda(''); setFiltroEspecie('todas'); setFiltroCategoria('todas'); setFiltroLaboratorio('todas'); setFiltroDisponibilidad('todas'); setEstadoInvestigacion('idle'); setSolicitudCreada(null); }}>
              Limpiar
            </Button>
          )}
          <span className="text-sm text-gray-400 ml-auto">{filtrados.length} resultados</span>
        </CardBody>
      </Card>

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtrados.map((p) => (
          <Card key={p.codigo} hover className="cursor-pointer flex flex-col" >
            <div onClick={() => setProductoSel(p)} className="p-4 flex flex-col h-full">
              <div className="flex items-start justify-between mb-2">
                <div className="w-9 h-9 rounded-lg bg-navy-50 text-navy-600 flex items-center justify-center">
                  <Package className="w-[18px] h-[18px]" />
                </div>
                <Badge tone={estadoTone[p.estado]}>{p.estado}</Badge>
              </div>
              <p className="text-xs text-gray-400 font-mono">{p.codigo}</p>
              <h3 className="text-sm font-semibold text-navy-800 mt-0.5 leading-snug">{p.nombre}</h3>
              <p className="text-xs text-gray-500 mt-1">{p.categoria}</p>
              <p className="text-xs text-gray-400 mt-0.5">{p.presentacion} · {p.laboratorio}</p>

              {/* Availability by sede */}
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-1">
                {sedes.map((s) => (
                  <div key={s.id} className="flex items-center justify-between text-xs">
                    <span className="text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-400" />{s.nombre}</span>
                    <span className={p.stock[s.id] === 0 ? 'text-error-600 font-medium' : p.stock[s.id] < 10 ? 'text-accent-600 font-medium' : 'text-navy-700'}>
                      {p.stock[s.id]} u
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-400">Total: {stockTotal(p)} u</span>
                <Badge tone={p.especie === 'Bovinos' ? 'navy' : p.especie === 'Equinos' ? 'cyan' : 'gray'}>{p.especie}</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtrados.length === 0 && (
        <Card className="overflow-hidden border border-cyan-100">
          <div className="bg-gradient-to-r from-navy-800 to-navy-700 px-6 py-5 text-white">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Globe2 className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <p className="font-semibold">Esta referencia no aparece en el inventario de MARE</p>
                  <p className="text-sm text-white/70 mt-1">La IA puede investigar fuentes comerciales públicas y contrastar el resultado con el portafolio interno.</p>
                </div>
              </div>
              {estadoInvestigacion === 'idle' && (
                <Button
                  variant="accent"
                  className="flex-shrink-0"
                  icon={<Sparkles className="w-4 h-4" />}
                  onClick={investigarEnInternet}
                  disabled={busqueda.trim().length < 3}
                >
                  Investigar en internet
                </Button>
              )}
            </div>
          </div>

          {estadoInvestigacion === 'loading' && (
            <CardBody className="py-10 text-center">
              <LoaderCircle className="w-8 h-8 text-cyan-600 animate-spin mx-auto" />
              <p className="text-sm font-medium text-navy-700 mt-3">Consultando catálogos y fuentes comerciales…</p>
              <p className="text-xs text-gray-500 mt-1">Después compararemos categoría, especie y disponibilidad interna.</p>
            </CardBody>
          )}

          {estadoInvestigacion === 'done' && (
            <CardBody className="space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge tone="cyan" dot>Investigación web simulada</Badge>
                    <span className="text-xs text-gray-400">Datos demostrativos</span>
                  </div>
                  <h3 className="text-base font-semibold text-navy-800 mt-2">Referencia consultada: “{busqueda.trim()}”</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Clasificación comercial estimada: {analisisExterno.categoria || 'sin categoría concluyente'} · {analisisExterno.especie || 'especie por confirmar'}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={investigarEnInternet}>Volver a consultar</Button>
              </div>

              {analisisExterno.alternativas.length > 0 ? (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-4 h-4 text-cyan-600" />
                    <h4 className="text-sm font-semibold text-navy-800">Coincidencias comerciales en el inventario real</h4>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                    {analisisExterno.alternativas.map((producto, index) => (
                      <button
                        key={producto.codigo}
                        onClick={() => setProductoSel(producto)}
                        className="text-left p-4 rounded-xl border border-gray-200 hover:border-cyan-300 hover:shadow-card transition-all bg-white"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <Badge tone={index === 0 ? 'success' : 'gray'}>{index === 0 ? 'Mayor coincidencia' : 'Otra opción'}</Badge>
                          <span className="text-xs font-mono text-gray-400">{producto.codigo}</span>
                        </div>
                        <p className="text-sm font-semibold text-navy-800 mt-3">{producto.nombre}</p>
                        <p className="text-xs text-gray-500 mt-1">{producto.categoria} · {producto.especie}</p>
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                          <span className="text-xs text-gray-500">{stockTotal(producto)} unidades disponibles</span>
                          <span className="text-xs font-medium text-cyan-700 flex items-center gap-1">Ver inventario <ArrowRight className="w-3 h-3" /></span>
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-warning-50/60 border border-warning-100 rounded-lg p-3">
                    <p className="text-xs text-navy-600">La coincidencia es únicamente comercial. No confirma equivalencia, sustitución, uso clínico ni recomendación terapéutica; requiere validación profesional.</p>
                    <Button variant="secondary" size="sm" className="flex-shrink-0" onClick={() => setSolicitudAbierta(true)}>Ninguna corresponde: pedir a proveedor</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-xl border border-accent-200 bg-accent-50/40 p-4 flex items-start gap-3">
                    <Info className="w-5 h-5 text-accent-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-navy-800">No encontramos una coincidencia responsable en el portafolio</p>
                      <p className="text-xs text-gray-600 mt-1">La IA evitó proponer una sustitución dudosa y buscó proveedores comerciales en Colombia.</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-cyan-200 bg-white p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-700 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-sm font-semibold text-navy-800">Distribuciones Veterinarias Andinas S.A.S.</p>
                            <Badge tone="success" dot>Proveedor localizado</Badge>
                            <Badge tone="gray">Dato simulado</Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Bogotá, D. C. · Despacho nacional</p>
                          <p className="text-xs text-navy-600 mt-2">Reporta disponibilidad comercial por confirmar · Entrega estimada entre 24 y 48 horas</p>
                        </div>
                      </div>
                      <Button variant="accent" className="flex-shrink-0" icon={<Building2 className="w-4 h-4" />} onClick={() => setSolicitudAbierta(true)}>
                        Simular pedido
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {solicitudCreada && (
                <div className="rounded-xl bg-success-50 border border-success-100 p-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-success-700">Orden simulada {solicitudCreada.id} enviada al proveedor</p>
                    <p className="text-xs text-navy-600 mt-1">{solicitudCreada.cantidad} unidad(es) de “{solicitudCreada.producto}” · {solicitudCreada.proveedor}, {solicitudCreada.ciudadProveedor}.</p>
                    <p className="text-xs text-success-700 mt-1">Estado: pendiente de confirmación del proveedor · Prioridad {solicitudCreada.prioridad.toLowerCase()}.</p>
                  </div>
                </div>
              )}
            </CardBody>
          )}
        </Card>
      )}

      {/* Disclaimer */}
      <div className="bg-warning-50/50 border border-warning-100 rounded-xl p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-warning-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-navy-700">
          La información presentada es comercial y logística. Las decisiones sanitarias y terapéuticas requieren validación de un médico veterinario.
        </p>
      </div>

      {/* Product detail modal */}
      <Modal
        open={!!productoSel}
        onClose={() => setProductoSel(null)}
        title={productoSel?.nombre || ''}
        subtitle={productoSel ? `${productoSel.codigo} · ${productoSel.categoria}` : ''}
        size="lg"
      >
        {productoSel && (
          <div className="space-y-5">
            {/* Info grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">Código</p>
                <p className="text-sm font-medium text-navy-700 font-mono">{productoSel.codigo}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">Presentación</p>
                <p className="text-sm font-medium text-navy-700">{productoSel.presentacion}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">Laboratorio</p>
                <p className="text-sm font-medium text-navy-700">{productoSel.laboratorio}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">Especie</p>
                <Badge tone={productoSel.especie === 'Bovinos' ? 'navy' : productoSel.especie === 'Equinos' ? 'cyan' : 'gray'}>{productoSel.especie}</Badge>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">Rotación</p>
                <Badge tone={productoSel.rotacion === 'Alta' ? 'success' : productoSel.rotacion === 'Media' ? 'cyan' : 'gray'}>{productoSel.rotacion}</Badge>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-400">Estado</p>
                <Badge tone={estadoTone[productoSel.estado]}>{productoSel.estado}</Badge>
              </div>
            </div>

            {/* Availability by sede */}
            <div>
              <h4 className="text-sm font-semibold text-navy-800 mb-2 flex items-center gap-2"><MapPin className="w-4 h-4 text-cyan-600" />Disponibilidad por sede</h4>
              <div className="space-y-2">
                {sedes.map((s) => (
                  <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-navy-700">{s.nombre} <span className="text-xs text-gray-400">· {s.municipio}</span></span>
                    <span className={`text-sm font-semibold ${productoSel.stock[s.id] === 0 ? 'text-error-600' : productoSel.stock[s.id] < 10 ? 'text-accent-600' : 'text-navy-700'}`}>
                      {productoSel.stock[s.id]} unidades
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between p-3 bg-navy-50 rounded-lg">
                  <span className="text-sm font-medium text-navy-700">Total</span>
                  <span className="text-sm font-bold text-navy-800">{stockTotal(productoSel)} unidades</span>
                </div>
              </div>
            </div>

            {/* Related products */}
            {relacionados.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-navy-800 mb-2 flex items-center gap-2"><Layers className="w-4 h-4 text-cyan-600" />Productos relacionados por categoría</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {relacionados.map((r) => (
                    <button
                      key={r.codigo}
                      onClick={() => setProductoSel(r)}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-lg bg-navy-50 text-navy-600 flex items-center justify-center flex-shrink-0">
                        <Package className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-navy-700 truncate">{r.nombre}</p>
                        <p className="text-xs text-gray-400">{r.codigo} · {r.presentacion}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-warning-50/50 border border-warning-100 rounded-lg p-3">
              <p className="text-xs text-navy-600">
                La información presentada es comercial y logística. Las decisiones sanitarias y terapéuticas requieren validación de un médico veterinario.
              </p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={solicitudAbierta}
        onClose={() => setSolicitudAbierta(false)}
        title="Solicitar referencia a proveedor"
        subtitle="Simulación de una orden de compra a un proveedor colombiano"
        size="lg"
        footer={(
          <>
            <Button variant="ghost" onClick={() => setSolicitudAbierta(false)}>Cancelar</Button>
            <Button variant="accent" icon={<Building2 className="w-4 h-4" />} onClick={crearSolicitudProveedor}>Enviar orden simulada</Button>
          </>
        )}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-navy-700 mb-1.5">Referencia solicitada</label>
            <input value={busqueda} readOnly className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 text-navy-700" />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy-700 mb-1.5">Proveedor en Colombia</label>
            <select value={proveedorSeleccionado} onChange={(e) => setProveedorSeleccionado(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30">
              {proveedoresSimulados.map((proveedor) => (
                <option key={proveedor.id} value={proveedor.id}>{proveedor.nombre} · {proveedor.ciudad}</option>
              ))}
            </select>
            {proveedoresSimulados.filter((proveedor) => proveedor.id === proveedorSeleccionado).map((proveedor) => (
              <div key={proveedor.id} className="mt-2 rounded-lg bg-cyan-50 border border-cyan-100 px-3 py-2.5">
                <p className="text-xs font-medium text-cyan-800">{proveedor.cobertura}</p>
                <p className="text-xs text-cyan-700 mt-0.5">{proveedor.tiempoEntrega} · Disponibilidad por confirmar</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-navy-700 mb-1.5">Cantidad estimada</label>
              <input type="number" min={1} value={cantidadSolicitada} onChange={(e) => setCantidadSolicitada(Math.max(1, Number(e.target.value) || 1))} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30" />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy-700 mb-1.5">Prioridad</label>
              <select value={prioridadSolicitud} onChange={(e) => setPrioridadSolicitud(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30">
                <option>Normal</option>
                <option>Alta</option>
                <option>Urgente</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-navy-700 mb-1.5">Cliente o interesado</label>
            <input value={clienteSolicitud} onChange={(e) => setClienteSolicitud(e.target.value)} placeholder="Ej. Hacienda El Porvenir" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30" />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy-700 mb-1.5">Observaciones comerciales</label>
            <textarea value={observacionesSolicitud} onChange={(e) => setObservacionesSolicitud(e.target.value)} rows={3} placeholder="Presentación requerida, fecha esperada u otra información para Compras…" className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/30" />
          </div>
          <div className="bg-warning-50/60 border border-warning-100 rounded-lg p-3">
            <p className="text-xs text-navy-600">Proveedor, disponibilidad, tiempos y orden son datos simulados para esta demostración. El trámite es comercial y no constituye recomendación médica, equivalencia terapéutica ni autorización de uso.</p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
