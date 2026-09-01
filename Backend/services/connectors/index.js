import { OsmStructuresConnector } from './osmStructures.connector.js';
import { WeatherConnector } from './weather.connector.js';
import { SeismicConnector } from './seismic.connector.js';

export const connectors = [
  new OsmStructuresConnector(),
  new WeatherConnector(),
  new SeismicConnector()
];
