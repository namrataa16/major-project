import { Load, Vehicle, VehicleMatchResult } from '../types';

export function matchVehiclesForLoad(load: Load, allVehicles: Vehicle[]): VehicleMatchResult[] {
  const results: VehicleMatchResult[] = allVehicles.map((vehicle) => {
    const notes: string[] = [];
    
    // 1. Capacity Fit (0-100)
    let capacityScore = 50;
    if (vehicle.capacityTonnes < load.weightTonnes) {
      capacityScore = 10; // Under capacity
      notes.push(`Under-capacity (${vehicle.capacityTonnes}T < ${load.weightTonnes}T load)`);
    } else {
      const utilization = (load.weightTonnes / vehicle.capacityTonnes) * 100;
      if (utilization >= 75 && utilization <= 100) {
        capacityScore = 98; // Ideal capacity utilization
        notes.push(`Optimal capacity utilization (${Math.round(utilization)}%)`);
      } else if (utilization >= 50) {
        capacityScore = 80;
        notes.push(`Good capacity fit (${Math.round(utilization)}% payload)`);
      } else {
        capacityScore = 60; // Oversized vehicle
        notes.push(`Oversized vehicle for this load`);
      }
    }

    // 2. Availability Fit (0-100)
    let availabilityScore = 30;
    const isAvailable = vehicle.status === 'Available';
    if (vehicle.status === 'Available') {
      availabilityScore = 95;
      notes.push('Vehicle currently available for immediate dispatch');
    } else if (vehicle.status === 'On Trip') {
      availabilityScore = 60;
      notes.push('Currently on trip — ETA completion soon');
    } else {
      availabilityScore = 15;
      notes.push(`Status: ${vehicle.status}`);
    }

    // 3. Location Fit (0-100)
    let locationScore = 50;
    const originNorm = load.origin.toLowerCase().trim();
    const locNorm = vehicle.currentLocation.toLowerCase().trim();
    if (locNorm.includes(originNorm) || originNorm.includes(locNorm)) {
      locationScore = 95;
      notes.push(`At pickup hub (${vehicle.currentLocation})`);
    } else if (
      (originNorm === 'mumbai' && (locNorm === 'thane' || locNorm === 'bhiwandi' || locNorm === 'navi mumbai')) ||
      (originNorm === 'pune' && locNorm === 'chakan')
    ) {
      locationScore = 85;
      notes.push(`Nearby pickup hub (${vehicle.currentLocation})`);
    } else {
      locationScore = 55;
      notes.push(`Located at ${vehicle.currentLocation}`);
    }

    // 4. Vehicle Type Fit
    let typeScore = 80;
    if (load.vehicleRequirement && load.vehicleRequirement.toLowerCase().includes(vehicle.type.toLowerCase())) {
      typeScore = 95;
    } else if (load.vehicleRequirement && load.vehicleRequirement.includes(`${vehicle.capacityTonnes}T`)) {
      typeScore = 95;
    }

    // Weighted match calculation
    const totalMatchScore = Math.round(
      capacityScore * 0.35 +
      availabilityScore * 0.30 +
      locationScore * 0.20 +
      typeScore * 0.15
    );

    return {
      vehicle,
      matchScore: Math.min(99, Math.max(20, totalMatchScore)),
      isAvailable,
      capacityFitScore: capacityScore,
      locationFitScore: locationScore,
      vehicleTypeFitScore: typeScore,
      notes,
    };
  });

  // Sort descending by match score
  return results.sort((a, b) => b.matchScore - a.matchScore);
}
