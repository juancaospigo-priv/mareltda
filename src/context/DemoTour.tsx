/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const demoSteps = [
  {
    route: '/',
    target: 'demo-clientes',
    title: 'Clientes que requieren seguimiento',
    description: 'La gerencia identifica de inmediato las cuentas con riesgo comercial o contacto vencido.',
  },
  {
    route: '/',
    target: 'demo-prioridades',
    title: 'Alertas de inventario entre sedes',
    description: 'La IA conecta faltantes con existencias disponibles y propone acciones logísticas explicables.',
  },
  {
    route: '/',
    target: 'demo-llamada',
    title: 'Convertir una llamada en oportunidad',
    description: 'Una nota libre puede convertirse en pedido, traslado, tarea comercial, visita técnica y actividad compartida.',
  },
  {
    route: '/',
    target: 'demo-kpis',
    title: 'La operación en menos de 30 segundos',
    description: 'El Resumen ejecutivo concentra clientes, pedidos, inventario y valor potencial para orientar la conversación gerencial.',
  },
  {
    route: '/oportunidades',
    target: 'demo-oportunidades',
    title: 'Oportunidades IA',
    description: 'Las oportunidades se priorizan por urgencia, valor potencial, confianza y responsable comercial.',
  },
  {
    route: '/clientes',
    target: 'demo-clientes-modulo',
    title: 'Clientes y seguimiento comercial',
    description: 'Cada ficha reúne historial, pedidos, visitas, tareas, notas y recomendaciones comerciales revisables.',
  },
  {
    route: '/pedidos',
    target: 'demo-pedidos',
    title: 'Pedidos conectados con la operación',
    description: 'La bandeja permite buscar, filtrar, ajustar cantidades, cambiar sedes de despacho y controlar estados.',
  },
  {
    route: '/inventario',
    target: 'demo-inventario-modulo',
    title: 'Inventario consolidado entre sedes',
    description: 'Los estados se distinguen claramente y los faltantes pueden resolverse mediante traslados sugeridos.',
  },
  {
    route: '/catalogo',
    target: 'demo-catalogo',
    title: 'Catálogo inteligente',
    description: 'La búsqueda combina lenguaje natural, filtros y disponibilidad sin convertir la plataforma en un comercio electrónico.',
  },
  {
    route: '/visitas',
    target: 'demo-visitas',
    title: 'Agenda y visitas técnicas',
    description: 'El equipo coordina visitas, registra notas y crea seguimientos sin emitir diagnósticos ni recomendaciones terapéuticas.',
  },
  {
    route: '/despachos',
    target: 'demo-despachos',
    title: 'Despachos, carga y rutas',
    description: 'La operación conoce qué lleva cada camión, qué está en tránsito, sus paradas y el avance geográfico del recorrido.',
  },
  {
    route: '/configuracion',
    target: 'demo-configuracion',
    title: 'Reglas de operación configurables',
    description: 'La gerencia controla umbrales, sedes, equipo y notificaciones que alimentan las alertas del sistema.',
  },
];

interface DemoTourContextValue {
  startDemo: () => void;
  active: boolean;
}

const DemoTourContext = createContext<DemoTourContextValue | null>(null);

export function DemoTourProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const active = step > 0;
  const current = active ? demoSteps[step - 1] : null;

  useEffect(() => {
    if (!current) return;
    navigate(current.route);
    let highlighted: HTMLElement | null = null;
    const reveal = () => {
      highlighted = document.getElementById(current.target);
      highlighted?.classList.add('demo-tour-target-active');
      highlighted?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    const timer = window.setTimeout(reveal, 180);
    return () => {
      window.clearTimeout(timer);
      highlighted?.classList.remove('demo-tour-target-active');
      document.getElementById(current.target)?.classList.remove('demo-tour-target-active');
    };
  }, [current, navigate]);

  const stopDemo = () => {
    document.querySelector('.demo-tour-target-active')?.classList.remove('demo-tour-target-active');
    setStep(0);
  };

  const finishDemo = () => {
    stopDemo();
    navigate('/');
  };

  return (
    <DemoTourContext.Provider value={{ startDemo: () => setStep(1), active }}>
      {children}
      {current && (
        <>
          <div className="fixed inset-0 z-50 bg-navy-950/45 backdrop-blur-[1px] pointer-events-none animate-fade-in" />
          <div
            className="fixed bottom-5 left-1/2 z-[70] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-xl border border-cyan-200 bg-white p-4 shadow-modal animate-slide-up"
            role="dialog"
            aria-live="polite"
            aria-label="Recorrido guiado por MARE Control IA"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-cyan-50 text-sm font-bold text-cyan-700">
                {step}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Demostración completa · Paso {step} de {demoSteps.length}</p>
                <h2 className="mt-0.5 text-base font-semibold text-navy-800">{current.title}</h2>
                <p className="mt-1 text-sm text-gray-600">{current.description}</p>
              </div>
              <button aria-label="Cancelar demostración" onClick={stopDemo} className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-navy-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <button onClick={stopDemo} className="text-sm font-medium text-gray-500 hover:text-navy-700">Cancelar recorrido</button>
              <div className="flex items-center gap-2">
                {step > 1 && (
                  <Button variant="secondary" onClick={() => setStep((value) => Math.max(1, value - 1))}>
                    <ArrowLeft className="h-4 w-4" /> Anterior
                  </Button>
                )}
                <Button
                  variant="primary"
                  onClick={() => step === demoSteps.length ? finishDemo() : setStep((value) => value + 1)}
                >
                  {step === demoSteps.length ? 'Finalizar' : 'Siguiente'}
                  {step < demoSteps.length && <ArrowRight className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </DemoTourContext.Provider>
  );
}

export function useDemoTour() {
  const context = useContext(DemoTourContext);
  if (!context) throw new Error('useDemoTour debe usarse dentro de DemoTourProvider');
  return context;
}
