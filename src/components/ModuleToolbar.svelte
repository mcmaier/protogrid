<script>
  import { MODULE_LIBRARY } from '../lib/modules.js';
    import { ADAPTER_LIBRARY } from '../lib/adapters.js';

  let { modules = $bindable(), adapters = $bindable(), config, selectedInstanceId, onSelect, showOverlays = $bindable() } = $props();
  let selectedModuleId = $state('');
  let selectedAdapterId = $state('');

  // ── Module filtering ──
  let moduleCategories = $derived.by(() => {
    const matching = MODULE_LIBRARY.filter(m => m.pitch === config.pitch);
    const cats = {};
    for (const m of matching) {
      (cats[m.category] ??= []).push(m);
    }
    return cats;
  });

  // ── Adapter filtering ──
  let adapterCategories = $derived.by(() => {
    const matching = ADAPTER_LIBRARY.filter(a => a.pitch === config.pitch);
    const cats = {};
    for (const a of matching) {
      (cats[a.category] ??= []).push(a);
    }
    return cats;
  });

  // Reset selections when pitch changes
  $effect(() => {
    if (selectedModuleId) {
      const def = MODULE_LIBRARY.find(m => m.id === selectedModuleId);
      if (def && def.pitch !== config.pitch) selectedModuleId = '';
    }
    if (selectedAdapterId) {
      const def = ADAPTER_LIBRARY.find(a => a.id === selectedAdapterId);
      if (def && def.pitch !== config.pitch) selectedAdapterId = '';
    }
  });

  // Remove placed items that don't match the new pitch
  $effect(() => {
    const pitch = config.pitch;
    const validModIds = new Set(MODULE_LIBRARY.filter(m => m.pitch === pitch).map(m => m.id));
    const filteredMods = modules.filter(m => validModIds.has(m.moduleId));
    if (filteredMods.length !== modules.length) modules = filteredMods;

    const validAdpIds = new Set(ADAPTER_LIBRARY.filter(a => a.pitch === pitch).map(a => a.id));
    const filteredAdp = adapters.filter(a => validAdpIds.has(a.adapterId));
    if (filteredAdp.length !== adapters.length) adapters = filteredAdp;
  });

  // ── Grid helpers ──
  function getGridSize() {
    const pitch = config.pitch;
    const margin = pitch + 0.5;
    return {
      cols: Math.max(0, Math.floor((config.width - 2 * margin) / pitch + 1)),
      rows: Math.max(0, Math.floor((config.height - 2 * margin) / pitch + 1)),
    };
  }

  // ── Module actions ──
function addModule() {
  if (!selectedModuleId) return;
  const def = MODULE_LIBRARY.find(m => m.id === selectedModuleId);
  if (!def) return;
  const { cols, rows } = getGridSize();
  const col = Math.max(0, Math.floor((cols - def.widthPins) / 2));
  const row = Math.max(0, Math.floor((rows - def.heightPins) / 2));
  modules = [...modules, {
    id: crypto.randomUUID(),
    moduleId: selectedModuleId,
    name: def.name,
      col: Math.max(0, Math.floor((cols - def.widthPins) / 2)),
      row: Math.max(0, Math.floor((rows - def.heightPins) / 2)),
      rotation: 0,
    color: def.color,
  }];
}

  function rotateModule(instanceId) {
    modules = modules.map(m =>
      m.id === instanceId
        ? { ...m, rotation: ((m.rotation || 0) + 1) % 4 }
        : m
    );
  }

  function removeModule(instanceId) {
    modules = modules.filter(m => m.id !== instanceId);
  } 

  // ── Adapter actions ──
  function addAdapter() {
    if (!selectedAdapterId) return;
    const def = ADAPTER_LIBRARY.find(a => a.id === selectedAdapterId);
    if (!def) return;
    const { cols, rows } = getGridSize();
    const col = Math.max(0, Math.floor((cols - def.widthPins) / 2));
    const row = Math.max(0, Math.floor((rows - def.heightPins) / 2));
    adapters = [...adapters, {
      id: crypto.randomUUID(),
      adapterId: selectedAdapterId,
      name: def.name,
      col: Math.max(0, Math.floor((cols - def.widthPins) / 2)),
      row: Math.max(0, Math.floor((rows - def.heightPins) / 2)),
      rotation: 0,
      color: def.color,
    }];
  }

  function rotateAdapter(instanceId) {
    adapters = adapters.map(a =>
      a.id === instanceId
        ? { ...a, rotation: ((a.rotation || 0) + 1) % 4 }
        : a
    );
  }

  function removeAdapter(instanceId) {
    adapters = adapters.filter(a => a.id !== instanceId);
  }

  function clearAll() {
    onSelect(null);
    adapters = [];
    modules = [];
  }
