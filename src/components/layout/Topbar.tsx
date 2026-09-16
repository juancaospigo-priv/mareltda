import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, MapPin, ChevronDown, Menu, Check } from 'lucide-react';
import { sedes, type SedeId, notificaciones as initialNotifs, clientes, productos, pedidos } from '@/data/simData';

interface TopbarProps {
  sedeSeleccionada: SedeId | 'todas';
  onSedeChange: (sede: SedeId | 'todas') => void;
  onMenuClick: () => void;
}

export function Topbar({ sedeSeleccionada, onSedeChange, onMenuClick }: TopbarProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sedeOpen, setSedeOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState(initialNotifs);
  const [searchResults, setSearchResults] = useState<{ type: string; label: string; to: string }[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const sedeRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifs.filter((n) => !n.leida).length;

  // Global search across clientes, productos, pedidos
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase();
    const results: { type: string; label: string; to: string }[] = [];
    clientes.forEach((c) => {
      if (c.nombre.toLowerCase().includes(q) || c.municipio.toLowerCase().includes(q)) {
        results.push({ type: 'Cliente', label: c.nombre, to: `/clientes?id=${c.id}` });
      }
    });
    productos.forEach((p) => {
      if (p.nombre.toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q) || p.categoria.toLowerCase().includes(q)) {
        results.push({ type: 'Producto', label: `${p.nombre} (${p.codigo})`, to: `/catalogo?q=${encodeURIComponent(p.nombre)}` });
      }
    });
    pedidos.forEach((p) => {
      if (p.id.toLowerCase().includes(q) || p.clienteNombre.toLowerCase().includes(q)) {
        results.push({ type: 'Pedido', label: `${p.id} — ${p.clienteNombre}`, to: '/pedidos' });
      }
    });
    setSearchResults(results.slice(0, 8));
  }, [searchQuery]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchFocused(false);
      if (sedeRef.current && !sedeRef.current.contains(e.target as Node)) setSedeOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      navigate(searchResults[0].to);
      setSearchQuery('');
      setSearchFocused(false);
    }
  };

  const markAllRead = () => setNotifs(notifs.map((n) => ({ ...n, leida: true })));

  const sedeNombre = sedeSeleccionada === 'todas' ? 'Todas las sedes' : sedes.find((s) => s.id === sedeSeleccionada)?.nombre || '';

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 lg:px-6 h-16 flex items-center gap-3 lg:gap-4">
      {/* Mobile menu */}
      <button onClick={onMenuClick} className="lg:hidden text-navy-600 hover:bg-gray-100 p-2 rounded-lg">
        <Menu className="w-5 h-5" />
      </button>

      {/* Global search */}
      <div ref={searchRef} className="relative flex-1 max-w-xl">
        <form onSubmit={handleSearchSubmit}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Buscar clientes, productos, pedidos..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-all"
            />
          </div>
        </form>
        {searchFocused && searchResults.length > 0 && (
          <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-lg shadow-modal border border-gray-200 py-2 max-h-80 overflow-y-auto animate-slide-up">
            {searchResults.map((r, i) => (
              <button
                key={i}
                onClick={() => {
                  navigate(r.to);
                  setSearchQuery('');
                  setSearchFocused(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-50 text-left"
              >
                <span className="text-xs font-medium text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded">{r.type}</span>
                <span className="text-sm text-navy-700">{r.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sede selector */}
      <div ref={sedeRef} className="relative">
        <button
          onClick={() => setSedeOpen(!sedeOpen)}
          className="flex items-center gap-2 px-3 py-2 text-sm text-navy-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <MapPin className="w-4 h-4 text-cyan-600" />
          <span className="hidden sm:inline font-medium">{sedeNombre}</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>
        {sedeOpen && (
          <div className="absolute right-0 mt-1 w-52 bg-white rounded-lg shadow-modal border border-gray-200 py-1.5 animate-slide-up">
            <button
              onClick={() => { onSedeChange('todas'); setSedeOpen(false); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 ${sedeSeleccionada === 'todas' ? 'text-cyan-600 font-medium' : 'text-navy-700'}`}
            >
              {sedeSeleccionada === 'todas' && <Check className="w-4 h-4" />}
              <span className={sedeSeleccionada !== 'todas' ? 'pl-4' : ''}>Todas las sedes</span>
            </button>
            {sedes.map((s) => (
              <button
                key={s.id}
                onClick={() => { onSedeChange(s.id); setSedeOpen(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 ${sedeSeleccionada === s.id ? 'text-cyan-600 font-medium' : 'text-navy-700'}`}
              >
                {sedeSeleccionada === s.id && <Check className="w-4 h-4" />}
                <span className={sedeSeleccionada !== s.id ? 'pl-4' : ''}>{s.nombre} <span className="text-gray-400 text-xs">· {s.municipio}</span></span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Notifications */}
      <div ref={notifRef} className="relative">
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          className="relative p-2 text-navy-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-accent-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
        {notifOpen && (
          <div className="absolute right-0 mt-1 w-80 bg-white rounded-lg shadow-modal border border-gray-200 animate-slide-up">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <p className="text-sm font-semibold text-navy-800">Notificaciones</p>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-cyan-600 hover:text-cyan-700 font-medium">
                  Marcar todas leídas
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifs.map((n) => (
                <div key={n.id} className={`px-4 py-3 border-b border-gray-100 ${!n.leida ? 'bg-cyan-50/40' : ''}`}>
                  <div className="flex items-start gap-2">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.tipo === 'alerta' ? 'bg-accent-500' : n.tipo === 'oportunidad' ? 'bg-cyan-500' : 'bg-gray-400'}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-navy-800">{n.titulo}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{n.mensaje}</p>
                      <p className="text-[10px] text-gray-400 mt-1">{n.fecha}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="flex items-center gap-2 pl-2 lg:pl-3 lg:border-l lg:border-gray-200">
        <div className="w-8 h-8 rounded-full bg-navy-700 text-white flex items-center justify-center text-sm font-semibold">
          GM
        </div>
        <div className="hidden lg:block">
          <p className="text-sm font-medium text-navy-800 leading-tight">Gerencia Mare</p>
          <p className="text-[10px] text-gray-400">Administrador</p>
        </div>
      </div>
    </header>
  );
}
