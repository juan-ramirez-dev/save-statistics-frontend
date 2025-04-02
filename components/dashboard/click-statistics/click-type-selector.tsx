import { memo, useMemo } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { UniqueClickStatistic } from '@/lib/api/statistics';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';

interface ClickTypeSelectorProps {
  uniqueClickStats: UniqueClickStatistic[];
  selectedUniqueClick?: string;
  onUniqueClickChange: (value: string) => void;
}

export const ClickTypeSelector = memo(function ClickTypeSelector({
  uniqueClickStats,
  selectedUniqueClick,
  onUniqueClickChange
}: ClickTypeSelectorProps) {
  // Encontrar el texto del click seleccionado actualmente
  const selectedClickText = useMemo(() => {
    if (!selectedUniqueClick) return '';
    const selected = uniqueClickStats.find(click => click.id === selectedUniqueClick);
    return selected ? selected.text : '';
  }, [uniqueClickStats, selectedUniqueClick]);

  // Encontrar la fecha del último click para el tipo seleccionado
  const lastClicked = useMemo(() => {
    if (!selectedUniqueClick) return null;
    const selected = uniqueClickStats.find(click => click.id === selectedUniqueClick);
    return selected ? parseISO(selected.updatedAt) : null;
  }, [uniqueClickStats, selectedUniqueClick]);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Tipo de Click:
        </label>
        {lastClicked && (
          <div className="px-2 py-1 text-xs rounded bg-blue-50 text-blue-700">
            Último: {format(lastClicked, "d MMM yyyy, HH:mm", { locale: es })}
          </div>
        )}
      </div>
      
      <Select value={selectedUniqueClick} onValueChange={onUniqueClickChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecciona un tipo de click">
            {selectedClickText || "Selecciona un tipo de click"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {uniqueClickStats.map((click) => (
            <SelectItem 
              key={click.id} 
              value={click.id}
              className="flex items-center justify-between py-2 cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <span className="font-medium">{click.text}</span>
                <div className="ml-2 px-1.5 py-0.5 text-xs rounded-full border border-gray-200">
                  {click.count}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}); 