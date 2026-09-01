import { Connector } from './connector.interface.js';

export class WeatherConnector extends Connector {
  constructor() {
    // Run every 15 minutes
    super('open-meteo-weather', 15 * 60 * 1000);
  }

  async fetch(structure) {
    try {
      const lat = structure.location.lat;
      const lng = structure.location.lng;

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Open-Meteo API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.current) return null;

      // Normalize the reading object
      return {
        source: 'open-meteo',
        temperature: data.current.temperature_2m, // °C
        humidity: data.current.relative_humidity_2m, // %
        precipitation: data.current.precipitation, // mm
        windSpeed: data.current.wind_speed_10m // km/h
      };
    } catch (err) {
      console.error(`[${this.name}] Failed to fetch weather for ${structure.name}:`, err.message);
      return null;
    }
  }
}
