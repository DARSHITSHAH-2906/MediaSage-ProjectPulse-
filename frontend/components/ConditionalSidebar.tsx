'use client';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

const AUTH_ROUTES = ['/login', '/signup', '/register'];

export default function ConditionalSidebar() {
  const pathname = usePathname();
  const isAuth = AUTH_ROUTES.some(r => pathname.startsWith(r));
  if (isAuth) return null;
  return <Sidebar />;
}
