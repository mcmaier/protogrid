<script>
  import { computeSignalGrid, computeMinSize, BOARD_MIN_WIDTH, BOARD_MAX_WIDTH, BOARD_MIN_HEIGHT, BOARD_MAX_HEIGHT, MOUNT_EDGE_MIN, MOUNT_EDGE_MAX } from '../lib/gerber.js';

  let { config = $bindable(), onExport, onSaveProject, onLoadProject, resolvedAdapters = [], signalTrackDrawMode = $bindable(), onToggleSignalTrackDrawMode = $bindable(), onDeleteCustomTracks, onDeleteAllCustomTracks, selectedSignalTrackIndex = null } = $props();

  let minSize = $derived(computeMinSize(config.pitch, config.powerRails, config.mountingHoles));
  let effMinW = $derived(Math.max(BOARD_MIN_WIDTH, minSize.minWidth));
  let effMinH = $derived(Math.max(BOARD_MIN_HEIGHT, minSize.minHeight));

  let sigGrid = $derived(computeSignalGrid(config, resolvedAdapters));
  let padSize = $derived((config.drillDiameter + config.annularRing * 2).toFixed(2));

  // Text input buffers – decoupled from config so typing isn't interrupted
  let widthText = $state(String(config.width));
  let heightText = $state(String(config.height));
  let edgeDistText = $state(String(config.mountingHoles.edgeDistance));

  // Sync text buffers when config changes externally
  let lastWidth = $state(config.width);
  let lastHeight = $state(config.height);
  let lastEdgeDist = $state(config.mountingHoles.edgeDistance);

  let trackDrawMode = $derived(signalTrackDrawMode);
  let trackDrawModeToggle = $derived(onToggleSignalTrackDrawMode);
  let customTrackCount = $derived((config.signalTracks || []).length);  
  

  $effect(() => {
    if (config.width !== lastWidth) {
      widthText = String(config.width);
      lastWidth = config.width;
    }
    if (config.height !== lastHeight) {
      heightText = String(config.height);
      lastHeight = config.height;
    }
    if (config.mountingHoles.edgeDistance !== lastEdgeDist) {
      edgeDistText = String(config.mountingHoles.edgeDistance);
      lastEdgeDist = config.mountingHoles.edgeDistance;
    }
  });

  // Clamp when rails or mounting holes change
  $effect(() => {
    const cw = clamp(config.width, effMinW, BOARD_MAX_WIDTH);
    const ch = clamp(config.height, effMinH, BOARD_MAX_HEIGHT);
    if (cw !== config.width) config.width = cw;
    if (ch !== config.height) config.height = ch;
  });

  function clamp(val, min, max) {
    return Math.min(max, Math.max(min, val));
  }

  // Slider drives config directly
  function onSliderWidth(e) {
    config.width = +e.target.value;
    widthText = String(config.width);
    lastWidth = config.width;
  }

  function onSliderHeight(e) {
    config.height = +e.target.value;
    heightText = String(config.height);
    lastHeight = config.height;
  }

  function onSliderEdgeDist(e) {
    config.mountingHoles = { ...config.mountingHoles, edgeDistance: +e.target.value };
    edgeDistText = String(config.mountingHoles.edgeDistance);
    lastEdgeDist = config.mountingHoles.edgeDistance;
  }

  // Text input: free typing, commit on blur or Enter
  function commitWidth() {
    const v = parseInt(widthText, 10);
    config.width = isNaN(v) ? effMinW : clamp(v, effMinW, BOARD_MAX_WIDTH);
    widthText = String(config.width);
    lastWidth = config.width;
  }

  function commitHeight() {
    const v = parseInt(heightText, 10);
    config.height = isNaN(v) ? effMinH : clamp(v, effMinH, BOARD_MAX_HEIGHT);
    heightText = String(config.height);
    lastHeight = config.height;
  }

  function commitEdgeDist() {
    const v = parseFloat(edgeDistText);
    const clamped = isNaN(v) ? 4.0 : clamp(v, MOUNT_EDGE_MIN, MOUNT_EDGE_MAX);
    config.mountingHoles = { ...config.mountingHoles, edgeDistance: clamped };
    edgeDistText = String(clamped);
    lastEdgeDist = clamped;
  }

  function onKeydown(e, commitFn) {
    if (e.key === 'Enter') {
      commitFn();
      e.target.blur();
    }
  }

  function toggleRail(side) {
    config.powerRails = {
      ...config.powerRails,
      [side]: !config.powerRails[side],
    };
  }

  function setMountMode(mode) {
    config.mountingHoles = { ...config.mountingHoles, mode };
  }

  function setMountDiameter(e) {
    config.mountingHoles = { ...config.mountingHoles, diameter: +e.target.value };
  }


  function handleProjectFileChange(event) {
    const [file] = event.target.files || [];
    onLoadProject?.(file);
    event.target.value = '';
  }
  const LABEL_STEPS = [0, 1, 2, 5]; // off → every → every 2nd → every 5th

  function cycleLabelStep(which) {
    const current = config.labels[which];
    const idx = LABEL_STEPS.indexOf(current);
    const next = LABEL_STEPS[(idx + 1) % LABEL_STEPS.length];
    config.labels = { ...config.labels, [which]: next };
  }

  function toggleLabels(which) {
    const current = config.labels[which];    
    const next = current ? 0 : 1;
    config.labels = { ...config.labels, [which]: next };
  }

  function labelButtonText(which) {
    const step = config.labels[which];
    const prefix = which === 'rows' ? 'Rows' : 'Cols';
    if (step === 0) return `${prefix}: Off`;
    if (step === 1) return `${prefix}: All`;
    if (step === 2) return `${prefix}: ×2`;
    return `${prefix}: ×${step}`;  
  }
  </script>

