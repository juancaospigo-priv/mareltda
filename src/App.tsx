import { BrowserRouter, Routes, Route, useOutletContext } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { ToastProvider } from '@/components/ui/Toast';
import { SessionDataProvider } from '@/context/SessionData';
import { ResumenEjecutivo } from '@/pages/ResumenEjecutivo';
import { OportunidadesIA } from '@/pages/OportunidadesIA';
import { Clientes } from '@/pages/Clientes';
import { Pedidos } from '@/pages/Pedidos';
import { Inventario } from '@/pages/Inventario';
import { Catalogo } from '@/pages/Catalogo';
import { Visitas } from '@/pages/Visitas';
import { Configuracion } from '@/pages/Configuracion';
import type { SedeId } from '@/data/simData';

function useSede() {
  return useOutletContext<{ sedeSeleccionada: SedeId | 'todas' }>();
}

function ResumenEjecutivoWrapper() {
  const { sedeSeleccionada } = useSede();
  return <ResumenEjecutivo sedeSeleccionada={sedeSeleccionada} />;
}

function InventarioWrapper() {
  const { sedeSeleccionada } = useSede();
  return <Inventario sedeSeleccionada={sedeSeleccionada} />;
}

export default function App() {
  return (
    <ToastProvider>
      <SessionDataProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<ResumenEjecutivoWrapper />} />
              <Route path="oportunidades" element={<OportunidadesIA />} />
              <Route path="clientes" element={<Clientes />} />
              <Route path="pedidos" element={<Pedidos />} />
              <Route path="inventario" element={<InventarioWrapper />} />
              <Route path="catalogo" element={<Catalogo />} />
              <Route path="visitas" element={<Visitas />} />
              <Route path="configuracion" element={<Configuracion />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SessionDataProvider>
    </ToastProvider>
  );
}
