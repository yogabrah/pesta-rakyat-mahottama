(function(){
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.getElementById('sitePlan');
  const scene = svg ? svg.querySelector('#scene') : null;
  const fallback = svg ? svg.querySelector('#fallback') : null;
  const plan = document.querySelector('.plan');
  const note = document.getElementById('planNote');
  const CX = 540;
  const CY = 150;
  const UX = 6;
  const UY = 3;

  const notes = {
    day: 'Tata letak mengikuti denah Lapangan Puputan Klungkung: panggung di utara, Balai Budaya dan skate park di selatan. Skema tidak berskala; detail final mengikuti survei lokasi.',
    night: 'Simulasi malam puncak: panggung, wahana, dan area kembang api aktif hingga 00.15 WITA.',
    safety: 'Overlay keselamatan: jalur evakuasi, titik kumpul, dan radius aman kembang api.'
  };

  function make(tag, attrs, parent){
    const node = document.createElementNS(NS, tag);
    if (attrs) {
      Object.keys(attrs).forEach(function(key){
        if (attrs[key] !== undefined && attrs[key] !== null) node.setAttribute(key, attrs[key]);
      });
    }
    (parent || scene).appendChild(node);
    return node;
  }

  function P(x, y, h){
    return [CX + (x - y) * UX, CY + (x + y) * UY - (h || 0)];
  }

  function points(list){
    return list.map(function(pt){ return pt[0].toFixed(2) + ',' + pt[1].toFixed(2); }).join(' ');
  }

  function polygon(parent, list, attrs){
    return make('polygon', Object.assign({ points: points(list) }, attrs), parent);
  }

  function line(parent, a, b, attrs){
    return make('line', Object.assign({ x1: a[0], y1: a[1], x2: b[0], y2: b[1] }, attrs), parent);
  }

  function label(parent, x, y, text, attrs){
    const node = make('text', Object.assign({
      x: x, y: y, fill: 'var(--plan-ink)', 'font-size': '12', 'letter-spacing': '.08em'
    }, attrs), parent);
    node.textContent = text;
    return node;
  }

  function zoneGroup(id, title){
    const group = make('g', { 'class': 'zone', 'data-zone': id });
    const t = make('title', null, group);
    t.textContent = title;
    return group;
  }

  function isoBox(parent, x, y, w, d, h, top, side, side2){
    const t = [P(x, y, h), P(x + w, y, h), P(x + w, y + d, h), P(x, y + d, h)];
    const common = {
      stroke: 'var(--plan-ink)',
      'stroke-width': '0.7',
      'stroke-opacity': '0.3',
      'stroke-linejoin': 'round'
    };
    polygon(parent, [t[1], t[2], [t[2][0], t[2][1] + h], [t[1][0], t[1][1] + h]], Object.assign({ fill: side }, common));
    polygon(parent, [t[2], t[3], [t[3][0], t[3][1] + h], [t[2][0], t[2][1] + h]], Object.assign({ fill: side2 || side }, common));
    polygon(parent, t, Object.assign({ fill: top }, common));
  }

  function isoSlab(parent, x, y, w, d, topH, thick, top, side){
    const t = [P(x, y, topH), P(x + w, y, topH), P(x + w, y + d, topH), P(x, y + d, topH)];
    const b = [P(x, y, topH - thick), P(x + w, y, topH - thick), P(x + w, y + d, topH - thick), P(x, y + d, topH - thick)];
    const common = {
      stroke: 'var(--plan-ink)',
      'stroke-width': '0.7',
      'stroke-opacity': '0.3',
      'stroke-linejoin': 'round'
    };
    polygon(parent, [t[1], t[2], b[2], b[1]], Object.assign({ fill: side }, common));
    polygon(parent, [t[2], t[3], b[3], b[2]], Object.assign({ fill: side }, common));
    polygon(parent, t, Object.assign({ fill: top }, common));
  }

  function flatQuad(parent, x, y, w, d, attrs){
    polygon(parent, [P(x, y), P(x + w, y), P(x + w, y + d), P(x, y + d)], attrs);
  }

  function buildPlan(){
    const defs = make('defs', null, scene);
    const arrow = make('marker', {
      id: 'evacArrow', viewBox: '0 0 10 10', refX: '8', refY: '5',
      markerWidth: '6', markerHeight: '6', orient: 'auto-start-reverse'
    }, defs);
    make('path', { d: 'M0 0L10 5L0 10Z', fill: '#53624f' }, arrow);

    const ground = make('g', null, scene);
    const corners = [P(0, 0), P(100, 0), P(100, 78), P(0, 78)];
    polygon(ground, [corners[3], corners[2], [corners[2][0], corners[2][1] + 14], [corners[3][0], corners[3][1] + 14]], { fill: 'var(--plan-ground-side)' });
    polygon(ground, [corners[2], corners[1], [corners[1][0], corners[1][1] + 14], [corners[2][0], corners[2][1] + 14]], { fill: 'var(--plan-ground-side)' });
    polygon(ground, corners, {
      fill: 'var(--plan-ground)',
      stroke: 'var(--plan-boundary)',
      'stroke-width': '1.4',
      'stroke-linejoin': 'round'
    });

    for (let x = 10; x < 100; x += 10) {
      line(ground, P(x, 0), P(x, 78), { stroke: 'var(--plan-grid)', 'stroke-width': '0.7' });
    }
    for (let y = 10; y < 78; y += 10) {
      line(ground, P(0, y), P(100, y), { stroke: 'var(--plan-grid)', 'stroke-width': '0.7' });
    }

    polygon(ground, [P(4, 4), P(96, 4), P(96, 74), P(4, 74)], {
      fill: 'none',
      stroke: 'var(--plan-boundary)',
      'stroke-width': '1',
      'stroke-dasharray': '6 6',
      opacity: '0.55'
    });
    polygon(ground, corners, {
      fill: 'none',
      stroke: 'var(--plan-boundary)',
      'stroke-width': '1.6'
    });

    const paths = make('g', null, scene);
    const pathFill = { fill: 'var(--plan-path)', stroke: 'var(--plan-path-line)', 'stroke-width': '0.8' };
    flatQuad(paths, 4, 4, 92, 4, pathFill);
    flatQuad(paths, 4, 70, 92, 4, pathFill);
    flatQuad(paths, 4, 8, 4, 62, pathFill);
    flatQuad(paths, 92, 8, 4, 62, pathFill);
    flatQuad(paths, 46, 8, 8, 62, pathFill);
    flatQuad(paths, 8, 32, 38, 4, pathFill);
    flatQuad(paths, 4, 50, 38, 24, { fill: 'var(--plan-path)', stroke: 'var(--plan-path-line)', 'stroke-width': '1' });
    flatQuad(paths, 44, 54, 40, 22, { fill: 'var(--plan-path)', stroke: 'var(--plan-path-line)', 'stroke-width': '1' });

    const plaza = P(50, 32);
    make('ellipse', {
      cx: plaza[0], cy: plaza[1], rx: 94, ry: 42,
      fill: 'var(--plan-path)', stroke: 'var(--plan-path-line)', 'stroke-width': '1'
    }, paths);
    make('ellipse', {
      cx: plaza[0], cy: plaza[1], rx: 66, ry: 29,
      fill: 'none', stroke: 'var(--plan-path-line)', 'stroke-width': '0.9', 'stroke-dasharray': '3 5'
    }, paths);

    line(paths, P(50, 8), P(50, 32), { stroke: 'var(--plan-path-line)', 'stroke-width': '1.2', 'stroke-dasharray': '4 6' });
    line(paths, P(8, 34), P(46, 34), { stroke: 'var(--plan-path-line)', 'stroke-width': '1', 'stroke-dasharray': '4 6' });
    line(paths, P(50, 34), P(50, 70), { stroke: 'var(--plan-path-line)', 'stroke-width': '1', 'stroke-dasharray': '4 6' });

    const treeSpots = [
      [2, 18, 0.8], [2, 46, 0.85], [2, 68, 0.8], [98, 12, 0.8], [98, 48, 0.85],
      [34, 76, 0.75], [84, 76, 0.8], [12, 76, 0.75]
    ];
    const trees = make('g', null, scene);
    treeSpots.forEach(function(spot){
      const pt = P(spot[0], spot[1]);
      const s = spot[2];
      make('ellipse', { cx: pt[0], cy: pt[1] + 2, rx: 9 * s, ry: 4 * s, fill: 'var(--plan-sage)', opacity: '0.18' }, trees);
      make('circle', { cx: pt[0], cy: pt[1] - 7 * s, r: 7 * s, fill: 'var(--plan-sage)', opacity: '0.92' }, trees);
      make('circle', { cx: pt[0] - 3 * s, cy: pt[1] - 12 * s, r: 4.6 * s, fill: 'var(--plan-sage)', opacity: '0.72' }, trees);
    });

    const parking = zoneGroup('parking', 'Parkir dan retribusi');
    flatQuad(parking, 4, -8, 92, 5, { fill: 'var(--plan-path)', stroke: 'var(--plan-boundary)', 'stroke-width': '1.1' });
    flatQuad(parking, -6, 6, 4, 66, { fill: 'var(--plan-path)', stroke: 'var(--plan-boundary)', 'stroke-width': '1.1' });
    flatQuad(parking, 102, 6, 4, 66, { fill: 'var(--plan-path)', stroke: 'var(--plan-boundary)', 'stroke-width': '1.1' });
    flatQuad(parking, 8, 82, 84, 6, { fill: 'var(--plan-path)', stroke: 'var(--plan-boundary)', 'stroke-width': '1.1' });
    for (let x = 12; x < 96; x += 8) {
      line(parking, P(x, -8), P(x, -3), { stroke: 'var(--plan-path-line)', 'stroke-width': '0.8' });
    }
    for (let i = 0; i < 7; i++) {
      isoBox(parking, 20 + i * 8, -7.4, 2.2, 1.5, 2, i % 2 ? 'var(--plan-cream)' : 'var(--plan-gold)', 'var(--plan-gold-side)');
    }
    isoBox(parking, -5.4, 18, 2.4, 1.8, 2, 'var(--plan-gold)', 'var(--plan-gold-side)');
    isoBox(parking, -5.4, 26, 2.4, 1.8, 2, 'var(--plan-cream)', 'var(--plan-gold-side)');
    isoBox(parking, 103.2, 20, 2.4, 1.8, 2, 'var(--plan-cream)', 'var(--plan-gold-side)');
    isoBox(parking, 103.2, 28, 2.4, 1.8, 2, 'var(--plan-gold)', 'var(--plan-gold-side)');
    const parkSign = P(50, -5.5);
    make('circle', { cx: parkSign[0], cy: parkSign[1] - 10, r: 11, fill: 'var(--plan-cream)', stroke: 'var(--plan-gold)', 'stroke-width': '1.2' }, parking);
    const parkText = make('text', { x: parkSign[0], y: parkSign[1] - 6.4, 'text-anchor': 'middle', fill: 'var(--plan-maroon)', 'font-size': '11' }, parking);
    parkText.textContent = 'P';

    const stage = zoneGroup('stage', 'Panggung utama');
    isoBox(stage, 34, 0, 32, 8, 3, 'var(--plan-gold)', 'var(--plan-gold-side)');
    polygon(stage, [P(34, 0, 3), P(66, 0, 3), P(66, 0, 28), P(34, 0, 28)], {
      fill: 'var(--plan-maroon)', stroke: 'var(--plan-ink)', 'stroke-width': '0.8', 'stroke-opacity': '0.22'
    });
    [[34, 0], [66, 0], [34, 8], [66, 8]].forEach(function(corner){
      line(stage, P(corner[0], corner[1], 3), P(corner[0], corner[1], 31), { stroke: 'var(--plan-gold)', 'stroke-width': '1.7' });
    });
    isoSlab(stage, 34, 0, 32, 8, 31, 4, 'var(--plan-maroon)', 'var(--plan-maroon-side)');
    line(stage, P(35, 8, 13), P(65, 8, 13), { stroke: 'var(--plan-gold)', 'stroke-width': '2.4' });
    line(stage, P(35, 8, 10), P(65, 8, 10), { stroke: 'var(--plan-cream)', 'stroke-width': '1', opacity: '0.65' });
    isoBox(stage, 34, 8, 3, 2, 7, 'var(--plan-cream)', 'var(--plan-gold-side)');
    isoBox(stage, 63, 8, 3, 2, 7, 'var(--plan-cream)', 'var(--plan-gold-side)');

    const audience = make('g', null, scene);
    flatQuad(audience, 8, 0, 22, 12, { fill: 'var(--plan-path)', stroke: 'var(--plan-path-line)', 'stroke-width': '0.9' });
    for (let i = 0; i < 3; i++) {
      isoBox(audience, 9, 1.5 + i * 3.2, 20, 1.2, 0.8, 'var(--plan-cream)', 'var(--plan-gold-side)');
    }

    const vip = make('g', null, scene);
    flatQuad(vip, 70, 0, 18, 12, { fill: 'var(--plan-path)', stroke: 'var(--plan-path-line)', 'stroke-width': '0.9' });
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        isoBox(vip, 72 + i * 5, 2 + j * 5, 3, 2, 1.4, 'var(--plan-cream)', 'var(--plan-gold-side)');
      }
    }

    const foh = make('g', null, scene);
    isoBox(foh, 44, 26, 7, 6, 5, 'var(--plan-muted)', 'var(--plan-ink)');
    isoBox(foh, 44, 33, 10, 2, 2, 'var(--plan-water)', 'var(--plan-sage-side)');

    const balloon = make('g', null, scene);
    isoBox(balloon, 78, 14, 8, 6, 5, 'var(--plan-cream)', 'var(--plan-gold-side)');
    make('circle', { cx: P(82, 17, 12)[0], cy: P(82, 17, 12)[1], r: 10, fill: 'var(--plan-maroon)', opacity: '0.9' }, balloon);
    line(balloon, P(82, 17, 5), P(82, 17, 10), { stroke: 'var(--plan-ink)', 'stroke-width': '1' });

    const sponsor = make('g', null, scene);
    for (let i = 0; i < 6; i++) {
      isoBox(sponsor, 8, 12 + i * 3.1, 2.2, 2.2, 4, 'var(--plan-cream)', 'var(--plan-gold-side)');
    }
    for (let i = 0; i < 7; i++) {
      isoBox(sponsor, 88, 14 + i * 3.1, 2.2, 2.2, 4, 'var(--plan-cream)', 'var(--plan-gold-side)');
    }

    const service = make('g', null, scene);
    isoBox(service, 2, 18, 3, 3, 5, 'var(--plan-sage)', 'var(--plan-sage-side)');
    isoBox(service, 94, 24, 3, 3, 5, 'var(--plan-gold)', 'var(--plan-gold-side)');

    const carousel = zoneGroup('carousel', 'Komidi putar');
    const car = P(28, 20);
    make('ellipse', { cx: car[0], cy: car[1] + 2, rx: 38, ry: 18, fill: 'var(--plan-gold)', opacity: '0.18' }, carousel);
    make('rect', { x: car[0] - 34, y: car[1] - 32, width: 68, height: 32, fill: 'var(--plan-gold-side)', stroke: 'var(--plan-ink)', 'stroke-width': '0.7', 'stroke-opacity': '0.25' }, carousel);
    make('ellipse', { cx: car[0], cy: car[1], rx: 34, ry: 16, fill: 'var(--plan-cream)', stroke: 'var(--plan-ink)', 'stroke-width': '0.8', 'stroke-opacity': '0.3' }, carousel);
    const canopy = make('g', { transform: 'translate(' + car[0] + ' ' + (car[1] - 32) + ')' }, carousel);
    const canopySpin = make('g', null, canopy);
    make('animateTransform', { attributeName: 'transform', type: 'rotate', from: '0 0 0', to: '360 0 0', dur: '80s', repeatCount: 'indefinite' }, canopySpin);
    make('ellipse', { cx: 0, cy: 0, rx: 38, ry: 18, fill: 'var(--plan-maroon)', stroke: 'var(--plan-ink)', 'stroke-width': '0.8', 'stroke-opacity': '0.3' }, canopySpin);
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      line(canopySpin, [0, 0], [Math.cos(angle) * 38, Math.sin(angle) * 18], { stroke: 'var(--plan-cream)', 'stroke-width': '1.2', opacity: '0.8' });
    }
    make('circle', { cx: 0, cy: 0, r: 3.5, fill: 'var(--plan-gold)' }, canopySpin);
    line(carousel, [car[0], car[1] - 32], [car[0], car[1] - 50], { stroke: 'var(--plan-gold)', 'stroke-width': '1.5' });
    polygon(carousel, [[car[0], car[1] - 50], [car[0] + 13, car[1] - 46], [car[0], car[1] - 42]], { fill: 'var(--plan-maroon)' });
    const horses = make('g', { transform: 'translate(' + car[0] + ' ' + car[1] + ')' }, carousel);
    const horseSpin = make('g', null, horses);
    make('animateTransform', { attributeName: 'transform', type: 'rotate', from: '0 0 0', to: '-360 0 0', dur: '70s', repeatCount: 'indefinite' }, horseSpin);
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6;
      make('circle', {
        cx: Math.cos(angle) * 24,
        cy: Math.sin(angle) * 11 - 3,
        r: 2.8, fill: i % 2 ? 'var(--plan-cream)' : 'var(--plan-maroon)'
      }, horseSpin);
    }

    const ferris = zoneGroup('ferris', 'Bianglala');
    const ferrisBase = P(72, 44);
    const hubX = ferrisBase[0];
    const hubY = ferrisBase[1] - 78;
    make('ellipse', { cx: hubX, cy: ferrisBase[1] + 2, rx: 50, ry: 23, fill: 'var(--plan-gold)', opacity: '0.16' }, ferris);
    line(ferris, [hubX - 45, ferrisBase[1]], [hubX, hubY], { stroke: 'var(--plan-gold)', 'stroke-width': '3' });
    line(ferris, [hubX + 45, ferrisBase[1]], [hubX, hubY], { stroke: 'var(--plan-gold)', 'stroke-width': '3' });
    line(ferris, [hubX - 52, ferrisBase[1] + 2], [hubX + 52, ferrisBase[1] + 2], { stroke: 'var(--plan-maroon)', 'stroke-width': '3' });
    const rotor = make('g', { transform: 'translate(' + hubX + ' ' + hubY + ')' }, ferris);
    const spinner = make('g', null, rotor);
    make('animateTransform', {
      attributeName: 'transform', type: 'rotate', from: '0 0 0', to: '360 0 0',
      dur: '70s', repeatCount: 'indefinite'
    }, spinner);
    make('circle', { cx: 0, cy: 0, r: 62, fill: 'none', stroke: 'var(--plan-wheel)', 'stroke-width': '2.2' }, spinner);
    make('circle', { cx: 0, cy: 0, r: 49, fill: 'none', stroke: 'var(--plan-wheel)', 'stroke-width': '0.7', opacity: '0.4' }, spinner);
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const x = Math.cos(angle) * 62;
      const y = Math.sin(angle) * 62;
      line(spinner, [0, 0], [x, y], { stroke: 'var(--plan-wheel)', 'stroke-width': '0.8', opacity: '0.55' });
      make('circle', { cx: x, cy: y, r: 4.4, fill: 'var(--plan-cream)', stroke: 'var(--plan-wheel)', 'stroke-width': '1.2' }, spinner);
    }
    make('circle', { cx: 0, cy: 0, r: 7, fill: 'var(--plan-cream)', stroke: 'var(--plan-wheel)', 'stroke-width': '1.6' }, rotor);

    const food = zoneGroup('food', 'Sentra kuliner dan UMKM');
    for (let i = 0; i < 6; i++) {
      isoBox(food, 8 + i * 4.1, 44, 3.3, 2.8, 5, 'var(--plan-maroon)', 'var(--plan-maroon-side)');
      isoBox(food, 8 + i * 4.1, 48, 3.3, 2.8, 5, 'var(--plan-maroon)', 'var(--plan-maroon-side)');
    }
    for (let i = 0; i < 5; i++) {
      isoBox(food, 38 + i * 3.7, 40, 2.8, 2.4, 4, 'var(--plan-water)', 'var(--plan-sage-side)');
    }
    for (let i = 0; i < 9; i++) {
      isoBox(food, 46 + i * 4, 52, 3.2, 2.6, 5, 'var(--plan-maroon)', 'var(--plan-maroon-side)');
    }
    for (let i = 0; i < 5; i++) {
      isoBox(food, 88, 36 + i * 3.7, 3, 3, 5, 'var(--plan-maroon)', 'var(--plan-maroon-side)');
    }
    for (let i = 0; i < 4; i++) {
      isoBox(food, 80 + i * 3.1, 28, 2.7, 2.4, 5, i % 2 ? 'var(--plan-cream)' : 'var(--plan-gold)', 'var(--plan-gold-side)');
    }

    const kids = zoneGroup('kids', 'Zona anak');
    flatQuad(kids, 8, 28, 13, 12, { fill: 'var(--plan-path)', stroke: 'var(--plan-path-line)', 'stroke-width': '0.9' });
    isoBox(kids, 9, 30, 3, 3, 5, 'var(--plan-sage)', 'var(--plan-sage-side)');
    line(kids, P(12, 31, 5), [P(12, 31, 5)[0] + 18, P(12, 31, 5)[1] + 9], { stroke: 'var(--plan-gold)', 'stroke-width': '2' });
    const track = P(27, 35);
    make('ellipse', { cx: track[0], cy: track[1], rx: 46, ry: 22, fill: 'none', stroke: 'var(--plan-gold)', 'stroke-width': '1.3', 'stroke-dasharray': '5 6', opacity: '0.8' }, kids);
    isoBox(kids, 21, 32, 4, 3, 5, 'var(--plan-sage)', 'var(--plan-sage-side)');
    isoBox(kids, 27, 36, 4, 3, 6, 'var(--plan-gold)', 'var(--plan-gold-side)');
    isoBox(kids, 24, 39, 4, 3, 5, 'var(--plan-maroon)', 'var(--plan-maroon-side)');
    isoBox(kids, 54, 44, 10, 6, 2, 'var(--plan-cream)', 'var(--plan-maroon-side)');
    const tramp = P(59, 47, 4);
    make('ellipse', { cx: tramp[0], cy: tramp[1], rx: 32, ry: 14, fill: 'var(--plan-maroon)', opacity: '0.85' }, kids);
    make('ellipse', { cx: tramp[0], cy: tramp[1], rx: 25, ry: 10, fill: 'none', stroke: 'var(--plan-cream)', 'stroke-width': '1' }, kids);

    const gate = zoneGroup('gate', 'Gerbang dan plaza');
    gate.classList.add('zone-gate');
    isoBox(gate, 0, 30, 2, 2, 13, 'var(--plan-maroon)', 'var(--plan-maroon-side)');
    isoBox(gate, 0, 34, 2, 2, 13, 'var(--plan-maroon)', 'var(--plan-maroon-side)');
    isoSlab(gate, 0, 30, 2, 6, 17, 3, 'var(--plan-gold)', 'var(--plan-gold-side)');
    line(gate, P(-5, 32), P(-1, 32), { stroke: 'var(--plan-gold)', 'stroke-width': '1.6', 'stroke-dasharray': '3 4' });
    polygon(gate, [P(-1, 32), [P(-1, 32)[0] - 4, P(-1, 32)[1] - 2], [P(-1, 32)[0] - 4, P(-1, 32)[1] + 2]], { fill: 'var(--plan-gold)' });

    const medical = zoneGroup('medical', 'Pos medis dan informasi');
    isoBox(medical, 14, 26, 6, 4, 6, 'var(--plan-cream)', 'var(--plan-gold-side)');
    const med = P(17, 28, 7);
    line(medical, [med[0] - 5, med[1]], [med[0] + 5, med[1]], { stroke: 'var(--plan-maroon)', 'stroke-width': '2.6' });
    line(medical, [med[0], med[1] - 5], [med[0], med[1] + 5], { stroke: 'var(--plan-maroon)', 'stroke-width': '2.6' });

    const balai = make('g', null, scene);
    isoBox(balai, 8, 54, 28, 18, 10, 'var(--plan-cream)', 'var(--plan-gold-side)');
    isoSlab(balai, 8, 54, 28, 18, 17, 4, 'var(--plan-maroon)', 'var(--plan-maroon-side)');
    isoBox(balai, 33, 56, 3, 14, 4, 'var(--plan-gold)', 'var(--plan-gold-side)');

    const skate = make('g', null, scene);
    flatQuad(skate, 48, 58, 32, 14, { fill: 'var(--plan-sage)', opacity: '0.55', stroke: 'var(--plan-boundary)', 'stroke-width': '0.9' });
    isoBox(skate, 52, 62, 5, 4, 2, 'var(--plan-sage)', 'var(--plan-sage-side)');
    isoBox(skate, 66, 66, 6, 3, 2, 'var(--plan-gold)', 'var(--plan-gold-side)');
    isoBox(skate, 58, 68, 5, 2, 1.5, 'var(--plan-sage)', 'var(--plan-sage-side)');

    const labels = make('g', null, scene);
    const addLabel = function(x, y, h, text, attrs){
      const pt = P(x, y, h || 0);
      label(labels, pt[0], pt[1], text, Object.assign({
        class: 'plan-label', 'text-anchor': 'middle', 'font-size': '11', 'letter-spacing': '.06em'
      }, attrs || {}));
    };
    addLabel(18, -5.7, 0, 'PARKIR PENGISI ACARA', { fill: 'var(--plan-muted)' });
    addLabel(19, 7, 2, 'PENONTON ANAK', { fill: 'var(--plan-muted)' });
    addLabel(80, 7, 2, 'UNDANGAN', { fill: 'var(--plan-muted)' });
    addLabel(50, 4, 32, 'STAGE', { fill: 'var(--plan-cream)', 'font-size': '10' });
    addLabel(50, 11, 0, 'PANGGUNG UTAMA', { fill: 'var(--plan-maroon)' });
    addLabel(22, 64, 12, 'BALAI BUDAYA', { fill: 'var(--plan-ink)' });
    addLabel(64, 66, 4, 'TAMAN BERMAIN · SKATE PARK', { 'font-size': '9' });
    addLabel(14, 36, 6, 'PLAYGROUND', { 'font-size': '9' });
    addLabel(59, 47, 8, 'TRAMPOLIN', { 'font-size': '9' });
    addLabel(47, 30, 8, 'FOH', { 'font-size': '9' });
    addLabel(82, 17, 13, 'BALON', { 'font-size': '9' });
    addLabel(24, 47, 8, 'UMKM', { 'font-size': '9', fill: 'var(--plan-maroon)' });
    addLabel(93, 45, 9, 'UMKM', { 'font-size': '9', fill: 'var(--plan-maroon)' });
    addLabel(-4, 55, 0, 'PARKIR MOTOR', { 'font-size': '8', fill: 'var(--plan-muted)' });
    addLabel(104, 40, 0, 'PARKIR MOTOR', { 'font-size': '8', fill: 'var(--plan-muted)' });
    addLabel(50, 85, 0, 'PARKIR MOTOR', { 'font-size': '8', fill: 'var(--plan-muted)' });
    addLabel(2, 33, 20, 'GERBANG', { 'font-size': '9', fill: 'var(--plan-maroon)' });

    const fireworks = zoneGroup('fireworks', 'Zona peluncuran kembang api');
    const fw = P(76, -13);
    make('ellipse', { cx: fw[0], cy: fw[1] + 4, rx: 38, ry: 16, fill: 'var(--plan-ground)', stroke: 'var(--plan-boundary)', 'stroke-width': '1' }, fireworks);
    for (let i = 0; i < 5; i++) {
      make('rect', { x: fw[0] - 16 + i * 7, y: fw[1] - 10, width: 4, height: 14, rx: 1, fill: 'var(--plan-maroon)', stroke: 'var(--plan-ink)', 'stroke-width': '0.5' }, fireworks);
    }
    line(fireworks, [fw[0], fw[1] - 20], [fw[0], fw[1] - 52], { stroke: 'var(--plan-maroon)', 'stroke-width': '1.2', 'stroke-dasharray': '2 3' });
    label(fireworks, fw[0], fw[1] - 58, 'ZONA KEMBANG API · LUAR PAGAR', {
      class: 'plan-label', 'text-anchor': 'middle', fill: 'var(--plan-maroon)', 'font-size': '9'
    });

    const safety = make('g', { 'class': 'safety-only' }, scene);
    make('circle', {
      cx: fw[0], cy: fw[1], r: 120,
      fill: 'rgba(126,51,37,.06)', stroke: 'var(--plan-maroon)',
      'stroke-width': '1.5', 'stroke-dasharray': '6 6'
    }, safety);
    label(safety, fw[0], fw[1] + 138, 'RADIUS AMAN ±150 M', {
      'text-anchor': 'middle', fill: 'var(--plan-maroon)', 'font-size': '10'
    });
    const gatePoint = P(2, 34);
    const plazaPoint = P(50, 30);
    const southPoint = P(50, 55);
    const assemblyWest = P(-6, 40);
    const assemblySouth = P(50, 84);
    make('path', {
      d: 'M' + plazaPoint[0] + ' ' + plazaPoint[1] + ' Q ' + (gatePoint[0] + 90) + ' ' + (gatePoint[1] + 20) + ' ' + gatePoint[0] + ' ' + gatePoint[1] + ' T ' + assemblyWest[0] + ' ' + assemblyWest[1],
      fill: 'none', stroke: '#53624f', 'stroke-width': '5', 'stroke-linecap': 'round',
      opacity: '0.82', 'marker-end': 'url(#evacArrow)'
    }, safety);
    make('path', {
      d: 'M' + southPoint[0] + ' ' + southPoint[1] + ' Q ' + (southPoint[0] - 80) + ' ' + (southPoint[1] + 50) + ' ' + assemblySouth[0] + ' ' + assemblySouth[1],
      fill: 'none', stroke: '#53624f', 'stroke-width': '5', 'stroke-linecap': 'round',
      opacity: '0.82', 'marker-end': 'url(#evacArrow)'
    }, safety);
    make('circle', { cx: assemblyWest[0], cy: assemblyWest[1], r: 10, fill: '#53624f' }, safety);
    make('circle', { cx: assemblyWest[0], cy: assemblyWest[1], r: 18, fill: 'none', stroke: '#53624f', 'stroke-width': '1', 'stroke-dasharray': '3 4' }, safety);
    label(safety, assemblyWest[0], assemblyWest[1] - 26, 'TITIK KUMPUL', { 'text-anchor': 'middle', fill: '#3f4d3b', 'font-size': '10' });
    make('circle', { cx: assemblySouth[0], cy: assemblySouth[1], r: 10, fill: '#53624f' }, safety);
    make('circle', { cx: assemblySouth[0], cy: assemblySouth[1], r: 18, fill: 'none', stroke: '#53624f', 'stroke-width': '1', 'stroke-dasharray': '3 4' }, safety);
    label(safety, assemblySouth[0], assemblySouth[1] + 32, 'TITIK KUMPUL', { 'text-anchor': 'middle', fill: '#3f4d3b', 'font-size': '10' });
    label(safety, plazaPoint[0], plazaPoint[1] - 18, 'JALUR EVAKUASI 6 M', { 'text-anchor': 'middle', fill: '#3f4d3b', 'font-size': '10' });

    const night = make('g', { 'class': 'night-only' }, scene);
    const stars = [
      [120, 70, 1.4], [190, 48, 1], [260, 96, 1.2], [380, 52, 1], [470, 36, 1.4],
      [560, 58, 1], [640, 32, 1.2], [720, 62, 1], [810, 40, 1.5], [930, 60, 1],
      [1020, 42, 1.2], [1110, 84, 1], [1160, 46, 1.4], [540, 130, 1], [980, 130, 1.2]
    ];
    stars.forEach(function(star){
      make('circle', { 'class': 'star', cx: star[0], cy: star[1], r: star[2], fill: 'var(--plan-cream)', opacity: '0.75' }, night);
    });
    function burst(cx, cy, radius, color){
      const g = make('g', { 'class': 'burst', opacity: '0.9' }, night);
      make('circle', { cx: cx, cy: cy, r: 2.4, fill: color }, g);
      for (let i = 0; i < 16; i++) {
        const angle = (Math.PI * 2 * i) / 16;
        const inner = radius * 0.28;
        const outer = radius * (i % 2 ? 0.75 : 1);
        line(g, [cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner], [cx + Math.cos(angle) * outer, cy + Math.sin(angle) * outer], {
          stroke: color, 'stroke-width': i % 2 ? '1' : '1.6', 'stroke-linecap': 'round'
        });
        make('circle', { cx: cx + Math.cos(angle) * outer, cy: cy + Math.sin(angle) * outer, r: 1.8, fill: color, opacity: '0.8' }, g);
      }
    }
    burst(360, 80, 46, 'var(--plan-gold)');
    burst(500, 55, 30, 'var(--plan-cream)');
    burst(650, 80, 40, 'var(--plan-maroon)');
    burst(820, 50, 34, 'var(--plan-gold)');
    burst(980, 90, 42, 'var(--plan-cream)');
    burst(1110, 60, 26, 'var(--plan-gold)');

    const markerData = [
      ['gate', '01', 2, 34, -14, 0],
      ['stage', '02', 38, 5, 0, 0],
      ['ferris', '03', 72, 44, 0, 10],
      ['carousel', '04', 28, 23, -12, 0],
      ['kids', '05', 20, 35, -10, 0],
      ['food', '06', 18, 48, -12, 0],
      ['food', '06', 88, 45, 12, 0],
      ['medical', '07', 17, 28, -12, 0],
      ['fireworks', '08', 76, -13, 0, 20],
      ['parking', '09', 104, 20, 0, 0]
    ];
    markerData.forEach(function(item){
      const pt = P(item[2], item[3]);
      const mx = pt[0] + item[4];
      const my = pt[1] + item[5];
      const g = make('g', { 'class': 'marker', 'data-zone': item[0] }, scene);
      make('circle', { cx: mx, cy: my, r: 12, 'class': 'mdot' }, g);
      const t = make('text', { x: mx, y: my + 3.6, 'text-anchor': 'middle' }, g);
      t.textContent = item[1];
    });

    if (fallback) fallback.remove();
  }

  if (svg && scene) {
    try {
      buildPlan();
    } catch (error) {
      if (window.console && console.error) console.error(error);
    }
  }

  Array.prototype.forEach.call(document.querySelectorAll('.sec-num'), function(el){
    if (el.querySelector('.sec-patra')) return;
    const patra = document.createElementNS(NS, 'svg');
    patra.setAttribute('class', 'sec-patra');
    patra.setAttribute('viewBox', '0 0 64 20');
    patra.setAttribute('aria-hidden', 'true');
    const use = document.createElementNS(NS, 'use');
    use.setAttribute('href', '#patra-small');
    patra.appendChild(use);
    el.appendChild(patra);
  });

  if (plan && note) {
    const buttons = Array.prototype.slice.call(document.querySelectorAll('[data-plan-mode]'));
    buttons.forEach(function(button){
      button.addEventListener('click', function(){
        const mode = button.getAttribute('data-plan-mode');
        plan.setAttribute('data-mode', mode);
        buttons.forEach(function(other){
          other.setAttribute('aria-pressed', other === button ? 'true' : 'false');
        });
        note.textContent = notes[mode] || notes.day;
      });
    });
  }

  if (plan) {
    const legendItems = Array.prototype.slice.call(document.querySelectorAll('.legend-item[data-zone]'));
    legendItems.forEach(function(item){
      const id = item.getAttribute('data-zone');
      const targets = Array.prototype.slice.call(plan.querySelectorAll('[data-zone="' + id + '"]'));
      function activate(){
        plan.classList.add('has-active');
        targets.forEach(function(target){ target.classList.add('is-active'); });
      }
      function deactivate(){
        plan.classList.remove('has-active');
        targets.forEach(function(target){ target.classList.remove('is-active'); });
      }
      item.addEventListener('mouseenter', activate);
      item.addEventListener('mouseleave', deactivate);
      item.addEventListener('focus', activate);
      item.addEventListener('blur', deactivate);
    });
  }

  const toggle = document.querySelector('.nav-toggle');
  const backdrop = document.querySelector('.nav-backdrop');
  const body = document.body;

  const toggleLabel = document.querySelector('.nav-toggle-label');

  function closeNav(){
    body.classList.remove('nav-open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    if (toggleLabel) toggleLabel.textContent = 'Isi';
  }

  if (toggle) {
    toggle.addEventListener('click', function(){
      const open = body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (toggleLabel) toggleLabel.textContent = open ? 'Tutup' : 'Isi';
    });
  }
  if (backdrop) backdrop.addEventListener('click', closeNav);
  Array.prototype.forEach.call(document.querySelectorAll('.rail-nav a'), function(link){
    link.addEventListener('click', closeNav);
  });
  document.addEventListener('keydown', function(event){
    if (event.key === 'Escape') closeNav();
  });
  window.addEventListener('resize', function(){
    if (window.innerWidth > 960) closeNav();
  });

  const progress = document.getElementById('progressBar');
  const navLinks = Array.prototype.slice.call(document.querySelectorAll('.rail-nav a'));
  const sections = navLinks.map(function(link){
    const id = link.getAttribute('href');
    return { link: link, section: id && id.length > 1 ? document.querySelector(id) : null };
  }).filter(function(item){ return item.section; });

  let ticking = false;
  function updateScroll(){
    const probe = window.scrollY + window.innerHeight * 0.28;
    let active = null;
    sections.forEach(function(item){
      const top = item.section.getBoundingClientRect().top + window.scrollY;
      if (top <= probe) active = item;
    });
    sections.forEach(function(item){
      if (item === active) item.link.setAttribute('aria-current', 'true');
      else item.link.removeAttribute('aria-current');
    });
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0) + '%';
    }
  }
  function onScroll(){
    if (!ticking) {
      window.requestAnimationFrame(function(){
        updateScroll();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateScroll();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(updateScroll);

  const lightbox = document.getElementById('photoLightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  if (lightbox && lightboxImage && typeof lightbox.showModal === 'function') {
    function sizeLightbox(){
      if (!lightboxImage.naturalWidth || !lightboxImage.naturalHeight) return;
      const maxW = window.innerWidth * .92 - 20;
      const maxH = window.innerHeight * .76;
      const ratio = lightboxImage.naturalWidth / lightboxImage.naturalHeight;
      const width = Math.max(220, Math.min(maxW, maxH * ratio, 880));
      lightbox.style.width = Math.round(width + 20) + 'px';
    }
    Array.prototype.forEach.call(document.querySelectorAll('.doc-media'), function(link){
      link.addEventListener('click', function(event){
        const img = link.querySelector('img');
        const card = link.closest('.doc-card');
        const caption = card ? card.querySelector('figcaption') : null;
        event.preventDefault();
        lightboxImage.src = link.getAttribute('href');
        lightboxImage.alt = img ? img.alt : '';
        if (lightboxCaption) {
          lightboxCaption.textContent = caption ? caption.textContent.replace(/\s+/g, ' ').trim() : '';
        }
        lightbox.showModal();
        requestAnimationFrame(sizeLightbox);
      });
    });
    lightboxImage.addEventListener('load', sizeLightbox);
    window.addEventListener('resize', sizeLightbox);
    const closeButton = lightbox.querySelector('.lightbox-close');
    if (closeButton) closeButton.addEventListener('click', function(){ lightbox.close(); });
    lightbox.addEventListener('click', function(event){
      if (event.target === lightbox) lightbox.close();
    });
  }

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches && svg && svg.pauseAnimations) {
    svg.pauseAnimations();
  }
})();
