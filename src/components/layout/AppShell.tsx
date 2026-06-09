'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar, NavItem } from './Sidebar';
import { Topbar } from './Topbar';
import { BottomNav } from './BottomNav';
import styles from './AppShell.module.css';
import { Role } from '@prisma/client';

// Icons using SVG to avoid dependencies
const DashboardIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>;
const ProjectsIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>;
const ReportsIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const IssuesIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
const MaterialsIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const TeamIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;

const pmNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Projects', href: '/projects', icon: <ProjectsIcon /> },
  { label: 'Reports', href: '/reports', icon: <ReportsIcon /> },
  { label: 'Issues', href: '/issues', icon: <IssuesIcon /> },
  { label: 'Materials', href: '/materials', icon: <MaterialsIcon /> },
  { label: 'Team', href: '/team', icon: <TeamIcon /> },
];

const supervisorNavItems: NavItem[] = [
  { label: 'My Projects', href: '/projects', icon: <ProjectsIcon /> },
  { label: 'My Reports', href: '/reports', icon: <ReportsIcon /> },
  { label: 'My Issues', href: '/issues', icon: <IssuesIcon /> },
  { label: 'My Requests', href: '/materials', icon: <MaterialsIcon /> },
];

interface AppShellProps {
  children: React.ReactNode;
  userRole: Role;
  userName: string;
  userProfileImageUrl: string | null;
}

export function AppShell({ children, userRole, userName, userProfileImageUrl }: AppShellProps) {
  const pathname = usePathname();
  const navItems = userRole === Role.project_manager ? pmNavItems : supervisorNavItems;
  
  // Determine page title from pathname
  let pageTitle = 'SiteLog';
  const matchingItem = navItems.find(item => pathname === item.href || pathname.startsWith(`${item.href}/`));
  if (matchingItem) {
    pageTitle = matchingItem.label;
  }

  const homeHref = userRole === Role.project_manager ? '/dashboard' : '/projects';

  return (
    <div className={styles.shell}>
      <div className={styles.sidebar}>
        <Sidebar items={navItems} homeHref={homeHref} />
      </div>
      
      <div className={styles.main}>
        <Topbar title={pageTitle} userName={userName} userRole={userRole} userProfileImageUrl={userProfileImageUrl} />
        
        <main className={styles.content}>
          {children}
        </main>
        
        <BottomNav items={navItems} />
      </div>
    </div>
  );
}
