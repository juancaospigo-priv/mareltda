import { useState } from 'react';
import {
  Settings, Building2, Users, Bell, Database, Sparkles,
  MapPin, Save,
} from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { sedes, vendedores } from '@/data/simData';

export function Configuracion() {
  const { showToast } = useToast();
  const [notifActivas, setNotifActivas] = useState({
    clientesSinContacto: true,
    inventarioBajo: true,
    oportunidadesIA: true,
    trasladosSugeridos: false,
  nuevaVisita: true,
  pedidoCerrado: false,
  });
  const [umbralContacto, setUmbralContacto] = useState(30);
  const [umbralInventario, setUmbralInventario] = useState(10);

  const handleGuardar = () => {
    showToast('Configuración guardada', 'success');
  };

  const toggleNotif = (key: keyof typeof notifActivas) => {
    setNotifActivas((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-navy-800 flex items-center gap-2">
          <Settings className="w-6 h-6 text-cyan-500" />
          Configuración
        </h1>
        <p className="text-sm text-gray-500 mt-1">Parámetros del sistema y preferencias de notificación</p>
      </div>

      {/* Sedes */}
      <Card>
        <CardHeader title="Sedes" subtitle="Puntos de operación de Mare" icon={<Building2 className="w-5 h-5" />} />
        <CardBody className="space-y-2">
          {sedes.map((s) => (
            <div key={s.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-9 h-9 rounded-lg bg-navy-50 text-navy-600 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-navy-700">{s.nombre}</p>
                <p className="text-xs text-gray-400">{s.municipio}</p>
              </div>
              <Badge tone="success" dot>Activa</Badge>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Equipo comercial */}
      <Card>
        <CardHeader title="Equipo comercial" subtitle="Vendedores activos" icon={<Users className="w-5 h-5" />} />
        <CardBody className="space-y-2">
          {vendedores.map((v) => (
            <div key={v} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-9 h-9 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center text-sm font-bold">
                {v.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-navy-700">{v}</p>
                <p className="text-xs text-gray-400">Vendedor activo</p>
              </div>
              <Badge tone="cyan" dot>En línea</Badge>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Parámetros de IA */}
      <Card>
        <CardHeader title="Parámetros de análisis IA" subtitle="Umbrales para detección automática" icon={<Sparkles className="w-5 h-5" />} />
        <CardBody className="space-y-5">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-navy-700">Días sin contacto para alertar</label>
              <span className="text-sm font-bold text-cyan-600">{umbralContacto} días</span>
            </div>
            <input type="range" min="7" max="90" value={umbralContacto} onChange={(e) => setUmbralContacto(Number(e.target.value))} className="w-full accent-cyan-500" />
            <p className="text-xs text-gray-400 mt-1">La IA marcará clientes como "sin contacto" cuando superen este umbral de días sin visita.</p>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-navy-700">Stock mínimo para alerta de inventario bajo</label>
              <span className="text-sm font-bold text-cyan-600">{umbralInventario} unidades</span>
            </div>
            <input type="range" min="1" max="50" value={umbralInventario} onChange={(e) => setUmbralInventario(Number(e.target.value))} className="w-full accent-cyan-500" />
            <p className="text-xs text-gray-400 mt-1">La IA recomendará traslados cuando el stock de un producto caiga por debajo de este umbral.</p>
          </div>
        </CardBody>
      </Card>

      {/* Notificaciones */}
      <Card>
        <CardHeader title="Notificaciones" subtitle="Preferencias de alertas" icon={<Bell className="w-5 h-5" />} />
        <CardBody className="space-y-2">
          {[
            { key: 'clientesSinContacto' as const, label: 'Clientes sin contacto prolongado', desc: 'Alerta cuando un cliente supera el umbral de días sin visita' },
            { key: 'inventarioBajo' as const, label: 'Inventario bajo', desc: 'Alerta cuando un producto cae bajo el umbral de stock' },
            { key: 'oportunidadesIA' as const, label: 'Nuevas oportunidades IA', desc: 'Notificar cuando se detecta una nueva oportunidad comercial' },
            { key: 'trasladosSugeridos' as const, label: 'Traslados sugeridos', desc: 'Notificar cuando la IA sugiere un traslado entre sedes' },
            { key: 'nuevaVisita' as const, label: 'Nueva visita programada', desc: 'Notificar cuando se programa una nueva visita' },
            { key: 'pedidoCerrado' as const, label: 'Pedido despachado', desc: 'Notificar cuando un pedido cambia a estado despachado' },
          ].map((item) => (
            <div key={item.key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <button
                onClick={() => toggleNotif(item.key)}
                className={`w-10 h-6 rounded-full transition-colors relative flex-shrink-0 ${notifActivas[item.key] ? 'bg-cyan-500' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifActivas[item.key] ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </button>
              <div className="flex-1">
                <p className="text-sm font-medium text-navy-700">{item.label}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </CardBody>
      </Card>

      {/* Data info */}
      <Card>
        <CardHeader title="Datos del sistema" subtitle="Información del prototipo" icon={<Database className="w-5 h-5" />} />
        <CardBody>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Versión del prototipo</span><span className="font-medium text-navy-700">1.0.0</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Tipo de datos</span><span className="font-medium text-navy-700">Simulados (locales)</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Productos en catálogo</span><span className="font-medium text-navy-700">24 referencias</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Clientes registrados</span><span className="font-medium text-navy-700">15 fincas</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Sedes activas</span><span className="font-medium text-navy-700">4 sedes</span></div>
          </div>
          <div className="mt-3 bg-warning-50/50 border border-warning-100 rounded-lg p-3">
            <p className="text-xs text-navy-600">Prototipo demostrativo · Datos simulados. Esta configuración no se persiste entre sesiones.</p>
          </div>
        </CardBody>
      </Card>

      {/* Save */}
      <div className="flex justify-end">
        <Button variant="primary" icon={<Save className="w-4 h-4" />} onClick={handleGuardar}>
          Guardar configuración
        </Button>
      </div>
    </div>
  );
}
