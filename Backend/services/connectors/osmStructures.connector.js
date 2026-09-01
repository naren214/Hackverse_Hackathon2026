import { Connector } from './connector.interface.js';

export class OsmStructuresConnector extends Connector {
  constructor() {
    // Run infrequently to respect OSM public API rate limits (e.g. every 12 hours)
    super('osm-structures', 12 * 60 * 60 * 1000);
  }

  async fetch(structure) {
    try {
      const lat = structure.location.lat;
      const lng = structure.location.lng;

      // Query OpenStreetMap via Overpass API for nearby bridges/flyovers (within 5000m)
      const overpassQuery = `
        [out:json];
        (
          way["bridge"="yes"](around:5000,${lat},${lng});
          way["highway"="primary"](around:5000,${lat},${lng});
        );
        out center;
      `;
      
      const overpassUrl = 'https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(overpassQuery);
      const response = await fetch(overpassUrl);

      if (!response.ok) {
        throw new Error(`OSM Overpass API error: ${response.statusText}`);
      }

      const data = await response.json();
      const elements = data.elements || [];

      // Find the closest element with a valid name
      let closest = null;
      let minDistance = Infinity;

      for (const el of elements) {
        if (!el.tags || !el.tags.name) continue;
        const elLat = el.center ? el.center.lat : el.lat;
        const elLon = el.center ? el.center.lon : el.lon;
        if (elLat === undefined || elLon === undefined) continue;

        // Fast euclidean distance approximation for local scale
        const dist = Math.pow(elLat - lat, 2) + Math.pow(elLon - lng, 2);
        if (dist < minDistance) {
          minDistance = dist;
          closest = el;
        }
      }

      if (closest) {
        return {
          source: 'osm',
          name: closest.tags.name,
          lat: closest.center ? closest.center.lat : closest.lat,
          lng: closest.center ? closest.center.lon : closest.lon,
          type: closest.tags.bridge === 'yes' ? 'bridge' : 'flyover'
        };
      }

      return null;
    } catch (err) {
      console.error(`[${this.name}] Failed to fetch OSM data for ${structure.name}:`, err.message);
      return null; // Skip non-critically
    }
  }
}
