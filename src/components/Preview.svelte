<script>
  import { computeGrid, generatePadPositions, generatePowerRailTraces, generateSignalTraces, computeMountingHoles, generateLabelStrokes, RAIL_TRACE_WIDTH, MOUNT_KEEPOUT_MARGIN, isInKeepout } from '../lib/gerber.js';
  import { getRotatedModule } from '../lib/modules.js';
  import { getRotatedAdapter } from '../lib/adapters.js';
  import { getTextStrokes } from '../lib/font.js';
  
  let { config, modules = $bindable(), adapters = $bindable(), selectedInstanceId, onSelect, signalTrackDrawMode = false } = $props();

  let fullConfig = $derived({
    ...config,
  });

  // Resolve adapter definitions with rotation applied
  let resolvedAdapters = $derived(adapters.map(inst => ({
    ...inst,
    _adapterDef: getRotatedAdapter(inst.adapterId, inst.rotation || 0),
  })));

  let pads = $derived(generatePadPositions(fullConfig, resolvedAdapters));
  let traces = $derived(generatePowerRailTraces(fullConfig, resolvedAdapters));
  let signalTraces = $derived(generateSignalTraces(fullConfig));
  let mountHoles = $derived(computeMountingHoles(fullConfig));
  let labelStrokes = $derived(generateLabelStrokes(fullConfig));
  let grid = $derived(computeGrid(fullConfig));
  
  // Detect adapter overlap and out-of-bounds issues
  let adapterConflicts = $derived.by(() => {
    const conflicts = new Set(); // adapter instance IDs with problems
    const occupied = new Map();  // "col,row" → adapter instance ID
    const holes = mountHoles;
    const pitch = config.pitch;

    for (const inst of adapters) {
      const def = getRotatedAdapter(inst.adapterId, inst.rotation || 0);
      if (!def) continue;

      for (let c = 0; c < def.widthPins; c++) {
        for (let r = 0; r < def.heightPins; r++) {
          const gc = inst.col + c;
          const gr = inst.row + r;

          // Out of grid bounds?
          if (gc < 0 || gc >= grid.cols || gr < 0 || gr >= grid.rows) {
            conflicts.add(inst.id);
            continue;
          }

          // Overlaps mounting hole keepout?
          if (holes.length > 0) {
            const px = grid.gridLeft + gc * pitch;
            const py = grid.gridBottom + gr * pitch;
            if (isInKeepout(px, py, holes)) {
              conflicts.add(inst.id);
            }
          }

          const key = `${gc},${gr}`;
          if (occupied.has(key)) {
            conflicts.add(inst.id);
            conflicts.add(occupied.get(key));
          } else {
            occupied.set(key, inst.id);
          }
        }
      }
    }
    return conflicts;
  });

  // Add padding around board
  let labelPad = 3;

  // Zoom & pan state
  let zoomLevel = $state(1); // 1 = fit whole board, >1 = zoomed in
  let panX = $state(0); // pan offset in board-mm
  let panY = $state(0);
  let isPanning = $state(false);
  let panStartPt = $state(null);

  // Compute viewBox based on zoom and pan
  let viewBox = $derived.by(() => {
    const fullW = config.width + labelPad * 2;
    const fullH = config.height + labelPad * 2;
    const w = fullW / zoomLevel;
    const h = fullH / zoomLevel;
    // Center the view, then apply pan offset
    const x = -labelPad + (fullW - w) / 2 - panX;
    const y = -labelPad + (fullH - h) / 2 - panY;
    return `${x} ${y} ${w} ${h}`;
  });

  const colors = {
    board: '#1a5c1a',
    boardStroke: '#0d3d0d',
    pad: '#c8a84e',
    padHole: '#1a1a1a',
    vcc: '#cc3333',
    gnd: '#3333cc',
    signal: '#c8a84e',
    mountRing: '#888888',
    mountHole: '#1a1a1a',
    keepout: '#0d3d0d',
    silkscreen: '#e8e8e8',
  };

  let copperDia = $derived(fullConfig.padDiameter + fullConfig.annularRing * 2);

  // Convert polyline to SVG path "d" string
  function polyToPath(polyline) {
    if (polyline.length < 2) return '';
    let d = `M${polyline[0].x},${polyline[0].y}`;
    for (let i = 1; i < polyline.length; i++) {
      d += `L${polyline[i].x},${polyline[i].y}`;
    }
    return d;
  }

  
  // ── Module rendering helpers ──

  /** Convert module grid position to board mm coordinates */
  function moduleToMm(inst) {
    const rm = getRotatedModule(inst.moduleId, inst.rotation || 0);
    if (!rm) return null;
    const pitch = config.pitch;
    const x = grid.gridLeft + (inst.col || 0) * pitch;
    const y = grid.gridBottom + (inst.row || 0) * pitch;
    if (isNaN(x) || isNaN(y)) return null;
    return { x, y, rm, pitch };
  }

    /** Convert adapter grid position to board mm and get its features */
  function adapterToMm(inst) {
    const def = getRotatedAdapter(inst.adapterId, inst.rotation || 0);
    if (!def) return null;
    const pitch = config.pitch;
    const x = grid.gridLeft + (inst.col || 0) * pitch;
    const y = grid.gridBottom + (inst.row || 0) * pitch;
    if (isNaN(x) || isNaN(y)) return null;
    return { x, y, def, pitch };
  }

  // ── Drag handling (supports both modules and adapters) ──
  let svgEl = $state(null);
  let dragging = $state(null); // { instanceId, kind: 'module'|'adapter', startCol, startRow, startX, startY }

  function getSvgPoint(e) {
    if (!svgEl) return { x: 0, y: 0 };
    const pt = svgEl.createSVGPoint();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svgEl.getScreenCTM().inverse();
    const svgPt = pt.matrixTransform(ctm);
    // Undo the Y-flip: SVG has scale(1,-1) translate(0,-height)
    return { x: svgPt.x, y: config.height - svgPt.y };
  }

    // Block browser scroll/zoom while dragging
  function onTouchMove(e) {
    if (dragging) e.preventDefault();
  }

  function onItemPointerDown(e, inst, kind) {
    e.preventDefault();
    e.stopPropagation();
    onSelect(inst.id);
    const pt = getSvgPoint(e);
    dragging = {
      instanceId: inst.id,
      kind,
      startCol: inst.col,
      startRow: inst.row,
      startX: pt.x,
      startY: pt.y,
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
  }

  function onPointerMove(e) {
    if (!dragging) return;
    const pt = getSvgPoint(e);
    const pitch = config.pitch;
    const dCols = Math.round((pt.x - dragging.startX) / pitch);
    const dRows = Math.round((pt.y - dragging.startY) / pitch);
    
    let newCol = dragging.startCol + dCols;
    let newRow = dragging.startRow + dRows;

    // Clamp adapters to grid bounds
    if (dragging.kind === 'adapter') {
      const inst = adapters.find(a => a.id === dragging.instanceId);
      const def = inst && getRotatedAdapter(inst.adapterId, inst.rotation || 0);
      if (def) {
        const { cols, rows } = grid;
        newCol = Math.max(0, Math.min(newCol, cols - def.widthPins));
        newRow = Math.max(0, Math.min(newRow, rows - def.heightPins));
      }
    }

    if (dragging.kind === 'module') {
      modules = modules.map(m =>
        m.id === dragging.instanceId
          ? { ...m, col: newCol, row: newRow }
          : m
      );
    } else {
      adapters = adapters.map(a =>
        a.id === dragging.instanceId
          ? { ...a, col: newCol, row: newRow }
          : a
      );
    }
  }

  function onPointerUp() {
    dragging = null;
    isPanning = false;
    panStartPt = null;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('touchmove', onTouchMove);
  }

  function onPreviewWheel(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.15 : 0.15;
    zoomLevel = Math.max(1, Math.min(10, zoomLevel + delta * zoomLevel));
  }

  function snapToGridPoint(e) {
    const pt = getSvgPoint(e);
    const col = Math.round((pt.x - grid.gridLeft) / config.pitch);
    const row = Math.round((pt.y - grid.gridBottom) / config.pitch);
    if (col < 0 || col >= grid.cols || row < 0 || row >= grid.rows) return null;
    return { col, row };
  }

  function projectTrackEnd(start, point) {
    const dc = Math.abs(point.col - start.col);
    const dr = Math.abs(point.row - start.row);
    return dc >= dr
      ? { col: point.col, row: start.row }
      : { col: start.col, row: point.row };
  }

  function onPreviewPointerDown(e) {
    if (signalTrackDrawMode && e.button === 0 && !e.ctrlKey && !dragging) {
      const snapped = snapToGridPoint(e);
      if (snapped) {
        e.preventDefault();
        e.stopPropagation();
        onSelect(null);

        if (!signalTrackStart) {
          signalTrackStart = snapped;
          signalTrackHover = snapped;
        } else {
          const end = projectTrackEnd(signalTrackStart, snapped);
          if (end.col !== signalTrackStart.col || end.row !== signalTrackStart.row) {
            config.signalTracks = [
              ...(config.signalTracks || []),
              {
                startCol: signalTrackStart.col,
                startRow: signalTrackStart.row,
                endCol: end.col,
                endRow: end.row,
              },
            ];
          }
          signalTrackStart = null;
          signalTrackHover = null;
        }
        return;
      }
    }

    // Middle mouse button or Ctrl+Left for panning the view
    if (e.button === 1 || (e.button === 0 && e.ctrlKey)) {
      e.preventDefault();
      isPanning = true;
      panStartPt = { x: e.clientX, y: e.clientY, panX, panY };
      window.addEventListener('pointermove', onPanMove);
      window.addEventListener('pointerup', onPanUp);
    } else if (e.button === 0 && !e.ctrlKey) {
      // Only deselect when clicking on the SVG itself or the board rect,
      // not when clicking on adapter/module overlays (those handle their own selection)
      const isBackground = e.target === svgEl || e.target.closest('.module-overlay, .adapter-overlay') === null;
      if (isBackground) {
        onSelect(null);
      }
    }
  }

  function onPanMove(e) {
    if (!isPanning || !panStartPt || !svgEl) return;
    const rect = svgEl.getBoundingClientRect();
    const fullW = config.width + labelPad * 2;
    const fullH = config.height + labelPad * 2;
    // Convert pixel delta to board-mm delta
    const scaleX = (fullW / zoomLevel) / rect.width;
    const scaleY = (fullH / zoomLevel) / rect.height;
    panX = panStartPt.panX + (e.clientX - panStartPt.x) * scaleX;
    panY = panStartPt.panY + (e.clientY - panStartPt.y) * scaleY;
  }

  function onPanUp() {
    isPanning = false;
    panStartPt = null;
    window.removeEventListener('pointermove', onPanMove);
    window.removeEventListener('pointerup', onPanUp);
  }

    function resetView() {
    zoomLevel = 1;
    panX = 0;    
    panY = 0;
  }

  // ── Touch gestures for mobile (2-finger pan + pinch zoom) ──
  let touchState = $state(null); // { startTouches, startPanX, startPanY, startZoom }
  let signalTrackStart = $state(null);
  let signalTrackHover = $state(null);

  $effect(() => {
    if (!signalTrackDrawMode) {
      signalTrackStart = null;
      signalTrackHover = null;
    }
  });

  function onPreviewPointerMove(e) {
    if (!signalTrackDrawMode || !signalTrackStart) return;
    const snapped = snapToGridPoint(e);
    signalTrackHover = snapped ? projectTrackEnd(signalTrackStart, snapped) : null;
  }

  function getTouchCenter(touches) {
    const t0 = touches[0], t1 = touches[1];
    return { x: (t0.clientX + t1.clientX) / 2, y: (t0.clientY + t1.clientY) / 2 };
  }

  function getTouchDist(touches) {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function onPreviewTouchStart(e) {
    if (e.touches.length === 2) {
      e.preventDefault();
      touchState = {
        startDist: getTouchDist(e.touches),
        startCenter: getTouchCenter(e.touches),
        startPanX: panX,
        startPanY: panY,
        startZoom: zoomLevel,
      };
    }
  }

  function onPreviewTouchMove(e) {
    if (e.touches.length === 2 && touchState) {
      e.preventDefault();
      const rect = svgEl?.getBoundingClientRect();
      if (!rect) return;

      const fullW = config.width + labelPad * 2;
      const fullH = config.height + labelPad * 2;
      const scaleX = (fullW / zoomLevel) / rect.width;
      const scaleY = (fullH / zoomLevel) / rect.height;

      // Pinch zoom
      const newDist = getTouchDist(e.touches);
      const zoomDelta = newDist / touchState.startDist;
      zoomLevel = Math.max(1, Math.min(10, touchState.startZoom * zoomDelta));

      // Two-finger pan
      const newCenter = getTouchCenter(e.touches);
      const dx = newCenter.x - touchState.startCenter.x;
      const dy = newCenter.y - touchState.startCenter.y;
      panX = touchState.startPanX + dx * scaleX;
      panY = touchState.startPanY + dy * scaleY;
    }
  }

  function onPreviewTouchEnd(e) {
    if (e.touches.length < 2) {
      touchState = null;
    }
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="preview-container" style="position: relative;">
  <svg
  bind:this={svgEl}
  viewBox={viewBox}
  xmlns="http://www.w3.org/2000/svg"
  class="pcb-preview"
  class:has-modules={modules.length > 0 || adapters.length > 0}
  onwheel={onPreviewWheel}
  onpointerdown={onPreviewPointerDown}
  onpointermove={onPreviewPointerMove}
  ontouchstart={onPreviewTouchStart}
  ontouchmove={onPreviewTouchMove}
  ontouchend={onPreviewTouchEnd}
>
  <!-- Flip Y axis: Gerber Y=0 is bottom, SVG Y=0 is top -->
  <g transform="scale(1,-1) translate(0,{-config.height})">
  <!-- PCB Board -->
  <rect
    x="0" y="0"
    width={config.width}
    height={config.height}
    fill={colors.board}
    stroke={colors.boardStroke}
    stroke-width="0.2"
    rx="0.3"
  />

  <!-- Mounting hole keepout zones (darker area, no copper) -->
  {#each mountHoles as hole}
    <circle
      cx={hole.x}
      cy={hole.y}
      r={hole.keepout / 2}
      fill={colors.keepout}
      opacity="0.7"
    />
  {/each}

  {#each signalTraces as t}
    <line
      x1={t.x1} y1={t.y1}
      x2={t.x2} y2={t.y2}
      stroke={colors.signal}
      stroke-width={RAIL_TRACE_WIDTH}
      stroke-linecap="round"
      opacity="0.85"
    />
  {/each}

  {#if signalTrackDrawMode && signalTrackStart && signalTrackHover}
    {@const sx = grid.gridLeft + signalTrackStart.col * config.pitch}
    {@const sy = grid.gridBottom + signalTrackStart.row * config.pitch}
    {@const ex = grid.gridLeft + signalTrackHover.col * config.pitch}
    {@const ey = grid.gridBottom + signalTrackHover.row * config.pitch}
    <line
      x1={sx} y1={sy}
      x2={ex} y2={ey}
      stroke="#f9e2af"
      stroke-width={RAIL_TRACE_WIDTH}
      stroke-dasharray="0.8 0.4"
      stroke-linecap="round"
      opacity="0.95"
    />
  {/if}

  <!-- Power rail traces -->
  {#each traces as t}
    <line
      x1={t.x1} y1={t.y1}
      x2={t.x2} y2={t.y2}
      //stroke={t.type === 'vcc' ? colors.vcc : colors.gnd}
      stroke={colors[t.type] || colors.signal}
      stroke-width={RAIL_TRACE_WIDTH}
      stroke-linecap="round"
      opacity="0.6"
    />
  {/each}

  <!-- Pads -->
  {#each pads as pad}
    <circle
      cx={pad.x}
      cy={pad.y}
      r={copperDia / 2}
      fill={pad.type === 'vcc' ? colors.vcc : pad.type === 'gnd' ? colors.gnd : colors.pad}
    />
    <circle
      cx={pad.x}
      cy={pad.y}
      r={fullConfig.padDiameter / 2}
      fill={colors.padHole}
    />
  {/each}

  <!-- Mounting holes (on top of everything) -->
  {#each mountHoles as hole}
    <!-- Silver ring -->
    <circle
      cx={hole.x}
      cy={hole.y}
      r={hole.keepout / 2 - MOUNT_KEEPOUT_MARGIN / 2}
      fill="none"
      stroke={colors.mountRing}
      stroke-width="0.3"
      opacity="0.5"
    />
    <!-- Drill hole -->
    <circle
      cx={hole.x}
      cy={hole.y}
      r={hole.diameter / 2}
      fill={colors.mountHole}
    />
  {/each}

  <!-- Silkscreen labels -->
  {#each labelStrokes as polyline}
    <path
      d={polyToPath(polyline)}
      stroke={colors.silkscreen}
      stroke-width="0.15"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />
     {/each}
  
  
  <!-- Module overlays -->
  {#each modules as inst (inst.id)}
    {@const m = moduleToMm(inst)}
    {@const isSelected = selectedInstanceId === inst.id}
    {#if m}
      {@const outW = m.rm.outline.width}
      {@const outH = m.rm.outline.height}
      {@const pinW = (m.rm.widthPins - 1) * m.pitch}
      {@const pinH = (m.rm.heightPins - 1) * m.pitch}
      {@const oOfs = m.rm.outlineOffset || { x: 0, y: 0 }}
      {@const ofsX = (outW - pinW) / 2 - oOfs.x}
      {@const ofsY = (outH - pinH) / 2 - oOfs.y}
      {@const outCx = m.x - ofsX + outW / 2}
      {@const outCy = m.y - ofsY + outH / 2}

      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <g
        class="module-overlay"
        class:dragging={dragging?.instanceId === inst.id}
        onpointerdown={(e) => onItemPointerDown(e, inst, 'module')}
        style="cursor: grab;"
      >
        <!-- Selection highlight -->
        {#if isSelected}
          <rect
            x={m.x - ofsX - 0.8}
            y={m.y - ofsY - 0.8}
            width={outW + 1.6}
            height={outH + 1.6}
            fill="none"
            stroke="#89b4fa"
            stroke-width="0.35"
            stroke-dasharray="0.8 0.4"
            rx="0.6"
            opacity="0.9"
          />
        {/if}

        <!-- Module body outline -->
        <rect
          x={m.x - ofsX}
          y={m.y - ofsY}
          width={outW}
          height={outH}
          fill={inst.color}
          fill-opacity="0.2"
          stroke={inst.color}
          stroke-width="0.3"
          stroke-dasharray="1 0.5"
          rx="0.5"
        />

        <!-- Pin markers -->
        {#each m.rm.pins as pin}
          <circle
            cx={m.x + pin.col * m.pitch}
            cy={m.y + pin.row * m.pitch}
            r={m.pitch * 0.25}
            fill={inst.color}
            fill-opacity="0.5"
            stroke={inst.color}
            stroke-width="0.15"
          />
        {/each}

        <!-- Module label centered on outline (flipped back for readability) -->
        <g transform="translate({outCx},{outCy}) scale(1,-1)">
          <text
            x="0"
            y="0"
            text-anchor="middle"
            dominant-baseline="central"
            fill={inst.color}
            fill-opacity="0.8"
            font-size="{Math.min(2.5, outW * 0.1)}"
            font-family="'Segoe UI', system-ui, sans-serif"
            font-weight="600"
          >{m.rm.name}</text>
        </g>
      </g>
    {/if}
  {/each}

  <!-- Adapter overlays (real Gerber features) -->
  {#each adapters as inst (inst.id)}
    {@const a = adapterToMm(inst)}
    {@const hasConflict = adapterConflicts.has(inst.id)}
    {@const isSelected = selectedInstanceId === inst.id}
    {#if a}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <g class="module-overlay adapter-overlay"
        class:dragging={dragging?.instanceId === inst.id}
        class:conflict={hasConflict}
        onpointerdown={(e) => onItemPointerDown(e, inst, 'adapter')}
        style="cursor: grab;">

        <!-- Selection highlight -->
        {#if isSelected}
          <rect
            x={a.x - 0.8}
            y={a.y - 0.8}
            width={(a.def.widthPins - 1) * a.pitch + 1.6}
            height={(a.def.heightPins - 1) * a.pitch + 1.6}
            fill="none"
            stroke="#f9e2af"
            stroke-width="0.25"
            stroke-dasharray="0.6 0.3"
            rx="0.4"
          />
        {/if}
        
        <!-- Conflict highlight background -->
        {#if hasConflict}
          <rect
            x={a.x - 0.5}
            y={a.y - 0.5}
            width={(a.def.widthPins - 1) * a.pitch + 1}
            height={(a.def.heightPins - 1) * a.pitch + 1}
            fill="#ff0000"
            fill-opacity="0.15"
            stroke="#ff0000"
            stroke-width="0.2"
            stroke-dasharray="0.5 0.3"
            rx="0.3"
          />
        {/if}

        {#each a.def.features.copperBack as b}
          {#if b.type === 'trace'}
            <line x1={a.x + b.x1} y1={a.y + b.y1} x2={a.x + b.x2} y2={a.y + b.y2}
              stroke="#0b280b" stroke-width={b.w} stroke-opacity="0.4" stroke-linecap="round" />
          {/if}
        {/each}

        {#each a.def.features.copper as f}
          {#if f.type === 'trace'}
            <line x1={a.x + f.x1} y1={a.y + f.y1} x2={a.x + f.x2} y2={a.y + f.y2}
              stroke="#72692e" stroke-width={f.w} stroke-opacity="0.8" stroke-linecap="round" />
          {/if}
        {/each}      
        
        {#each a.def.features.copper as f_p}
          {#if f_p.type === 'pad'}
            <rect x={a.x + f_p.x - f_p.w / 2} y={a.y + f_p.y - f_p.h / 2}
              width={f_p.w} height={f_p.h} fill="#c8a84e" fill-opacity="0.9" rx="0.15" ry="0.15"/>
          {/if}
        {/each} 

        {#each a.def.features.drills as via}
          <circle cx={a.x + via.x} cy={a.y + via.y}
            r={via.size/2} fill="#c8a84e" />
          <circle cx={a.x + via.x} cy={a.y + via.y}
            r={via.drill/2} fill="#1a1a1a" />
        {/each}

        {#each a.def.throughPins as pin}
          <circle cx={a.x + pin.col * a.pitch} cy={a.y + pin.row * a.pitch}
            r={copperDia / 2} fill="#c8a84e" />
          <circle cx={a.x + pin.col * a.pitch} cy={a.y + pin.row * a.pitch}
            r={config.padDiameter / 2} fill="#1a1a1a" />
        {/each}

        {#each a.def.features.silk as f}
          {#if f.type === 'poly'}
            <path d={polyToPath(f.points.map(p => ({ x: a.x + p.x, y: a.y + p.y })))}
              stroke="#e8e8e8" stroke-width="0.15" stroke-linecap="round"
              stroke-linejoin="round" fill="none" opacity="0.7" />
          {:else if f.type === 'circle'}
            <circle cx={a.x + f.x} cy={a.y + f.y} r={f.d / 2} fill="#e8e8e8" opacity="0.7" />
          {/if}
        {/each}

        <!-- Silk reference texts  -->
        {#each a.def.features.silkText as st}
          {@const textStrokes = getTextStrokes(st.text, a.x + st.x, a.y + st.y, st.height || 1.0, st.anchor || 'center', st.rotation || 0)}
          {#each textStrokes as polyline}
            <path d={polyToPath(polyline)}
              stroke="#e8e8e8" stroke-width="0.15" stroke-linecap="round"
              stroke-linejoin="round" fill="none" opacity="0.7" />
          {/each}
        {/each}
        
        <!-- Silk label -->
        {#if a.def.silkLabel}
          {@const sl = a.def.silkLabel}
          {@const labelStrokes = getTextStrokes(sl.text, a.x + sl.x, a.y + sl.y, sl.height || 1.0, sl.anchor || 'center', sl.rotation || 0)}
          {#each labelStrokes as polyline}
            <path d={polyToPath(polyline)}
              stroke="#e8e8e8" stroke-width="0.15" stroke-linecap="round"
              stroke-linejoin="round" fill="none" opacity="0.7" />
          {/each}
        {/if}
        
        <!-- Corner markers at adapter boundary (pointing inward) -->
        {#each [
          { col: 0, row: 0, dx: 1, dy: 1 },
          { col: a.def.widthPins - 1, row: 0, dx: -1, dy: 1 },
          { col: 0, row: a.def.heightPins - 1, dx: 1, dy: -1 },
          { col: a.def.widthPins - 1, row: a.def.heightPins - 1, dx: -1, dy: -1 },
        ] as corner}
          {@const cx = a.x + corner.col * a.pitch}
          {@const cy = a.y + corner.row * a.pitch}
          {@const vx = cx - corner.dx * 1.1}
          {@const vy = cy - corner.dy * 1.1}
          <path d="M {vx} {vy} L {vx + corner.dx * 1.3} {vy} M {vx} {vy} L {vx} {vy + corner.dy * 1.3}"
            stroke="#e8e8e8" stroke-width="0.15" stroke-linecap="round"
            fill="none" opacity="0.7" />
        {/each}

        <g transform="translate({a.x + (a.def.widthPins - 1) * a.pitch / 2},{a.y + (a.def.heightPins - 1) * a.pitch / 2 + a.def.outline.height * 0.4}) scale(1,-1)">
          <text x="0" y="0" text-anchor="middle" dominant-baseline="central"
            fill="#f9e2af" fill-opacity="0.9"
            font-size="{Math.min(1.8, a.def.outline.width * 0.08)}"
            font-family="'Segoe UI', system-ui, sans-serif"
            font-weight="600">⚡ {a.def.name}</text>
        </g>
      </g>
    {/if}
  {/each}    
  </g>
</svg>

<!-- Zoom controls overlay -->
<div class="zoom-controls">
  <button class="zoom-btn" onclick={resetView} title="Reset view">⟲</button>
  <button class="zoom-btn" onclick={() => zoomLevel = Math.max(1, zoomLevel / 1.3)} title="Zoom out">−</button>
  <input type="range" class="zoom-slider" min="1" max="10" step="0.1"
    bind:value={zoomLevel} title="Zoom: {Math.round(zoomLevel * 100)}%" />
  <button class="zoom-btn" onclick={() => zoomLevel = Math.min(10, zoomLevel * 1.3)} title="Zoom in">+</button>
  <span class="zoom-label">{Math.round(zoomLevel * 100)}%</span>
</div>
</div>

<style>
  .preview-container {
    position: relative;
  }

  .pcb-preview {
    width: 100%;
    height: auto;
    max-height: 800px;
    border-radius: 8px;
    background: #111;
    padding: 8px;
  }
  
    .pcb-preview {
    touch-action: none;
  }

  .zoom-controls {
    position: absolute;
    bottom: 16px;
    right: 16px;
    display: flex;
    align-items: center;
    gap: 4px;
    background: rgba(20, 20, 30, 0.85);
    backdrop-filter: blur(4px);
    padding: 4px 8px;
    border-radius: 6px;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .zoom-btn {
    width: 26px;
    height: 26px;
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 4px;
    background: rgba(255,255,255,0.05);
    color: #ccc;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    line-height: 1;
  }

  .zoom-btn:hover {
    background: rgba(255,255,255,0.12);
    color: #fff;
  }

  .zoom-slider {
    width: 80px;
    height: 4px;
    -webkit-appearance: none;
    appearance: none;
    background: rgba(255,255,255,0.15);
    border-radius: 2px;
    outline: none;
    cursor: pointer;
  }

  .zoom-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #e94560;
    cursor: pointer;
  }

  .zoom-label {
    font-size: 10px;
    color: #888;
    min-width: 36px;
    text-align: right;
    font-family: monospace;
  }
  
  .module-overlay {
    touch-action: none;
  }

  .module-overlay:hover rect {
    fill-opacity: 0.3;
    stroke-width: 0.5;
  }

  .module-overlay.dragging rect {
    fill-opacity: 0.35;
    stroke-dasharray: none;
  }
  
  .adapter-overlay:hover rect {
    fill-opacity: 0.9;
  }
</style>
