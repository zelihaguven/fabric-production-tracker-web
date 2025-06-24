
import { TrendingUp, Package, AlertTriangle, CheckCircle } from 'lucide-react';
import { StatsData } from '@/hooks/useStatsData';

export interface StatConfig {
  title: string;
  getValue: (stats: StatsData) => string;
  change: string;
  changeType: 'neutral' | 'warning';
  icon: typeof CheckCircle;
  gradient: string;
}

export const statsConfig: StatConfig[] = [
  {
    title: 'Toplam Sipariş',
    getValue: (stats) => stats.totalOrders.toString(),
    change: '',
    changeType: 'neutral',
    icon: CheckCircle,
    gradient: 'from-blue-500 to-cyan-500'
  },
  {
    title: 'Aktif Üretim',
    getValue: (stats) => stats.activeProduction.toString(),
    change: '',
    changeType: 'neutral',
    icon: TrendingUp,
    gradient: 'from-green-500 to-emerald-500'
  },
  {
    title: 'Stok Uyarıları',
    getValue: (stats) => stats.stockAlerts.toString(),
    change: '',
    changeType: 'warning',
    icon: AlertTriangle,
    gradient: 'from-orange-500 to-red-500'
  },
  {
    title: 'Tamamlanan',
    getValue: (stats) => stats.completedOrders.toString(),
    change: '',
    changeType: 'neutral',
    icon: Package,
    gradient: 'from-purple-500 to-pink-500'
  }
];
