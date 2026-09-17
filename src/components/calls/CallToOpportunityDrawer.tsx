import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ArrowRight, Building2, Check, CheckCircle2, ClipboardList,
  FileText, Loader2, MapPin, Package, PhoneCall, ShoppingCart, Sparkles,
  Truck, UserRoundCheck, X,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { useSessionData } from '@/context/SessionData';

const notasIniciales = 'Don Carlos llamó de El Porvenir. Necesita 4 unidades del antiparasitario bovino, 10 bultos de concentrado para levante y 6 bolsas de sal mineralizada. Lo necesita para esta semana. Preguntó también por la visita del veterinario.';

const pasos = [
  'Capturar llamada',
  'Organizar necesidad',
  'Consultar cliente e inventario',
  'Recomendar abastecimiento',
  'Crear pedido y seguimiento',
];

interface ProductoSolicitud {
  codigo: string;
  nombre: string;
  cantidad: number;
  unidad: string;
}

const productosIniciales: ProductoSolicitud[] = [
  { codigo: 'AP-2001', nombre: 'Antiparasitario Bovino Campo', cantidad: 4, unidad: 'unidades' },
  { codigo: 'AC-7001', nombre: 'Concentrado Lechero Premium', cantidad: 10, unidad: 'bultos' },
  { codigo: 'SM-6001', nombre: 'Sal Mineralizada Bovina', cantidad: 6, unidad: 'bolsas' },
];

const sugerenciasIniciales = [
  { id: 'ubate', titulo: 'Atender una parte desde Ubaté', detalle: 'Separar 4 unidades del antiparasitario disponibles en la sede.', aprobada: true },
  { id: 'traslado', titulo: 'Solicitar traslado desde Siberia', detalle: 'Trasladar 10 bultos de concentrado a Ubaté para completar el pedido.', aprobada: true },
  { id: 'confirmar', titulo: 'Confirmar inventario bajo', detalle: 'Validar las 6 bolsas de sal mineralizada porque parte de la existencia está comprometida.', aprobada: true },
  { id: 'seguimiento', titulo: 'Programar seguimiento comercial', detalle: 'Carlos Mendoza debe confirmar pedido y fecha de entrega mañana.', aprobada: true },
  { id: 'visita', titulo: 'Sugerir visita del equipo técnico', detalle: 'Programar visita técnica sin emitir diagnóstico ni recomendación terapéutica.', aprobada: true },
];

