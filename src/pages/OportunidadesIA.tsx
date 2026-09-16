import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles, Phone, MapPin, FileText, ArrowRightLeft,
  Package, TrendingDown, RefreshCw, ChevronRight, Filter,
  CheckCircle2, Clock, User,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import {
  oportunidades as oportunidadesInit, formatCOP, type Oportunidad, type Prioridad, type TipoOportunidad,
} from '@/data/simData';

const tipoIcons: Record<TipoOportunidad, typeof Phone> = {
  'Contacto pendiente': Phone,
  'Visita sugerida': MapPin,
  'Cotización sin respuesta': FileText,
  'Traslado de inventario': ArrowRightLeft,
  'Venta cruzada': Package,
  'Baja rotación': TrendingDown,
  'Reposición predicha': RefreshCw,
};

const prioridadTone: Record<Prioridad, 'error' | 'warning' | 'gray'> = {
  Alta: 'error',
  Media: 'warning',
  Baja: 'gray',
};

export function OportunidadesIA() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [oportunidades, setOportunidades] = useState<Oportunidad[]>(oportunidadesInit);
  const [filtroPrioridad, setFiltroPrioridad] = useState<Prioridad | 'todas'>('todas');
  const [filtroTipo, setFiltroTipo] = useState<TipoOportunidad | 'todas'>('todas');

  const filtradas = useMemo(() => {
    return oportunidades
      .filter((o) => filtroPrioridad === 'todas' || o.prioridad === filtroPrioridad)
      .filter((o) => filtroTipo === 'todas' || o.tipo === filtroTipo)
      .sort((a, b) => {
        const order: Record<Prioridad, number> = { Alta: 0, Media: 1, Baja: 2 };
        return order[a.prioridad] - order[b.prioridad];
      });
  }, [oportunidades, filtroPrioridad, filtroTipo]);

  const tiposUnicos = Array.from(new Set(oportunidades.map((o) => o.tipo)));

  const handleAccion = (o: Oportunidad) => {
    setOportunidades((prev) => prev.map((x) => (x.id === o.id ? { ...x, estado: 'En gestión' } : x)));
    showToast(`Oportunidad "${o.clienteNombre}" marcada en gestión`, 'success');
  };

  const handleCerrar = (o: Oportunidad) => {
    setOportunidades((prev) => prev.map((x) => (x.id === o.id ? { ...x, estado: 'Cerrada' } : x)));
    showToast(`Oportunidad cerrada: ${o.clienteNombre}`, 'info');
  };

  const handleNavegar = (o: Oportunidad) => {
    if (o.clienteId) navigate(`/clientes?id=${o.clienteId}`);
    else if (o.tipo === 'Traslado de inventario') navigate('/inventario');
    else if (o.tipo === 'Baja rotación') navigate('/inventario');
  };

  const abiertas = oportunidades.filter((o) => o.estado === 'Abierta').length;
  const enGestion = oportunidades.filter((o) => o.estado === 'En gestión').length;
  const cerradas = oportunidades.filter((o) => o.estado === 'Cerrada').length;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-800 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-cyan-500" />
            Oportunidades IA
          </h1>
          <p className="text-sm text-gray-500 mt-1">Centro de recomendaciones comerciales detectadas automáticamente</p>
        </div>
        <div className="flex gap-2">
          <Badge tone="error" dot>{abiertas} abiertas</Badge>
          <Badge tone="warning" dot>{enGestion} en gestión</Badge>
          <Badge tone="gray" dot>{cerradas} cerradas</Badge>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardBody className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Filter className="w-4 h-4" />
            <span>Filtrar:</span>
          </div>
          <select
            value={filtroPrioridad}
            onChange={(e) => setFiltroPrioridad(e.target.value as Prioridad | 'todas')}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
          >
            <option value="todas">Todas las prioridades</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value as TipoOportunidad | 'todas')}
            className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
          >
            <option value="todas">Todos los tipos</option>
            {tiposUnicos.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          {(filtroPrioridad !== 'todas' || filtroTipo !== 'todas') && (
            <Button size="sm" variant="ghost" onClick={() => { setFiltroPrioridad('todas'); setFiltroTipo('todas'); }}>
              Limpiar filtros
            </Button>
          )}
          <span className="text-sm text-gray-400 ml-auto">{filtradas.length} resultados</span>
        </CardBody>
      </Card>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtradas.map((o) => {
          const Icon = tipoIcons[o.tipo];
          return (
            <Card key={o.id} hover className="flex flex-col">
              <div className="p-5 pb-3">
                {/* Top row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                      <Icon className="w-[18px] h-[18px]" />
                    </div>
                    <Badge tone="navy">{o.tipo}</Badge>
                  </div>
                  <Badge tone={prioridadTone[o.prioridad]} dot>{o.prioridad}</Badge>
                </div>

                {/* Cliente */}
                <h3 className="text-base font-semibold text-navy-800">{o.clienteNombre}</h3>
                {o.sedeInvolucrada && (
                  <p className="text-xs text-gray-500 mt-0.5">Sede involucrada: {o.sedeInvolucrada}</p>
                )}

                {/* Motivo */}
                <p className="text-sm text-gray-600 mt-3 leading-relaxed">{o.motivo}</p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-gray-100">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Valor potencial</p>
                    <p className="text-sm font-semibold text-navy-800">
                      {o.valorPotencial > 0 ? formatCOP(o.valorPotencial) : '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wide">Confianza IA</p>
                    <div className="flex items-center gap-1.5">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${o.confianza}%` }} />
                      </div>
                      <span className="text-xs font-medium text-cyan-600">{o.confianza}%</span>
                    </div>
                  </div>
                </div>

                {/* Acción + responsable */}
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-success-500 flex-shrink-0 mt-0.5" />
                    <span className="text-navy-700">{o.accion}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <User className="w-3.5 h-3.5" />
                    <span>Responsable: {o.responsable}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-auto p-4 pt-0 flex items-center gap-2">
                {o.estado === 'Abierta' ? (
                  <>
                    <Button size="sm" variant="primary" onClick={() => handleAccion(o)} className="flex-1">
                      Gestionar
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => handleNavegar(o)}>
                      Ver
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </>
                ) : o.estado === 'En gestión' ? (
                  <>
                    <Badge tone="warning" dot>En gestión</Badge>
                    <Button size="sm" variant="ghost" onClick={() => handleCerrar(o)} className="ml-auto">
                      Cerrar
                    </Button>
                  </>
                ) : (
                  <Badge tone="gray" dot>Cerrada</Badge>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {filtradas.length === 0 && (
        <div className="text-center py-12">
          <Clock className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No hay oportunidades con los filtros seleccionados</p>
        </div>
      )}
    </div>
  );
}
