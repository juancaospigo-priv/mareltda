import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  Users,
  ShoppingCart,
  Package,
  BookOpen,
  CalendarDays,
  Settings,
  Truck,
  X,
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Resumen ejecutivo', icon: LayoutDashboard },
  { to: '/oportunidades', label: 'Oportunidades IA', icon: Sparkles },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/pedidos', label: 'Pedidos', icon: ShoppingCart },
  { to: '/inventario', label: 'Inventario', icon: Package },
  { to: '/catalogo', label: 'Catálogo', icon: BookOpen },
  { to: '/visitas', label: 'Visitas', icon: CalendarDays },
  { to: '/despachos', label: 'Despachos y rutas', icon: Truck },
  { to: '/configuracion', label: 'Configuración', icon: Settings },
];

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-navy-950/40 z-30 lg:hidden" onClick={onClose} />}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-navy-900 text-white flex flex-col z-40 transition-transform ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Identidad corporativa */}
        <div className="flex items-start justify-between gap-3 px-4 py-4 border-b border-navy-700/50">
          <div className="min-w-0 flex-1">
            <div className="relative h-12 overflow-hidden rounded-lg bg-white shadow-sm">
              <img
                src="/mare-logo.png"
                alt="Logo de MARE"
                className="absolute inset-x-0 top-1/2 w-full -translate-y-1/2"
              />
            </div>
            <p className="mt-2 text-sm font-semibold tracking-tight text-white">MARE <span className="text-cyan-400">|</span> Salud Animal</p>
            <p className="text-[10px] text-navy-300">Control IA · Inteligencia para la gestión</p>
          </div>
          <button aria-label="Cerrar navegación" onClick={onClose} className="lg:hidden mt-1 text-navy-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-300 border-l-2 border-cyan-400'
                      : 'text-navy-200 hover:bg-navy-800 hover:text-white'
                  }`
                }
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        {/* Demo disclaimer */}
        <div className="px-4 py-3 border-t border-navy-700/50">
          <p className="text-[10px] text-navy-300 text-center leading-relaxed">
            Prototipo demostrativo<br />Todos los datos son simulados
          </p>
        </div>
      </aside>
    </>
  );
}
