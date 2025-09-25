// Calculadora de Sueldo Neto Perú 2025
// Incluye AFP, 5ta categoría, gratificaciones y bono salud

export interface SalaryInputs {
  basicSalary: number;
  foodAllowance: number;
  hasFamilyAllowance: boolean;
  year: number;
}

export interface SalaryResults {
  // Inputs
  basicSalary: number;
  foodAllowance: number;
  familyAllowance: number;
  
  // Mensual
  grossMonthlySalary: number;
  afpDeduction: number;
  fifthCategoryTax: number;
  netMonthlySalary: number;
  
  // Anual
  annualGrossIncome: number;
  christmasBonus: number;
  julyBonus: number;
  healthBonus: number;
  totalAnnualIncome: number;
  
  annualAfpDeduction: number;
  annualFifthCategoryTax: number;
  netAnnualSalary: number;
  
  // Desglose detallado
  breakdown: SalaryBreakdown;
}

export interface SalaryBreakdown {
  monthlyCalculation: {
    step: string;
    description: string;
    amount: number;
    formula?: string;
  }[];
  
  annualCalculation: {
    step: string;
    description: string;
    amount: number;
    formula?: string;
  }[];
  
  fifthCategoryDetails: {
    step: string;
    description: string;
    amount: number;
    rate?: string;
  }[];
}

// Parámetros Perú 2025
const PERU_TAX_PARAMS_2025 = {
  UIT: 5150, // Unidad Impositiva Tributaria 2025
  AFP_RATE: 0.1325, // 13.25% (Prima + Comisión + Aporte)
  FAMILY_ALLOWANCE: 102.5, // Asignación familiar mensual
  
  // Tramos de 5ta categoría (sobre ingresos anuales > 7 UIT)
  FIFTH_CATEGORY_BRACKETS: [
    { from: 0, to: 36750, rate: 0.08 },      // 8% hasta 7 UIT
    { from: 36750, to: 110250, rate: 0.14 }, // 14% de 7 a 21 UIT  
    { from: 110250, to: 220500, rate: 0.17 }, // 17% de 21 a 42 UIT
    { from: 220500, to: 367500, rate: 0.20 }, // 20% de 42 a 70 UIT
    { from: 367500, to: Infinity, rate: 0.30 } // 30% más de 70 UIT
  ],
  
  DEDUCTION_UIT: 7, // 7 UIT de deducción para 5ta categoría
  HEALTH_BONUS_RATE: 0.09, // 9% de gratificaciones para bono salud
};

