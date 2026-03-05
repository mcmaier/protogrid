<script>
  import { writable } from 'svelte/store';
  import Controls from './components/Controls.svelte';
  import Preview from './components/Preview.svelte';
  import ModuleToolbar from './components/ModuleToolbar.svelte';
  import { generateAllFiles } from './lib/gerber.js';
  import { downloadAsZip } from './lib/zip.js';
  import { getRotatedAdapter } from './lib/adapters.js';
  import { fullscreen } from './lib/fullscreen.js';

  let config = $state({
    width: 50,
    height: 40,
    pitch: 2.54,
    padDiameter: 1.0,
    annularRing: 0.3,
    powerRails: {
      top: true,
      bottom: false,
      left: false,
      right: false,
    },
    mountingHoles: {
      mode: 'none',       // 'none' | 'diagonal' | '4corners'
      diameter: 3.2,       // mm
      edgeDistance: 4.0,    // mm from board edge
    },
    labels: {
      rows: 0,          // row numbers on left
      cols: 0,          // column letters on top
    },
  });

  let modules = $state([]);
  let adapters = $state([]);
  let selectedInstanceId = $state(null);

  let resolvedAdapters = $derived(adapters.map(inst => ({
    ...inst,
    _adapterDef: getRotatedAdapter(inst.adapterId, inst.rotation || 0),
  })));

  function onSelect(id) {
    selectedInstanceId = id;
  }

  async function handleExport() {
    const files = generateAllFiles(config, resolvedAdapters);
    const name = `MacGizmoGrid-${config.width}x${config.height}-${config.pitch}mm.zip`;
    await downloadAsZip(files, name);

    if (typeof gridgenTrack === 'function') gridgenTrack('gerber_export');
  }

  const fullscreenStore = writable(false);
  
  function toggleFullscreen(node) {
    if (!$fullscreenStore) {
      node.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    fullscreenStore.update(v => !v);
  }
</script>

<div use:fullscreen={{toggle: toggleFullscreen}} class="ppp-app" id="main-app">
<div style="display:flex; flex-direction: row; justify-content:space-between;">
  <div class="ppp-header">
    <span class="subtitle">Parametric Prototype PCB Generator</span>      
  </div>
  <button id="fullscreen-toggle" onclick={() => toggleFullscreen(document.getElementById("main-app"))} title={$fullscreenStore ? 'Vollbild verlassen' : 'Vollbild'}>
      {#if $fullscreenStore}
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="1f1f1f" class="bi bi-fullscreen-exit" viewBox="0 0 16 16">
          <path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5m5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5M0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5m10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0z"/>
          <!-- Exit Path --></svg>
      {:else}
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="1f1f1f" class="bi bi-fullscreen" viewBox="0 0 16 16">
          <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5M.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5"/>
        <!-- Enter Path --></svg>
      {/if}
  </button>
  </div>

  <div class="ppp-layout">
    <aside class="ppp-sidebar">
      <Controls bind:config onExport={handleExport} {resolvedAdapters} />
    </aside>
    <main class="ppp-main">
      <ModuleToolbar bind:modules bind:adapters {config} {selectedInstanceId} {onSelect} />
      <Preview {config} bind:modules bind:adapters {selectedInstanceId} {onSelect} />
    </main>
  </div>

  <div class="ppp-footer">
    <span>MacGizmo GridGen - Parametric Prototype PCB Generator v{__APP_VERSION__} Beta - Powered by macgizmo.com</span>
  </div>
</div>

<style>
  :root {
    background: #1f1f1f;
  }

  :global(div:fullscreen) {
    width: 100vw !important;
    height: 100vh !important;
  }

  .ppp-app {
    width: 100%;
    padding: 20px;
    font-family: 'Segoe UI', system-ui, sans-serif;
    color: #fcfaf9;    
  }

  .ppp-header {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
    margin-bottom: 16px;
  }

  .subtitle {
    font-size: 16px;
    color: #fcfaf9;
  }
  
  .ppp-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 20px;
    align-items: start;
  }

  .ppp-sidebar {
    position: sticky;
    top: 20px;
  }

  .ppp-main {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-height: 300px;   
    max-width: 100vw; 
  }

  .ppp-footer {
    margin-top: 16px;
    padding: 10px;
    text-align: left;
    font-size: 12px;
    color: #6c9fb2;
  }

  #fullscreen-toggle {
    margin: 5px;
    padding: 5px;
    background: #f8c000;
    align-items: center;
    align-content: center;
    justify-content: center;
    border-radius: 5px;

  }

  @media (max-width: 640px) {
    .ppp-layout {
      grid-template-columns: 1fr;
    }

    .ppp-sidebar {
      position: static;
    }
  }
</style>