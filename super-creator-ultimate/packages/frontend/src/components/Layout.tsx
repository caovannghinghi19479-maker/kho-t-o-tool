import { Link, Outlet } from 'react-router-dom';

const links = [
  ['/', 'Dashboard'],
  ['/profiles', 'Profiles'],
  ['/automation', 'Automation Studio'],
  ['/research', 'Research'],
  ['/studio', 'Studio'],
  ['/export', 'Export'],
  ['/settings', 'Settings']
] as const;

export const Layout = () => (
  <div className="min-h-screen bg-background text-slate-100 flex">
    <aside className="w-64 border-r border-slate-800 p-4 space-y-4">
      <h1 className="text-xl font-bold">SuperCreatorUltimate</h1>
      <nav className="space-y-2">
        {links.map(([to, label]) => (
          <Link key={to} to={to} className="block rounded bg-slate-900 px-3 py-2 hover:bg-slate-800">
            {label}
          </Link>
        ))}
      </nav>
    </aside>
    <main className="flex-1 p-6">
      <Outlet />
    </main>
  </div>
);
