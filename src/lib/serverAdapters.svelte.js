/**
 * Reactive store for server-side adapter library loaded at runtime
 * from public/assets/adapters/index.json.
 *
 * Unlike customAdapters, these are not persisted to localStorage
 * and not serialized into project files. They appear in the UI
 * under their own category field, identical to built-in adapters.
 */

class ServerAdaptersStore {
  /** @type {any[]} */
  list = $state([]);

  /**
   * Add or replace adapters by id.
   * @param {any|any[]} incoming
   */
  add(incoming) {
    const items = Array.isArray(incoming) ? incoming : [incoming];
    const map = new Map(this.list.map(a => [a.id, a]));
    for (const a of items) map.set(a.id, a);
    this.list = [...map.values()];
  }
}

export const serverAdapters = new ServerAdaptersStore();
