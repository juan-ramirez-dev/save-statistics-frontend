import { memo } from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const StatisticsHeader = memo(function StatisticsHeader() {
  return (
    <CardHeader className="relative overflow-hidden pb-8 pt-6">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 opacity-80" />
      <div className="relative z-10">
        <CardTitle className="text-2xl font-bold text-blue-900 mb-2">
          Estadísticas de Clicks
        </CardTitle>
        <CardDescription className="text-indigo-700 max-w-3xl">
          Analiza tus datos con filtros por texto, tiempo y período. Obtén información valiosa sobre cómo interactúan los usuarios con tu contenido.
        </CardDescription>
      </div>
      <div className="absolute right-4 top-6 h-16 w-16 rounded-full bg-blue-500/10 p-3">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="h-full w-full text-blue-600"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" 
          />
        </svg>
      </div>
    </CardHeader>
  );
}); 