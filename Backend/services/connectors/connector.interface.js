/**
 * Base Connector Interface
 * All real-world data connectors must implement this shape.
 */
export class Connector {
  constructor(name, intervalMs) {
    this.name = name;
    this.intervalMs = intervalMs;
  }

  /**
   * Fetch data for a given structure.
   * @param {Object} structure - Mongoose Structure document
   * @returns {Object} Normalized reading object containing risk factors or enriched data
   */
  async fetch(structure) {
    throw new Error(`fetch() not implemented in connector ${this.name}`);
  }
}
