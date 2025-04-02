import { useState, useEffect } from 'react';
import { useAuthContext } from '@/lib/auth-provider';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useUniqueClickStats, useClicksByText } from './hooks';
import { StatisticsHeader } from './statistics-header';
import { PersonalTokenCard } from './personal-token-card';
import { ChartSection } from './chart-section';
import { ClickTypeSelector } from './click-type-selector';

export function ClickStatistics() {
  const { user } = useAuthContext();
  const {
    data: uniqueClickStats,
    loading: uniqueLoading,
    error: uniqueError
  } = useUniqueClickStats();

  const {
    data: clicksByText,
    loading: clicksLoading,
    fetchData: fetchClicksByText
  } = useClicksByText();

  const [selectedUniqueClick, setSelectedUniqueClick] = useState<string | undefined>(undefined);

  // Configurar el click seleccionado inicial y cargar sus datos
  useEffect(() => {
    if (uniqueClickStats.length > 0 && !selectedUniqueClick) {
      setSelectedUniqueClick(uniqueClickStats[0].id);

      if (user?.personalToken) {
        fetchClicksByText(uniqueClickStats[0].text, user.personalToken);
      }
    }
  }, [uniqueClickStats, selectedUniqueClick, user, fetchClicksByText]);

  // Manejador para cambios en la selección de tipo de click
  const handleUniqueClickChange = (value: string) => {
    setSelectedUniqueClick(value);

    const selectedClick = uniqueClickStats.find(click => click.id === value);
    if (selectedClick && user?.personalToken) {
      fetchClicksByText(selectedClick.text, user.personalToken);
    }
  };

  // Renderizado de carga
  if (uniqueLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Columna izquierda */}
        <div className="md:col-span-3">
          <PersonalTokenCard personalToken={user?.personalToken} />
        </div>

        {/* Columna derecha */}
        <div className="md:col-span-9">
          <Card>
            <StatisticsHeader />
            <CardContent className="pt-6 min-h-[300px] flex flex-col items-center justify-center">
              <Loader2 className="h-10 w-10 text-blue-500 animate-spin mb-4" />
              <p className="text-muted-foreground text-center">Cargando estadísticas...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Renderizado de error
  if (uniqueError) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Columna izquierda */}
        <div className="md:col-span-3">
          <PersonalTokenCard personalToken={user?.personalToken} />
        </div>

        {/* Columna derecha */}
        <div className="md:col-span-9">
          <Card>
            <StatisticsHeader />
            <CardContent className="pt-6">
              <Alert variant="destructive" className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-700">{uniqueError}</AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Renderizado sin datos
  if (!uniqueClickStats.length) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Columna izquierda */}
        <div className="md:col-span-3">
          <PersonalTokenCard personalToken={user?.personalToken} />
        </div>

        {/* Columna derecha */}
        <div className="md:col-span-9">
          <Card>
            <StatisticsHeader />
            <CardContent className="pt-6 min-h-[200px] flex items-center justify-center">
              <div className="text-center p-8 border border-dashed border-gray-200 rounded-md w-full">
                <p className="text-muted-foreground">No hay estadísticas de clicks disponibles.</p>
                <p className="text-sm text-gray-400 mt-2">Los datos aparecerán cuando comiences a registrar clicks.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Encontrar el click único seleccionado
  const selectedClick = uniqueClickStats.find(click => click.id === selectedUniqueClick);

  // Renderizado principal
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
      {/* Columna derecha */}
      <div className="md:col-span-8">
        <Card className="overflow-hidden border-gray-200 shadow-sm">
          <StatisticsHeader />
          <CardContent className="p-6">
            <div className="flex flex-col space-y-6">
              <ClickTypeSelector
                uniqueClickStats={uniqueClickStats}
                selectedUniqueClick={selectedUniqueClick}
                onUniqueClickChange={handleUniqueClickChange}
              />

              <ChartSection
                selectedClick={selectedClick}
                clicksByText={clicksByText}
                isLoading={clicksLoading}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Columna izquierda */}
      <div className="md:col-span-4">
        <PersonalTokenCard personalToken={user?.personalToken} />
      </div>


    </div>
  );
} 