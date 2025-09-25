import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Calendar, Gift, Heart, TrendingUp, Coins } from 'lucide-react';
import { formatCurrency } from '@/utils/salaryCalculator';

interface AnnualMetricsProps {
  annualGrossIncome: number;
  christmasBonus: number;
  julyBonus: number;
  healthBonus: number;
  totalAnnualIncome: number;
  netAnnualSalary: number;
  loading?: boolean;
}

const AnnualMetrics: React.FC<AnnualMetricsProps> = ({
  annualGrossIncome,
  christmasBonus,
  julyBonus,
  healthBonus,
  totalAnnualIncome,
  netAnnualSalary,
  loading = false,
}) => {
  const metrics = [
    {
      label: 'Ingresos Anuales (12 meses)',
      value: annualGrossIncome,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Gratificación Diciembre',
      value: christmasBonus,
      icon: Gift,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      label: 'Gratificación Julio',
      value: julyBonus,
      icon: Gift,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      label: 'Bono Salud (9%)',
      value: healthBonus,
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    },
    {
      label: 'Total Ingresos Anuales',
      value: totalAnnualIncome,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  return (
    <Card className="shadow-card hover:shadow-elevated transition-all duration-300 animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-card-foreground flex items-center gap-2">
          <Coins className="w-6 h-6 text-primary" />
          Métricas Anuales
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Métricas regulares */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`p-4 rounded-lg border ${metric.bgColor} hover:scale-105 transition-all duration-200`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${metric.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      {metric.label}
                    </p>
                    {loading ? (
                      <div className="animate-pulse">
                        <div className="h-5 bg-muted rounded w-24 mt-1"></div>
                      </div>
                    ) : (
                      <motion.p
                        key={metric.value}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                        className={`text-lg font-bold ${metric.color}`}
                      >
                        {formatCurrency(metric.value)}
                      </motion.p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Neto anual destacado */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6 p-6 rounded-lg bg-gradient-to-r from-primary/10 to-success/10 border-2 border-primary/20 hover:shadow-glow transition-all duration-300"
        >
          <div className="text-center">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">
              💰 Sueldo Neto Anual Total
            </p>
            {loading ? (
              <div className="animate-pulse flex justify-center">
                <div className="h-8 bg-muted rounded w-48"></div>
              </div>
            ) : (
              <motion.p
                key={netAnnualSalary}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, type: 'spring', stiffness: 150 }}
                className="text-3xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent"
              >
                {formatCurrency(netAnnualSalary)}
              </motion.p>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              Incluye gratificaciones, bono salud y descuentos
            </p>
          </div>
        </motion.div>

        {/* Resumen de deducciones anuales */}
        {!loading && netAnnualSalary > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.4 }}
            className="mt-4 p-4 rounded-lg bg-muted/30 border"
          >
            <div className="text-center">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                📋 Resumen Anual
              </p>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="text-muted-foreground">Ingresos Totales</p>
                  <p className="font-bold text-green-600">
                    {formatCurrency(totalAnnualIncome)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Descuentos</p>
                  <p className="font-bold text-red-600">
                    {formatCurrency(totalAnnualIncome - netAnnualSalary)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">% Retención</p>
                  <p className="font-bold text-orange-600">
                    {((1 - netAnnualSalary / totalAnnualIncome) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnnualMetrics;