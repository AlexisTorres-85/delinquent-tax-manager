import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Home, AlertTriangle, FileText } from 'lucide-react';
import Chart from 'react-apexcharts';
import type { ApexOptions } from 'apexcharts';

// Mock data for charts
const delinquentTrendData = [
  { month: 'Jan', count: 245 },
  { month: 'Feb', count: 289 },
  { month: 'Mar', count: 312 },
  { month: 'Apr', count: 278 },
  { month: 'May', count: 295 },
  { month: 'Jun', count: 318 },
];

const revenueData = [
  { month: 'Jan', amount: 125000 },
  { month: 'Feb', amount: 145000 },
  { month: 'Mar', amount: 132000 },
  { month: 'Apr', amount: 158000 },
  { month: 'May', amount: 142000 },
  { month: 'Jun', amount: 165000 },
];

const statusData = [
  { status: 'Del', count: 318 },
  { status: 'Plan', count: 145 },
  { status: 'Fore', count: 89 },
  { status: 'Flag', count: 56 },
];

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  chart: React.ReactNode;
}

function StatCard({ title, value, change, icon, chart }: StatCardProps) {
  const isPositive = change > 0;
  
  return (
    <Card className="p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          <div className="flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            <span className={`text-sm font-medium ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}{change}%
            </span>
            <span className="text-sm text-muted-foreground">vs last month</span>
          </div>
        </div>
        <div className="p-3 bg-primary/10 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="h-20">
        {chart}
      </div>
    </Card>
  );
}

export function ParcelsStats() {
  // Line chart options for delinquent trend
  const lineChartOptions: ApexOptions = {
    chart: {
      type: 'line',
      sparkline: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    colors: ['#333'],
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
    },
    xaxis: {
      categories: delinquentTrendData.map(d => d.month),
    },
  };

  const lineChartSeries = [{
    name: 'Count',
    data: delinquentTrendData.map(d => d.count),
  }];

  // Area chart options for revenue
  const areaChartOptions: ApexOptions = {
    chart: {
      type: 'area',
      sparkline: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.4,
        opacityTo: 0.1,
        stops: [0, 90, 100],
      },
    },
    colors: ['hsl(var(--primary))'],
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
    },
    xaxis: {
      categories: revenueData.map(d => d.month),
    },
  };

  const areaChartSeries = [{
    name: 'Amount',
    data: revenueData.map(d => d.amount),
  }];

  // Bar chart options for status
  const barChartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      sparkline: {
        enabled: true,
      },
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        columnWidth: '60%',
      },
    },
    colors: ['hsl(var(--primary))'],
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
    },
    xaxis: {
      categories: statusData.map(d => d.status),
    },
  };

  const barChartSeries = [{
    name: 'Count',
    data: statusData.map(d => d.count),
  }];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        title="Total Delinquent"
        value="318"
        change={7.2}
        icon={<AlertTriangle className="h-5 w-5 text-primary" />}
        chart={
          <Chart
            options={lineChartOptions}
            series={lineChartSeries}
            type="line"
            height="130%"
          />
        }
      />

      <StatCard
        title="Collections"
        value="$165K"
        change={4.5}
        icon={<DollarSign className="h-5 w-5 text-primary" />}
        chart={
          <Chart
            options={areaChartOptions}
            series={areaChartSeries}
            type="area"
            height="100%"
          />
        }
      />

      <StatCard
        title="Total Parcels"
        value="1,247"
        change={2.1}
        icon={<Home className="h-5 w-5 text-primary" />}
        chart={
          <Chart
            options={lineChartOptions}
            series={lineChartSeries}
            type="line"
            height="100%"
          />
        }
      />

      <StatCard
        title="Active Cases"
        value="608"
        change={-3.2}
        icon={<FileText className="h-5 w-5 text-primary" />}
        chart={
          <Chart
            options={barChartOptions}
            series={barChartSeries}
            type="bar"
            height="100%"
          />
        }
      />
    </div>
  );
}
