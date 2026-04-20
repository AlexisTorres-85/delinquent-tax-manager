import { MenuConfig } from "@/config/types";
import {
  Activity,
  AlertTriangle,
  BarChart2,
  Bell,
  BookOpen,
  Briefcase,
  Building2,
  CheckCircle,
  ClipboardList,
  Clock,
  Cog,
  CreditCard,
  Download,
  FileSearch,
  FileText,
  FolderOpen,
  Gavel,
  GitBranch,
  History,
  LayoutDashboard,
  List,
  Lock,
  MapPin,
  PenLine,
  PlusCircle,
  Scale,
  Search,
  Settings,
  ShieldAlert,
  TrendingUp,
  Users,
  Wallet,
  XCircle,
} from 'lucide-react';

export const MENU_SIDEBAR_MAIN: MenuConfig = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard',
    path: '/',
    rootPath: '/',
    children: [
      {
        title: 'Dashboard',
        children: [
          { title: 'Overview',          path: '/',                       icon: LayoutDashboard },
          { title: 'Today Activity',    path: '/today',                  icon: Activity },
          { title: 'Alerts',            path: '/alerts',                 icon: Bell },
          { title: 'Performance KPIs',  path: '/kpis',                   icon: TrendingUp },
        ],
      },
    ],
  },
  {
    icon: FolderOpen,
    title: 'Parcels',
    path: '/parcels',
    rootPath: '/parcels',
    children: [
      {
        title: 'Parcels',
        children: [
          { title: 'All Parcels',       path: '/parcels',                icon: List },
          { title: 'Search / Lookup',   path: '/parcels/search',         icon: Search },
          { title: 'Recently Viewed',   path: '/parcels/recent',         icon: Clock },
          { title: 'Delinquent Only',   path: '/parcels/delinquent',     icon: AlertTriangle },
          { title: 'In Payment Plan',   path: '/parcels/in-plan',        icon: Wallet },
          { title: 'In Foreclosure',    path: '/parcels/foreclosure',    icon: Gavel },
          { title: 'Flagged Parcels',   path: '/parcels/flagged',        icon: ShieldAlert },
        ],
      },
    ],
  },
  {
    icon: CreditCard,
    title: 'Payments',
    path: '/payments',
    rootPath: '/payments',
    children: [
      {
        title: 'Payments',
        children: [
          { title: 'Record Payment',        path: '/payments/record',        icon: PlusCircle },
          { title: 'All Payments',          path: '/payments',               icon: CreditCard },
          { title: 'Pending Payments',      path: '/payments/pending',       icon: Clock },
          { title: 'Failed Payments',       path: '/payments/failed',        icon: XCircle },
          { title: 'Payment Reconciliation',path: '/payments/reconciliation',icon: CheckCircle },
          { title: 'Payment Methods',       path: '/payments/methods',       icon: Wallet },
        ],
      },
    ],
  },
  {
    icon: FileText,
    title: 'Plans',
    path: '/plans',
    rootPath: '/plans',
    children: [
      {
        title: 'Plans',
        children: [
          { title: 'Active Plans',          path: '/plans',                  icon: FileText },
          { title: 'Create Plan',           path: '/plans/create',           icon: PlusCircle },
          { title: 'Defaulted Plans',       path: '/plans/defaulted',        icon: XCircle },
          { title: 'Completed Plans',       path: '/plans/completed',        icon: CheckCircle },
          { title: 'Installment Schedules', path: '/plans/schedules',        icon: ClipboardList },
        ],
      },
    ],
  },
  {
    icon: Scale,
    title: 'Enforcement',
    path: '/enforcement',
    rootPath: '/enforcement',
    children: [
      {
        title: 'Enforcement',
        children: [
          { title: 'Foreclosure Cases',     path: '/enforcement',            icon: Gavel },
          { title: 'Liens',                 path: '/enforcement/liens',      icon: Lock },
          { title: 'Legal Notices',         path: '/enforcement/notices',    icon: PenLine },
          { title: 'Escalations',           path: '/enforcement/escalations',icon: AlertTriangle },
          { title: 'Case Timeline',         path: '/enforcement/timeline',   icon: GitBranch },
          { title: 'Collections Workflow',  path: '/enforcement/collections',icon: Briefcase },
        ],
      },
    ],
  },
  {
    icon: BarChart2,
    title: 'Reports',
    path: '/reports',
    rootPath: '/reports',
    children: [
      {
        title: 'Reports',
        children: [
          { title: 'Delinquency Summary',   path: '/reports',                icon: FileSearch },
          { title: 'Revenue Reports',       path: '/reports/revenue',        icon: TrendingUp },
          { title: 'Tax Collection Trends', path: '/reports/trends',         icon: BarChart2 },
          { title: 'Custom Reports',        path: '/reports/custom',         icon: BookOpen },
          { title: 'Export Data',           path: '/reports/export',         icon: Download },
        ],
      },
    ],
  },
  {
    icon: Settings,
    title: 'Admin',
    path: '/admin',
    rootPath: '/admin',
    children: [
      {
        title: 'Admin',
        children: [
          { title: 'Users & Roles',         path: '/admin/users',            icon: Users },
          { title: 'Permissions',           path: '/admin/permissions',      icon: Lock },
          { title: 'Departments',           path: '/admin/departments',      icon: Building2 },
          { title: 'Tax Configuration',     path: '/admin/tax',              icon: FileText },
          { title: 'Penalty Rules',         path: '/admin/penalties',        icon: Scale },
          { title: 'System Settings',       path: '/admin/settings',         icon: Cog },
          { title: 'Integrations',          path: '/admin/integrations',     icon: History },
        ],
      },
    ],
  },
];