export function CallToOpportunityDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { llamadaConvertida, convertirLlamada } = useSessionData();
  const [paso, setPaso] = useState(1);
  const [notas, setNotas] = useState(notasIniciales);
  const [analizando, setAnalizando] = useState(false);
  const [productos, setProductos] = useState(productosIniciales);
  const [sugerencias, setSugerencias] = useState(sugerenciasIniciales);
  const [finalizado, setFinalizado] = useState(llamadaConvertida);

  useEffect(() => {
    if (open && llamadaConvertida) {
      setPaso(5);
      setFinalizado(true);
    }
  }, [open, llamadaConvertida]);

  if (!open) return null;

  const analizar = () => {
    setAnalizando(true);
    window.setTimeout(() => {
      setAnalizando(false);
      setPaso(2);
    }, 1100);
  };

  const actualizarCantidad = (codigo: string, cantidad: number) => {
    setProductos((prev) => prev.map((producto) => (
      producto.codigo === codigo ? { ...producto, cantidad: Math.max(1, cantidad) } : producto
    )));
  };

  const actualizarSugerencia = (id: string, campo: 'detalle' | 'aprobada', valor: string | boolean) => {
    setSugerencias((prev) => prev.map((sugerencia) => (
      sugerencia.id === id ? { ...sugerencia, [campo]: valor } : sugerencia
    )));
  };

  const crearAcciones = () => {
    convertirLlamada({
      notas,
      cantidades: Object.fromEntries(productos.map((producto) => [producto.codigo, producto.cantidad])),
      sugerencias: sugerencias.map(({ id, detalle }) => ({ id, detalle })),
    });
    setFinalizado(true);
    showToast('Llamada convertida en pedido, traslado, tarea y visita', 'success');
  };

  const irA = (ruta: string) => {
    onClose();
    navigate(ruta);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-fade-in">
      <button aria-label="Cerrar panel" className="absolute inset-0 bg-navy-950/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative w-full max-w-3xl h-full bg-gray-50 shadow-modal flex flex-col animate-slide-in-right">
        <header className="bg-white border-b border-gray-200 px-5 py-4 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-navy-800">Convertir llamada en oportunidad</h2>
                <p className="text-xs text-gray-500">Hacienda El Porvenir · Flujo asistido por IA</p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </header>

        <div className="bg-white border-b border-gray-200 px-5 py-3 overflow-x-auto">
          <div className="flex min-w-[640px]">
            {pasos.map((nombre, index) => {
              const numero = index + 1;
              const completado = paso > numero || finalizado;
              const activo = paso === numero && !finalizado;
              return (
                <div key={nombre} className="flex items-center flex-1 last:flex-none">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${completado ? 'bg-success-500 text-white' : activo ? 'bg-cyan-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {completado ? <Check className="w-4 h-4" /> : numero}
                    </div>
                    <span className={`text-[11px] leading-tight max-w-[92px] ${activo ? 'text-navy-800 font-semibold' : 'text-gray-400'}`}>{nombre}</span>
                  </div>
                  {numero < pasos.length && <div className={`h-px flex-1 mx-2 ${completado ? 'bg-success-300' : 'bg-gray-200'}`} />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 lg:p-6">
          {paso === 1 && !finalizado && (
            <div className="space-y-5 max-w-2xl mx-auto">
              <div className="bg-white rounded-xl border border-gray-200 shadow-card p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center"><PhoneCall className="w-5 h-5" /></div>
                  <div>
                    <h3 className="font-semibold text-navy-800">1. Capturar llamada</h3>
                    <p className="text-sm text-gray-500 mt-0.5">Escribe las notas tal como las tomaría el vendedor durante la conversación.</p>
                  </div>
                </div>
                <label className="text-sm font-medium text-navy-700 block mb-2">Notas desordenadas de la llamada</label>
                <textarea value={notas} onChange={(event) => setNotas(event.target.value)} rows={7} className="w-full px-4 py-3 text-sm leading-relaxed border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 resize-none" />
                <div className="flex items-center justify-between mt-3">
                  <p className="text-xs text-gray-400">La IA solo organizará información comercial y logística.</p>
                  <Button variant="accent" icon={analizando ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} onClick={analizar} disabled={analizando || !notas.trim()}>
                    {analizando ? 'Analizando llamada…' : 'Analizar con IA'}
                  </Button>
                </div>
              </div>
              {analizando && (
                <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-4 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-5 h-5 text-cyan-600 animate-spin" />
                    <div>
                      <p className="text-sm font-medium text-navy-800">Organizando nombres, productos, cantidades y urgencia</p>
                      <p className="text-xs text-gray-500 mt-0.5">Consultando datos simulados del cliente y las cuatro sedes…</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {paso === 2 && !finalizado && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <SectionTitle icon={<FileText className="w-5 h-5" />} title="2. Necesidad organizada" subtitle="La IA convirtió las notas libres en información comercial revisable." />
              <div className="grid grid-cols-2 gap-3">
                <InfoItem label="Cliente identificado" value="Hacienda El Porvenir" />
                <InfoItem label="Ubicación" value="Ubaté, Cundinamarca" />
                <InfoItem label="Tipo de producción" value="Ganadería de leche · Bovinos" />
                <InfoItem label="Urgencia" value="Esta semana" badge="Alta" />
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-card p-4">
                <h4 className="text-sm font-semibold text-navy-800 mb-3">Productos y cantidades detectadas</h4>
                <div className="space-y-2">
                  {productos.map((producto) => (
                    <div key={producto.codigo} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Package className="w-4 h-4 text-cyan-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-navy-700">{producto.nombre}</p>
                        <p className="text-xs text-gray-400">{producto.codigo}</p>
                      </div>
                      <input type="number" min="1" value={producto.cantidad} onChange={(event) => actualizarCantidad(producto.codigo, Number(event.target.value))} className="w-16 px-2 py-1.5 text-sm text-center border border-gray-200 rounded-lg" />
                      <span className="text-xs text-gray-500 w-16">{producto.unidad}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <InfoItem label="Pregunta pendiente" value="Confirmar presentación exacta del concentrado para levante." />
                <InfoItem label="Solicitud adicional" value="Visita del equipo técnico solicitada por el cliente." />
              </div>
            </div>
          )}

          {paso === 3 && !finalizado && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <SectionTitle icon={<Building2 className="w-5 h-5" />} title="3. Cliente e inventario" subtitle="Cruce de la necesidad con la ficha de Hacienda El Porvenir y la disponibilidad simulada." />
              <div className="bg-white rounded-xl border border-gray-200 shadow-card p-4 flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg bg-navy-50 text-navy-600 flex items-center justify-center"><Building2 className="w-5 h-5" /></div>
                <div className="flex-1">
                  <p className="font-semibold text-navy-800">Hacienda El Porvenir</p>
                  <p className="text-sm text-gray-500">Cliente histórico · 85 bovinos · Responsable: Carlos Mendoza</p>
                </div>
                <Badge tone="warning">En riesgo</Badge>
              </div>
              <div className="space-y-3">
                <InventoryResult icon={<CheckCircle2 className="w-5 h-5" />} tone="success" title="Antiparasitario bovino" code="AP-2001" status="Disponible en Ubaté" detail="15 unidades disponibles · se solicitan 4" />
                <InventoryResult icon={<Truck className="w-5 h-5" />} tone="accent" title="Concentrado para levante" code="AC-7001" status="Agotado en Ubaté" detail="120 unidades disponibles en Siberia · requiere traslado" />
                <InventoryResult icon={<ClipboardList className="w-5 h-5" />} tone="warning" title="Sal mineralizada" code="SM-6001" status="Requiere confirmación" detail="30 unidades físicas en Ubaté · 24 comprometidas · disponibilidad libre baja" />
              </div>
            </div>
          )}

          {paso === 4 && !finalizado && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <SectionTitle icon={<Sparkles className="w-5 h-5" />} title="4. Abastecimiento recomendado" subtitle="Aprueba cada sugerencia o edita el texto antes de crear las acciones." />
              <div className="space-y-3">
                {sugerencias.map((sugerencia) => (
                  <div key={sugerencia.id} className={`bg-white rounded-xl border shadow-card p-4 ${sugerencia.aprobada ? 'border-cyan-200' : 'border-gray-200 opacity-70'}`}>
                    <div className="flex items-center gap-3 mb-3">
                      <button onClick={() => actualizarSugerencia(sugerencia.id, 'aprobada', !sugerencia.aprobada)} className={`w-6 h-6 rounded-md flex items-center justify-center border ${sugerencia.aprobada ? 'bg-cyan-500 border-cyan-500 text-white' : 'bg-white border-gray-300 text-transparent'}`}>
                        <Check className="w-4 h-4" />
                      </button>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-navy-800">{sugerencia.titulo}</p>
                        <p className="text-xs text-gray-400">{sugerencia.aprobada ? 'Aprobada' : 'Pendiente de aprobación'}</p>
                      </div>
                    </div>
                    <textarea value={sugerencia.detalle} onChange={(event) => actualizarSugerencia(sugerencia.id, 'detalle', event.target.value)} rows={2} className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30 resize-none" />
                  </div>
                ))}
              </div>
              <div className="bg-warning-50/60 border border-warning-100 rounded-lg p-3 text-xs text-navy-700">
                La visita propuesta es exclusivamente técnica y comercial. No incluye diagnósticos, tratamientos ni recomendaciones terapéuticas.
              </div>
            </div>
          )}

          {paso === 5 && !finalizado && (
            <div className="space-y-5 max-w-2xl mx-auto">
              <SectionTitle icon={<ShoppingCart className="w-5 h-5" />} title="5. Crear pedido y seguimiento" subtitle="Revisa las acciones que quedarán visibles para toda la empresa durante esta sesión." />
              <div className="grid sm:grid-cols-2 gap-3">
                <CreationCard icon={<ShoppingCart className="w-5 h-5" />} title="Pedido P-IA-001" detail="Pendiente de confirmación · 3 referencias" />
                <CreationCard icon={<Truck className="w-5 h-5" />} title="Solicitud TR-IA-001" detail="10 bultos · Siberia → Ubaté" />
                <CreationCard icon={<UserRoundCheck className="w-5 h-5" />} title="Tarea comercial" detail="Confirmar pedido y entrega mañana" />
                <CreationCard icon={<MapPin className="w-5 h-5" />} title="Visita técnica" detail="18 sept · 3:30 p. m. · Carlos Mendoza" />
              </div>
              <div className="bg-white rounded-xl border border-gray-200 shadow-card p-4">
                <p className="text-sm font-semibold text-navy-800 mb-2">También se actualizará el cliente</p>
                <p className="text-sm text-gray-600">La llamada, el pedido, la tarea y la visita aparecerán en el historial de Hacienda El Porvenir.</p>
              </div>
              <Button variant="accent" size="lg" className="w-full justify-center" icon={<Sparkles className="w-5 h-5" />} onClick={crearAcciones} disabled={!sugerencias.every((sugerencia) => sugerencia.aprobada)}>
                Crear pedido y acciones de seguimiento
              </Button>
              {!sugerencias.every((sugerencia) => sugerencia.aprobada) && <p className="text-xs text-center text-accent-600">Aprueba las cinco sugerencias para completar la demostración.</p>}
            </div>
          )}

          {finalizado && (
            <div className="min-h-full flex items-center justify-center py-8">
              <div className="max-w-xl w-full text-center">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-success-50 text-success-600 flex items-center justify-center mb-5"><CheckCircle2 className="w-9 h-9" /></div>
                <Badge tone="success" dot>Flujo completado</Badge>
                <h3 className="text-2xl font-bold text-navy-800 mt-4 leading-tight">Una llamada que antes quedaba en la memoria del vendedor ahora se convirtió en información, acciones y seguimiento para toda la empresa.</h3>
                <p className="text-sm text-gray-500 mt-3">El pedido, el traslado, la tarea, la visita y la actividad ya están conectados con Hacienda El Porvenir.</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-6 text-left">
                  <ResultLink label="Pedido" value="P-IA-001" onClick={() => irA('/pedidos')} />
                  <ResultLink label="Traslado" value="TR-IA-001" onClick={() => irA('/inventario')} />
                  <ResultLink label="Cliente" value="El Porvenir" onClick={() => irA('/clientes?id=C-001')} />
                  <ResultLink label="Visita" value="18 sept" onClick={() => irA('/visitas')} />
                </div>
                <Button variant="primary" className="mt-6" onClick={onClose}>Volver al resumen</Button>
              </div>
            </div>
          )}
        </div>

        {!finalizado && paso > 1 && (
          <footer className="bg-white border-t border-gray-200 px-5 py-4 flex items-center justify-between">
            <Button variant="ghost" icon={<ArrowLeft className="w-4 h-4" />} onClick={() => setPaso((prev) => Math.max(1, prev - 1))}>Anterior</Button>
            {paso < 5 && <Button variant="primary" onClick={() => setPaso((prev) => Math.min(5, prev + 1))}>Continuar <ArrowRight className="w-4 h-4" /></Button>}
          </footer>
        )}
      </aside>
    </div>
  );
}

function SectionTitle({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center flex-shrink-0">{icon}</div>
      <div><h3 className="font-semibold text-navy-800">{title}</h3><p className="text-sm text-gray-500 mt-0.5">{subtitle}</p></div>
    </div>
  );
}

function InfoItem({ label, value, badge }: { label: string; value: string; badge?: string }) {
  return <div className="bg-white rounded-xl border border-gray-200 shadow-card p-4"><p className="text-xs text-gray-400">{label}</p><div className="flex items-center gap-2 mt-1"><p className="text-sm font-medium text-navy-700">{value}</p>{badge && <Badge tone="accent">{badge}</Badge>}</div></div>;
}

function InventoryResult({ icon, tone, title, code, status, detail }: { icon: React.ReactNode; tone: 'success' | 'accent' | 'warning'; title: string; code: string; status: string; detail: string }) {
  const styles = { success: 'bg-success-50 text-success-600 border-success-100', accent: 'bg-accent-50 text-accent-600 border-accent-100', warning: 'bg-warning-50 text-warning-600 border-warning-100' };
  return <div className="bg-white rounded-xl border border-gray-200 shadow-card p-4 flex items-start gap-3"><div className={`w-10 h-10 rounded-lg border flex items-center justify-center ${styles[tone]}`}>{icon}</div><div className="flex-1"><div className="flex items-center justify-between gap-2"><p className="text-sm font-semibold text-navy-800">{title}</p><span className="text-xs font-mono text-gray-400">{code}</span></div><p className="text-sm font-medium text-navy-700 mt-1">{status}</p><p className="text-xs text-gray-500 mt-0.5">{detail}</p></div></div>;
}

function CreationCard({ icon, title, detail }: { icon: React.ReactNode; title: string; detail: string }) {
  return <div className="bg-white rounded-xl border border-gray-200 shadow-card p-4 flex items-start gap-3"><div className="w-9 h-9 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center">{icon}</div><div><p className="text-sm font-semibold text-navy-800">{title}</p><p className="text-xs text-gray-500 mt-1">{detail}</p></div></div>;
}

function ResultLink({ label, value, onClick }: { label: string; value: string; onClick: () => void }) {
  return <button onClick={onClick} className="bg-white border border-gray-200 rounded-xl p-3 hover:border-cyan-300 hover:bg-cyan-50/30 transition-colors"><p className="text-[10px] uppercase tracking-wide text-gray-400">{label}</p><p className="text-sm font-semibold text-navy-800 mt-0.5">{value}</p></button>;
}
