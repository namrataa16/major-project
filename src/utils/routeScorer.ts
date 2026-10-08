import { RouteOption, RouteScoringWeights, Vehicle } from '../types';

export const DEFAULT_ROUTE_WEIGHTS: RouteScoringWeights = {
  fuelCost: 0.25,        // 25%
  travelTime: 0.20,      // 20%
  roadQuality: 0.15,     // 15%
  terrainDifficulty: 0.15, // 15%
  vehicleSuitability: 0.15, // 15%
  tollCost: 0.10,        // 10%
};

/**
 * Calculates dynamic route scores based on vehicle specs, cargo weight, and configurable weights.
 */
export function calculateRouteScore(
  route: RouteOption,
  vehicle?: Vehicle,
  cargoWeightTonnes: number = 18,
  weights: RouteScoringWeights = DEFAULT_ROUTE_WEIGHTS
): {
  score: number;
  breakdown: {
    fuelScore: number;
    timeScore: number;
    roadScore: number;
    terrainScore: number;
    vehicleScore: number;
    tollScore: number;
  };
  totalOperatingCost: number;
} {
  // Base total operating cost = Fuel + Toll
  const baseCost = route.estimatedFuelCost + route.tollCost;
  
  // Dynamic fuel adjustment based on vehicle mileage and payload burden
  const vehicleMileage = vehicle ? vehicle.mileageKmPerL : 3.8;
  const vehicleCapacity = vehicle ? vehicle.capacityTonnes : 20;
  const payloadRatio = Math.min(1.2, Math.max(0.5, cargoWeightTonnes / vehicleCapacity));
  
  // Heavy payload on steep terrain increases fuel penalty significantly
  const terrainMultiplier = route.terrainDifficulty === 'High' ? 1.25 : route.terrainDifficulty === 'Medium' ? 1.08 : 1.0;
  const estimatedFuel = (route.distanceKm / vehicleMileage) * 95 * payloadRatio * terrainMultiplier;
  const adjustedTotalCost = Math.round(estimatedFuel + route.tollCost);

  // 1. Fuel Cost Score (Lower cost -> higher score out of 100)
  // Benchmark fuel range ~ ₹2400 to ₹3500
  const fuelScore = Math.max(30, Math.min(100, Math.round(100 - ((estimatedFuel - 2400) / 1400) * 50)));

  // 2. Travel Time Score (Faster -> higher score)
  // Benchmark time range 3.2h to 4.5h
  const timeScore = Math.max(30, Math.min(100, Math.round(100 - ((route.durationHours - 3.2) / 1.5) * 50)));

  // 3. Road Quality Score
  const roadScore = route.roadQuality === 'High' ? 95 : route.roadQuality === 'Medium' ? 70 : 45;

  // 4. Terrain Difficulty Score (Low difficulty = gentle gradient = high score for heavy vehicles)
  const terrainScore = route.terrainDifficulty === 'Low' ? 95 : route.terrainDifficulty === 'Medium' ? 68 : 40;

  // 5. Vehicle Suitability Score
  // Heavy vehicles (>= 20T) suffer on high terrain; Multi-Axle needs high road quality; LCV is agile.
  let vehicleScore = 80;
  if (vehicle) {
    if (vehicle.capacityTonnes >= 20 && route.terrainDifficulty === 'High') {
      vehicleScore = 45; // High wear & tear, clutch overheating risk
    } else if (vehicle.capacityTonnes >= 20 && route.terrainDifficulty === 'Low') {
      vehicleScore = 95; // Optimal for multi-axle heavy trailers
    } else if (vehicle.type === 'Light Commercial Vehicle') {
      vehicleScore = 85;
    }
  } else {
    vehicleScore = route.terrainDifficulty === 'Low' ? 90 : route.terrainDifficulty === 'Medium' ? 72 : 55;
  }

  // 6. Toll Cost Score (Lower toll -> higher score)
  // Benchmark toll ₹300 to ₹600
  const tollScore = Math.max(40, Math.min(100, Math.round(100 - ((route.tollCost - 300) / 400) * 40)));

  // Weighted aggregate
  const rawScore = 
    fuelScore * weights.fuelCost +
    timeScore * weights.travelTime +
    roadScore * weights.roadQuality +
    terrainScore * weights.terrainDifficulty +
    vehicleScore * weights.vehicleSuitability +
    tollScore * weights.tollCost;

  const finalScore = Math.round(rawScore);

  return {
    score: finalScore,
    breakdown: {
      fuelScore,
      timeScore,
      roadScore,
      terrainScore,
      vehicleScore,
      tollScore,
    },
    totalOperatingCost: adjustedTotalCost,
  };
}

/**
 * Compare two routes to produce human-readable intelligence insights
 */
export function compareRoutes(recommended: RouteOption, shortest: RouteOption) {
  const distanceDiffPct = Math.round(((recommended.distanceKm - shortest.distanceKm) / shortest.distanceKm) * 100);
  const costDiffPct = Math.round(((shortest.estimatedFuelCost + shortest.tollCost - (recommended.estimatedFuelCost + recommended.tollCost)) / (shortest.estimatedFuelCost + shortest.tollCost)) * 100);
  
  return {
    distanceDiffPct: Math.abs(distanceDiffPct),
    isLonger: distanceDiffPct > 0,
    costDiffPct: Math.abs(costDiffPct),
    isCostLower: costDiffPct > 0,
    summaryMessage: `${Math.abs(distanceDiffPct)}% longer distance, but estimated ${Math.abs(costDiffPct)}% lower operating cost and lower terrain difficulty.`,
  };
}
