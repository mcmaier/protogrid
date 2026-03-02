<script>
  import { MODULE_LIBRARY } from '../lib/modules.js';
    import { ADAPTER_LIBRARY } from '../lib/adapters.js';

  let { modules = $bindable(), adapters = $bindable(), config } = $props();
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
    <button class="place-btn" onclick={addModule} disabled={!selectedModuleId}>Place ↓</button>
  </div>

  <!-- Placed items -->
  {#if modules.length > 0 || adapters.length > 0}
    <div class="section-divider"></div>
    <div class="placing-toolbar">
      <div class="placed-list">
        {#each adapters as inst (inst.id)}
          <span class="placed-tag adapter-tag" style="border-color: {inst.color}">
            ⚡ {inst.name}
            <button class="rotate-btn" onclick={() => rotateAdapter(inst.id)} title="Rotate 90°">↻</button>
            <button class="remove-btn" onclick={() => removeAdapter(inst.id)} title="Remove">×</button>
          </span>
        {/each}
        {#each modules as inst (inst.id)}
          <span class="placed-tag" style="border-color: {inst.color}">
            {inst.name}
            <button class="rotate-btn" onclick={() => rotateModule(inst.id)} title="Rotate 90°">↻</button>
            <button class="remove-btn" onclick={() => removeModule(inst.id)} title="Remove">×</button>
          </span>
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
  }
  
  .adapter-tag {
    background: #3a3520;
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