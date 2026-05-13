import { MenuConfig } from "@/config/types";
import {
  Activity,
  BarChart2,
  Bell,
  BookOpen,
  Building2,
  CheckCircle,
  ClipboardCheck,
  ClipboardList,
  Clock,
  Cog,
  CreditCard,
  Download,
  FileSearch,
  FileSignature,
  FileText,
  FolderOpen,
  HardHat,
  History,
  LandPlot,
  Landmark,
  LayoutDashboard,
  List,
  Lock,
  MapPin,
  PlusCircle,
  ScrollText,
  Scale,
  Search,
  Settings,
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
          { title: 'Overview', path: '/', icon: LayoutDashboard },
          { title: 'Today Activity', path: '/today', icon: Activity },
          { title: 'Alerts', path: '/alerts', icon: Bell },
          { title: 'Performance KPIs', path: '/kpis', icon: TrendingUp },
        ],
      },
    ],
  },
  {
    icon: LandPlot,
    title: 'Property Parcels',
    path: '/property-parcels/delinquent-parcel-cases',
    rootPath: '/property-parcels',
    children: [
      {
        title: 'Property Parcels',
        children: [
          { title: 'Delinquent Parcel Cases', path: '/property-parcels/delinquent-parcel-cases', icon: LandPlot },
          { title: 'Catalis Parcel Search', path: '/property-parcels/catalis-parcel-search', icon: Search },
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
          { title: 'Payment Plans', path: '/payments/plans', icon: FileText },
          { title: 'Pending Payments', path: '/payments/pending', icon: Clock },
          { title: 'Missed Payments', path: '/payments/missed', icon: XCircle },
          { title: 'Payment Schedules', path: '/payments/schedules', icon: ClipboardList },
          { title: 'Payment History', path: '/payments/history', icon: History },
        ],
      },
    ],
  },

  {
    icon: HardHat,
    title: 'Planning & Development',
    path: '/planning/parcels-in-review',
    rootPath: '/planning',
    children: [
      {
        title: 'Planning & Development',
        children: [
          { title: 'Parcels In Review', path: '/planning/parcels-in-review', icon: MapPin },
        ],
      },
    ],
  },
  {
    icon: Landmark,
    title: 'County Clerk',
    path: '/county-clerk/submissions',
    rootPath: '/county-clerk',
    children: [
      {
        title: 'County Clerk',
        children: [
          { title: 'County Clerk Submissions', path: '/county-clerk/submissions', icon: FileSignature },
          { title: 'County Owned Parcels', path: '/county-clerk/county-owned-parcels', icon: Building2 },
          { title: 'Tax Deeded Parcels', path: '/county-clerk/tax-deeded-parcels', icon: ScrollText },
          { title: 'Committee Review', path: '/county-clerk/committee-review', icon: ClipboardCheck },
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
          { title: 'Delinquency Summary', path: '/reports', icon: FileSearch },
          { title: 'Revenue Reports', path: '/reports/revenue', icon: TrendingUp },
          { title: 'Tax Collection Trends', path: '/reports/trends', icon: BarChart2 },
          { title: 'Custom Reports', path: '/reports/custom', icon: BookOpen },
          { title: 'Export Data', path: '/reports/export', icon: Download },
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
          { title: 'Users & Roles', path: '/admin/users', icon: Users },
          { title: 'Permissions', path: '/admin/permissions', icon: Lock },
          { title: 'Departments', path: '/admin/departments', icon: Building2 },
          { title: 'Tax Configuration', path: '/admin/tax', icon: FileText },
          { title: 'Penalty Rules', path: '/admin/penalties', icon: Scale },
          { title: 'System Settings', path: '/admin/settings', icon: Cog },
          { title: 'Integrations', path: '/admin/integrations', icon: History },
        ],
      },
    ],
  },
];

