// Homecoming rules and coordinates. Rendering and input remain in game.js.
export const TILE = 16;
export const WORLD = Object.freeze({ width: 320, height: 208 });
const point = (x, y) => ({ x, y });
const rect = (x, y, w = 16, h = 16, kind = 'tree') => ({ x, y, w, h, kind });
const near = (a, b, radius = 14) => Math.hypot(a.x - b.x, a.y - b.y) <= radius;
const copyPath = path => path.map(p => ({ ...p }));
const trees = cells => cells.map(([x, y]) => rect(x, y));
const HOLLOW_WAITING = [point(40, 120), point(32, 152), point(56, 176)];
const HOLLOW_REST = [point(240, 144), point(264, 160), point(240, 176)];
const CREW_SPACING = 36;
const CROSSING_WAITING = [point(192, 152), point(208, 168), point(192, 176)];
const GROVE_WAITING = [point(64, 136), point(32, 176), point(80, 176)];
const GROVE_REST = [point(176, 176), point(224, 144), point(168, 160)];
const CHILD_STEPS = [GROVE_REST[2], point(176, 168), point(208, 168), point(240, 144)];
export const SCENES = {
  glade: {
    name: 'Lantern Glade', start: point(48, 160),
    lantern: point(112, 144), sparks: [point(128, 144), point(208, 144), point(240, 64)],
    exit: point(288, 64), exitName: 'Moonroot Crossing',
    obstacles: [...trees([[32, 48], [64, 48], [160, 112], [160, 128], [224, 96], [256, 96]]), rect(48, 80, 32, 16, 'trunk')],
    paths: [[point(48, 160), point(128, 160), point(224, 160), point(248, 144), point(248, 64), point(288, 64)], [point(48, 160), point(64, 104), point(64, 32)]],
    memory: { ...point(80, 176), title: 'A folded leaf', text: 'Luna: “Last autumn we folded a leaf over the lantern in the drizzle. Grandma got rain down her collar. She said the leaf might suit her better.”' },
  },
  crossing: {
    name: 'Moonroot Crossing', start: point(64, 56), north: point(160, 64), south: point(160, 152),
    exit: point(288, 168), exitName: 'Whispering Hollow', back: point(32, 56),
    obstacles: trees([[32, 32], [256, 32], [32, 160], [240, 176]]),
    paths: [[point(32, 56), point(160, 56)], [point(160, 152), point(288, 168)]],
    memory: { ...point(224, 152), title: 'Silver thread', text: 'Luna: “My mitten loop broke here. Grandma sewed it with thread from her pocket. I held the lantern while she worked.”' },
  },
  hollow: {
    name: 'Whispering Hollow', start: point(64, 168), A: point(80, 144), B: point(144, 72), C: point(240, 144),
    exit: point(288, 160), exitName: 'Starfall Grove', back: point(32, 176),
    // The broken bank reaches the lower boundary. Only the upper detour is passable.
    obstacles: [...trees([[32, 32], [64, 32], [272, 32], [288, 96]]), rect(112, 112, 96, 80, 'bank'), rect(144, 96, 32, 16, 'trunk')],
    paths: [[point(48, 144), point(80, 144), point(80, 72), point(240, 72), point(240, 144), point(288, 160)]],
    memory: { ...point(256, 64), title: 'An empty seed shell', text: 'Luna: “I blew into a seed shell after I stopped being scared. The hollow squeaked back. Grandma tried too, but only got bits on her tongue.”' },
  },
  grove: {
    name: 'Starfall Grove', start: point(48, 160), V: point(240, 72), M: point(112, 72), footing: point(192, 144), home: point(288, 40), back: point(32, 176),
    obstacles: [...trees([[32, 32], [64, 32], [144, 112], [160, 112], [256, 112], [272, 112]]), rect(96, 48, 32, 16, 'well')],
    paths: [[point(48, 160), point(112, 160), point(112, 72), point(240, 72), point(288, 40)], [point(160, 160), point(192, 144), point(240, 144), point(240, 72)], [point(176,144), point(224,144), point(224,72), point(272,40)]],
  },
};

