<script>
  import { MODULE_LIBRARY } from '../lib/modules.js';
  import { ADAPTER_LIBRARY, VARIABLE_SUBGRID_ADAPTER_ID, cycleVariableSubgridPitch, cycleVariableSubgridPadShape, isAdapterCompatibleWithPitch, getVariableSubgridPitches } from '../lib/adapters.js';
  import { getPitchProfile } from '../lib/gridProfiles.js';

  let { modules = $bindable(), adapters = $bindable(), config, selectedInstanceId, onSelect, showModuleOverlays = $bindable(), showAdapterOverlays = $bindable() } = $props();
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
    const matching = ADAPTER_LIBRARY.filter(a => isAdapterCompatibleWithPitch(a, config.pitch));
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
      if (def && !isAdapterCompatibleWithPitch(def, config.pitch)) selectedAdapterId = '';
    }
  });

  // Remove placed items that don't match the new pitch
  $effect(() => {
    const pitch = config.pitch;
    const validModIds = new Set(MODULE_LIBRARY.filter(m => m.pitch === pitch).map(m => m.id));
    const filteredMods = modules.filter(m => validModIds.has(m.moduleId));
    if (filteredMods.length !== modules.length) modules = filteredMods;

    const validAdpIds = new Set(ADAPTER_LIBRARY.filter(a => isAdapterCompatibleWithPitch(a, pitch)).map(a => a.id));
    const filteredAdp = adapters
      .filter(a => validAdpIds.has(a.adapterId))
      .map(a => {
        if (a.adapterId !== VARIABLE_SUBGRID_ADAPTER_ID) return a;
        const pitches = getVariableSubgridPitches(pitch);
        const nextPitch = pitches.some(p => Math.abs(p - Number(a.subGridPitch)) < 0.0001)
          ? Number(a.subGridPitch)
          : pitches[0];
        const profile = getPitchProfile(nextPitch);
        return {
          ...a,
          pitch,
          subGridPitch: nextPitch,
          subPadSize: profile.padSize,
          subGridDrill: profile.drillSize,
          subPadShape: a.subPadShape === 'circle' ? 'circle' : 'square',
        };
      });
    if (JSON.stringify(filteredAdp) !== JSON.stringify(adapters)) adapters = filteredAdp;
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
    if (selectedInstanceId === instanceId) onSelect(null);
  }

  // ── Adapter actions ──
  function addAdapter() {
    if (!selectedAdapterId) return;
    const def = ADAPTER_LIBRARY.find(a => a.id === selectedAdapterId);
    if (!def) return;
    const { cols, rows } = getGridSize();
    const isVariableSubGrid = def.id === VARIABLE_SUBGRID_ADAPTER_ID;
    const widthPins = isVariableSubGrid ? 4 : def.widthPins;
    const heightPins = isVariableSubGrid ? 4 : def.heightPins;
    const subGridPitch = isVariableSubGrid ? (getVariableSubgridPitches(config.pitch)[0] || 2.0) : undefined;
    const subProfile = isVariableSubGrid ? getPitchProfile(subGridPitch) : null;
    const subPadSize = subProfile?.padSize;
    const subGridDrill = subProfile?.drillSize;

    adapters = [...adapters, {
      id: crypto.randomUUID(),
      adapterId: selectedAdapterId,
      name: def.name,
      col: Math.max(0, Math.floor((cols - widthPins) / 2)),
      row: Math.max(0, Math.floor((rows - heightPins) / 2)),
      rotation: 0,
      color: def.color,
      ...(isVariableSubGrid ? { widthPins, heightPins, pitch: config.pitch, subGridPitch, subPadSize, subGridDrill, subPadShape: 'square' } : {}),
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
    if (selectedInstanceId === instanceId) onSelect(null);
  }

  function changeAdapterGrid(instanceId) {
    adapters = adapters.map(a =>
      a.id === instanceId
        ? cycleVariableSubgridPitch(a)
        : a
    );
  }

  function changeAdapterPadShape(instanceId) {
    adapters = adapters.map(a =>
      a.id === instanceId
        ? cycleVariableSubgridPadShape(a)
        : a
    );
  }

  function clearAll() {
    onSelect(null);
    adapters = [];
    modules = [];
  }
</script>

<div class="toolbar">
  <!-- Adapter row -->
  <div class="add-row">
    <span class="row-icon" title="SMD Adapters — included in Gerber export">⚡</span>
      <button class="icon-btn" class:off={!showAdapterOverlays} onclick={() => showAdapterOverlays = !showAdapterOverlays}
      title={showAdapterOverlays ? 'Hide adapter overlays' : 'Show adapter overlays'}>
      {#if showAdapterOverlays}
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/><path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709z"/><path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06L.646 2.646a.5.5 0 1 1 .708-.708l14 14a.5.5 0 0 1-.708.708z"/></svg>
      {/if}
    </button>
    <button class="add-btn adapter-accent" onclick={addAdapter} disabled={!selectedAdapterId} title="Place adapter">+</button>
    <select class="item-select adapter-accent" bind:value={selectedAdapterId}>
      <option value="">Adapter...</option>
      {#each Object.entries(adapterCategories) as [cat, adps]}
        <optgroup label={cat}>
          {#each adps as adp}
            <option value={adp.id}>{adp.name}</option>
          {/each}
        </optgroup>
      {/each}
      {#if Object.keys(adapterCategories).length === 0}
        <option value="" disabled>No adapters ({config.pitch}mm)</option>
      {/if}
    </select>

  </div>

  <!-- Module row -->
  <div class="add-row">
    <span class="row-icon" title="Module Preview — size reference only">📐</span>
    <button class="icon-btn" class:off={!showModuleOverlays} onclick={() => showModuleOverlays = !showModuleOverlays}
      title={showModuleOverlays ? 'Hide module overlays' : 'Show module overlays'}>
      {#if showModuleOverlays}
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/><path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/></svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/><path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/><path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709z"/><path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06L.646 2.646a.5.5 0 1 1 .708-.708l14 14a.5.5 0 0 1-.708.708z"/></svg>
      {/if}

    </button>
    <button class="add-btn module-accent" onclick={addModule} disabled={!selectedModuleId} title="Place module">+</button>
    <select class="item-select module-accent" bind:value={selectedModuleId}>
      <option value="">Module...</option>
      {#each Object.entries(moduleCategories) as [cat, mods]}
        <optgroup label={cat}>
          {#each mods as mod}
            <option value={mod.id}>{mod.name}</option>
          {/each}
        </optgroup>
      {/each}
      {#if Object.keys(moduleCategories).length === 0}
        <option value="" disabled>No modules ({config.pitch}mm)</option>
      {/if}
    </select>
    
  </div>

  <!-- Placed items as compact chips -->
  {#if adapters.length > 0 || modules.length > 0}
    <div class="placed-items">
      {#each adapters as inst (inst.id)}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="chip adapter-chip" class:selected={selectedInstanceId === inst.id}
          onclick={() => onSelect(selectedInstanceId === inst.id ? null : inst.id)}
          onkeydown={(e) => { if (e.key === 'Enter') onSelect(selectedInstanceId === inst.id ? null : inst.id); }}
          role="button" tabindex="0">
          <span class="chip-name">⚡{inst.name}</span>
           {#if inst.adapterId === VARIABLE_SUBGRID_ADAPTER_ID}            
            <button class="chip-action" onclick={(e) => { e.stopPropagation(); changeAdapterGrid(inst.id); }} title="Change Sub-Grid Pitch (Space)">#</button>
            <button class="chip-action" onclick={(e) => { e.stopPropagation(); changeAdapterPadShape(inst.id); }} title="Toggle Pad Shape (Shift+Space)">{inst.subPadShape === 'circle' ? '●' : '■'}</button>
            {:else}
            <button class="chip-action" onclick={(e) => { e.stopPropagation(); rotateAdapter(inst.id); }} title="Rotate (Space)">↻</button>
          {/if}          
          <button class="chip-action chip-remove" onclick={(e) => { e.stopPropagation(); removeAdapter(inst.id); }} title="Remove (Del)">×</button>
        </div>
      {/each}
      {#each modules as inst (inst.id)}
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="chip module-chip" class:selected={selectedInstanceId === inst.id}
          onclick={() => onSelect(selectedInstanceId === inst.id ? null : inst.id)}
          onkeydown={(e) => { if (e.key === 'Enter') onSelect(selectedInstanceId === inst.id ? null : inst.id); }}
          role="button" tabindex="0">
          <span class="chip-name">{inst.name}</span>
          <button class="chip-action" onclick={(e) => { e.stopPropagation(); rotateModule(inst.id); }} title="Rotate (Space)">↻</button>
          <button class="chip-action chip-remove" onclick={(e) => { e.stopPropagation(); removeModule(inst.id); }} title="Remove (Del)">×</button>
        </div>
      {/each}
      {#if adapters.length + modules.length > 1}
        <button class="chip chip-clear" onclick={clearAll} title="Remove all">Clear all</button>
      {/if}
    </div>
  {/if}
</div>

<style>
  .toolbar {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 6px 8px;
    background: #1a1a1a;
    border-radius: 6px;
    font-family: 'Segoe UI', system-ui, sans-serif;
    font-size: 12px;
  }

  .add-row {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .row-icon {
    font-size: 13px;
    width: 20px;
    text-align: center;
    flex-shrink: 0;
    cursor: help;
  }

  .item-select {
    flex: 1;
    min-width: 0;
    padding: 5px 6px;
    background: #313244;
    border: 1px solid #45475a;
    border-radius: 4px;
    color: #cdd6f4;
    font-size: 12px;
  }
  .item-select:focus { outline: none; }
  .item-select.adapter-accent:focus { border-color: #f9e2af; }
  .item-select.module-accent:focus { border-color: #89b4fa; }

  .icon-btn {
    background: none;
    color: #f1f1f1;
    border: 1px solid transparent;
    border-radius: 3px;
    cursor: pointer;
    padding: 2px 4px;
    font-size: 13px;
    line-height: 1;
    opacity: 0.8;
    transition: opacity 0.1s;
  }
  .icon-btn:hover { opacity: 1; }
  .icon-btn.off { opacity: 0.35; }

  .add-btn {
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: background 0.1s;
  }
  .add-btn.adapter-accent { background: #f9e2af; color: #1e1e2e; }
  .add-btn.adapter-accent:hover { background: #f2d68a; }
  .add-btn.module-accent { background: #89b4fa; color: #1e1e2e; }
  .add-btn.module-accent:hover { background: #74a8f7; }
  .add-btn:disabled { background: #45475a; color: #585b70; cursor: not-allowed; }

  .placed-items {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
    padding-top: 4px;
    border-top: 1px solid #313244;
  }

  .chip {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    padding: 2px 5px;
    background: #313244;
    border: 1px solid #45475a;
    border-radius: 3px;
    color: #cdd6f4;
    font-size: 11px;
    cursor: pointer;
    transition: background 0.1s;
    line-height: 1.3;
  }
  .chip:hover { background: #3a3a50; }

  .adapter-chip { border-left: 2px solid #f9e2af; }
  .module-chip { border-left: 2px solid #89b4fa; }

  .chip.selected { background: #3a3a6a; border-color: #89b4fa; outline: 1px solid #89b4fa; outline-offset: 0px; }
  .adapter-chip.selected { background: #4a4520; border-color: #f9e2af; outline-color: #f9e2af; }

  .chip-name {
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .chip-action {
    background: none;
    border: none;
    color: #89b4fa;
    cursor: pointer;
    font-size: 12px;
    padding: 0 1px;
    line-height: 1;
    opacity: 0.7;
  }
  .chip-action:hover { opacity: 1; }
  .chip-remove { color: #f38ba8; }

  .chip-clear {
    background: none;
    border: 1px dashed #585b70;
    color: #7f849c;
    font-size: 10px;
  }
  .chip-clear:hover { border-color: #f38ba8; color: #f38ba8; }
</style>