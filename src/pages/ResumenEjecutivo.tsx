import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, UserMinus, Sparkles, ShoppingCart, PackageX, TrendingDown,
  ArrowRightLeft, DollarSign, AlertTriangle, ArrowRight, Clock,
  CalendarDays, Activity, CheckCircle2, ChevronRight,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import {
  getKPIs, getPrioridadesIA, getOportunidadesPorSede, getInventarioStatusData,
  clientes, visitas, actividadesRecientes, formatCOP, diasDesde, type SedeId,
} from '@/data/simData';

export function ResumenEjecutivo({ sedeSeleccionada }: { sedeSeleccionada: SedeId | 'todas' }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const kpis = getKPIs();
  const prioridades = getPrioridadesIA();
  const oportunidadesData = getOportunidadesPorSede();
  const inventarioData = getInventarioStatusData();
  const proximasVisitas = visitas.filter((v) => v.estado === 'Programada').slice(0, 5);
  const clientesAtencion = clientes
    .filter((c) => c.nivelRiesgo === 'Alto' || c.estadoComercial === 'Sin contacto')
    .slice(0, 5);

  const handlePrioridad = (tipo: string) => {
    if (tipo === 'clientes') navigate('/clientes');
    else if (tipo === 'traslado') navigate('/inventario');
    else if (tipo === 'inventario') navigate('/inventario');
    else if (tipo === 'oportunidades') {
      showToast('Tarea creada: Contactar 5 fincas en ventana de reposición', 'success');
      navigate('/oportunidades');
    }
  };

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Buenos días';
    if (h < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-navy-800">
          {getGreeting()}. Esto es lo que requiere atención hoy en Mare.
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Resumen consolidado {sedeSeleccionada === 'todas' ? 'de todas las sedes' : `de sede ${sedeSeleccionada}`}
        </p>
      </div>

      {/* KPIs */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Clientes activos" value={kpis.clientesActivos} icon={<Users className="w-4 h-4" />} tone="navy" onClick={() => navigate('/clientes')} />
          <StatCard label="Sin contacto 30+ días" value={kpis.clientesSinContacto} icon={<UserMinus className="w-4 h-4" />} tone="warning" onClick={() => navigate('/clientes')} />
          <StatCard label="Oportunidades abiertas" value={kpis.oportunidadesAbiertas} icon={<Sparkles className="w-4 h-4" />} tone="cyan" onClick={() => navigate('/oportunidades')} />
          <StatCard label="Pedidos pendientes" value={kpis.pedidosPendientes} icon={<ShoppingCart className="w-4 h-4" />} tone="navy" onClick={() => navigate('/pedidos')} />
          <StatCard label="Productos agotados" value={kpis.productosAgotados} icon={<PackageX className="w-4 h-4" />} tone="error" onClick={() => navigate('/inventario')} />
          <StatCard label="Baja rotación" value={kpis.bajaRotacion} icon={<TrendingDown className="w-4 h-4" />} tone="accent" onClick={() => navigate('/inventario')} />
          <StatCard label="Traslados sugeridos" value={kpis.trasladosPendientes} icon={<ArrowRightLeft className="w-4 h-4" />} tone="warning" onClick={() => navigate('/inventario')} />
          <StatCard label="Valor potencial" value={formatCOP(kpis.valorOportunidades)} icon={<DollarSign className="w-4 h-4" />} tone="success" />
        </div>
      )}

      {/* AI Priorities */}
      <Card className="border-l-4 border-l-cyan-500">
        <CardHeader
          title="Prioridades detectadas por IA"
          subtitle="Análisis automático de datos comerciales e inventario"
          icon={<Sparkles className="w-5 h-5" />}
          action={<Badge tone="cyan" dot>4 alertas</Badge>}
        />
        <CardBody className="space-y-3">
          {prioridades.map((p) => (
            <div key={p.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-navy-800">{p.titulo}</p>
                <p className="text-xs text-gray-500 mt-0.5">{p.explicacion}</p>
              </div>
              <Button size="sm" variant="secondary" onClick={() => handlePrioridad(p.tipo)} className="flex-shrink-0">
                {p.accion}
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Oportunidades por sede */}
        <Card>
          <CardHeader title="Oportunidades por sede" subtitle="Valor potencial en COP" icon={<DollarSign className="w-5 h-5" />} />
          <CardBody>
            {loading ? <Skeleton className="h-64 w-full" /> : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={oportunidadesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="sede" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
                  <Tooltip
                    formatter={(v: number) => [formatCOP(v), 'Valor potencial']}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                  />
                  <Bar dataKey="valor" fill="#06b6d4" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>

        {/* Inventario status */}
        <Card>
          <CardHeader title="Estado del inventario" subtitle="Distribución por estado" icon={<PackageX className="w-5 h-5" />} />
          <CardBody>
            {loading ? <Skeleton className="h-64 w-full" /> : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={inventarioData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                    {inventarioData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
                  <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Agenda + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Próximas visitas */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Agenda de visitas próximas"
            subtitle="Visitas programadas esta semana"
            icon={<CalendarDays className="w-5 h-5" />}
            action={<Button size="sm" variant="ghost" onClick={() => navigate('/visitas')}>Ver todas <ChevronRight className="w-4 h-4" /></Button>}
          />
          <CardBody>
            {loading ? (
              <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
            ) : (
              <div className="space-y-2">
                {proximasVisitas.map((v) => (
                  <div key={v.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:border-cyan-200 hover:bg-cyan-50/30 transition-colors cursor-pointer" onClick={() => navigate('/visitas')}>
                    <div className="w-10 h-10 rounded-lg bg-navy-50 text-navy-600 flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-medium">{new Date(v.fecha).toLocaleDateString('es-CO', { month: 'short' })}</span>
                      <span className="text-sm font-bold leading-none">{new Date(v.fecha).getDate()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy-800 truncate">{v.clienteNombre}</p>
                      <p className="text-xs text-gray-500">{v.hora} · {v.municipio} · {v.vendedor}</p>
                    </div>
                    <Badge tone="cyan" dot>{v.estado}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Actividad reciente */}
        <Card>
          <CardHeader title="Actividad reciente" subtitle="Equipo comercial" icon={<Activity className="w-5 h-5" />} />
          <CardBody>
            {loading ? (
              <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : (
              <div className="space-y-3">
                {actividadesRecientes.map((a) => (
                  <div key={a.id} className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0 text-[10px] font-bold">
                      {a.usuario.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-navy-700">
                        <span className="font-medium">{a.usuario}</span> {a.accion.toLowerCase()}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{a.detalle}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{a.hora}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Clientes que requieren atención */}
      <Card>
        <CardHeader
          title="Clientes que requieren atención"
          subtitle="Sin contacto prolongado o en riesgo comercial"
          icon={<AlertTriangle className="w-5 h-5" />}
          action={<Button size="sm" variant="ghost" onClick={() => navigate('/clientes')}>Ver todos <ChevronRight className="w-4 h-4" /></Button>}
        />
        <CardBody>
          {loading ? (
            <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-gray-500 border-b border-gray-200">
                    <th className="pb-2 font-medium">Cliente</th>
                    <th className="pb-2 font-medium hidden sm:table-cell">Municipio</th>
                    <th className="pb-2 font-medium hidden md:table-cell">Última visita</th>
                    <th className="pb-2 font-medium">Días sin contacto</th>
                    <th className="pb-2 font-medium">Riesgo</th>
                    <th className="pb-2 font-medium text-right">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesAtencion.map((c) => (
                    <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-2.5">
                        <p className="font-medium text-navy-800">{c.nombre}</p>
                        <p className="text-xs text-gray-400">{c.tipoExplotacion}</p>
                      </td>
                      <td className="py-2.5 text-gray-600 hidden sm:table-cell">{c.municipio}</td>
                      <td className="py-2.5 text-gray-600 hidden md:table-cell">{c.ultimaVisita}</td>
                      <td className="py-2.5">
                        <span className={`font-medium ${diasDesde(c.ultimaVisita) > 90 ? 'text-error-600' : diasDesde(c.ultimaVisita) > 45 ? 'text-accent-600' : 'text-warning-600'}`}>
                          {diasDesde(c.ultimaVisita)} días
                        </span>
                      </td>
                      <td className="py-2.5">
                        <Badge tone={c.nivelRiesgo === 'Alto' ? 'error' : c.nivelRiesgo === 'Medio' ? 'warning' : 'success'}>
                          {c.nivelRiesgo}
                        </Badge>
                      </td>
                      <td className="py-2.5 text-right">
                        <Button size="sm" variant="secondary" onClick={() => navigate('/clientes')}>
                          Ver
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