<div class="controls">
  <h2>Board Parameters</h2>

  <div class="control-group">
    <div class="slider-field">
      <span class="slider-label">Width (mm)</span>
      <div class="slider-row">
        <input type="range" class="slider"
          min={effMinW} max={BOARD_MAX_WIDTH} step="1"
          value={config.width}
          oninput={onSliderWidth} />
        <input type="text" class="slider-text"
          bind:value={widthText}
          onblur={commitWidth}
          onkeydown={(e) => onKeydown(e, commitWidth)} />
      </div>
    </div>

    <div class="slider-field">
      <span class="slider-label">Height (mm)</span>
      <div class="slider-row">
        <input type="range" class="slider"
          min={effMinH} max={BOARD_MAX_HEIGHT} step="1"
          value={config.height}
          oninput={onSliderHeight} />
        <input type="text" class="slider-text"
          bind:value={heightText}
          onblur={commitHeight}
          onkeydown={(e) => onKeydown(e, commitHeight)} />
      </div>
    </div>
  </div>

  <div class="control-group">
    <label>
      Pitch
      <select bind:value={config.pitch}>
        <option value={2.54}>2.54 mm (Standard)</option>
        <option value={2.00}>2.00 mm</option>
        <option value={1.27}>1.27 mm</option>
      </select>
    </label>
  </div>

  <div class="info">
    <span>Pad Size:<br>{padSize} mm</span>
    <span>Drill Size:<br>{config.drillDiameter.toFixed(2)} mm</span>
    <span>Signal:<br>{sigGrid.cols} × {sigGrid.rows}</span>
    <span>Pads:<br>{sigGrid.total}</span>
  </div>

  {#if sigGrid.total === 0}
    <div class="warning">Board has no signal pads!</div>
  {/if}

  <div class="control-group">
    <h3>Power Rails &amp; Signal Tracks</h3>
    <div class="rail-toggles quad">
      <button class="rail-btn" class:active={config.powerRails.top}
        onclick={() => toggleRail('top')}>Top</button>
      <button class="rail-btn" class:active={config.powerRails.bottom}
        onclick={() => toggleRail('bottom')}>Bottom</button>
      <button class="rail-btn" class:active={config.powerRails.left}
        onclick={() => toggleRail('left')}>Left</button>
      <button class="rail-btn" class:active={config.powerRails.right}
        onclick={() => toggleRail('right')}>Right</button>
    </div>
  </div>

  <div class="control-group">
    <div class="track-actions">
      <button class="rail-btn" class:active={trackDrawMode} onclick={trackDrawModeToggle}>
          {trackDrawMode ? '✏️ Drawing...' : 'Draw Track'}
      </button>
      <button class="rail-btn track-delete-btn" onclick={onDeleteCustomTracks} disabled={selectedSignalTrackIndex === null}>
        Delete Selected
      </button>
      <button class="rail-btn track-delete-btn" onclick={onDeleteAllCustomTracks} disabled={customTrackCount === 0}>
        Delete All ({customTrackCount})
      </button>
    </div>
    {#if trackDrawMode}
      <div class="track-hints">Click start → click end · Right-click to finish chain · ESC to cancel · Ctrl+Z undo</div>
    {/if}
  </div>

  <div class="control-group">
    <h3>Mounting Holes</h3>
    <div class="rail-toggles triple">
      <button class="rail-btn" class:active={config.mountingHoles.mode === 'none'}
        onclick={() => setMountMode('none')}>Off</button>
      <button class="rail-btn" class:active={config.mountingHoles.mode === 'diagonal'}
        onclick={() => setMountMode('diagonal')}>2× Diagonal</button>
      <button class="rail-btn" class:active={config.mountingHoles.mode === '4corners'}
        onclick={() => setMountMode('4corners')}>4× Corners</button>
    </div>

    {#if config.mountingHoles.mode !== 'none'}
      <label>
        Diameter
        <select value={config.mountingHoles.diameter} onchange={setMountDiameter}>
          <option value={2.5}>2.5 mm</option>
          <option value={3.2}>3.2 mm (M3)</option>
          <option value={4.0}>4.0 mm</option>
        </select>
      </label>

      <div class="slider-field">
        <span class="slider-label">Edge Distance (mm)</span>
        <div class="slider-row">
          <input type="range" class="slider"
            min={MOUNT_EDGE_MIN} max={MOUNT_EDGE_MAX} step="0.5"
            value={config.mountingHoles.edgeDistance}
            oninput={onSliderEdgeDist} />
          <input type="text" class="slider-text"
            bind:value={edgeDistText}
            onblur={commitEdgeDist}
            onkeydown={(e) => onKeydown(e, commitEdgeDist)} />
        </div>
      </div>
    {/if}
  </div>

  <div class="control-group">
    <h3>Labels (Silkscreen)</h3>
    <div class="rail-toggles">
      <button class="rail-btn" class:active={config.labels.rows > 0}
        onclick={() => cycleLabelStep('rows')}>{labelButtonText('rows')}</button>
      <button class="rail-btn" class:active={config.labels.cols > 0}
        onclick={() => toggleLabels('cols')}>{labelButtonText('cols')}</button>
    </div>
  </div>

  <div class="project-section">
    <div class="project-actions">
      <button class="secondary-btn" onclick={onSaveProject}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"/>
        </svg> Save</button>
      <label class="secondary-btn file-btn">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-upload" viewBox="0 0 16 16">
          <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"/>
          <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708z"/>
        </svg> Load
        <input type="file" accept=".json,.gridgen.json,application/json" onchange={handleProjectFileChange} />
      </label>
    </div>

    <button class="export-btn" onclick={onExport}>
      Download Gerber ZIP
    </button>

    <div class="download-hint">
      <span>Gerber RS-274X + Excellon Drill</span>
    </div>  
  </div>

  <div class="order-section">
    <h3>How to order the PCB?</h3>
    <span class="order-hint">Go to the manufacturer of your choice<br>& upload your generated Gerber file</span>
  </div>  
</div>

<style>
  .controls {
    display: flex; flex-direction: column; gap: 16px; padding: 20px;
    background: #1f1f1f; border-radius: 12px;
    color: #fcfaf9; font-family: 'Segoe UI', system-ui, sans-serif; font-size: 14px;
  }

  h2 { margin: 0; font-size: 18px; color: #89b4fa; font-weight: 600; }

  h3 {
    margin: 0 0 8px 0; font-size: 13px; color: #a6adc8;
    text-transform: uppercase; letter-spacing: 0.5px;
  }

  .control-group { display: flex; flex-direction: column; gap: 10px; }

  label {
    display: flex; justify-content: space-between;
    align-items: center; gap: 12px;
  }

  select {
    width: 120px; padding: 6px 10px; background: #313244;
    border: 1px solid #45475a; border-radius: 6px;
    color: #cdd6f4; font-size: 14px; text-align: right;
  }
  select:focus { outline: none; border-color: #89b4fa; }

  /* Slider + text combo */
  .slider-field { display: flex; flex-direction: column; gap: 4px; }
  .slider-label { font-size: 13px; color: #a6adc8; }

  .slider-row {
    display: flex; align-items: center; gap: 10px;
  }

  .slider {
    flex: 1; height: 6px; -webkit-appearance: none; appearance: none;
    background: #313244; border-radius: 3px; outline: none;
  }
  .slider::-webkit-slider-thumb {
    -webkit-appearance: none; appearance: none;
    width: 16px; height: 16px; border-radius: 50%;
    background: #89b4fa; cursor: pointer;
    border: 2px solid #1e1e2e;
  }
  .slider::-moz-range-thumb {
    width: 16px; height: 16px; border-radius: 50%;
    background: #89b4fa; cursor: pointer;
    border: 2px solid #1e1e2e;
  }
  .slider::-webkit-slider-runnable-track { height: 6px; border-radius: 3px; }
  .slider::-moz-range-track { height: 6px; border-radius: 3px; background: #313244; }

  .slider-text {
    width: 56px; padding: 4px 6px; background: #313244;
    border: 1px solid #45475a; border-radius: 6px;
    color: #cdd6f4; font-size: 14px; text-align: center;
  }
  .slider-text:focus { outline: none; border-color: #89b4fa; }

  .rail-toggles { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
  .rail-toggles.triple { grid-template-columns: 1fr 1fr 1fr; }
  .rail-toggles.quad { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 6px; }

  .rail-btn {
    padding: 8px; background: #313244; border: 1px solid #45475a;
    border-radius: 6px; color: #a6adc8; cursor: pointer;
    font-size: 13px; transition: all 0.15s ease;
  }
  .rail-btn:hover { background: #45475a; }
  .rail-btn.active { background: #89b4fa22; border-color: #89b4fa; color: #89b4fa; }

  .track-actions {
    display: flex;
    gap: 6px;
    align-items: center;
  }

  .track-actions .rail-btn {
    flex: 1;
  }

  .track-delete-btn {
    flex: 0.7 !important;
    font-size: 11px;
    padding: 6px 8px;
  }

  .track-delete-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .track-hints {
    font-size: 10px;
    color: #a6adc8;
    padding: 2px 0;
    line-height: 1.4;
  }

  .info {
    display: flex; justify-content: space-between;
    padding: 10px 12px; background: #313244;
    border-radius: 6px; font-size: 12px; color: #9ba3c5;
  }

  .warning {
    padding: 8px 12px; background: #f38ba822; border: 1px solid #f38ba8;
    border-radius: 6px; font-size: 12px; color: #f38ba8;
  }

  .export-btn {
    padding: 12px; background: #f8c000; color: #1e1e2e;
    border: none; border-radius: 8px;
    font-size: 15px; font-weight: 600; cursor: pointer;
    transition: background 0.15s ease;
  }
  .export-btn:hover { background: #c49800; }
  .export-btn:disabled { background: #585b70; cursor: not-allowed; }

  .project-section {
    display: flex; flex-direction: column; gap: 8px;
    padding-top: 12px;
    border-top: 1px solid #45475a;
  }

  .project-actions {
    display: flex;
    gap: 8px;
    margin-top: 8px;
  }

  .secondary-btn {
    flex: 1;
    border: 1px solid #6c7086;
    background: #313244;
    color: #cdd6f4;
    border-radius: 6px;
    padding: 8px 10px;
    font-size: 12px;
    cursor: pointer;
    text-align: center;
  }

  .secondary-btn:hover {
    background: #3b3f58;
  }

  .file-btn {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }

  .file-btn input {
    display: none;
  }

  .download-hint {
    padding: 4px;
    text-align: left;
    font-size: 14px;
    color: #6c9fb2;
  }
  
  /* --- Order PCB Section --- */
  .order-section {
    display: flex; flex-direction: column; gap: 8px;
    padding-top: 12px;
    border-top: 1px solid #45475a;
  }

  .order-hint {
    font-size: 12px;
    color: #6c9fb2;
  }
</style>
