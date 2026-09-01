export function computeRiskScore(structure, realInputs) {
  // Start with a baseline. If structure has a healthScore, we anchor near it to avoid erratic jumps,
  // or we start from 100 and subtract. We'll start from 100 for a pure derived score.
  let score = 100;
  const reasons = [];

  // 1. Age & Inspection Penalty
  const age = structure.buildYear ? new Date().getFullYear() - structure.buildYear : 30; // default 30 years
  if (age > 50) {
    score -= 10;
    reasons.push(`Structure age > 50 years (-10)`);
  } else if (age > 20) {
    score -= 5;
    reasons.push(`Structure age > 20 years (-5)`);
  }

  const daysSinceInspection = structure.lastInspection 
    ? (new Date() - new Date(structure.lastInspection)) / (1000 * 60 * 60 * 24)
    : 365; // default 1 year
  
  if (daysSinceInspection > 180) {
    score -= 10;
    reasons.push(`Over 6 months since last inspection (-10)`);
  } else if (daysSinceInspection > 90) {
    score -= 5;
    reasons.push(`Over 3 months since last inspection (-5)`);
  }

  // 2. Weather Penalties (Open-Meteo)
  if (realInputs.weather) {
    const { windSpeed, humidity, precipitation, temperature } = realInputs.weather;
    
    // Wind Load Penalty
    if (windSpeed > 60) {
      score -= 15;
      reasons.push(`High wind load: ${windSpeed}km/h (-15)`);
    } else if (windSpeed > 40) {
      score -= 5;
      reasons.push(`Moderate wind load: ${windSpeed}km/h (-5)`);
    }

    // Corrosion Penalty
    if (humidity > 85 && precipitation > 10) {
      score -= 15;
      reasons.push(`High corrosion risk: ${humidity}% humidity + ${precipitation}mm rain (-15)`);
    } else if (humidity > 70 && precipitation > 2) {
      score -= 5;
      reasons.push(`Elevated corrosion risk: ${humidity}% humidity + ${precipitation}mm rain (-5)`);
    }

    // Thermal Stress
    if (temperature > 40 || temperature < -10) {
      score -= 10;
      reasons.push(`Extreme thermal stress: ${temperature}°C (-10)`);
    }
  }

  // 3. Seismic Penalties (USGS)
  if (realInputs.seismic) {
    const { magnitude, distanceKm } = realInputs.seismic;
    // Significant earthquake nearby
    if (magnitude > 5.0 && distanceKm < 100) {
      score -= 40;
      reasons.push(`Critical seismic shock: Mag ${magnitude} at ${Math.round(distanceKm)}km (-40)`);
    } else if (magnitude > 4.0 && distanceKm < 200) {
      score -= 20;
      reasons.push(`Moderate seismic shock: Mag ${magnitude} at ${Math.round(distanceKm)}km (-20)`);
    } else if (magnitude > 3.0 && distanceKm < 300) {
      score -= 5;
      reasons.push(`Minor seismic shock: Mag ${magnitude} at ${Math.round(distanceKm)}km (-5)`);
    }
  }

  // Clamp 0-100
  score = Math.max(0, Math.min(100, score));

  // Thresholds mapping (derived from app logic: healthy >=80, warning >=60, critical <60)
  let status = 'healthy';
  if (score < 60) {
    status = 'critical';
  } else if (score < 80) {
    status = 'warning';
  }

  return {
    score,
    status,
    reasons
  };
}