export function calculateSalary(inputs: SalaryInputs): SalaryResults {
  const { basicSalary, foodAllowance, hasFamilyAllowance } = inputs;
  const params = PERU_TAX_PARAMS_2025;
  
  // Valores base
  const familyAllowance = hasFamilyAllowance ? params.FAMILY_ALLOWANCE : 0;
  const grossMonthlySalary = basicSalary + foodAllowance + familyAllowance;
  
  // AFP mensual
  const afpDeduction = basicSalary * params.AFP_RATE;
  
  // Cálculos anuales
  const monthlyTaxableIncome = basicSalary + familyAllowance; // Los vales no tributan
  const annualTaxableIncome = monthlyTaxableIncome * 12;
  
  // Gratificaciones (julio y diciembre)
  const christmasBonus = basicSalary + familyAllowance;
  const julyBonus = basicSalary + familyAllowance;
  const totalBonuses = christmasBonus + julyBonus;
  
  // Bono salud (9% de gratificaciones)
  const healthBonus = totalBonuses * params.HEALTH_BONUS_RATE;
  
  // Total ingresos anuales gravables
  const totalAnnualTaxableIncome = annualTaxableIncome + totalBonuses;
  
  // Base para 5ta categoría (ingresos - deducción 7 UIT)
  const deductionAmount = params.DEDUCTION_UIT * params.UIT;
  const fifthCategoryBase = Math.max(0, totalAnnualTaxableIncome - deductionAmount);
  
  // Cálculo 5ta categoría por tramos
  let annualFifthCategoryTax = 0;
  let remainingBase = fifthCategoryBase;
  
  const fifthCategoryDetails: SalaryBreakdown['fifthCategoryDetails'] = [];
  
  for (const bracket of params.FIFTH_CATEGORY_BRACKETS) {
    if (remainingBase <= 0) break;
    
    const taxableInBracket = Math.min(remainingBase, bracket.to - bracket.from);
    const taxForBracket = taxableInBracket * bracket.rate;
    annualFifthCategoryTax += taxForBracket;
    
    if (taxableInBracket > 0) {
      fifthCategoryDetails.push({
        step: `Tramo ${bracket.rate * 100}%`,
        description: `S/ ${formatNumber(bracket.from)} - S/ ${bracket.to === Infinity ? '∞' : formatNumber(bracket.to)}`,
        amount: taxForBracket,
        rate: `${bracket.rate * 100}%`,
      });
    }
    
    remainingBase -= taxableInBracket;
  }
  
  // 5ta categoría mensual
  const fifthCategoryTax = annualFifthCategoryTax / 12;
  
  // Sueldo neto mensual
  const netMonthlySalary = grossMonthlySalary - afpDeduction - fifthCategoryTax;
  
  // Cálculos anuales finales
  const annualGrossIncome = grossMonthlySalary * 12;
  const annualAfpDeduction = afpDeduction * 12;
  const totalAnnualIncome = annualGrossIncome + totalBonuses + healthBonus;
  const netAnnualSalary = totalAnnualIncome - annualAfpDeduction - annualFifthCategoryTax;
  
  // Desglose detallado
  const breakdown: SalaryBreakdown = {
    monthlyCalculation: [
      {
        step: '1',
        description: 'Sueldo básico',
        amount: basicSalary,
      },
      {
        step: '2',
        description: 'Vales de alimentación',
        amount: foodAllowance,
      },
      ...(hasFamilyAllowance ? [{
        step: '3',
        description: 'Asignación familiar',
        amount: familyAllowance,
      }] : []),
      {
        step: '4',
        description: 'Sueldo bruto mensual',
        amount: grossMonthlySalary,
        formula: 'Sueldo básico + Vales + Asignación familiar',
      },
      {
        step: '5',
        description: 'Descuento AFP (13.25%)',
        amount: -afpDeduction,
        formula: `Sueldo básico × ${params.AFP_RATE * 100}%`,
      },
      {
        step: '6',
        description: 'Impuesto 5ta categoría (mensual)',
        amount: -fifthCategoryTax,
        formula: 'Impuesto anual ÷ 12 meses',
      },
      {
        step: '7',
        description: 'Sueldo neto mensual',
        amount: netMonthlySalary,
        formula: 'Bruto - AFP - 5ta categoría',
      },
    ],
    
    annualCalculation: [
      {
        step: '1',
        description: 'Ingresos anuales (12 meses)',
        amount: monthlyTaxableIncome * 12,
        formula: '(Sueldo básico + Asig. familiar) × 12',
      },
      {
        step: '2',
        description: 'Gratificación diciembre',
        amount: christmasBonus,
      },
      {
        step: '3',
        description: 'Gratificación julio',
        amount: julyBonus,
      },
      {
        step: '4',
        description: 'Bono salud (9% gratificaciones)',
        amount: healthBonus,
        formula: `(${formatNumber(totalBonuses)}) × 9%`,
      },
      {
        step: '5',
        description: 'Total ingresos gravables anuales',
        amount: totalAnnualTaxableIncome,
      },
      {
        step: '6',
        description: 'Deducción 7 UIT',
        amount: -deductionAmount,
        formula: `7 × S/ ${formatNumber(params.UIT)}`,
      },
      {
        step: '7',
        description: 'Base imponible 5ta categoría',
        amount: fifthCategoryBase,
      },
      {
        step: '8',
        description: 'Impuesto 5ta categoría anual',
        amount: annualFifthCategoryTax,
        formula: 'Calculado por tramos progresivos',
      },
    ],
    
    fifthCategoryDetails,
  };
  
  return {
    // Inputs
    basicSalary,
    foodAllowance,
    familyAllowance,
    
    // Mensual
    grossMonthlySalary,
    afpDeduction,
    fifthCategoryTax,
    netMonthlySalary,
    
    // Anual
    annualGrossIncome,
    christmasBonus,
    julyBonus,
    healthBonus,
    totalAnnualIncome,
    
    annualAfpDeduction,
    annualFifthCategoryTax,
    netAnnualSalary,
    
    breakdown,
  };
}

function formatNumber(num: number): string {
  return new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}