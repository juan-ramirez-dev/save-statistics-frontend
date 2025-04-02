import { memo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Copy, Key } from 'lucide-react';

interface PersonalTokenCardProps {
  personalToken?: string;
}

export const PersonalTokenCard = memo(function PersonalTokenCard({ personalToken }: PersonalTokenCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (personalToken) {
      navigator.clipboard.writeText(personalToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="relative pb-8 pt-6 bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="absolute right-4 top-6 h-14 w-14 rounded-full bg-emerald-500/10 p-3">
          <Key className="h-full w-full text-emerald-600" />
        </div>
        <div className="relative z-10">
          <CardTitle className="text-xl font-bold text-emerald-900">Tu Token Personal</CardTitle>
          <CardDescription className="text-emerald-700 max-w-3xl">
            Este identificador único te permite registrar clicks sin autenticación. Utilízalo en tus aplicaciones.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
          <div className="rounded-md bg-gray-50 p-3 font-mono text-sm relative overflow-hidden">
            <div className="overflow-x-auto whitespace-nowrap pb-1">
              {personalToken || "No token available"}
            </div>
            {personalToken && (
              <Button
                size="sm"
                variant="outline"
                className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                onClick={handleCopy}
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </Button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Puedes usar este token en combinación con el texto de click para registrar estadísticas de uso sin necesidad de login.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}); 