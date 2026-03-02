<script>
  import Controls from './components/Controls.svelte';
  import Preview from './components/Preview.svelte';
  import ModuleToolbar from './components/ModuleToolbar.svelte';
  import { generateAllFiles } from './lib/gerber.js';
  import { downloadAsZip } from './lib/zip.js';
  import { ADAPTER_LIBRARY, getRotatedAdapter } from './lib/adapters.js';

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

  async function handleExport() {
    // Attach rotated adapter definitions for Gerber generation
    const resolvedAdapters = adapters.map(inst => ({
      ...inst,
      _adapterDef: getRotatedAdapter(inst.adapterId, inst.rotation || 0),
    }));

    const files = generateAllFiles(config, resolvedAdapters);
    const name = `MacGizmoGrid-${config.width}x${config.height}-${config.pitch}mm.zip`;
    await downloadAsZip(files, name);

    if (typeof gridgenTrack === 'function') gridgenTrack('gerber_export');
  }
</script>

<div class="ppp-app">
  <div class="ppp-header">
    <span class="subtitle">Parametric Prototype PCB Generator</span>
  </div>

  <div class="ppp-layout">
    <aside class="ppp-sidebar">
      <Controls bind:config onExport={handleExport} />
    </aside>
    <main class="ppp-main">
      <ModuleToolbar bind:modules bind:adapters {config} />
      <Preview {config} bind:modules bind:adapters />
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

  @media (max-width: 640px) {
    .ppp-layout {
      grid-template-columns: 1fr;
    }

    .ppp-sidebar {
      position: static;
    }
  }
</style>