</script>

<div class="module-toolbar">
  <!-- Adapter section -->
  <div class="section-label">⚡ SMD Adapter <span class="section-hint">— included in Gerber export</span></div>
  <div class="toolbar-row">
    <select class="module-select adapter-select" bind:value={selectedAdapterId}>
      <option value="">Select adapter...</option>
      {#each Object.entries(adapterCategories) as [cat, adps]}
        <optgroup label={cat}>
          {#each adps as adp}
            <option value={adp.id}>{adp.name}</option>
          {/each}
        </optgroup>
      {/each}
      {#if Object.keys(adapterCategories).length === 0}
        <option value="" disabled>No adapters for {config.pitch}mm pitch</option>
      {/if}
    </select>
    <button class="place-btn adapter-place-btn" onclick={addAdapter} disabled={!selectedAdapterId}>Place ↓</button>
  </div>

  <!-- Module Preview section -->
  <div class="section-divider"></div>
  <div class="section-label">📐 Module Preview<span class="section-hint">— only for size estimation</span></div>
  <div class="toolbar-row">
    <select class="module-select" bind:value={selectedModuleId}>
      <option value="">Select module...</option>
      {#each Object.entries(moduleCategories) as [cat, mods]}
        <optgroup label={cat}>
          {#each mods as mod}
            <option value={mod.id}>{mod.name}</option>
          {/each}
        </optgroup>
      {/each}
      {#if Object.keys(moduleCategories).length === 0}
        <option value="" disabled>No modules for {config.pitch}mm pitch</option>
      {/if}
    </select>
        <button class="overlay-toggle" onclick={() => showOverlays = !showOverlays} title={showOverlays ? 'Hide overlays' : 'Show overlays'}>
      {#if showOverlays}
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/><path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709z"/><path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06L.646 2.646a.5.5 0 1 1 .708-.708l14 14a.5.5 0 0 1-.708.708z"/></svg>
      {/if}
    </button>
    <button class="place-btn" onclick={addModule} disabled={!selectedModuleId}>Place ↓</button>
  </div>

  <!-- Placed items -->
  {#if modules.length > 0 || adapters.length > 0}
    <div class="section-divider"></div>
    <div class="placing-toolbar">
      <div class="placed-list">
        {#each adapters as inst (inst.id)}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="placed-tag adapter-tag" class:selected={selectedInstanceId === inst.id}
          style="border-color: {selectedInstanceId === inst.id ? '#f9e2af' : inst.color}" role="button" tabindex="0"
          onclick={() => onSelect(selectedInstanceId === inst.id ? null : inst.id)}
          onkeydown={(e) => { if (e.key === 'Enter') onSelect(selectedInstanceId === inst.id ? null : inst.id); }}>
          ⚡ {inst.name}
          <span class="tag-pos">({inst.col},{inst.row})</span>
          <button type="button" class="rotate-btn" onclick={(e) => { e.stopPropagation(); rotateAdapter(inst.id); }} title="Rotate 90°">↻</button>
          <button type="button" class="remove-btn" onclick={(e) => { e.stopPropagation(); removeAdapter(inst.id); }} title="Remove">×</button>
        </div>
      {/each}
      {#each modules as inst (inst.id)}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="placed-tag" class:selected={selectedInstanceId === inst.id}
          style="border-color: {selectedInstanceId === inst.id ? '#89b4fa' : inst.color}" role="button" tabindex="0"
           onclick={() => onSelect(selectedInstanceId === inst.id ? null : inst.id)}
          onkeydown={(e) => { if (e.key === 'Enter') onSelect(selectedInstanceId === inst.id ? null : inst.id); }}>
         {inst.name}
          <span class="tag-pos">({inst.col},{inst.row})</span>
          <button type="button" class="rotate-btn" onclick={(e) => { e.stopPropagation(); rotateModule(inst.id); }} title="Rotate 90°">↻</button>
          <button type="button" class="remove-btn" onclick={(e) => { e.stopPropagation(); removeModule(inst.id); }} title="Remove">×</button>
        </div>
      {/each}   
      </div>
      <div>
        <button class="place-btn clear-btn" onclick={clearAll}>Clear All</button>
      </div>
    </div>
  {/if}

  {#if modules.length > 0}
    <span class="module-hint">⚠ Module overlays are approximate size references only. Verify dimensions before ordering.</span>
  {/if}
</div>

<style>
  .module-toolbar {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px 12px;
    background: #1a1a1a;
    border-radius: 8px;
    font-family: 'Segoe UI', system-ui, sans-serif;
    font-size: 13px;
  }
  
  .section-label {
    font-size: 12px;
    font-weight: 600;
    color: #a6adc8;
    letter-spacing: 0.02em;
  }

  .section-hint {
    font-weight: 400;
    color: #7f849c;
    font-style: italic;
  }

  .section-divider {
    border-top: 1px solid #313244;
    margin: 2px 0;
  }

  .toolbar-row {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }

  .module-select {
    flex: 1;
    min-width: 180px;
    padding: 7px 10px;
    background: #313244;
    border: 1px solid #45475a;
    border-radius: 6px;
    color: #cdd6f4;
    font-size: 13px;
  }
  .module-select:focus { outline: none; border-color: #89b4fa; }

  .adapter-select:focus { border-color: #f9e2af; }

    .overlay-toggle {
    background: none;
    border: 1px solid #45475a;
    border-radius: 4px;
    color: #cdd6f4;
    cursor: pointer;
    padding: 4px 6px;
    display: flex;
    align-items: center;
    opacity: 0.7;
    transition: opacity 0.15s;
  }
  .overlay-toggle:hover { opacity: 1; border-color: #89b4fa; }

  .place-btn {
    padding: 7px 14px;
    background: #89b4fa;
    color: #1e1e2e;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s ease;
    white-space: nowrap;
  }
  .place-btn:hover { background: #74a8f7; }
  .place-btn:disabled {
    background: #585b70;
    color: #45475a;
    cursor: not-allowed;
  }

  .adapter-place-btn {
    background: #f9e2af;
    color: #1e1e2e;
  }
  .adapter-place-btn:hover { background: #f2d68a; }

  .clear-btn {
    background: #e24f4f;
    color: #1e1e2e;
  }
  .clear-btn:hover { background: #e72626; }

  .placing-toolbar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .placed-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .placed-tag {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background: #313244;
    border: 1px solid #45475a;
    border-left-width: 3px;
    border-radius: 4px;
    color: #cdd6f4;
    font-size: 12px;
        cursor: pointer;
    transition: background 0.1s, box-shadow 0.1s;
  }

  .placed-tag:hover {
    background: #3a3a50;
  }
  
  .adapter-tag {
    background: #3a3520;
  }

  .adapter-tag:hover {
    background: #4a4530;
  }

  .placed-tag.selected {
    background: #3a3a6a !important;
    border-color: #89b4fa !important;
    border-left-width: 3px;
    outline: 1px solid #89b4fa;
    outline-offset: 1px;
  }

  .adapter-tag.selected {
    background: #5a5020 !important;
    border-color: #f9e2af !important;
    outline-color: #f9e2af;
  }

  .tag-pos {
    font-size: 10px;
    color: #7f849c;
    font-family: monospace;
  }

    .rotate-btn {
    background: none;
    border: none;
    color: #89b4fa;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    padding: 0 2px;
    line-height: 1;
  }
  .rotate-btn:hover { color: #74a8f7; }

    .module-hint {
    font-size: 11px;
    color: #7f849c;
    font-style: italic;
  }

  .remove-btn {
    background: none;
    border: none;
    color: #f38ba8;
    cursor: pointer;
    font-size: 14px;
    font-weight: bold;
    padding: 0 2px;
    line-height: 1;
  }
  .remove-btn:hover { color: #ff6b8a; }
</style>