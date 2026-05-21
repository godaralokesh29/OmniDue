'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { Menu, X, Shield, BarChart3, Settings, FileText, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { label: 'Dashboard', href: '/', icon: BarChart3 },
    { label: 'Risk Heatmap', href: '/heatmap', icon: Shield },
    { label: 'Audits', href: '/audits', icon: FileText },
    { label: 'License Scanner', href: '/license-scanner', icon: Lock },
    { label: 'Security Audit', href: '/security-audit', icon: Shield },
    { label: 'Privacy Mapper', href: '/privacy-mapper', icon: Lock },
    { label: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } border-r border-border bg-card transition-all duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className={`flex items-center gap-2 ${!sidebarOpen && 'justify-center'}`}>
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-linear-to-br from-blue-600 to-blue-700">
                <Shield className="w-5 h-5 text-white" />
              </div>
              {sidebarOpen && (
                <span className="text-sm font-bold bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                  M&A Agent
                </span>
              )}
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 hover:bg-muted rounded transition-colors"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-muted transition-colors group"
                >
                  <Icon className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  {sidebarOpen && <span className="group-hover:text-foreground transition-colors">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <Button
              variant="outline"
              className="w-full"
              size={sidebarOpen ? 'sm' : 'icon'}
            >
              {sidebarOpen ? 'Help & Support' : '?'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="border-b border-border bg-card px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-semibold text-muted-foreground">Demo Mode</h2>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              Docs
            </Button>
            <Button variant="ghost" size="sm">
              Support
            </Button>
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
