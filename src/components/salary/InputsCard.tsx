import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, RefreshCw } from 'lucide-react';

interface InputsCardProps {
  onCalculate: (data: SalaryInputs) => void;
  onClear: () => void;
  loading?: boolean;
}

export interface SalaryInputs {
  basicSalary: number;
  foodAllowance: number;
  hasFamilyAllowance: boolean;
  year: number;
}

const InputsCard: React.FC<InputsCardProps> = ({ onCalculate, onClear, loading = false }) => {
  const [basicSalary, setBasicSalary] = useState<string>('');
  const [foodAllowance, setFoodAllowance] = useState<string>('');
  const [hasFamilyAllowance, setHasFamilyAllowance] = useState<boolean>(false);
  const [year, setYear] = useState<string>('2025');

  const handleNumberInput = (value: string, setter: (val: string) => void) => {
    // Solo permitir números y punto decimal
    const numericValue = value.replace(/[^0-9.]/g, '');
    setter(numericValue);
  };

  const formatCurrency = (value: string): string => {
    if (!value) return '';
    const number = parseFloat(value);
    if (isNaN(number)) return value;
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const handleCalculate = () => {
    const inputs: SalaryInputs = {
      basicSalary: parseFloat(basicSalary) || 0,
      foodAllowance: parseFloat(foodAllowance) || 0,
      hasFamilyAllowance,
      year: parseInt(year),
    };
    onCalculate(inputs);
  };

  const handleClear = () => {
    setBasicSalary('');
    setFoodAllowance('');
    setHasFamilyAllowance(false);
    setYear('2025');
    onClear();
  };

  const isValidInput = parseFloat(basicSalary) > 0;

  return (
    <Card className="w-full shadow-card animate-fade-in">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-card-foreground flex items-center gap-2">
          <Calculator className="w-6 h-6 text-primary" />
          Datos Salariales
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="basic-salary" className="text-sm font-medium text-card-foreground">
            Sueldo Básico (S/)
          </label>
          <Input
            id="basic-salary"
            type="text"
            placeholder="Ej: 3000"
            value={basicSalary}
            onChange={(e) => handleNumberInput(e.target.value, setBasicSalary)}
            className="text-lg font-mono"
            autoComplete="off"
          />
          {basicSalary && (
            <p className="text-sm text-muted-foreground">
              {formatCurrency(basicSalary)}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="food-allowance" className="text-sm font-medium text-card-foreground">
            Vales de Alimentación (S/)
          </label>
          <Input
            id="food-allowance"
            type="text"
            placeholder="Ej: 300"
            value={foodAllowance}
            onChange={(e) => handleNumberInput(e.target.value, setFoodAllowance)}
            className="text-lg font-mono"
            autoComplete="off"
          />
          {foodAllowance && (
            <p className="text-sm text-muted-foreground">
              {formatCurrency(foodAllowance)}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="family-allowance"
            checked={hasFamilyAllowance}
            onCheckedChange={(checked) => setHasFamilyAllowance(checked as boolean)}
          />
          <label
            htmlFor="family-allowance"
            className="text-sm font-medium text-card-foreground cursor-pointer"
          >
            Asignación Familiar (S/ 102.50)
          </label>
        </div>

        <div className="space-y-2">
          <label htmlFor="year" className="text-sm font-medium text-card-foreground">
            Año de Cálculo
          </label>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar año" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            variant="calculator"
            size="lg"
            onClick={handleCalculate}
            disabled={!isValidInput || loading}
            className="flex-1"
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Calculator className="w-4 h-4" />
            )}
            Calcular Sueldo Neto
          </Button>
          
          <Button
            variant="clear"
            size="lg"
            onClick={handleClear}
            className="flex-1 sm:flex-none"
          >
            Limpiar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InputsCard;