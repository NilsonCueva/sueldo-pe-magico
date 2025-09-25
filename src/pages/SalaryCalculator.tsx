import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import InputsCard, { SalaryInputs } from '@/components/salary/InputsCard';
import KPICards from '@/components/salary/KPICards';
import AnnualMetrics from '@/components/salary/AnnualMetrics';
import ChartsPanel from '@/components/salary/ChartsPanel';
import BreakdownAccordion from '@/components/salary/BreakdownAccordion';
import { calculateSalary, SalaryResults } from '@/utils/salaryCalculator';

const SalaryCalculator: React.FC = () => {
  const [results, setResults] = useState<SalaryResults | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = useCallback(async (inputs: SalaryInputs) => {
    setLoading(true);
    
    // Simular un pequeño delay para mostrar loading (opcional)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const calculatedResults = calculateSalary(inputs);
      setResults(calculatedResults);
    } catch (error) {
      console.error('Error calculating salary:', error);
      // Aquí podrías mostrar un toast de error
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClear = useCallback(() => {
    setResults(null);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-primary">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-primary/95 backdrop-blur-sm border-b border-foreground/10">
        <div className="container mx-auto px-4 py-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-center">
              💰 Sueldo Neto Perú 2025
            </h1>
            <p className="text-foreground/80 text-center mt-2 text-sm sm:text-base">
              Calculadora completa con AFP, 5ta categoría y gratificaciones
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Inputs (Desktop) / Top (Mobile) */}
          <motion.div
            className="lg:col-span-4 space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <InputsCard 
              onCalculate={handleCalculate}
              onClear={handleClear}
              loading={loading}
            />
          </motion.div>

          {/* Right Column - Results (Desktop) / Bottom (Mobile) */}
          <motion.div
            className="lg:col-span-8 space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* KPI Cards */}
            <KPICards
              grossSalary={results?.grossMonthlySalary || 0}
              afpDeduction={results?.afpDeduction || 0}
              fifthCategoryTax={results?.fifthCategoryTax || 0}
              netSalary={results?.netMonthlySalary || 0}
              loading={loading}
            />

            {/* Annual Metrics */}
            {(results || loading) && (
              <AnnualMetrics
                annualGrossIncome={results?.annualGrossIncome || 0}
                christmasBonus={results?.christmasBonus || 0}
                julyBonus={results?.julyBonus || 0}
                healthBonus={results?.healthBonus || 0}
                totalAnnualIncome={results?.totalAnnualIncome || 0}
                netAnnualSalary={results?.netAnnualSalary || 0}
                loading={loading}
              />
            )}

            {/* Charts */}
            {results && !loading && (
              <ChartsPanel
                grossSalary={results.grossMonthlySalary}
                afpDeduction={results.afpDeduction}
                fifthCategoryTax={results.fifthCategoryTax}
                netSalary={results.netMonthlySalary}
                annualGross={results.annualGrossIncome}
                annualNet={results.netAnnualSalary}
              />
            )}

            {/* Detailed Breakdown */}
            <BreakdownAccordion
              breakdown={results?.breakdown || null}
              loading={loading}
            />
          </motion.div>
        </div>

        {/* Footer Info */}
        <motion.footer
          className="mt-12 py-8 border-t border-foreground/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <div className="text-center text-foreground/60 space-y-2">
            <p className="text-sm">
              ✨ Calculadora actualizada para Perú 2025 - UIT: S/ 5,150
            </p>
            <p className="text-xs">
              Incluye AFP (13.25%), 5ta categoría por tramos progresivos, gratificaciones y bono salud
            </p>
            <p className="text-xs text-foreground/40">
              Los resultados son referenciales. Consulta con un especialista para casos específicos.
            </p>
          </div>
        </motion.footer>
      </main>
    </div>
  );
};

export default SalaryCalculator;