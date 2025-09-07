/**
 * Professional Construction Variance Analysis System
 * Earned Value Management (EVM) Calculations for UK Construction Industry
 * 
 * Implements industry-standard EVM formulas with professional thresholds
 * and variance decomposition suitable for quantity surveyors and commercial managers.
 */

export interface EVMMetrics {
  // Core EVM Values
  BAC: number;          // Budget at Completion
  EV: number;           // Earned Value
  AC: number;           // Actual Cost
  PV: number;           // Planned Value
  
  // Performance Indicators
  CPI: number;          // Cost Performance Index
  SPI: number;          // Schedule Performance Index
  CV: number;           // Cost Variance
  SV: number;           // Schedule Variance
  
  // Forecasting
  EAC: number;          // Estimate at Completion
  ETC: number;          // Estimate to Complete
  VAC: number;          // Variance at Completion
  TCPI: number;         // To-Complete Performance Index
  
  // Professional Status
  cpiStatus: 'EXCELLENT' | 'ACCEPTABLE' | 'ATTENTION' | 'CRITICAL';
  spiStatus: 'EXCELLENT' | 'ACCEPTABLE' | 'ATTENTION' | 'CRITICAL';
  overallStatus: 'GREEN' | 'AMBER' | 'RED';
}

export interface VarianceDecomposition {
  priceVariance: number;      // (Actual Price - Standard Price) × Actual Quantity
  quantityVariance: number;   // (Standard Quantity - Actual Quantity) × Standard Price
  efficiencyVariance: number; // Labor Hours × (Standard Rate - Actual Rate)
  totalVariance: number;      // Sum of all variances
  primaryDriver: string;      // Main cause of variance
}

