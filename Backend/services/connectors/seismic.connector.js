import { Connector } from './connector.interface.js';

// Haversine distance in km
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; // Distance in km
}

export class SeismicConnector extends Connector {
  constructor() {
    // Run every hour
    super('usgs-seismic', 60 * 60 * 1000);
  }

  async fetch(structure) {
    try {
      const lat = structure.location.lat;
      const lng = structure.location.lng;

      // Fetch significant earthquakes from the past week
      const url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson';
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`USGS API error: ${response.statusText}`);
      }

      const data = await response.json();
      const features = data.features || [];

      let nearest = null;
      let minDistance = Infinity;

      for (const feature of features) {
        const [eqLng, eqLat] = feature.geometry.coordinates;
        const distance = getDistanceFromLatLonInKm(lat, lng, eqLat, eqLng);
        
        if (distance < minDistance) {
          minDistance = distance;
          nearest = feature;
        }
      }

      if (nearest) {
        return {
          source: 'usgs',
          magnitude: nearest.properties.mag,
          distanceKm: minDistance,
          title: nearest.properties.title,
          time: nearest.properties.time
        };
      }

      return null;
    } catch (err) {
      console.error(`[${this.name}] Failed to fetch seismic data for ${structure.name}:`, err.message);
      return null;
    }
  }
}
