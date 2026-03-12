/**
 * Reactive localStorage-backed store for user-imported custom adapters.
 * Uses Svelte 5 runes — must be imported from .svelte files or .svelte.js modules.
 */

const STORAGE_KEY = 'gridgen_custom_adapters';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

class CustomAdaptersStore {
  /** @type {any[]} */
  list = $state(loadFromStorage());

  /**
   * Add or replace adapters by id. Re-uploading the same id updates the entry.
   * @param {any|any[]} incoming
   */
  add(incoming) {
    const items = Array.isArray(incoming) ? incoming : [incoming];
    const map = new Map(this.list.map(a => [a.id, a]));
    for (const a of items) map.set(a.id, a);
    this.list = [...map.values()];
    persist(this.list);
  }

  /**
   * Remove a custom adapter by id.
   * @param {string} id
   */
  remove(id) {
    this.list = this.list.filter(a => a.id !== id);
    persist(this.list);
  }

  /** Clear all custom adapters. */
  clear() {
    this.list = [];
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const customAdapters = new CustomAdaptersStore();
