<script>
  import Controls from './components/Controls.svelte';
  import Preview from './components/Preview.svelte';
  import ModuleToolbar from './components/ModuleToolbar.svelte';
  import { generateAllFiles } from './lib/gerber.js';
  import { downloadAsZip } from './lib/zip.js';
  import { getAdapterForInstance, registerCustomAdapters } from './lib/adapters.js';
  import { parseProject, serializeProject } from './lib/projectFile.js';
  import { customAdapters } from './lib/customAdapters.svelte.js';
  import { applyPitchProfile } from './lib/gridProfiles.js';

  const defaultConfig = applyPitchProfile({
    width: 50,
    height: 40,
    pitch: 2.54,
    drillDiameter: 1.0,
    annularRing: 0.3,
    padShape: 'circle',
    powerRails: {
      top: true,
      bottom: false,
      left: false,
      right: false,
    },
    mountingHoles: {
      mode: 'none',
      diameter: 3.2,
      edgeDistance: 4.0,
    },
    labels: {
      rows: 0,
      cols: 0,
    },
    signalTracks: [],
    silkLines: [],
  }, 2.54);

  let config = $state(structuredClone(defaultConfig));
  let modules = $state([]);
  let adapters = $state([]);
  let selectedInstanceId = $state(null);  
  let signalTrackDrawMode = $state(false);
  let showAdapterOverlays = $state(true);
  let showModuleOverlays = $state(true);
  let selectedSignalTrackIndex = $state(null);
  let silkLineDrawMode = $state(false);
  let selectedSilkLineIndex = $state(null);
  let pendingPitch = $state(defaultConfig.pitch);

  // Keep plain-JS adapter lookup in sync with the reactive custom list
  $effect(() => { registerCustomAdapters(customAdapters.list); });

  // Reference customAdapters.list so this re-derives when the custom library changes
  let resolvedAdapters = $derived(adapters.map(inst => {
    void customAdapters.list; // reactive dependency
    return { ...inst, _adapterDef: getAdapterForInstance(inst) };
  }));

  function onSelect(id) {
    selectedInstanceId = id;
    if (id !== null) selectedSignalTrackIndex = null;
  }

  async function handleExport() {
    const files = generateAllFiles(config, resolvedAdapters);
    const name = `MacGizmoGrid-${config.width}x${config.height}-${config.pitch}mm.zip`;
    await downloadAsZip(files, name);

    if (typeof gridgenTrack === 'function') gridgenTrack('gerber_export');
  }

  function downloadTextFile(content, filename, mimeType = 'application/json') {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function handleSaveProject() {
    const json = serializeProject({ config, modules, adapters, customAdapterDefs: customAdapters.list });
    const filename = `MacGizmoGrid-${config.width}x${config.height}.gridgen.json`;
    downloadTextFile(json, filename);
  }

  async function handleLoadProject(file) {
    if (!file) return;

    try {
      const text = await file.text();
      const imported = parseProject(text, defaultConfig);

      if (imported.customAdapterDefs.length > 0) {
        customAdapters.add(imported.customAdapterDefs);
        registerCustomAdapters(customAdapters.list); // sync update before adapters are set
      }
      config = imported.config;
      pendingPitch = imported.config.pitch;
      modules = imported.modules;
      adapters = imported.adapters;
      selectedInstanceId = null;
      selectedSignalTrackIndex = null;
      signalTrackDrawMode = false;
      silkLineDrawMode = false;
      selectedSilkLineIndex = null;

      if (imported.isFutureVersion) {
        alert('Projektdatei wurde mit einer neueren Version erstellt. Nicht bekannte Felder wurden ignoriert.');
      }
    } catch (error) {
      console.error(error);
      alert(`Projektdatei konnte nicht geladen werden: ${error?.message || 'Unbekannter Fehler'}`);
    }
  }

  let isFullscreen = $state(false);

  // Sync state with actual browser fullscreen (handles ESC, F11, API calls)
  $effect(() => {
    const onFsChange = () => {
      isFullscreen = !!document.fullscreenElement;
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  });

  // Intercept F11 to use our app-level fullscreen on the #main-app element
  $effect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  function toggleFullscreen() {
    const el = document.getElementById('main-app');
    if (!document.fullscreenElement) {
      el?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  function toggleSignalTrackDrawMode() {
    signalTrackDrawMode = !signalTrackDrawMode;
        if (!signalTrackDrawMode) {
      selectedSignalTrackIndex = null;
    }
  }

  function clearCustomSignalTracks() {
    if (selectedSignalTrackIndex === null) return;

    config = {
      ...config,
      signalTracks: (config.signalTracks || []).filter((_, index) => index !== selectedSignalTrackIndex),
    };
    selectedSignalTrackIndex = null;
    signalTrackDrawMode = false;
  }

  function selectSignalTrack(index) {
    selectedSignalTrackIndex = index;
    selectedInstanceId = null;
  }

  $effect(() => {
    const count = (config.signalTracks || []).length;
    if (selectedSignalTrackIndex !== null && selectedSignalTrackIndex >= count) {
      selectedSignalTrackIndex = null;
    }
  });

  $effect(() => {
    if (selectedInstanceId !== null) {
      selectedSignalTrackIndex = null;
    }
  });

  $effect(() => {
    if (signalTrackDrawMode) {
      selectedSignalTrackIndex = null;
      silkLineDrawMode = false;
    }
  });

  $effect(() => {
    if (silkLineDrawMode) {
      selectedSilkLineIndex = null;
      signalTrackDrawMode = false;
    }
  });

  $effect(() => {
    const count = (config.silkLines || []).length;
    if (selectedSilkLineIndex !== null && selectedSilkLineIndex >= count) {
      selectedSilkLineIndex = null;
    }
  });

  function clearAllCustomSignalTracks() {
    config = {
      ...config,
      signalTracks: [],
    };
    selectedSignalTrackIndex = null;
    signalTrackDrawMode = false;
  }

  function toggleSilkLineDrawMode() {
    silkLineDrawMode = !silkLineDrawMode;
    if (!silkLineDrawMode) {
      selectedSilkLineIndex = null;
    }
  }

  function clearSilkLine() {
    if (selectedSilkLineIndex === null) return;
    config = {
      ...config,
      silkLines: (config.silkLines || []).filter((_, index) => index !== selectedSilkLineIndex),
    };
    selectedSilkLineIndex = null;
    silkLineDrawMode = false;
  }

  function selectSilkLine(index) {
    selectedSilkLineIndex = index;
    selectedInstanceId = null;
    selectedSignalTrackIndex = null;
  }

  function clearAllSilkLines() {
    config = {
      ...config,
      silkLines: [],
    };
    selectedSilkLineIndex = null;
    silkLineDrawMode = false;
  }
  
  $effect(() => {
if (pendingPitch === config.pitch) return;

  const nextPitch = pendingPitch;
    const hasPlacedItems = adapters.length > 0 || modules.length > 0;
    if (hasPlacedItems) {
      const shouldResetPlacedItems = confirm(
        'Changing main grid pitch will remove all placed adapters and modules. Continue?'
      );

      if (!shouldResetPlacedItems) {
        pendingPitch = config.pitch;
        return;
      }
    }

    config = applyPitchProfile({
      ...config,
      signalTracks: [],
      silkLines: [],
    }, nextPitch);

    adapters = [];
    modules = [];
    selectedInstanceId = null;
    signalTrackDrawMode = false;
    selectedSignalTrackIndex = null;
    silkLineDrawMode = false;
    selectedSilkLineIndex = null;
    pendingPitch = config.pitch;
  });
</script>

<div class="ppp-app" id="main-app">
  <div class="ppp-header-row">
    <div class="ppp-header">
      <span class="subtitle">Parametric Prototype PCB Generator</span>      
    </div>
    <button id="fullscreen-toggle" onclick={toggleFullscreen} title={isFullscreen ? 'Leave Fullscreen' : 'Fullscreen'}>
        {#if isFullscreen}
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
      <Controls bind:config bind:pendingPitch onExport={handleExport} onSaveProject={handleSaveProject} onLoadProject={handleLoadProject} {resolvedAdapters} signalTrackDrawMode={signalTrackDrawMode} onToggleSignalTrackDrawMode={toggleSignalTrackDrawMode} onDeleteCustomTracks={clearCustomSignalTracks} {selectedSignalTrackIndex} onDeleteAllCustomTracks={clearAllCustomSignalTracks} {silkLineDrawMode} onToggleSilkLineDrawMode={toggleSilkLineDrawMode} onDeleteSilkLine={clearSilkLine} onDeleteAllSilkLines={clearAllSilkLines} {selectedSilkLineIndex} />
    </aside>
    <main class="ppp-main">
      <ModuleToolbar bind:modules bind:adapters {config} {selectedInstanceId} {onSelect} bind:showAdapterOverlays bind:showModuleOverlays />
      <Preview bind:config bind:modules bind:adapters bind:signalTrackDrawMode {selectedInstanceId} {onSelect} {selectedSignalTrackIndex} onSelectSignalTrack={selectSignalTrack} {showAdapterOverlays} {showModuleOverlays} bind:silkLineDrawMode {selectedSilkLineIndex} onSelectSilkLine={selectSilkLine} />
    </main>
  </div>  
  <div class="ppp-footer">
    <span>MacGizmo GridGen - Parametric Prototype PCB Generator v{__APP_VERSION__} Beta - Powered by macgizmo.com</span>
  </div>
</div>

<style>
  :root {
    isolation: isolate;
    background: #1f1f1f;
  }

  :global(div:fullscreen) {
    width: 100vw !important;
    height: 100vh !important;
    overflow: auto;
  }

  .ppp-app {
    width: 100%;
    padding: 20px;
    font-family: 'Segoe UI', system-ui, sans-serif;
    color: #fcfaf9;
  }

  .ppp-header-row {
    display:flex; 
    flex-direction: row; 
    justify-content:space-between;
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
    max-width: 100vw;
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
    margin-top: 8px;
    padding: 6px 10px;
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

    #fullscreen-toggle { 
      display: none;
    }
  }
</style>
