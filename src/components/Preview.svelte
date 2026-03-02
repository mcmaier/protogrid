<script>
  import { computeGrid, generatePadPositions, generatePowerRailTraces, computeMountingHoles, generateLabelStrokes, RAIL_TRACE_WIDTH, MOUNT_KEEPOUT_MARGIN } from '../lib/gerber.js';
  import { getRotatedModule } from '../lib/modules.js';
  import { getRotatedAdapter } from '../lib/adapters.js';
  
  let { config, modules = $bindable(), adapters = $bindable() } = $props();

  let fullConfig = $derived({
    ...config,
  });

  // Resolve adapter definitions with rotation applied
  let resolvedAdapters = $derived(adapters.map(inst => ({
    ...inst,
    _adapterDef: getRotatedAdapter(inst.adapterId, inst.rotation || 0),
  })));

  let pads = $derived(generatePadPositions(fullConfig, resolvedAdapters));
  let traces = $derived(generatePowerRailTraces(fullConfig));
  let mountHoles = $derived(computeMountingHoles(fullConfig));
  let labelStrokes = $derived(generateLabelStrokes(fullConfig));
  let grid = $derived(computeGrid(fullConfig));
  
  // Detect adapter overlap and out-of-bounds issues
  let adapterConflicts = $derived.by(() => {
    const conflicts = new Set(); // adapter instance IDs with problems
    const occupied = new Map();  // "col,row" → adapter instance ID

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

  let labelPad = 2;
  let viewBox = $derived(`${-labelPad} ${-labelPad} ${config.width + labelPad * 2} ${config.height + labelPad * 2}`);

  const colors = {
    board: '#1a5c1a',
    boardStroke: '#0d3d0d',
    pad: '#c8a84e',
    padHole: '#1a1a1a',
    vcc: '#cc3333',
    gnd: '#3333cc',
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
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('touchmove', onTouchMove);
  }
</script>

<svg
  bind:this={svgEl}
  viewBox={viewBox}
  xmlns="http://www.w3.org/2000/svg"
  class="pcb-preview"
  class:has-modules={modules.length > 0 || adapters.length > 0}
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

  <!-- Power rail traces -->
  {#each traces as t}
    <line
      x1={t.x1} y1={t.y1}
      x2={t.x2} y2={t.y2}
      stroke={t.type === 'vcc' ? colors.vcc : colors.gnd}
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
    {#if a}
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <g class="module-overlay adapter-overlay"
        class:dragging={dragging?.instanceId === inst.id}
        class:conflict={hasConflict}
        onpointerdown={(e) => onItemPointerDown(e, inst, 'adapter')}
        style="cursor: grab;">
        
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

        {#each a.def.features.copper as f}
          {#if f.type === 'pad'}
            <rect x={a.x + f.x - f.w / 2} y={a.y + f.y - f.h / 2}
              width={f.w} height={f.h} fill="#c8a84e" fill-opacity="0.8" />
          {:else if f.type === 'trace'}
            <line x1={a.x + f.x1} y1={a.y + f.y1} x2={a.x + f.x2} y2={a.y + f.y2}
              stroke="#c8a84e" stroke-width={f.w} stroke-opacity="0.7" stroke-linecap="round" />
          {/if}
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

<style>
  .pcb-preview {
    width: 100%;
    height: auto;
    max-height: 800px;
    border-radius: 8px;
    background: #111;
    padding: 8px;
  }
  
    .pcb-preview.has-modules {
    touch-action: pan-x pan-y;
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