export interface SupplierPerformance {
  name: string;
  onTimeDelivery: number;     // Percentage (target: >95%)
  qualityCompliance: number;  // Percentage (target: >98%)
  defectRate: number;         // Percentage (target: <2%)
  costCompetitiveness: 1|2|3|4|5; // Ranking vs alternatives
  contractCompliance: number; // SLA adherence percentage
  bsCompliance: string[];     // e.g., ["BS6576", "BS8102", "PAS2035"]
  leadTimeReliability: number; // Actual vs promised delivery
  trend: 'IMPROVING' | 'STABLE' | 'DECLINING';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface ProjectThresholds {
  type: 'luxury' | 'heritage' | 'standard';
  acceptableVarianceRange: [number, number]; // Min, Max percentage
  cpiThresholds: {
    excellent: number;
    acceptable: number;
    attention: number;
  };
  spiThresholds: {
    excellent: number;
    acceptable: number;
    attention: number;
  };
  contingencyPercentage: number;
}

// Professional thresholds by project type
export const PROJECT_THRESHOLDS: Record<string, ProjectThresholds> = {
  luxury: {
    type: 'luxury',
    acceptableVarianceRange: [5, 10],
    cpiThresholds: { excellent: 1.05, acceptable: 0.95, attention: 0.90 },
    spiThresholds: { excellent: 1.05, acceptable: 0.95, attention: 0.90 },
    contingencyPercentage: 10
  },
  heritage: {
    type: 'heritage',
    acceptableVarianceRange: [10, 15],
    cpiThresholds: { excellent: 1.05, acceptable: 0.90, attention: 0.85 },
    spiThresholds: { excellent: 1.05, acceptable: 0.90, attention: 0.85 },
    contingencyPercentage: 15
  },
  standard: {
    type: 'standard',
    acceptableVarianceRange: [5, 8],
    cpiThresholds: { excellent: 1.10, acceptable: 0.95, attention: 0.90 },
    spiThresholds: { excellent: 1.05, acceptable: 0.95, attention: 0.90 },
    contingencyPercentage: 8
  }
};

/**
 * Calculate core EVM metrics with professional status assessment
 */
export function calculateEVMMetrics(
  budgetAtCompletion: number,
  physicalProgress: number,
  plannedProgress: number,
  actualCost: number,
  projectType: keyof typeof PROJECT_THRESHOLDS = 'standard'
): EVMMetrics {
  const BAC = budgetAtCompletion;
  const EV = BAC * (physicalProgress / 100);
  const PV = BAC * (plannedProgress / 100);
  const AC = actualCost;
  
  // Performance Indicators
  const CPI = AC > 0 ? EV / AC : 1;
  const SPI = PV > 0 ? EV / PV : 1;
  const CV = EV - AC;
  const SV = EV - PV;
  
  // Forecasting
  const EAC = CPI > 0 ? BAC / CPI : BAC;
  const ETC = EAC - AC;
  const VAC = BAC - EAC;
  const TCPI = (BAC - EV) / (BAC - AC);
  
  // Professional Status Assessment
  const thresholds = PROJECT_THRESHOLDS[projectType];
  
  const cpiStatus = CPI >= thresholds.cpiThresholds.excellent ? 'EXCELLENT' :
                    CPI >= thresholds.cpiThresholds.acceptable ? 'ACCEPTABLE' :
                    CPI >= thresholds.cpiThresholds.attention ? 'ATTENTION' : 'CRITICAL';
  
  const spiStatus = SPI >= thresholds.spiThresholds.excellent ? 'EXCELLENT' :
                    SPI >= thresholds.spiThresholds.acceptable ? 'ACCEPTABLE' :
                    SPI >= thresholds.spiThresholds.attention ? 'ATTENTION' : 'CRITICAL';
  
  const overallStatus = (cpiStatus === 'CRITICAL' || spiStatus === 'CRITICAL') ? 'RED' :
                       (cpiStatus === 'ATTENTION' || spiStatus === 'ATTENTION') ? 'AMBER' : 'GREEN';
  
  return {
    BAC, EV, AC, PV, CPI, SPI, CV, SV, EAC, ETC, VAC, TCPI,
    cpiStatus, spiStatus, overallStatus
  };
}

/**
 * Decompose variance into professional components
 */
export function decomposeVariance(
  standardPrice: number,
  actualPrice: number,
  standardQuantity: number,
  actualQuantity: number,
  standardLaborRate: number,
  actualLaborRate: number,
  laborHours: number
): VarianceDecomposition {
  const priceVariance = (actualPrice - standardPrice) * actualQuantity;
  const quantityVariance = (standardQuantity - actualQuantity) * standardPrice;
  const efficiencyVariance = laborHours * (standardLaborRate - actualLaborRate);
  
  const totalVariance = priceVariance + quantityVariance + efficiencyVariance;
  
  // Determine primary driver
  const variances = [
    { type: 'Price', amount: Math.abs(priceVariance) },
    { type: 'Quantity', amount: Math.abs(quantityVariance) },
    { type: 'Efficiency', amount: Math.abs(efficiencyVariance) }
  ];
  
  const primaryDriver = variances.reduce((max, current) => 
    current.amount > max.amount ? current : max
  ).type;
  
  return {
    priceVariance,
    quantityVariance,
    efficiencyVariance,
    totalVariance,
    primaryDriver
  };
}

/**
 * Assess supplier performance with professional scoring
 */
export function assessSupplierPerformance(
  deliveryRecord: number[],
  qualityScores: number[],
  defects: number,
  totalDeliveries: number,
  contractCompliance: number,
  bsStandards: string[],
  promisedDays: number[],
  actualDays: number[]
): SupplierPerformance {
  const onTimeDelivery = (deliveryRecord.filter(d => d <= 0).length / deliveryRecord.length) * 100;
  const qualityCompliance = qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length;
  const defectRate = (defects / totalDeliveries) * 100;
  const leadTimeReliability = (actualDays.reduce((sum, actual, i) => sum + (actual / promisedDays[i]), 0) / actualDays.length) * 100;
  
  // Cost competitiveness would be determined by market analysis
  const costCompetitiveness = 3; // Default to middle ranking
  
  // Determine trend based on recent performance
  const recentPerformance = qualityScores.slice(-3);
  const earlyPerformance = qualityScores.slice(0, 3);
  const avgRecent = recentPerformance.reduce((sum, score) => sum + score, 0) / recentPerformance.length;
  const avgEarly = earlyPerformance.reduce((sum, score) => sum + score, 0) / earlyPerformance.length;
  
  const trend = avgRecent > avgEarly + 2 ? 'IMPROVING' :
               avgRecent < avgEarly - 2 ? 'DECLINING' : 'STABLE';
  
  // Risk assessment
  const riskLevel = (onTimeDelivery < 90 || qualityCompliance < 95 || defectRate > 3) ? 'HIGH' :
                   (onTimeDelivery < 95 || qualityCompliance < 98 || defectRate > 2) ? 'MEDIUM' : 'LOW';
  
  return {
    name: '', // To be filled by caller
    onTimeDelivery,
    qualityCompliance,
    defectRate,
    costCompetitiveness: costCompetitiveness as 1|2|3|4|5,
    contractCompliance,
    bsCompliance: bsStandards,
    leadTimeReliability,
    trend,
    riskLevel
  };
}

/**
 * Generate professional variance analysis narrative
 */
export function generateProfessionalAnalysis(
  metrics: EVMMetrics,
  variance: VarianceDecomposition,
  supplierData: SupplierPerformance[],
  projectType: keyof typeof PROJECT_THRESHOLDS = 'standard'
): string {
  const thresholds = PROJECT_THRESHOLDS[projectType];
  const variancePercent = (Math.abs(metrics.CV) / metrics.BAC) * 100;
  
  const exceedsThreshold = variancePercent > thresholds.acceptableVarianceRange[1];
  const withinRange = variancePercent >= thresholds.acceptableVarianceRange[0] && 
                     variancePercent <= thresholds.acceptableVarianceRange[1];
  
  let analysis = `Cost variance of £${Math.abs(metrics.CV).toLocaleString()} represents a ${variancePercent.toFixed(1)}% deviation from budget baseline`;
  
  if (exceedsThreshold) {
    analysis += `, exceeding the ${thresholds.acceptableVarianceRange[0]}-${thresholds.acceptableVarianceRange[1]}% acceptable range for ${projectType} projects`;
  } else if (withinRange) {
    analysis += `, within the ${thresholds.acceptableVarianceRange[0]}-${thresholds.acceptableVarianceRange[1]}% acceptable range for ${projectType} projects`;
  }
  
  analysis += `. Primary driver is ${variance.primaryDriver.toLowerCase()} variance of £${Math.abs(variance.priceVariance || variance.quantityVariance || variance.efficiencyVariance).toLocaleString()}`;
  
  analysis += `. Current CPI of ${metrics.CPI.toFixed(2)} ${metrics.cpiStatus === 'CRITICAL' ? 'indicates immediate intervention required' : 
              metrics.cpiStatus === 'ATTENTION' ? 'requires management attention' : 'remains within acceptable parameters'}`;
  
  if (metrics.overallStatus === 'RED') {
    analysis += ' to prevent further budget erosion.';
  } else if (metrics.overallStatus === 'AMBER') {
    analysis += ' to maintain project financial health.';
  } else {
    analysis += ', demonstrating effective cost control.';
  }
  
  return analysis;
}

/**
 * Calculate ROI for remediation options
 */
export function calculateROI(
  netBenefit: number,
  investment: number,
  timeframe: number
): {
  roi: number;
  annualizedROI: number;
  paybackPeriod: number;
  npv: number;
} {
  const roi = (netBenefit / investment) * 100;
  const annualizedROI = ((netBenefit / investment + 1) ** (12 / timeframe) - 1) * 100;
  const paybackPeriod = investment / (netBenefit / timeframe);
  
  // Simple NPV calculation (assuming 5% discount rate)
  const discountRate = 0.05;
  const monthlyRate = discountRate / 12;
  const npv = netBenefit / ((1 + monthlyRate) ** timeframe) - investment;
  
  return { roi, annualizedROI, paybackPeriod, npv };
}

/**
 * Format currency for professional presentation
 */
export function formatCurrency(amount: number, showSign: boolean = false): string {
  const formatted = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
  
  if (showSign && amount !== 0) {
    return amount > 0 ? `+${formatted}` : `-${formatted}`;
  }
  
  return formatted;
}

/**
 * Format percentage for professional presentation
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Get professional status color and badge
 */
export function getStatusDisplay(status: 'GREEN' | 'AMBER' | 'RED'): {
  color: string;
  bgColor: string;
  textColor: string;
  badge: string;
} {
  switch (status) {
    case 'GREEN':
      return {
        color: 'green',
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        badge: 'PERFORMING'
      };
    case 'AMBER':
      return {
        color: 'amber',
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-800',
        badge: 'ATTENTION'
      };
    case 'RED':
      return {
        color: 'red',
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        badge: 'CRITICAL'
      };
  }
}