import { memo, useState, useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ClickStatistic, UniqueClickStatistic } from '@/lib/api/statistics';
import { ClickStatsBarChart, ChartContainer } from '@/components/ui/chart';
import { format, parseISO, startOfDay, startOfWeek, subMonths, isAfter, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

// Tipo para las opciones de agrupación de tiempo
type TimeGrouping = 'day';

// Tipo para los períodos de tiempo
type TimePeriod = 'all' | '1' | '2' | '3' | '4' | '5' | '6' | '1w' | '2w' | '3w';

interface ChartSectionProps {
  selectedClick: UniqueClickStatistic | undefined;
  clicksByText: ClickStatistic[];
  isLoading: boolean;
}

interface StatsSummary {
  total: number;
  averagePerDay: number;
  mostActiveDay: string;
  mostActiveCount: number;
  period: string;
}

// Componente de resumen de estadísticas
const StatisticsSummary = memo(({ summary }: { summary: StatsSummary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-gray-50 rounded-md border border-gray-200 mb-4">
      <div className="text-center p-2">
        <p className="text-sm text-gray-500">Total</p>
        <p className="text-xl font-bold">{summary.total}</p>
      </div>
      <div className="text-center p-2">
        <p className="text-sm text-gray-500">Media diaria</p>
        <p className="text-xl font-bold">{summary.averagePerDay.toFixed(2)}</p>
      </div>
      <div className="text-center p-2">
        <p className="text-sm text-gray-500">Día más activo</p>
        <p className="text-xl font-bold">{summary.mostActiveDay}</p>
      </div>
      <div className="text-center p-2">
        <p className="text-sm text-gray-500">Clicks ese día</p>
        <p className="text-xl font-bold">{summary.mostActiveCount}</p>
      </div>
    </div>
  );
});

StatisticsSummary.displayName = 'StatisticsSummary';

export const ChartSection = memo(function ChartSection({ 
  selectedClick, 
  clicksByText, 
  isLoading 
}: ChartSectionProps) {
  const [timeGrouping] = useState<TimeGrouping>('day');
  const [timePeriod, setTimePeriod] = useState<TimePeriod>('all');

  const handleTimePeriodChange = (value: string) => {
    setTimePeriod(value as TimePeriod);
  };

  // Paleta de colores personalizada
  const customColors = [
    "#3b82f6", // azul
    "#10b981", // verde
    "#f97316", // naranja
    "#8b5cf6", // violeta
    "#ec4899", // rosa
    "#f59e0b", // ámbar
  ];

  // Determinar un color basado en el ID del click seleccionado para consistencia visual
  const themeColor = useMemo(() => {
    if (!selectedClick) return customColors[0];
    // Usar el último carácter del ID para determinar el índice de color
    const lastChar = selectedClick.id.charAt(selectedClick.id.length - 1);
    const colorIndex = parseInt(lastChar, 16) % customColors.length;
    return customColors[colorIndex];
  }, [selectedClick]);

  // Filtrar datos según el período seleccionado
  const filteredClicksByText = useMemo(() => {
    if (timePeriod === 'all') return clicksByText;
    
    const now = new Date();
    
    // Filtro para semanas
    if (timePeriod.endsWith('w')) {
      const weeksAgo = subMonths(now, 0);
      weeksAgo.setDate(now.getDate() - (parseInt(timePeriod) * 7));
      
      return clicksByText.filter(click => {
        const clickDate = parseISO(click.createdAt);
        return isAfter(clickDate, weeksAgo);
      });
    }
    
    // Filtro para meses
    const monthsAgo = subMonths(now, parseInt(timePeriod));
    
    return clicksByText.filter(click => {
      const clickDate = parseISO(click.createdAt);
      return isAfter(clickDate, monthsAgo);
    });
  }, [clicksByText, timePeriod]);

  // Calcular resumen de estadísticas
  const statsSummary = useMemo(() => {
    if (!filteredClicksByText.length) {
      return {
        total: 0,
        averagePerDay: 0,
        mostActiveDay: '-',
        mostActiveCount: 0,
        period: timePeriod === 'all' 
          ? 'todos los tiempos' 
          : timePeriod.endsWith('w') 
            ? `últimas ${parseInt(timePeriod)} ${parseInt(timePeriod) === 1 ? 'semana' : 'semanas'}`
            : `últimos ${timePeriod} ${parseInt(timePeriod) === 1 ? 'mes' : 'meses'}`
      };
    }

    // Agrupar por día para encontrar el día más activo
    const clicksByDay = new Map<string, number>();
    
    filteredClicksByText.forEach(click => {
      const date = parseISO(click.createdAt);
      const dayKey = format(date, 'yyyy-MM-dd');
      
      clicksByDay.set(dayKey, (clicksByDay.get(dayKey) || 0) + 1);
    });
    
    // Encontrar el día con más clicks
    let mostActiveDay = '';
    let mostActiveCount = 0;
    
    clicksByDay.forEach((count, day) => {
      if (count > mostActiveCount) {
        mostActiveCount = count;
        mostActiveDay = day;
      }
    });
    
    // Calcular el promedio diario
    let averagePerDay = 0;
    
    if (filteredClicksByText.length > 0) {
      const dates = filteredClicksByText.map(click => parseISO(click.createdAt));
      const oldestDate = new Date(Math.min(...dates.map(d => d.getTime())));
      const newestDate = new Date(Math.max(...dates.map(d => d.getTime())));
      
      const daysDifference = Math.max(1, differenceInDays(newestDate, oldestDate) + 1);
      averagePerDay = filteredClicksByText.length / daysDifference;
    }
    
    return {
      total: filteredClicksByText.length,
      averagePerDay,
      mostActiveDay: mostActiveDay ? format(parseISO(mostActiveDay), 'd MMM yyyy', { locale: es }) : '-',
      mostActiveCount,
      period: timePeriod === 'all' 
        ? 'todos los tiempos' 
        : timePeriod.endsWith('w') 
          ? `últimas ${parseInt(timePeriod)} ${parseInt(timePeriod) === 1 ? 'semana' : 'semanas'}`
          : `últimos ${timePeriod} ${parseInt(timePeriod) === 1 ? 'mes' : 'meses'}`
    };
  }, [filteredClicksByText, timePeriod]);

  // Función para agrupar los datos según la selección de tiempo
  const chartData = useMemo(() => {
    if (!filteredClicksByText.length) return [];

    const groupedData = new Map();
    
    filteredClicksByText.forEach(click => {
      const date = parseISO(click.createdAt);
      const timeStart = startOfDay(date);
      const key = format(timeStart, "d MMM yyyy", { locale: es });

      if (groupedData.has(key)) {
        groupedData.set(key, groupedData.get(key) + 1);
      } else {
        groupedData.set(key, 1);
      }
    });

    // Convertir el Map a un array para el gráfico
    return Array.from(groupedData.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [filteredClicksByText]);

  if (isLoading) {
    return (
      <div className="w-full h-80 flex items-center justify-center">
        <p>Cargando gráfico...</p>
      </div>
    );
  }

  if (!clicksByText.length) {
    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
        <p className="text-center text-gray-500">No hay datos detallados disponibles para mostrar en el gráfico.</p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h3 className="font-semibold text-md">Cronología de clicks "{selectedClick?.text}"</h3>
        <div className="flex gap-2">
          <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los datos</SelectItem>
              <SelectItem value="1w">Última semana</SelectItem>
              <SelectItem value="2w">Últimas 2 semanas</SelectItem>
              <SelectItem value="3w">Últimas 3 semanas</SelectItem>
              <SelectItem value="1">Último mes</SelectItem>
              <SelectItem value="2">Últimos 2 meses</SelectItem>
              <SelectItem value="3">Últimos 3 meses</SelectItem>
              <SelectItem value="4">Últimos 4 meses</SelectItem>
              <SelectItem value="5">Últimos 5 meses</SelectItem>
              <SelectItem value="6">Últimos 6 meses</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mostrar resumen de estadísticas */}
      <StatisticsSummary summary={statsSummary} />

      <div className="w-full overflow-x-auto">
        <ChartContainer className="min-h-[350px]">
          {!isLoading && filteredClicksByText.length > 0 && (
            <ClickStatsBarChart 
              data={chartData} 
              dataKey="count"
              nameKey="name"
              barColors={[themeColor]}
            />
          )}
        </ChartContainer>
      </div>
      <div className="mt-4 text-sm text-gray-500 text-right">
        {timePeriod === 'all' ? (
          <span>Total de clicks: {clicksByText.length}</span>
        ) : (
          <>
            <span>Total de clicks en el período: {filteredClicksByText.length}</span>
            <span className="ml-2 text-gray-400">|</span>
            <span className="ml-2">Total histórico: {clicksByText.length}</span>
          </>
        )}
      </div>
    </div>
  );
}); 