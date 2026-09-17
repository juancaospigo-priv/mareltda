import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import type { SedeId } from '@/data/simData';
import { DemoTourProvider } from '@/context/DemoTour';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sedeSeleccionada, setSedeSeleccionada] = useState<SedeId | 'todas'>('todas');

  return (
    <DemoTourProvider>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar
            sedeSeleccionada={sedeSeleccionada}
            onSedeChange={setSedeSeleccionada}
            onMenuClick={() => setSidebarOpen(true)}
          />
          <main className="flex-1 p-4 lg:p-6 overflow-x-hidden">
            <Outlet context={{ sedeSeleccionada }} />
          </main>
        </div>
      </div>
    </DemoTourProvider>
  );
}