function line(s, speaker, text) { s.dialogue.push({ speaker, text }); }
function tell(s, text) { s.message = text; }
export function createGame({ scene = 'glade' } = {}) {
  const slice = scene === 'hollow';
  const s = {
    area: slice ? 'hollow' : 'glade', groupArea: slice ? 'hollow' : 'crossing', player: { ...SCENES[slice ? 'hollow' : 'glade'].start },
    lantern: slice ? 'carried' : 'ground', sparks: slice ? [0, 1, 2] : [],
    connections: { bridge: null, hollow: null, village: null },
    recording: null, echo: null, hold: null, echoLearned: slice, echoDemonstrated: false,
    dialogue: [], choice: false, introduced: {}, memories: [], message: '',
    crew: null, crewArrived: false, crossingCrew: null, groveCrew: null, homeCrew: null, afterHelpCrew: null, crossed: false, metEir: slice,
    childProgress: 0, childHelped: false, homeWalk: 0, won: false, slice,
  };
  if (slice) {
    s.connections.bridge = [point(160, 64), point(160, 152)];
    s.introduced.crossing = true;
    s.crossed = true;
  }
  enterScene(s, s.area);
  return s;
}
export function acknowledge(s) { s.dialogue.shift(); }
function enterScene(s, area, spawn) {
  s.area = area; s.player = { ...(spawn || SCENES[area].start) };
  s.recording = null; s.echo = null; s.hold = null;
  s.message = '';
  if (area === 'hollow' && s.connections.hollow && !s.crew) s.crewArrived = true;
  if (s.introduced[area]) return;
  s.introduced[area] = true;
  if (area === 'glade') line(s, 'Luna', 'Grandma will have the stove going. Our usual path is under that fallen tree.');
  if (area === 'crossing') {
    line(s, 'Eir', 'Luna! Over here, on the south bank. I came out to meet you.');
    line(s, 'Luna', 'Grandma! I found your lantern.');
    line(s, 'Eir', 'A branch caught its strap as I brought these two across. We reached this fixed light before the bridge drew back.');
    line(s, 'Eir', 'Our old bridge riddle: how can you show the way without going ahead?');
    s.choice = true;
  }
  if (area === 'hollow') {
    line(s, 'Eir', 'The trunk is across the old path. We can walk around, but the others need a steady light to follow.');
    line(s, 'Luna', 'I can’t stand at both stones, Grandma.');
    line(s, 'Eir', 'Remember when I waited here with the light last autumn? This lantern can keep your footsteps.');
    line(s, 'Eir', 'Choose “Shine here” at the near stone. Walk around the trunk. Create an echo: its light returns to the start and waits there.');
    s.echoLearned = true;
  }
  if (area === 'grove') {
    line(s, 'Eir', 'Two chimes are already lit: the bridge and the hollow. The last one marks our village path.');
    line(s, 'Luna', 'I’ll start at the village mark, then bring the lantern back to the well.');
  }
}
export function answerBridge(s, answer) {
  if (!s.choice || s.dialogue.length) return;
  s.choice = false;
  line(s, 'Eir', answer === 'stay' ? 'Yes. Stay with the light. I’ll hold this end from the fixed rest light.' : 'Call as loudly as you like. But the roots need light on both banks. I’ll hold this end.');
  line(s, 'Eir', 'Bring the lantern to the north mark and choose “Shine here”. We can light both ends together.');
}
export function obstacles(s) {
  const result = [...SCENES[s.area].obstacles];
  if (s.area === 'crossing') {
    // Water touches both boundaries. An open bridge is the only north/south crossing.
    result.push(rect(16, 88, 128, 40, 'water'), rect(176, 88, 128, 40, 'water'));
    if (!s.connections.bridge) result.push(rect(144, 88, 32, 40, 'water'));
  }
  return result;
}
export function canStand(s, x, y) {
  const radius = 4;
  if (x - radius < 16 || x + radius > 304 || y - radius < 16 || y + radius > 192) return false;
  return !obstacles(s).some(o => x + radius > o.x && x - radius < o.x + o.w && y + radius > o.y && y - radius < o.y + o.h);
}
export function move(s, dx, dy) {
  if (s.dialogue.length || s.choice || s.won || s.homeCrew && !s.homeCrew.ready || s.lantern === 'docked' && s.area !== 'grove') return;
  // Substeps preserve contact even for taps or a delayed animation frame.
  const steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / 2));
  for (let i = 0; i < steps; i++) {
    if (canStand(s, s.player.x + dx / steps, s.player.y)) s.player.x += dx / steps;
    if (canStand(s, s.player.x, s.player.y + dy / steps)) s.player.y += dy / steps;
    if (s.recording && s.lantern === 'carried') {
      const last = s.recording.path.at(-1);
      if (!near(last, s.player, .5)) s.recording.path.push({ ...s.player });
    }
    if (s.hold && !near(s.player, SCENES[s.area][s.hold], 12)) s.hold = null;
  }
  if (s.area === 'glade' && s.lantern === 'carried') {
    SCENES.glade.sparks.forEach((spark, i) => {
      if (!s.sparks.includes(i) && near(s.player, spark, 12)) {
        s.sparks.push(i); tell(s, `${s.sparks.length} of the lantern’s 3 sparks are back in the glass.`);
        if (s.sparks.length === 3) line(s, 'Luna', 'All three. Now I can see the old opening towards the river.');
      }
    });
  }
  if (s.area === 'crossing' && s.connections.bridge && s.player.y >= 144) s.crossed = true;
  checkConnections(s);
}
export function lit(s, id) {
  const scene = SCENES[s.area];
  if (s.area === 'crossing' && id === 'south') return true;
  if (id === 'M' && s.area === 'grove') return s.lantern === 'docked';
  if (s.lantern === 'carried' && s.hold === id && near(s.player, scene[id], 12)) return true;
  return !!(s.echo?.holding && s.recording?.start === id && near(s.echo, scene[id]));
}
function beginRecording(s, id) {
  if (s.echo) { tell(s, 'Recall the echo before beginning another path.'); return; }
  s.recording = { area: s.area, start: id, path: [{ ...s.player }] };
  s.hold = id;
  tell(s, 'The mark is lit while you stand here. Your lantern is now keeping your steps.');
}
export function echoAction(s) {
  if (s.dialogue.length || s.choice || !s.echoLearned || s.won) return;
  if (s.echo) {
    s.echo = null; tell(s, 'Echo recalled. The start mark is ready whenever you want to try again.');
    return;
  }
  if (!s.recording || s.recording.area !== s.area) {
    tell(s, 'Choose “Shine here” at the start mark first.'); return;
  }
  if (s.lantern !== 'carried') { tell(s, 'Take the lantern, then create another echo.'); return; }
  const path = copyPath(s.recording.path).reverse();
  s.echo = { ...path[0], path, index: 0, holding: path.length === 1 };
  s.echoDemonstrated = true;
  tell(s, 'The echo follows your steps back to the start. It will wait there. Take your time.');
  checkConnections(s);
}
function checkConnections(s) {
  if (s.area === 'crossing' && !s.connections.bridge && lit(s, 'north') && lit(s, 'south')) {
    s.connections.bridge = [point(160, 64), point(160, 152)];
    tell(s, 'Both banks are lit. The root bridge holds.');
    line(s, 'Eir', 'There it is. Come across, Luna. We’re waiting on this side.');
  }
  const hollow = s.area === 'hollow', key = hollow ? 'hollow' : 'village';
  if (!hollow && s.area !== 'grove') return;
  const start = hollow ? 'A' : 'V', end = hollow ? 'C' : 'M';
  const r = s.recording;
  if (s.connections[key] || !r || r.start !== start || !near(r.path.at(-1), SCENES[s.area][end]) || !lit(s, start) || !lit(s, end)) return;
  s.connections[key] = copyPath(r.path);
  s.echo = null; s.hold = null;
  if (hollow) {
    s.crew = {
      distance: 0, spacing: CREW_SPACING,
      paths: HOLLOW_WAITING.map((start, i) => [{ ...start }, point(64, 144), ...copyPath(r.path), { ...HOLLOW_REST[i] }]),
    };
    s.crewArrived = false;
    line(s, 'Luna', 'Now you can come.'); line(s, 'Eir', 'We can see the way.');
    tell(s, 'Let the others reach the far rest place before leaving.');
  } else {
    tell(s, 'All three paths hold their own light. The others are coming.');
    s.groveCrew = {
      distance: 0, spacing: 28,
      paths: GROVE_WAITING.map((start, i) => [{ ...start }, point(96, 160), point(136, 160), { ...GROVE_REST[i] }]),
    };
  }
}
function pathLength(path) { return path.slice(1).reduce((sum, p, i) => sum + Math.hypot(p.x - path[i].x, p.y - path[i].y), 0); }
export function alongPath(path, distance) {
  for (let i = 1; i < path.length; i++) {
    const a = path[i - 1], b = path[i], d = Math.hypot(b.x - a.x, b.y - a.y);
    if (distance <= d) return d ? point(a.x + (b.x - a.x) * distance / d, a.y + (b.y - a.y) * distance / d) : { ...b };
    distance -= d;
  }
  return { ...path.at(-1) };
}
function advanceParty(party, dt, speed = 42) {
  if (!party || party.arrived) return false;
  party.distance += dt * speed;
  party.arrived = party.paths.every((route, i) => party.distance >= pathLength(route) + i * party.spacing);
  return party.arrived;
}
function partyPositions(party) {
  return party.paths.map((route, i) => alongPath(route, Math.max(0, party.distance - i * party.spacing)));
}
export function tick(s, dt) {
  if (s.dialogue.length || s.choice || s.won) return;
  if (s.echo && !s.echo.holding) {
    let remaining = 80 * dt;
    while (s.echo.index < s.echo.path.length - 1 && remaining > 0) {
      const next = s.echo.path[s.echo.index + 1], distance = Math.hypot(next.x - s.echo.x, next.y - s.echo.y);
      if (distance <= remaining) { Object.assign(s.echo, next); s.echo.index++; remaining -= distance; }
      else { s.echo.x += (next.x - s.echo.x) / distance * remaining; s.echo.y += (next.y - s.echo.y) / distance * remaining; remaining = 0; }
    }
    if (s.echo.index === s.echo.path.length - 1) s.echo.holding = true;
  }
  checkConnections(s);
  if (s.area === 'crossing') advanceParty(s.crossingCrew, dt);
  if (s.area === 'hollow' && s.crew && !s.crewArrived) {
    if (advanceParty(s.crew, dt)) {
      s.crewArrived = true;
      tell(s, 'Everyone is safely across.');
    }
  }
  if (s.area === 'grove' && advanceParty(s.groveCrew, dt)) {
    line(s, 'Eir', 'Shall we go home?');
    line(s, 'Child', 'I can’t see where to put my foot.');
    line(s, 'Luna', near(s.player, SCENES.grove.footing, 24) ? 'I’m here. I’ll hold the light.' : 'I’m coming.');
    tell(s, 'The child is waiting at the wet root.');
  }
  if (s.area === 'grove' && s.connections.village && !s.childHelped) {
    if (s.groveCrew?.arrived && !s.dialogue.length && s.hold === 'footing' && s.lantern === 'carried' && near(s.player, SCENES.grove.footing, 12)) {
      s.childProgress = Math.min(1, s.childProgress + dt / 2.5);
      if (s.childProgress === 1) {
        s.childHelped = true; s.hold = null;
        s.homeCrew = { path: [point(176, 144), point(224, 144), point(224, 72), point(272, 40)], approach: 0, ready: false, distance: 0, limit: 0, arrived: false };
        s.afterHelpCrew = { distance: 0, spacing: 0, paths: [[point(224, 144), point(240, 144), point(240, 88), point(272, 88)], [point(240, 144), point(240, 88)]] };
        line(s, 'Child', 'I’ve got your hand.');
        tell(s, 'The child is safely across.');
        return;
      }
    }
  }
  if (s.area === 'grove' && s.childHelped) {
    advanceParty(s.afterHelpCrew, dt);
    if (!s.homeCrew.ready) {
      s.homeCrew.approach = Math.min(32, s.homeCrew.approach + dt * 65);
      if (s.homeCrew.approach === 32) {
        s.homeCrew.ready = true;
        line(s, 'Eir', 'Now?'); line(s, 'Luna', 'Now.');
        tell(s, 'Grandma is beside you.');
      }
      return;
    }
    // Eir shares the short authored home path one tile to Luna's left.
    // The fixed sections advance at walking speed; there is no escort AI.
    const route = s.homeCrew.path;
    const p = s.player;
    let limit = Math.max(0, Math.min(48, p.x - 192));
    if (p.x >= 216 && p.y < 144) limit = Math.max(limit, 48 + 144 - Math.max(72, p.y));
    if (p.x >= 232 && p.y <= 88) limit = Math.max(limit, 120 + Math.min(Math.hypot(48, 32), Math.hypot(Math.max(0, p.x - 240), Math.max(0, 72 - p.y))));
    if (near(p, SCENES.grove.home, 14)) limit = pathLength(route);
    s.homeCrew.limit = Math.max(s.homeCrew.limit, limit);
    s.homeCrew.distance = Math.min(s.homeCrew.limit, s.homeCrew.distance + dt * 65);
    s.homeCrew.arrived = s.homeCrew.distance >= pathLength(route);
  }
  if (s.area === 'grove' && s.childHelped && s.homeCrew.arrived && near(s.player, SCENES.grove.home, 14)) {
    s.homeWalk += dt;
    s.message = '';
    if (s.homeWalk >= 1.75) s.won = true;
  } else s.homeWalk = 0;
}
export function crewPositions(s) {
  if (s.groupArea !== s.area) return [];
  if (s.area === 'crossing') return s.crossingCrew ? partyPositions(s.crossingCrew) : CROSSING_WAITING.map(p => ({ ...p }));
  if (s.area === 'hollow') {
    if (s.crew) return partyPositions(s.crew);
    if (s.connections.hollow) return HOLLOW_REST.map(p => ({ ...p }));
    return HOLLOW_WAITING.map(p => ({ ...p }));
  }
  if (s.area === 'grove') {
    if (!s.connections.village) return GROVE_WAITING.map(p => ({ ...p }));
    if (!s.groveCrew?.arrived) return s.groveCrew ? partyPositions(s.groveCrew) : GROVE_WAITING.map(p => ({ ...p }));
    const child = alongPath(CHILD_STEPS, s.childProgress * pathLength(CHILD_STEPS));
    if (s.childHelped) return [s.homeCrew.ready ? alongPath(s.homeCrew.path, s.homeCrew.distance) : alongPath([GROVE_REST[0], point(176, 144)], s.homeCrew.approach), ...partyPositions(s.afterHelpCrew)];
    return [{ ...GROVE_REST[0] }, { ...GROVE_REST[1] }, child];
  }
  return [];
}
export function interaction(s) {
  const p = s.player, scene = SCENES[s.area];
  const at = target => target && near(p, target, 16);
  const atMark = target => target && near(p, target, 12);
  if (scene.memory && at(scene.memory) && !s.memories.includes(s.area)) return { id: 'memory', label: 'Remember last autumn' };
  if (s.area === 'glade') {
    if (s.lantern === 'ground' && at(scene.lantern)) return { id: 'lantern', label: 'Take the lantern' };
    if (at(scene.exit)) return { id: 'forward', label: 'Go to the river' };
  }
  if (s.area === 'crossing') {
    if (atMark(scene.north) && !s.connections.bridge) return { id: 'north', label: 'Shine here' };
    if (at(crewPositions(s)[0])) return { id: 'talk', label: 'Talk to Grandma' };
  }
  if (s.area === 'hollow' && !s.connections.hollow) {
    if (atMark(scene.A)) return { id: 'A', label: 'Shine here · start' };
    if (atMark(scene.C)) return { id: 'C', label: 'Shine here · far end' };
  }
  if (s.area === 'grove') {
    if (atMark(scene.M)) return { id: 'M', label: s.lantern === 'docked' ? 'Take the lantern' : 'Set lantern in ring' };
    if (atMark(scene.V) && !s.connections.village) return { id: 'V', label: 'Shine here · start' };
    if (atMark(scene.footing) && s.connections.village && !s.childHelped) return s.groveCrew?.arrived ? { id: 'footing', label: 'Shine on the child’s footing' } : { id: 'wait', label: 'Wait for the others' };
  }
  if (at(scene.exit)) return { id: 'forward', label: s.slice ? 'Finish the hollow scene' : `Continue to ${scene.exitName}` };
  if (at(scene.back)) return { id: 'back', label: 'Walk back' };
  if (s.area === 'hollow' && at(crewPositions(s)[0])) return { id: 'talk', label: 'Ask Grandma again' };
  return null;
}
export function act(s) {
  if (s.dialogue.length || s.choice || s.won) return;
  const action = interaction(s);
  if (!action) { tell(s, 'Walk closer to a mark, a person, or a path opening.'); return; }
  const id = action.id;
  if (id === 'wait') { tell(s, 'They’re following the lit path. Give them a moment.'); return; }
  if (id === 'memory') {
    s.memories.push(s.area); line(s, SCENES[s.area].memory.title, SCENES[s.area].memory.text); return;
  }
  if (id === 'lantern') {
    s.lantern = 'carried';
    line(s, 'Luna', 'Grandma’s lantern. Why is it out here? The strap has snapped below her three crooked stitches.');
    tell(s, 'Bring the lantern’s three sparks back into its glass.');
    return;
  }
  if (id === 'talk') {
    if (s.area === 'crossing') {
      if (s.metEir) { line(s, 'Eir', 'We’re right behind you. Follow the south bank to the hollow.'); return; }
      s.metEir = true;
      s.crossingCrew = { distance: 0, spacing: 24, paths: [
        [CROSSING_WAITING[0], point(256, 152), point(272, 144)],
        [CROSSING_WAITING[1], point(256, 160), point(280, 168)],
        [CROSSING_WAITING[2], point(224, 160), point(264, 160), point(264, 184)],
      ] };
      line(s, 'Eir', 'There you are. I wasn’t going to leave without you.');
      line(s, 'Luna', 'I can go ahead to the next light. Stay with them, Grandma.');
      line(s, 'Eir', 'We’ll follow the safe stretches. The Moonwell is just beyond the hollow.');
    } else line(s, 'Eir', 'Start at the near stone with “Shine here”. Walk around the trunk. Your echo can wait at the start while you light the far stone.');
    return;
  }
  if (id === 'north') { if (s.lantern === 'carried' && s.sparks.length === 3) { s.hold = id; checkConnections(s); } return; }
  if (id === 'A' || id === 'V') {
    if (s.lantern !== 'carried') { tell(s, 'Take the lantern from the well first.'); return; }
    beginRecording(s, id);
    if (id === 'V' && !s.sawWindow) { s.sawWindow = true; line(s, 'Luna', 'There’s our kitchen window. We’re nearly home.'); }
    return;
  }
  if (id === 'C') {
    if (!s.recording) { tell(s, 'Begin at the near stone so the lantern can keep the path you walk.'); return; }
    s.hold = 'C'; tell(s, 'This end is lit. The start needs a light at the same time.'); checkConnections(s); return;
  }
  if (id === 'M') {
    s.lantern = s.lantern === 'docked' ? 'carried' : 'docked'; s.hold = null;
    tell(s, s.lantern === 'docked' ? 'The real lantern lights the well ring. The village mark must also be lit.' : 'Lantern taken. Completed paths keep their light.');
    checkConnections(s); return;
  }
  if (id === 'footing') {
    if (s.lantern !== 'carried') { tell(s, 'Bring the lantern from the well to light this next step.'); return; }
    s.hold = 'footing'; line(s, 'Luna', 'I’ll stay right here.'); tell(s, 'Wait by the wet root while the child takes the next step.'); return;
  }
  if (id === 'back') {
    const previous = { crossing: 'glade', hollow: 'crossing', grove: 'hollow' }[s.area];
    const spawn = { crossing: point(272, 64), hollow: point(272, 168), grove: point(272, 160) }[s.area];
    if (s.lantern === 'docked') { tell(s, 'Take the lantern before going back.'); return; }
    enterScene(s, previous, spawn); return;
  }
  if (id === 'forward') {
    if (s.area === 'glade') {
      if (s.lantern !== 'carried' || s.sparks.length !== 3) { tell(s, 'The lantern needs all three sparks before you take the dark path.'); return; }
      enterScene(s, 'crossing'); return;
    }
    if (s.area === 'crossing') {
      if (!s.connections.bridge || !s.crossed || !s.metEir) { tell(s, 'Meet Grandma beside the south-bank rest light before going ahead.'); return; }
      if (s.crossingCrew && !s.crossingCrew.arrived) { tell(s, 'The others are following the south bank. Wait here for them.'); return; }
      if (s.groupArea === 'crossing') s.groupArea = 'hollow';
      enterScene(s, 'hollow'); return;
    }
    if (!s.connections.hollow || !s.crewArrived) { tell(s, 'Make the detour steady, then let the others follow its light.'); return; }
    if (s.slice) { s.sliceFinished = true; tell(s, 'The hollow route holds. Everyone has reached the far side.'); return; }
    if (s.groupArea === 'hollow') s.groupArea = 'grove';
    enterScene(s, 'grove');
  }
}
export function objective(s) {
  if (s.won) return 'Home, together.';
  if (s.area === 'glade') return s.lantern === 'ground' ? 'Find Eir’s dropped lantern beside the old path.' : s.sparks.length < 3 ? `Restore the lantern: ${s.sparks.length} / 3 sparks.` : 'Follow the warm opening to the river.';
  if (s.area === 'crossing') return !s.connections.bridge ? 'Light the north bridge mark. Eir holds the south end.' : !s.metEir ? 'Cross the bridge alone and meet Grandma at the rest light.' : 'Follow the south bank to Whispering Hollow.';
  if (s.area === 'hollow') {
    if (s.connections.hollow) return s.crewArrived ? 'Continue through the warm opening to Starfall Grove.' : 'The detour now holds its own light.';
    if (!s.recording) return 'Choose “Shine here” at the near stone to start keeping your steps.';
    if (!s.echo) return 'Walk the open detour. Create an echo to hold the start.';
    return 'Let the echo wait at the start. Walk around and light the far stone.';
  }
  if (!s.connections.village) return !s.recording ? 'Start at the village mark. Choose “Shine here”.' : 'Let an echo hold the village mark. Put the lantern in the well ring.';
  if (!s.groveCrew?.arrived) return s.lantern === 'docked' ? 'Take the lantern while the others follow the lit path.' : 'Meet the others at the wet root.';
  if (!s.childHelped) return s.lantern === 'docked' ? 'Take the lantern. Bring its light back to the waiting child.' : 'Light the child’s next footing, then wait there.';
  if (!s.homeCrew.ready) return 'Wait a moment for Grandma beside the root.';
  if (s.homeWalk > 0) return 'Home, together.';
  return near(s.player, SCENES.grove.home, 14) && !s.homeCrew.arrived ? 'Wait for Grandma by the kitchen window.' : 'Walk with Grandma towards your kitchen window.';
}
