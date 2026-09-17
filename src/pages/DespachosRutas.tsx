import { useMemo, useState } from 'react';
import {
  AlertTriangle, CheckCircle2, Clock3, Gauge, Map, MapPin, Navigation,
  PackageCheck, RefreshCw, Route, Search, Truck, Weight,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { camionesRutas, type CamionRuta, type EstadoCamion, type EstadoParada } from '@/data/logisticsData';
import { sedes } from '@/data/simData';

const estadoCamionTone: Record<EstadoCamion, 'cyan' | 'warning' | 'success' | 'error'> = {
  'En ruta': 'cyan',
  Cargando: 'warning',
  Disponible: 'success',
  'Con novedad': 'error',
};

const estadoParadaTone: Record<EstadoParada, 'success' | 'cyan' | 'gray'> = {
  Entregada: 'success',
  Próxima: 'cyan',
  Pendiente: 'gray',
};

export function DespachosRutas() {
  const { showToast } = useToast();
  const [camionId, setCamionId] = useState(camionesRutas[0].id);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<EstadoCamion | 'todos'>('todos');
  const [actualizado, setActualizado] = useState('Hace menos de un minuto');
  const camion = camionesRutas.find((item) => item.id === camionId) ?? camionesRutas[0];

  const camionesFiltrados = useMemo(() => camionesRutas.filter((item) => (
    filtroEstado === 'todos' || item.estado === filtroEstado
  )), [filtroEstado]);

  const cargaFiltrada = useMemo(() => {
    const q = busqueda.trim().toLocaleLowerCase('es-CO');
    if (!q) return camion.carga;
    return camion.carga.filter((item) => (
      [item.pedido, item.cliente, item.codigo, item.producto, item.destino]
        .some((value) => value.toLocaleLowerCase('es-CO').includes(q))
    ));
  }, [busqueda, camion]);

  const actualizarUbicaciones = () => {
    const hora = new Date().toLocaleTimeString('es-CO', { hour: 'numeric', minute: '2-digit' });
    setActualizado(`Actualizado a las ${hora}`);
    showToast('Ubicaciones simuladas actualizadas', 'success');
  };

  const porcentajeCarga = Math.round((camion.cargaKg / camion.capacidadKg) * 100);
  const paradasPendientes = camionesRutas.flatMap((item) => item.paradas).filter((parada) => parada.estado !== 'Entregada').length;
  const lineasEnTransito = camionesRutas.flatMap((item) => item.carga).filter((item) => item.estado === 'En tránsito').length;

  return (
    <div id="demo-despachos" className="space-y-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-navy-800">
            <Truck className="h-6 w-6 text-cyan-500" />
            Despachos y rutas
          </h1>
          <p className="mt-1 text-sm text-gray-500">Control de flota, carga, recorridos y entregas · Información simulada</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-gray-400 md:inline">{actualizado}</span>
          <Button variant="secondary" icon={<RefreshCw className="h-4 w-4" />} onClick={actualizarUbicaciones}>
            Actualizar ubicación
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard icon={<Truck className="h-5 w-5" />} label="Camiones operativos" value="3" detail="2 en recorrido" tone="navy" />
        <MetricCard icon={<PackageCheck className="h-5 w-5" />} label="Cargas en tránsito" value={String(lineasEnTransito)} detail="Líneas de manifiesto" tone="cyan" />
        <MetricCard icon={<MapPin className="h-5 w-5" />} label="Paradas pendientes" value={String(paradasPendientes)} detail="Rutas de hoy" tone="warning" />
        <MetricCard icon={<AlertTriangle className="h-5 w-5" />} label="Novedades activas" value="1" detail="Retraso vial controlado" tone="error" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(330px,0.7fr)]">
        <Card className="overflow-hidden">
          <CardHeader
            title="Mapa operativo de la flota"
            subtitle="Rutas previstas, paradas y ubicación simulada de los vehículos"
            icon={<Map className="h-5 w-5" />}
            action={<Badge tone="cyan" dot>Mapa geográfico</Badge>}
          />
          <CardBody>
            <GeoFleetMap selected={camion} onSelect={setCamionId} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Flota de hoy" subtitle="Selecciona un camión para revisar su operación" icon={<Truck className="h-5 w-5" />} />
          <CardBody className="space-y-3">
            <select
              value={filtroEstado}
              onChange={(event) => setFiltroEstado(event.target.value as EstadoCamion | 'todos')}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-navy-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
            >
              <option value="todos">Todos los estados</option>
              <option value="En ruta">En ruta</option>
              <option value="Con novedad">Con novedad</option>
              <option value="Cargando">Cargando</option>
              <option value="Disponible">Disponible</option>
            </select>
            {camionesFiltrados.map((item) => (
              <button
                key={item.id}
                onClick={() => setCamionId(item.id)}
                className={`w-full rounded-xl border p-4 text-left transition-all ${camion.id === item.id ? 'border-cyan-400 bg-cyan-50/50 shadow-sm' : 'border-gray-200 bg-white hover:border-cyan-200'}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-navy-800">{item.placa} <span className="font-normal text-gray-400">· {item.id}</span></p>
                    <p className="mt-0.5 text-xs text-gray-500">{item.conductor} · {item.tipo}</p>
                  </div>
                  <Badge tone={estadoCamionTone[item.estado]} dot>{item.estado}</Badge>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>{item.ubicacionActual}</span>
                  <span className="font-medium text-navy-700">{Math.round((item.cargaKg / item.capacidadKg) * 100)}% carga</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-cyan-500" style={{ width: `${item.progreso}%` }} />
                </div>
                {item.alerta && <p className="mt-3 flex items-start gap-1.5 text-xs text-accent-700"><AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />{item.alerta}</p>}
              </button>
            ))}
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,0.65fr)]">
        <Card>
          <CardHeader
            title={`Manifiesto de carga · ${camion.placa}`}
            subtitle={`${camion.carga.length} líneas cargadas · ${camion.cargaKg.toLocaleString('es-CO')} kg de ${camion.capacidadKg.toLocaleString('es-CO')} kg`}
            icon={<PackageCheck className="h-5 w-5" />}
            action={<Badge tone={porcentajeCarga > 85 ? 'warning' : 'cyan'}>{porcentajeCarga}% utilizado</Badge>}
          />
          <CardBody>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={busqueda}
                onChange={(event) => setBusqueda(event.target.value)}
                placeholder="Buscar pedido, cliente, producto o destino..."
                className="w-full rounded-lg border border-gray-200 py-2 pl-9 pr-3 text-sm outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs text-gray-500">
                    <th className="px-3 py-3 font-medium">Pedido</th>
                    <th className="px-3 py-3 font-medium">Cliente / destino</th>
                    <th className="px-3 py-3 font-medium">Producto</th>
                    <th className="px-3 py-3 text-right font-medium">Cantidad</th>
                    <th className="px-3 py-3 text-right font-medium">Peso</th>
                    <th className="px-3 py-3 font-medium">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {cargaFiltrada.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-3 py-3 font-mono text-xs font-medium text-cyan-700">{item.pedido}</td>
                      <td className="px-3 py-3"><p className="font-medium text-navy-800">{item.cliente}</p><p className="text-xs text-gray-400">{item.destino}</p></td>
                      <td className="px-3 py-3"><p className="font-medium text-navy-700">{item.producto}</p><p className="text-xs text-gray-400">{item.codigo}</p></td>
                      <td className="px-3 py-3 text-right font-medium text-navy-700">{item.cantidad} {item.unidad}</td>
                      <td className="px-3 py-3 text-right text-gray-600">{item.pesoKg.toLocaleString('es-CO')} kg</td>
                      <td className="px-3 py-3"><Badge tone={item.estado === 'Entregado' ? 'success' : item.estado === 'En tránsito' ? 'cyan' : 'warning'} dot>{item.estado}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {cargaFiltrada.length === 0 && <p className="py-8 text-center text-sm text-gray-500">No hay elementos que coincidan con la búsqueda.</p>}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Secuencia de la ruta" subtitle={`${camion.paradas.length} paradas · Llegada ${camion.llegadaEstimada}`} icon={<Route className="h-5 w-5" />} />
          <CardBody>
            <div className="mb-4 grid grid-cols-2 gap-3">
              <InfoBox icon={<Weight className="h-4 w-4" />} label="Carga total" value={`${camion.cargaKg.toLocaleString('es-CO')} kg`} />
              <InfoBox icon={<Gauge className="h-4 w-4" />} label="Avance de ruta" value={`${camion.progreso}%`} />
            </div>
            <div className="space-y-0">
              {camion.paradas.map((parada, index) => (
                <div key={`${camion.id}-${parada.orden}`} className="relative flex gap-3 pb-5 last:pb-0">
                  {index < camion.paradas.length - 1 && <div className="absolute left-[15px] top-8 h-[calc(100%-1rem)] w-px bg-gray-200" />}
                  <div className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${parada.estado === 'Entregada' ? 'bg-success-500 text-white' : parada.estado === 'Próxima' ? 'bg-cyan-500 text-white ring-4 ring-cyan-100' : 'bg-gray-100 text-gray-500'}`}>
                    {parada.estado === 'Entregada' ? <CheckCircle2 className="h-4 w-4" /> : parada.orden}
                  </div>
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex items-start justify-between gap-2"><p className="text-sm font-semibold text-navy-800">{parada.cliente}</p><Badge tone={estadoParadaTone[parada.estado]}>{parada.estado}</Badge></div>
                    <p className="mt-0.5 text-xs text-gray-500">{parada.nombre} · {parada.horaEstimada}</p>
                    <p className="mt-1 text-xs text-gray-400">{parada.pedidos.join(' · ')}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="rounded-xl border border-cyan-100 bg-cyan-50/60 p-4 text-sm text-navy-700">
        <strong>Alcance del prototipo:</strong> las ubicaciones y rutas son simuladas. En una implementación real, el mapa puede recibir posiciones desde GPS, el celular del conductor o el proveedor de rastreo de la flota.
      </div>
    </div>
  );
}

function GeoFleetMap({ selected, onSelect }: { selected: CamionRuta; onSelect: (id: string) => void }) {
  const bounds = { west: -75.0, east: -73.0, north: 5.68, south: 4.60 };
  const zoom = 9;
  const worldSize = 256 * 2 ** zoom;
  const project = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * worldSize;
    const sin = Math.sin((lat * Math.PI) / 180);
    const y = (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * worldSize;
    return { x, y };
  };
  const topLeft = project(bounds.north, bounds.west);
  const bottomRight = project(bounds.south, bounds.east);
  const mapWidth = bottomRight.x - topLeft.x;
  const mapHeight = bottomRight.y - topLeft.y;
  const point = (lat: number, lng: number) => {
    const projected = project(lat, lng);
    return { x: ((projected.x - topLeft.x) / mapWidth) * 100, y: ((projected.y - topLeft.y) / mapHeight) * 100 };
  };
  const minTileX = Math.floor(topLeft.x / 256);
  const maxTileX = Math.floor(bottomRight.x / 256);
  const minTileY = Math.floor(topLeft.y / 256);
  const maxTileY = Math.floor(bottomRight.y / 256);
  const tiles = [];
  for (let x = minTileX; x <= maxTileX; x += 1) {
    for (let y = minTileY; y <= maxTileY; y += 1) tiles.push({ x, y });
  }
  const routePoints = selected.ruta.map((item) => {
    const projected = point(item.lat, item.lng);
    return `${projected.x},${projected.y}`;
  }).join(' ');
  return (
    <div className="relative aspect-[16/8.3] min-h-[360px] overflow-hidden rounded-xl border border-gray-200 bg-[#e8eee9]">
      {tiles.map((tile) => (
        <img
          key={`${tile.x}-${tile.y}`}
          src={`https://tile.openstreetmap.org/${zoom}/${tile.x}/${tile.y}.png`}
          alt=""
          className="absolute max-w-none select-none opacity-80"
          style={{
            left: `${((tile.x * 256 - topLeft.x) / mapWidth) * 100}%`,
            top: `${((tile.y * 256 - topLeft.y) / mapHeight) * 100}%`,
            width: `${(256 / mapWidth) * 100}%`,
            height: `${(256 / mapHeight) * 100}%`,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-navy-900/5" />
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label={`Ruta del camión ${selected.placa}`}>
        <polyline points={routePoints} fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
        <polyline points={routePoints} fill="none" stroke={selected.color} strokeWidth="0.9" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 1" />
      </svg>
      {selected.paradas.map((parada) => {
        const position = point(parada.lat, parada.lng);
        return (
          <div key={parada.orden} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${position.x}%`, top: `${position.y}%` }}>
            <div className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold shadow-lg ${parada.estado === 'Entregada' ? 'bg-success-500 text-white' : parada.estado === 'Próxima' ? 'bg-cyan-500 text-white' : 'bg-white text-navy-700'}`}>{parada.orden}</div>
          </div>
        );
      })}
      {camionesRutas.map((camion) => {
        const position = point(camion.posicion.lat, camion.posicion.lng);
        const isSelected = camion.id === selected.id;
        return (
          <button
            key={camion.id}
            onClick={() => onSelect(camion.id)}
            className="absolute z-20 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
            title={`${camion.placa} · ${camion.estado}`}
          >
            {isSelected && <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400/50" />}
            <span className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-white shadow-lg transition-transform ${isSelected ? 'scale-110' : 'hover:scale-105'}`} style={{ backgroundColor: camion.color }}>
              <Truck className="h-5 w-5" />
            </span>
            <span className="absolute left-1/2 top-11 -translate-x-1/2 whitespace-nowrap rounded-md bg-navy-900/90 px-2 py-1 text-[10px] font-semibold text-white shadow">{camion.placa}</span>
          </button>
        );
      })}
      <div className="absolute left-3 top-3 flex flex-wrap gap-2">
        {sedes.map((sede) => <span key={sede.id} className="rounded-full border border-white/80 bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-navy-700 shadow-sm">{sede.nombre}</span>)}
      </div>
      <div className="absolute bottom-2 right-2 rounded bg-white/90 px-2 py-1 text-[9px] text-gray-500">
        © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" className="underline">OpenStreetMap</a> · Datos simulados
      </div>
      <div className="absolute bottom-3 left-3 rounded-lg border border-white/80 bg-white/95 px-3 py-2 shadow-sm">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-navy-800"><Navigation className="h-3.5 w-3.5 text-cyan-600" />{selected.placa} · {selected.ubicacionActual}</p>
        <p className="mt-0.5 flex items-center gap-1 text-[10px] text-gray-500"><Clock3 className="h-3 w-3" />Llegada estimada: {selected.llegadaEstimada}</p>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, detail, tone }: { icon: React.ReactNode; label: string; value: string; detail: string; tone: 'navy' | 'cyan' | 'warning' | 'error' }) {
  const styles = { navy: 'bg-navy-50 text-navy-600', cyan: 'bg-cyan-50 text-cyan-600', warning: 'bg-warning-50 text-warning-600', error: 'bg-error-50 text-error-600' };
  return <Card><div className="flex items-center gap-3 p-4"><div className={`flex h-10 w-10 items-center justify-center rounded-lg ${styles[tone]}`}>{icon}</div><div><p className="text-xs text-gray-500">{label}</p><div className="flex items-baseline gap-2"><p className="text-xl font-bold text-navy-800">{value}</p><span className="hidden text-xs text-gray-400 sm:inline">{detail}</span></div></div></div></Card>;
}

function InfoBox({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-lg bg-gray-50 p-3"><div className="flex items-center gap-1.5 text-xs text-gray-400">{icon}{label}</div><p className="mt-1 text-sm font-semibold text-navy-800">{value}</p></div>;
}
