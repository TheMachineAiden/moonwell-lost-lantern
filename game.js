import { WORLD, SCENES, createGame, acknowledge, answerBridge, obstacles, move, tick, act, echoAction, interaction, objective, lit, crewPositions } from './game-core.js';
import { FOREST_PRESENTATION } from './forest-presentation.js';

const $ = selector => document.querySelector(selector);
const write = (selector, text) => { const element = $(selector); if (element.textContent !== text) element.textContent = text; };
const canvas = $('#game'), ctx = canvas.getContext('2d');
const params = new URLSearchParams(location.search);
const artSample = params.get('art') === 'sample';
const immersive = params.get('experience') !== 'classic' && params.get('layout') !== '1' && !artSample;
document.body.classList.toggle('immersive', immersive);
const fullWorld = !artSample && params.get('layout') !== '1';
const sampleArt = {};
let artFailed = false;
if (artSample || fullWorld) {
  const files = { luna: 'moonwell-keeper-walk-v7.png', echo: 'moonwell-keeper-echo-v1.png', eir: 'moonwell-eir-empty-hand-idle-v1.png', adult: 'moonwell-traveller-adult-walk-v1.png', child: 'moonwell-traveller-child-walk-v1.png', tree: 'moonwell-spruce-overhang-v3.png', floor: 'moonwell-homecoming-loam-tiles-v1.png', lantern: 'moonwell-homecoming-lantern-loop-v1.png' };
  if (fullWorld) Object.assign(files, { path: immersive ? 'moonwell-homecoming-path-v2.png' : 'moonwell-homecoming-path-v1.png', edge: 'moonwell-homecoming-forest-edge-v1.png', bank: immersive ? 'moonwell-hollow-bank-v3.png' : 'moonwell-hollow-bank-v2.png', window: 'moonwell-home-window-v1.png', well: 'moonwell-homecoming-well-v1.png', roots: 'moonwell-root-shelf-variants-v2.png', water: 'moonwell-water-tile-v4.png', bridge: 'moonwell-bridge-vertical-v5.png', rune: 'moonwell-rune-stone-variants-v1.png', pool: 'moonwell-light-pool-variants-v2.png', spark: 'moonwell-firefly-variants-v2.png', memory: 'moonwell-memory-loop-v3.png', chime: 'moonwell-starroot-chime-variants-v5.png', opening: 'moonwell-exit-clearing-states-v4.png', foliage: 'moonwell-foliage-variants-v2.png', lanternOff: 'moonwell-homecoming-lantern-off-v1.png' });
  if (immersive && fullWorld) Object.assign(files, { richFloor: 'moonwell-loam-base-tiles-v1.png', loam: 'moonwell-clearing-loam-patches-v3.png', moonlight: 'moonwell-clearing-moonlight-v4.png', atmosphere: 'moonwell-forest-atmosphere-v1.png', ground: 'moonwell-ground-texture-variants-v2.png', stone: 'moonwell-stone-variants-v2.png', mushroom: 'moonwell-mushroom-variants-v2.png', canopy: 'moonwell-inner-forest-boundary-v1.png', forestBottom: 'moonwell-bottom-forest-clusters-v1.png' });
  for (const [name, file] of Object.entries(files)) {
    sampleArt[name] = new Image();
    sampleArt[name].onload = () => refresh();
    sampleArt[name].onerror = () => { artFailed = true; refresh(); };
    sampleArt[name].src = `assets/moonwell-art/production/${file}`;
  }
  if (artSample) { $('.build-label').hidden = false; $('.build-label').textContent = 'Art sample · layout markers'; }
}
const loaded = image => image?.complete && image.naturalWidth;
let state = createGame({ scene: params.get('scene') });
let started = false, paused = false, journal = false, last = 0, endingShown = false;
let lastConnectionCount = Object.values(state.connections).filter(Boolean).length;
let openingElapsed = 0, exploring = false;
let journalPage = 0;
let lastStepAt = 0, facing = 1;
let steeringPointer = null, touchDirection = null, lastPointerKind = null;
let lastFeedback = '', feedbackUntil = 0;
const touchPresentation = immersive && globalThis.matchMedia?.('(pointer: coarse)').matches === true;
const controlLabel = (text, key) => touchPresentation ? text : `${text} · ${key}`;
const actorMotion = new Map();
const keys = new Set();
const sound = globalThis.MoonwellSoundtrack, effects = globalThis.MoonwellEffects;
ctx.setTransform(2, 0, 0, 2, 0, 0);
ctx.imageSmoothingEnabled = false;
const colors = { ground: '#283c3d', path: '#718079', tree: '#16312c', trunk: '#a47b54', bank: '#344e50', water: '#396d89', ink: '#f2f1df', warm: '#ffdc83', cool: '#a5eff5' };
function box(x, y, w, h, color) { ctx.fillStyle = color; ctx.fillRect(x, y, w, h); }
function label(text, x, y, color = colors.ink, size = 8) {
  ctx.font = `bold ${size}px monospace`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#13242a'; ctx.fillRect(x - ctx.measureText(text).width / 2 - 2, y - size / 2 - 1, ctx.measureText(text).width + 4, size + 2);
  ctx.fillStyle = color; ctx.fillText(text, x, y);
}
function path(points, color, width) {
  if (!points?.length) return;
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  ctx.beginPath(); points.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke();
}
function mark(id, point, connected = false) {
  const on = connected || lit(state, id);
  box(point.x - 7, point.y - 6, 14, 12, on ? colors.warm : '#1b2e3b');
  ctx.strokeStyle = on ? '#fff0b0' : '#b4c9d1'; ctx.lineWidth = 1; ctx.strokeRect(point.x - 7, point.y - 6, 14, 12);
  label(id, point.x, point.y, on ? '#fff0b0' : '#d1e0e5', 7);
}
function actor(p, symbol, color, child = false) {
  const art = symbol === 'Luna' ? sampleArt.luna : symbol === 'Eir' ? sampleArt.eir : sampleArt[symbol];
  if (loaded(art)) {
    const now = performance.now(), old = actorMotion.get(symbol);
    const movedAt = !old || Math.hypot(old.x - p.x, old.y - p.y) > .01 ? now : old.movedAt;
    actorMotion.set(symbol, { ...p, movedAt });
    const eir = symbol === 'Eir', luna = symbol === 'Luna';
    const moving = now - (luna ? lastStepAt : movedAt) < 180;
    const frame = eir ? Math.floor(now / 460) % 4 : moving ? Math.floor(now / 110) % 4 : 0;
    const sw = luna ? 26 : eir ? 64 : 32, sh = luna ? 40 : eir ? 96 : 48;
    ctx.save(); ctx.translate(p.x, p.y); if (luna) ctx.scale(facing, 1);
    ctx.drawImage(art, frame * sw, 0, sw, sh, luna ? -6.5 : -8, luna ? -19.5 : -22, luna ? 13 : 16, luna ? 20 : 24);
    ctx.restore();
    if (!fullWorld) label(symbol, p.x, p.y + 8, color, 7);
    return;
  }
  box(p.x - 4, p.y - (child ? 7 : 11), 8, child ? 8 : 12, color);
  box(p.x - 2, p.y - (child ? 9 : 13), 4, 4, '#e8cbb1');
  label(symbol, p.x, p.y + 8, color, 7);
}
function draw() {
  if (fullWorld) { drawWorld(); return; }
  const scene = SCENES[state.area];
  const entities = [];
  box(0, 0, WORLD.width, WORLD.height, colors.ground);
  if (loaded(sampleArt.floor)) {
    for (let x = 0; x < WORLD.width; x += 16) for (let y = 0; y < WORLD.height; y += 16) ctx.drawImage(sampleArt.floor, (x / 16 + y / 16) % 4 * 16, 0, 16, 16, x, y, 16, 16);
  }
  for (let x = 0; x < WORLD.width; x += 16) for (let y = 0; y < WORLD.height; y += 16) {
    ctx.strokeStyle = '#ffffff07'; ctx.lineWidth = .5; ctx.strokeRect(x, y, 16, 16);
  }
  scene.paths.forEach(p => path(p, colors.path, 24));
  box(0, 0, 320, 16, '#132b28'); box(0, 192, 320, 16, '#132b28'); box(0, 0, 16, 208, '#132b28'); box(304, 0, 16, 208, '#132b28');
  for (const o of obstacles(state)) {
    if (o.kind === 'tree' && loaded(sampleArt.tree)) {
      entities.push({ y: o.y + 16, draw: () => ctx.drawImage(sampleArt.tree, 0, 0, 80, 112, o.x - 7, o.y - 26, 30, 42) });
      continue;
    }
    box(o.x, o.y, o.w, o.h, colors[o.kind]);
    ctx.strokeStyle = '#b6d1c733'; ctx.lineWidth = 1; ctx.strokeRect(o.x + .5, o.y + .5, o.w - 1, o.h - 1);
    if (o.kind === 'tree') box(o.x + 6, o.y + 4, 4, 10, '#405345');
  }
  if (state.area === 'hollow') {
    label('BROKEN BANK', 160, 163, '#c1cbca', 7);
    label('FALLEN TRUNK', 160, 102, '#ffe5bc', 6);
    label('OPEN DETOUR', 160, 51, '#dae4da', 7);
    const complete = !!state.connections.hollow;
    if (complete) path(state.connections.hollow, colors.warm, 3);
    mark('A', scene.A, complete); mark('C', scene.C, complete);
  }
  if (state.area === 'glade') {
    label('OLD SHORTCUT', 64, 66, '#ddd4c2', 6);
    if (state.lantern === 'ground') { box(scene.lantern.x - 4, scene.lantern.y - 6, 8, 10, '#d4b77e'); label('LANTERN', scene.lantern.x, scene.lantern.y - 17, colors.warm, 6); }
    scene.sparks.forEach((p, i) => { if (!state.sparks.includes(i)) { box(p.x - 2, p.y - 3, 4, 6, colors.warm); box(p.x - 4, p.y - 1, 8, 2, colors.warm); } });
  }
  if (state.area === 'crossing') {
    if (state.connections.bridge) { box(144, 88, 32, 40, '#ac916c'); path(state.connections.bridge, colors.warm, 3); }
    mark('north', scene.north, !!state.connections.bridge); mark('south', scene.south, !!state.connections.bridge);
    label('NORTH BANK', 72, 32, '#d7e6e9', 6); label('SOUTH BANK', 72, 144, '#d7e6e9', 6);
    box(176, 151, 4, 6, colors.warm); label('rest light', 188, 137, colors.warm, 6);
  }
  if (state.area === 'grove') {
    if (state.connections.village) path(state.connections.village, colors.warm, 3);
    mark('V', scene.V, !!state.connections.village); mark('M', scene.M, !!state.connections.village);
    for (const [i, key] of ['bridge', 'hollow', 'village'].entries()) box(88 + i * 16, 40, 9, 12, state.connections[key] ? colors.warm : '#141e27');
    label('MOONWELL', 112, 24, '#dce7df', 7);
    box(184, 138, 16, 4, '#937d62'); label('wet root', 192, 126, colors.warm, 6);
    if (state.sawWindow) { box(280, 24, 16, 16, colors.warm); label('HOME', 288, 52, colors.warm, 6); }
  }
  const connection = state.area === 'hollow' ? state.connections.hollow : state.connections.village;
  if (state.recording && !connection) {
    ctx.setLineDash([1, 5]); path(state.recording.path, '#c9eee1', 1); ctx.setLineDash([]);
  }
  if (scene.memory && !state.memories.includes(state.area)) { box(scene.memory.x - 3, scene.memory.y - 3, 6, 6, '#b5d3ef'); label('◇', scene.memory.x, scene.memory.y - 10, '#cde5ff'); }
  if (scene.exit) { box(scene.exit.x - 5, scene.exit.y - 8, 10, 16, '#dfba6955'); label('›', scene.exit.x, scene.exit.y, colors.warm, 12); }
  if (scene.back) label('‹', scene.back.x, scene.back.y, '#e1d2ac', 12);
  const crew = crewPositions(state);
  crew.forEach((p, i) => entities.push({ y: p.y, draw: () => actor(p, ['Eir', 'adult', 'child'][i], ['#d1c0e9', '#c6d6b5', '#efb5b0'][i], i === 2) }));
  if (state.echo) {
    entities.push({ y: state.echo.y, draw: () => {
    if (loaded(sampleArt.echo)) ctx.drawImage(sampleArt.echo, 0, 0, 26, 40, state.echo.x - 6.5, state.echo.y - 19.5, 13, 20);
    else box(state.echo.x - 5, state.echo.y - 12, 10, 13, '#a5eff5aa');
    label('echo', state.echo.x, state.echo.y - 24, colors.cool, 6);
    } });
  }
  entities.push({ y: state.player.y, draw: () => {
    actor(state.player, 'Luna', '#ffe08c');
    if (state.lantern === 'carried') {
      if (loaded(sampleArt.lantern)) ctx.drawImage(sampleArt.lantern, 0, 0, 16, 16, state.player.x + (facing > 0 ? 4 : -10), state.player.y - 7, 6, 6);
      else box(state.player.x + 5, state.player.y - 5, 3, 5, colors.warm);
    }
  } });
  entities.sort((a, b) => a.y - b.y).forEach(e => e.draw());
  if (state.lantern === 'docked') {
    if (loaded(sampleArt.lantern)) ctx.drawImage(sampleArt.lantern, 0, 0, 16, 16, SCENES.grove.M.x - 3, SCENES.grove.M.y - 5, 6, 6);
    else box(SCENES.grove.M.x - 2, SCENES.grove.M.y - 3, 4, 6, colors.warm);
  }
}

function placeAlong(points, gap, paint) {
  if (!points?.length) return;
  paint(points[0], 0); let carried = 0;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1], b = points[i], distance = Math.hypot(b.x - a.x, b.y - a.y);
    if (!distance) continue;
    const angle = Math.abs(b.y - a.y) > Math.abs(b.x - a.x) ? Math.PI / 2 : 0;
    for (let d = gap - carried; d <= distance; d += gap) paint({ x: a.x + (b.x - a.x) * d / distance, y: a.y + (b.y - a.y) * d / distance }, angle);
    carried = (carried + distance) % gap;
  }
}
function drawWorld() {
  ctx.clearRect(0, 0, WORLD.width, WORLD.height);
  if (artFailed || !Object.values(sampleArt).every(loaded)) return;
  const scene = SCENES[state.area], entities = [], now = performance.now();
  const openings = [scene.exit, scene.back].filter(Boolean);
  const stamp = (key, sx, sy, sw, sh, x, y, w = sw, h = sh) => ctx.drawImage(sampleArt[key], sx, sy, sw, sh, x, y, w, h);
  const pool = (p, size = 20, alpha = .7) => { ctx.save(); ctx.globalAlpha = alpha; stamp('pool', 16, 0, 16, 16, p.x - size / 2, p.y - size / 2, size, size); ctx.restore(); };
  const markWorld = (id, p, connected, variant = 0) => { if (connected || lit(state, id)) pool(p, 24, .9); stamp('rune', variant * 16, 0, 16, 16, p.x - 8, p.y - 8); };
  const trail = (points, complete) => placeAlong(points, complete ? 8 : 10, p => pool(p, complete ? 9 : 4, complete ? .75 : .35));
  const forest = immersive ? FOREST_PRESENTATION[state.area] : null;
  for (let y = 0; y < WORLD.height; y += 16) for (let x = 0; x < WORLD.width; x += 16) stamp(forest ? 'richFloor' : 'floor', (x / 16 + y / 16) % 4 * 16, 0, 16, 16, x, y);
  if (forest) {
    for (const patch of forest.loam) {
      ctx.save(); ctx.globalAlpha = patch.alpha;
      ctx.translate(patch.x + (patch.mirror ? patch.w : 0), patch.y);
      if (patch.mirror) ctx.scale(-1, 1);
      stamp('loam', patch.frame * 160, 0, 160, 96, 0, 0, patch.w, patch.h); ctx.restore();
    }
    ctx.save(); ctx.globalCompositeOperation = 'screen';
    for (const light of forest.moonlight) { ctx.globalAlpha = light.alpha; stamp('moonlight', light.frame * 192, 0, 192, 112, light.x, light.y, light.w, light.h); }
    ctx.restore();
    for (const item of forest.details) {
      const key = item.kind === 'moon' ? 'pool' : ['shadow','needles','root'].includes(item.kind) ? 'ground' : ['fern','glowmoss'].includes(item.kind) ? 'foliage' : item.kind;
      const size = item.kind === 'glowmoss' ? 12 : 16, frame = item.frame % (key === 'mushroom' ? 2 : 3);
      ctx.save(); ctx.globalAlpha = item.alpha;
      ctx.translate(item.col * 16 + item.xOffset + (item.mirror ? size : 0), item.row * 16 + item.yOffset);
      if (item.mirror) ctx.scale(-1,1);
      stamp(key, frame * 16, 0, 16, 16, 0, 0, size, size); ctx.restore();
    }
  }
  scene.paths.forEach(route => placeAlong(route, 12, (p, angle) => {
    ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(angle);
    if (forest) { ctx.globalAlpha = .65; if (Math.floor(p.x / 24 + p.y / 24) % 2) ctx.scale(1, -1); stamp('path', 0, 0, 40, 24, -20, -12); }
    else stamp('path', 0, 0, 40, 24, -20, -12);
    ctx.restore();
  }));
  if (state.area === 'crossing') {
    for (let y = 88; y < 128; y += 16) for (let x = 16; x < 304; x += 16) stamp('water', (x / 16 + (y - 88) / 16) % 4 * 16, 0, 16, Math.min(16, 128 - y), x, y);
    if (state.connections.bridge) stamp('bridge', 0, 8, 32, 48, 144, 84);
  }
  // The visible path continues through the forest edge at transition anchors.
  // The normal nearby action changes scene before Luna reaches the outer bounds.
  for (let row = 0; row < 13; row++) for (let col = 0; col < 20; col++) {
    const isEdge = row === 0 || row === 12 || col === 0 || col === 19;
    const isGap = openings.some(p => col === (p.x > 160 ? 19 : 0) && Math.abs(row * 16 + 8 - p.y) < 24);
    if (isEdge && !isGap && !(forest && row === 12)) stamp('edge', 0, 0, 16, 16, col * 16, row * 16);
  }
  for (const opening of openings) {
    const edgeX = opening.x > 160 ? 320 : 0;
    placeAlong([opening, { x: edgeX, y: opening.y }], 10, p => {
      ctx.save(); if (forest) ctx.globalAlpha = .4;
      stamp('path', 0, 0, 40, 24, p.x - 20, p.y - 12); ctx.restore();
    });
    stamp('opening', 96, 0, 32, 40, opening.x - 16, opening.y - 24);
  }
  if (state.area === 'hollow') {
    for (const route of [[{x:80,y:104},{x:144,y:104}], [{x:176,y:104},{x:240,y:104}]]) {
      placeAlong(route, 12, p => { ctx.save(); if (forest) ctx.globalAlpha = .32; stamp('path', 0, 0, 40, 24, p.x - 20, p.y - 12); ctx.restore(); });
    }
  }
  if (forest) {
    // Released forest silhouettes keep their roots on the tested boundary.
    // Their crowns may overhang it; they do not introduce new blocking ground.
    for (const [x, frame, mirror] of [[-2,1,false],[102,1,true],[206,0,false]]) {
      ctx.save(); ctx.translate(x + (mirror ? 128 : 0), -32); if (mirror) ctx.scale(-1,1);
      stamp('canopy', frame * 256, 0, 256, 112, 0, 0, 128, 56); ctx.restore();
    }
    for (const side of [0, 1]) for (let y = 48; y <= 192; y += 32) {
      if (openings.some(p => (p.x > 160 ? 1 : 0) === side && Math.abs(p.y - y) < 44)) continue;
      stamp('tree', ((y / 16 + side) % 3) * 80, 0, 80, 112, side ? 298 : -8, y - 42, 30, 42);
    }
  }
  for (const o of scene.obstacles) {
    if (o.kind === 'tree') entities.push({ y: o.y + 16, draw: () => stamp('tree', ((o.x + o.y) / 16 % 3) * 80, 0, 80, 112, o.x - 7, o.y - 26, 30, 42) });
    if (o.kind === 'trunk') entities.push({ y: o.y + o.h, draw: () => stamp('roots', 0, 0, 48, 24, o.x, o.y, 32, 16) });
    if (o.kind === 'bank') stamp('bank', 0, 0, 96, 80, o.x, o.y);
    if (o.kind === 'well') entities.push({ y: o.y + o.h, draw: () => stamp('well', 0, 0, 32, 16, o.x, o.y) });
  }
  if (state.area === 'glade') {
    if (state.lantern === 'ground') stamp('lanternOff', 0, 0, 16, 16, scene.lantern.x - 5, scene.lantern.y - 9, 10, 10);
    scene.sparks.forEach((p, i) => { if (!state.sparks.includes(i)) stamp('spark', (i * 4 + Math.floor(now / 180) % 4) * 16, 0, 16, 16, p.x - 8, p.y - 8); });
  }
  if (state.area === 'crossing') {
    markWorld('north', scene.north, !!state.connections.bridge); markWorld('south', scene.south, !!state.connections.bridge, 2);
    stamp('lantern', 0, 0, 16, 16, scene.south.x - 4, scene.south.y - 10, 8, 8);
    if (state.connections.bridge) trail(state.connections.bridge, true);
  }
  if (state.area === 'hollow') {
    if (state.connections.hollow) trail(state.connections.hollow, true);
    markWorld('A', scene.A, !!state.connections.hollow); markWorld('C', scene.C, !!state.connections.hollow, 2);
  }
  if (state.area === 'grove') {
    if (state.connections.village) trail(state.connections.village, true);
    markWorld('V', scene.V, !!state.connections.village); markWorld('M', scene.M, !!state.connections.village, 2);
    ['bridge', 'hollow', 'village'].forEach((key, i) => stamp('chime', (i * 4 + (state.connections[key] ? 3 : 0)) * 24, 0, 24, 24, 80 + i * 16, 28, 16, 16));
    stamp('roots', 48, 0, 48, 24, scene.footing.x - 8, scene.footing.y + 20, 16, 8);
    if (state.hold === 'footing') pool({ x: scene.footing.x, y: scene.footing.y + 24 }, 32, .8);
    if (state.sawWindow) entities.push({ y: 40, draw: () => stamp('window', 0, 0, 32, 24, 272, 16) });
    if (state.lantern === 'docked') stamp('lantern', 0, 0, 16, 16, scene.M.x - 3, scene.M.y - 5, 6, 6);
  }
  if (state.recording && !(state.area === 'hollow' ? state.connections.hollow : state.connections.village)) trail(state.recording.path, false);
  if (scene.memory && !state.memories.includes(state.area)) stamp('memory', 0, 0, 16, 16, scene.memory.x - 6, scene.memory.y - 9, 12, 12);
  const plants = { glade: [[32,128],[96,48],[192,64],[272,144]], crossing: [[96,24],[224,56],[80,160],[256,136]], hollow: [[32,80],[96,32],[208,48],[272,128]], grove: [[32,80],[80,112],[208,32],[272,176]] }[state.area];
  plants.forEach(([x, y], i) => stamp('foliage', i % 3 * 16, 0, 16, 16, x, y));
  crewPositions(state).forEach((p, i) => entities.push({ y: p.y, draw: () => actor(p, ['Eir', 'adult', 'child'][i], '', i === 2) }));
  if (state.echo) entities.push({ y: state.echo.y, draw: () => stamp('echo', (state.echo.holding ? 0 : Math.floor(now / 110) % 4) * 26, 0, 26, 40, state.echo.x - 6.5, state.echo.y - 19.5, 13, 20) });
  entities.push({ y: state.player.y, draw: () => {
    actor(state.player, 'Luna', '');
    if (state.lantern === 'carried') {
      ctx.save(); ctx.globalAlpha = state.sparks.length ? .4 + state.sparks.length * .2 : 1;
      stamp(state.sparks.length ? 'lantern' : 'lanternOff', 0, 0, 16, 16, state.player.x + (facing > 0 ? 4 : -10), state.player.y - 7, 6, 6); ctx.restore();
    }
  } });
  entities.sort((a, b) => a.y - b.y).forEach(e => e.draw());
  // Foreground crowns enter from below; their trunks and bases stay offscreen.
  // The retained panel continues beyond the canvas, without changing collision.
  if (forest) stamp('forestBottom', forest.frame * 320, 0, 320, 64, 0, 176);
  if (forest) stamp('atmosphere', forest.frame * 320, 0, 320, 208, 0, 0);
}
function compactTask() {
  if (state.won || state.homeWalk > 0) return 'Home, together';
  if (state.area === 'glade') return state.lantern === 'ground' ? 'Find Grandma’s lantern' : state.sparks.length < 3 ? `Light the lantern · ${state.sparks.length}/3 sparks` : 'Towards the river';
  if (state.area === 'crossing') return !state.connections.bridge ? 'Light the north bridge mark' : !state.metEir ? 'Cross to Grandma' : 'Towards Whispering Hollow';
  if (state.area === 'hollow') {
    if (state.connections.hollow) return state.crewArrived ? 'Towards Starfall Grove' : 'Wait for the others';
    if (!state.recording) return 'Light the near stone';
    return state.echo ? 'Light the far stone' : 'Walk the detour · Leave an echo';
  }
  if (!state.connections.village) return !state.recording ? 'Light the village mark' : 'Echo at the village · Lantern in the well';
  if (state.lantern === 'docked') return 'Take the lantern';
  if (!state.groveCrew?.arrived) return 'Meet the others at the wet root';
  if (!state.childHelped) return 'Light the child’s footing · Wait';
  if (!state.homeCrew.ready) return 'Wait for Grandma';
  return state.homeCrew.arrived ? 'Home with Grandma' : 'Walk with Grandma to the window';
}
function refresh() {
  $('#fullscreen').hidden = !immersive || document.fullscreenEnabled !== true || !!document.fullscreenElement;
  $('#pause-notebook').hidden = !immersive;
  $('#start').disabled = fullWorld && (artFailed || !Object.values(sampleArt).every(loaded));
  if (artFailed) write('#entry-copy', 'A forest picture could not load. Reload the page to try again.');
  write('#area', SCENES[state.area].name);
  const task = objective(state);
  write('#objective', immersive ? compactTask() : task);
  write('#pause-task', task);
  const progress = `Sparks ${state.sparks.length}/3 · Paths ${Object.values(state.connections).filter(Boolean).length}/3`;
  write('#progress', progress); write('#pause-progress', progress);
  if (state.message !== lastFeedback) { lastFeedback = state.message; feedbackUntil = performance.now() + 6500; }
  write('#feedback', state.won || state.homeWalk > 0 ? '' : state.message || 'The path is quiet. Take your time.');
  $('#feedback').hidden = immersive && (!state.message || performance.now() > feedbackUntil);
  const line = state.dialogue[0];
  document.body.classList.toggle('reading', !!line || state.choice || journal);
  if (line || state.choice || journal || paused || state.won) stopSteering();
  $('#speech').hidden = !line || journal;
  if (line) { write('#speaker', line.speaker); write('#words', line.text); }
  $('#choices').hidden = !state.choice || !!line || journal;
  const action = interaction(state);
  write('#act', controlLabel(action?.label || 'Look nearby', 'F'));
  $('#act').disabled = !started || paused || !!line || state.choice || journal || state.won;
  $('#echo').hidden = !state.echoLearned;
  write('#echo', controlLabel(state.echo ? 'Recall echo' : 'Create echo', 'E'));
  write('#next', controlLabel('Continue', 'Enter'));
  write('#close-journal', controlLabel('Close notebook', 'J'));
  $('#echo').disabled = !started || paused || !!line || state.choice || journal || state.won;
  $('#journal').hidden = !journal;
  $('.actions').hidden = journal;
  $('#tools').hidden = journal;
  if (journal) {
    journalPage = Math.max(0, Math.min(journalPage, state.memories.length - 1));
    const memory = SCENES[state.memories[journalPage]]?.memory;
    write('#memory-title', memory?.title || 'Last autumn');
    write('#notes', memory?.text || 'No keepsakes found yet. They are small memories of last autumn’s walk with Grandma.');
    $('#journal-pages').hidden = state.memories.length < 2;
    write('#memory-page', `${journalPage + 1} of ${state.memories.length}`);
    $('#previous-memory').disabled = journalPage === 0;
    $('#next-memory').disabled = journalPage >= state.memories.length - 1;
  }
  write('#pause', immersive ? 'Ⅱ' : paused ? 'Continue · P' : 'Pause · P');
  $('#pause').setAttribute('aria-label', paused ? 'Continue game' : 'Pause game');
  const count = Object.values(state.connections).filter(Boolean).length;
  if (count > lastConnectionCount && started) {
    if (count === 1) effects?.bridge(); else effects?.starroot(count);
    lastConnectionCount = count;
  }
  if (state.won && !endingShown) {
    endingShown = true; sound?.victory(); effects?.pause();
    $('#ending').hidden = false;
  }
  draw();
}
function unlock() { effects?.unlock(); }
function actInput() {
  if (!started || paused || journal || state.won) return;
  feedbackUntil = performance.now() + 6500;
  unlock();
  const memories = state.memories.length;
  act(state);
  if (state.memories.length > memories) effects?.memory();
  refresh();
}
function echoInput() {
  if (!started || paused || journal) return;
  feedbackUntil = performance.now() + 6500;
  unlock(); const before = state.echo; echoAction(state);
  if (state.echo && !before) effects?.echo();
  refresh();
}
function advance() { if (!started || paused || journal) return; acknowledge(state); refresh(); canvas.focus({ preventScroll: true }); }
function pause() {
  if (!started || state.won) return;
  paused = !paused; keys.clear(); stopSteering();
  $('#pause-card').hidden = !paused;
  if (paused) { sound?.pause(); effects?.pause(); } else { sound?.resume(); effects?.resume(); }
  refresh();
}
function start() {
  if (fullWorld && (artFailed || !Object.values(sampleArt).every(loaded))) return;
  if (immersive) requestPresentation();
  started = true; document.body.classList.add('playing'); $('#entry').hidden = true;
  sound?.prologue(); unlock();
  // Exploration follows the approved opening cue; pause and visibility keep its place.
  refresh(); canvas.focus({ preventScroll: true });
}
function journalInput() { if (!started || paused || state.won) return; journal = !journal; keys.clear(); stopSteering(); refresh(); }
const directionFor = key => ({ ArrowUp: [0, -1], w: [0, -1], ArrowDown: [0, 1], s: [0, 1], ArrowLeft: [-1, 0], a: [-1, 0], ArrowRight: [1, 0], d: [1, 0] })[key.length === 1 ? key.toLowerCase() : key];
function step(dx, dy) {
  if (!started || paused || journal) return;
  const before = state.sparks.length;
  const position = { ...state.player };
  move(state, dx, dy);
  if (position.x !== state.player.x || position.y !== state.player.y) { lastStepAt = performance.now(); if (position.x !== state.player.x) facing = state.player.x > position.x ? 1 : -1; }
  if (state.sparks.length > before) effects?.firefly(state.sparks.length, state.sparks.length === 3);
}
addEventListener('keydown', event => {
  if (event.target instanceof HTMLButtonElement && (event.key === ' ' || event.key === 'Enter')) return;
  const direction = directionFor(event.key);
  if (direction) {
    event.preventDefault();
    if (started && !paused && !journal) canvas.focus({ preventScroll: true });
    if (!event.repeat) step(direction[0] * 8, direction[1] * 8);
    keys.add(event.key);
  }
  if (event.repeat) return;
  if (['f', 'F'].includes(event.key)) { event.preventDefault(); actInput(); }
  if (['e', 'E'].includes(event.key)) { event.preventDefault(); echoInput(); }
  if (['p', 'P', 'Escape'].includes(event.key)) { event.preventDefault(); if (journal) journalInput(); else pause(); }
  if (['j', 'J'].includes(event.key)) journalInput();
  if (event.key === 'Enter' && state.dialogue.length) { event.preventDefault(); advance(); }
  refresh();
});
addEventListener('keyup', event => keys.delete(event.key));
addEventListener('blur', () => { keys.clear(); stopSteering(); });
addEventListener('resize', stopSteering);
document.addEventListener('fullscreenchange', () => { stopSteering(); refresh(); });
document.addEventListener('visibilitychange', () => { if (document.hidden) { keys.clear(); stopSteering(); } });
for (const button of document.querySelectorAll('[data-direction]')) {
  if (immersive) continue;
  let pointer;
  const stop = () => { keys.delete(button.dataset.direction); pointer = null; };
  button.addEventListener('pointerdown', event => {
    event.preventDefault(); unlock(); pointer = event.pointerId; button.setPointerCapture(pointer);
    const direction = directionFor(button.dataset.direction); step(direction[0] * 8, direction[1] * 8); keys.add(button.dataset.direction); refresh();
  });
  button.addEventListener('pointerup', stop); button.addEventListener('pointercancel', stop); button.addEventListener('lostpointercapture', stop);
  button.addEventListener('contextmenu', event => event.preventDefault());
}
// The released continuous thumb pad: pointer ownership and cardinal steering,
// plus a small neutral centre. Ordinary movement still uses the shared collision core.
function stopSteering() { steeringPointer = null; touchDirection = null; }
function steer(event) {
  const bounds = $('.steering').getBoundingClientRect();
  const x = event.clientX - (bounds.left + bounds.width / 2), y = event.clientY - (bounds.top + bounds.height / 2);
  touchDirection = Math.hypot(x,y) < 12 ? null : Math.abs(x) > Math.abs(y) ? [Math.sign(x),0] : [0,Math.sign(y)];
}
if (immersive) {
  const pad = $('.steering');
  pad.setAttribute('aria-label', 'Drag to walk. Release or return to the centre to stop.');
  pad.addEventListener('contextmenu', event => event.preventDefault());
  pad.addEventListener('pointerdown', event => {
    if (!started || paused || journal || state.dialogue.length || state.choice || state.won || steeringPointer !== null) return;
    event.preventDefault(); unlock(); steeringPointer = event.pointerId; lastPointerKind = event.pointerType || null;
    try { pad.setPointerCapture(event.pointerId); } catch {}
    steer(event); if (touchDirection) step(touchDirection[0] * 8, touchDirection[1] * 8); refresh();
  });
  pad.addEventListener('pointermove', event => { if (event.pointerId === steeringPointer) { event.preventDefault(); steer(event); } });
  for (const kind of ['pointerup','pointercancel','lostpointercapture']) pad.addEventListener(kind, event => { if (event.pointerId === steeringPointer) stopSteering(); });
}
function requestPresentation() {
  if (document.fullscreenEnabled !== true || document.fullscreenElement || typeof document.documentElement.requestFullscreen !== 'function') return;
  try { const request = document.documentElement.requestFullscreen(); if (request?.catch) request.catch(() => {}); } catch {}
}
$('#fullscreen').onclick = requestPresentation;
$('#pause-notebook').onclick = () => { if (paused) pause(); journalInput(); };
if (immersive) $('#entry-controls').textContent = 'Drag across the steering circle to walk. Release or return to its centre to stop. Tap the nearby action, and read each line at your own pace. There is no timer.';
$('#start').onclick = start; $('#next').onclick = advance;
$('#act').onclick = actInput; $('#echo').onclick = echoInput; $('#pause').onclick = pause; $('#resume').onclick = pause;
$('#notebook').onclick = journalInput; $('#close-journal').onclick = journalInput;
$('#previous-memory').onclick = () => { journalPage--; refresh(); };
$('#next-memory').onclick = () => { journalPage++; refresh(); };
for (const button of document.querySelectorAll('[data-answer]')) button.onclick = () => { answerBridge(state, button.dataset.answer); refresh(); };
for (const button of document.querySelectorAll('[data-restart]')) button.onclick = () => location.reload();
function frame(time) {
  const dt = Math.min(.04, (time - last) / 1000 || 0); last = time;
  if (started && !paused && !state.won) {
    if (!document.hidden && !exploring) {
      openingElapsed += dt;
      const audio = sound?.snapshot();
      if (audio?.ended || openingElapsed >= 15 && (!audio?.enabled || audio?.blocked || !audio)) {
        exploring = true; sound?.exploration();
      }
    }
    if (journal) { refresh(); requestAnimationFrame(frame); return; }
    let x = touchDirection?.[0] || 0, y = touchDirection?.[1] || 0;
    keys.forEach(key => { const d = directionFor(key); if (d) { x += d[0]; y += d[1]; } });
    if (x || y) { const length = Math.hypot(x, y); step(x / length * 65 * dt, y / length * 65 * dt); }
    tick(state, dt); refresh();
  }
  requestAnimationFrame(frame);
}
// Inspection is read-only. QA must play with ordinary keyboard/touch controls.
window.__moonwell = { snapshot: () => JSON.parse(JSON.stringify(state)), controls: () => ({ pointerActive: steeringPointer !== null, direction: touchDirection ? [...touchDirection] : null, pointerKind: lastPointerKind }) };
if (state.slice) { $('#entry-title').textContent = 'The path around the trunk'; $('#entry-copy').textContent = 'Begin after the bridge. Luna has found her grandmother Eir. Help her light a safe detour for the waiting adult and child.'; $('#start').textContent = 'Walk into the hollow'; }
refresh(); requestAnimationFrame(frame);
