(function(){
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.getElementById('sitePlan');
  const scene = svg ? svg.querySelector('#scene') : null;
  const fallback = svg ? svg.querySelector('#fallback') : null;
  const plan = document.querySelector('.plan');
  const note = document.getElementById('planNote');
  const CX = 500;
  const CY = 160;
  const UX = 6;
  const UY = 3;

  const notes = {
    day: 'Tata letak usulan. Skema tidak berskala; detail final mengikuti survei lokasi dan arahan Pemda.',
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
    const corners = [P(0, 0), P(100, 0), P(100, 60), P(0, 60)];
    polygon(ground, [corners[3], corners[2], [corners[2][0], corners[2][1] + 14], [corners[3][0], corners[3][1] + 14]], { fill: 'var(--plan-ground-side)' });
    polygon(ground, [corners[2], corners[1], [corners[1][0], corners[1][1] + 14], [corners[2][0], corners[2][1] + 14]], { fill: 'var(--plan-ground-side)' });
    polygon(ground, corners, {
      fill: 'var(--plan-ground)',
      stroke: 'var(--plan-boundary)',
      'stroke-width': '1.4',
      'stroke-linejoin': 'round'
    });

    for (let x = 10; x < 100; x += 10) {
      line(ground, P(x, 0), P(x, 60), { stroke: 'var(--plan-grid)', 'stroke-width': '0.7' });
    }
    for (let y = 10; y < 60; y += 10) {
      line(ground, P(0, y), P(100, y), { stroke: 'var(--plan-grid)', 'stroke-width': '0.7' });
    }

    polygon(ground, [P(4, 4), P(96, 4), P(96, 56), P(4, 56)], {
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
    flatQuad(paths, 48, 38, 8, 20, pathFill);
    flatQuad(paths, 24, 23, 24, 5, pathFill);
    flatQuad(paths, 56, 39, 40, 5, pathFill);
    flatQuad(paths, 28, 20, 52, 3.4, pathFill);
    line(paths, P(52, 58), P(52, 40), { stroke: 'var(--plan-path-line)', 'stroke-width': '1.2', 'stroke-dasharray': '4 6' });
    line(paths, P(24, 25.5), P(48, 25.5), { stroke: 'var(--plan-path-line)', 'stroke-width': '1', 'stroke-dasharray': '4 6' });
    line(paths, P(56, 41.5), P(96, 41.5), { stroke: 'var(--plan-path-line)', 'stroke-width': '1', 'stroke-dasharray': '4 6' });

    const plaza = P(62, 40);
    make('ellipse', {
      cx: plaza[0], cy: plaza[1], rx: 140, ry: 66,
      fill: 'var(--plan-path)', stroke: 'var(--plan-path-line)', 'stroke-width': '1'
    }, paths);
    make('ellipse', {
      cx: plaza[0], cy: plaza[1], rx: 104, ry: 48,
      fill: 'none', stroke: 'var(--plan-path-line)', 'stroke-width': '0.9', 'stroke-dasharray': '3 5'
    }, paths);

    const treeSpots = [
      [4, 4, 0.9], [16, 3, 1.1], [32, 3, 1], [48, 3, 1.15], [66, 3, 0.95],
      [82, 5, 1.05], [96, 9, 0.9], [98, 29, 1], [96, 44, 0.95], [90, 57, 1.05],
      [72, 58, 0.9], [52, 58, 1], [34, 57, 0.95], [18, 56, 1.05], [2, 48, 0.9], [2, 32, 1]
    ];
    const trees = make('g', null, scene);
    treeSpots.forEach(function(spot){
      const pt = P(spot[0], spot[1]);
      const s = spot[2];
      make('ellipse', { cx: pt[0], cy: pt[1] + 2, rx: 9 * s, ry: 4 * s, fill: 'var(--plan-sage)', opacity: '0.18' }, trees);
      make('circle', { cx: pt[0], cy: pt[1] - 7 * s, r: 7 * s, fill: 'var(--plan-sage)', opacity: '0.92' }, trees);
      make('circle', { cx: pt[0] - 3 * s, cy: pt[1] - 12 * s, r: 4.6 * s, fill: 'var(--plan-sage)', opacity: '0.72' }, trees);
    });

    const stage = zoneGroup('stage', 'Panggung utama');
    isoBox(stage, 6, 8, 18, 10, 3, 'var(--plan-gold)', 'var(--plan-gold-side)');
    [[6, 8], [24, 8], [24, 18], [6, 18]].forEach(function(corner){
      line(stage, P(corner[0], corner[1], 3), P(corner[0], corner[1], 31), { stroke: 'var(--plan-gold)', 'stroke-width': '1.7' });
    });
    polygon(stage, [P(6, 8, 3), P(24, 8, 3), P(24, 8, 29), P(6, 8, 29)], {
      fill: 'var(--plan-maroon)', stroke: 'var(--plan-ink)', 'stroke-width': '0.8', 'stroke-opacity': '0.22'
    });
    line(stage, P(8, 8, 21), P(22, 8, 21), { stroke: 'var(--plan-gold)', 'stroke-width': '2.6' });
    line(stage, P(8, 8, 17), P(22, 8, 17), { stroke: 'var(--plan-cream)', 'stroke-width': '1', opacity: '0.65' });
    isoSlab(stage, 6, 8, 18, 10, 36, 5, 'var(--plan-maroon)', 'var(--plan-maroon-side)');
    isoBox(stage, 8, 17.5, 3, 2, 7, 'var(--plan-cream)', 'var(--plan-gold-side)');
    isoBox(stage, 19, 17.5, 3, 2, 7, 'var(--plan-cream)', 'var(--plan-gold-side)');
    isoBox(stage, 12, 18.4, 6, 1.2, 1.2, 'var(--plan-cream)', 'var(--plan-gold-side)');

    const carousel = zoneGroup('carousel', 'Komidi putar');
    const car = P(84, 14);
    make('ellipse', { cx: car[0], cy: car[1] + 2, rx: 48, ry: 24, fill: 'var(--plan-gold)', opacity: '0.18' }, carousel);
    make('rect', { x: car[0] - 42, y: car[1] - 38, width: 84, height: 38, fill: 'var(--plan-gold-side)', stroke: 'var(--plan-ink)', 'stroke-width': '0.7', 'stroke-opacity': '0.25' }, carousel);
    make('ellipse', { cx: car[0], cy: car[1], rx: 42, ry: 20, fill: 'var(--plan-cream)', stroke: 'var(--plan-ink)', 'stroke-width': '0.8', 'stroke-opacity': '0.3' }, carousel);
    const canopy = make('g', { transform: 'translate(' + car[0] + ' ' + (car[1] - 38) + ')' }, carousel);
    const canopySpin = make('g', null, canopy);
    make('animateTransform', { attributeName: 'transform', type: 'rotate', from: '0 0 0', to: '360 0 0', dur: '80s', repeatCount: 'indefinite' }, canopySpin);
    make('ellipse', { cx: 0, cy: 0, rx: 46, ry: 22, fill: 'var(--plan-maroon)', stroke: 'var(--plan-ink)', 'stroke-width': '0.8', 'stroke-opacity': '0.3' }, canopySpin);
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      line(canopySpin, [0, 0], [Math.cos(angle) * 46, Math.sin(angle) * 22], { stroke: 'var(--plan-cream)', 'stroke-width': '1.2', opacity: '0.8' });
    }
    make('circle', { cx: 0, cy: 0, r: 4, fill: 'var(--plan-gold)' }, canopySpin);
    line(carousel, [car[0], car[1] - 38], [car[0], car[1] - 62], { stroke: 'var(--plan-gold)', 'stroke-width': '1.6' });
    polygon(carousel, [[car[0], car[1] - 62], [car[0] + 16, car[1] - 57], [car[0], car[1] - 52]], { fill: 'var(--plan-maroon)' });
    const horses = make('g', { transform: 'translate(' + car[0] + ' ' + car[1] + ')' }, carousel);
    const horseSpin = make('g', null, horses);
    make('animateTransform', { attributeName: 'transform', type: 'rotate', from: '0 0 0', to: '-360 0 0', dur: '70s', repeatCount: 'indefinite' }, horseSpin);
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 * i) / 6;
      make('circle', {
        cx: Math.cos(angle) * 29,
        cy: Math.sin(angle) * 13 - 4,
        r: 3.2, fill: i % 2 ? 'var(--plan-cream)' : 'var(--plan-maroon)'
      }, horseSpin);
    }

    const food = zoneGroup('food', 'Sentra kuliner dan UMKM');
    for (let i = 0; i < 5; i++) {
      isoBox(food, 6 + i * 4.4, 28, 3.6, 3.2, 6, i % 2 ? 'var(--plan-cream)' : 'var(--plan-gold)', 'var(--plan-gold-side)');
      isoBox(food, 6 + i * 4.4, 34, 3.6, 3.2, 6, i % 2 ? 'var(--plan-gold)' : 'var(--plan-cream)', 'var(--plan-gold-side)');
    }
    for (let i = 0; i < 6; i++) {
      isoBox(food, 62 + i * 4.3, 26, 3.5, 3.2, 6, i % 2 ? 'var(--plan-cream)' : 'var(--plan-gold)', 'var(--plan-gold-side)');
      isoBox(food, 62 + i * 4.3, 32, 3.5, 3.2, 6, i % 2 ? 'var(--plan-gold)' : 'var(--plan-cream)', 'var(--plan-gold-side)');
    }
    isoBox(food, 32, 30, 8, 2, 2, 'var(--plan-cream)', 'var(--plan-gold-side)');
    isoBox(food, 32, 35, 8, 2, 2, 'var(--plan-cream)', 'var(--plan-gold-side)');

    const kids = zoneGroup('kids', 'Zona anak');
    const track = P(89, 53);
    make('ellipse', { cx: track[0], cy: track[1], rx: 54, ry: 27, fill: 'none', stroke: 'var(--plan-gold)', 'stroke-width': '1.4', 'stroke-dasharray': '5 6', opacity: '0.8' }, kids);
    isoBox(kids, 80, 48, 5, 4, 7, 'var(--plan-sage)', 'var(--plan-sage-side)');
    isoBox(kids, 86, 50, 5, 3.6, 8, 'var(--plan-gold)', 'var(--plan-gold-side)');
    isoBox(kids, 91, 47, 4, 4, 6, 'var(--plan-maroon)', 'var(--plan-maroon-side)');
    isoBox(kids, 82, 54, 6, 3, 9, 'var(--plan-maroon)', 'var(--plan-maroon-side)');
    line(kids, P(86, 50, 10), P(86, 50, 18), { stroke: 'var(--plan-gold)', 'stroke-width': '1.4' });
    polygon(kids, [P(86, 50, 18), [P(86, 50, 18)[0] + 11, P(86, 50, 18)[1] + 2], P(86, 50, 18)], { fill: 'var(--plan-maroon)' });

    const gate = zoneGroup('gate', 'Gerbang dan plaza');
    gate.setAttribute('data-zone', 'gate');
    gate.classList.add('zone-gate');
    isoBox(gate, 44, 54, 3, 3, 16, 'var(--plan-maroon)', 'var(--plan-maroon-side)');
    isoBox(gate, 53, 54, 3, 3, 16, 'var(--plan-maroon)', 'var(--plan-maroon-side)');
    isoSlab(gate, 44, 54, 12, 3, 22, 3.5, 'var(--plan-gold)', 'var(--plan-gold-side)');
    isoBox(gate, 57.4, 54, 2.6, 2.6, 6, 'var(--plan-cream)', 'var(--plan-gold-side)');
    line(gate, P(50, 61), P(50, 57.5), { stroke: 'var(--plan-gold)', 'stroke-width': '1.6', 'stroke-dasharray': '3 4' });
    polygon(gate, [P(50, 57.5), [P(50, 57.5)[0] - 4, P(50, 57.5)[1] + 2], [P(50, 57.5)[0] + 4, P(50, 57.5)[1] + 2]], { fill: 'var(--plan-gold)' });

    const medical = zoneGroup('medical', 'Pos medis dan informasi');
    isoBox(medical, 58, 50, 6, 5, 7, 'var(--plan-cream)', 'var(--plan-gold-side)');
    const med = P(61, 52.5, 7);
    line(medical, [med[0] - 5, med[1]], [med[0] + 5, med[1]], { stroke: 'var(--plan-maroon)', 'stroke-width': '2.6' });
    line(medical, [med[0], med[1] - 5], [med[0], med[1] + 5], { stroke: 'var(--plan-maroon)', 'stroke-width': '2.6' });

    const service = make('g', null, scene);
    isoBox(service, 2, 44, 4, 4, 5, 'var(--plan-sage)', 'var(--plan-sage-side)');
    isoBox(service, 95, 28, 3, 3, 5, 'var(--plan-sage)', 'var(--plan-sage-side)');
    isoBox(service, 2, 20, 4, 3, 5, 'var(--plan-gold)', 'var(--plan-gold-side)');

    const parking = zoneGroup('parking', 'Parkir dan retribusi');
    polygon(parking, [P(-14, 44), P(0, 44), P(0, 56), P(-14, 56)], {
      fill: 'var(--plan-path)', stroke: 'var(--plan-boundary)', 'stroke-width': '1.1'
    });
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        const bx = -13 + c * 3;
        const by = 45.5 + r * 3.4;
        polygon(parking, [P(bx, by), P(bx + 2.2, by), P(bx + 2.2, by + 1.6), P(bx, by + 1.6)], {
          fill: 'var(--plan-cream)', stroke: 'var(--plan-path-line)', 'stroke-width': '0.6'
        });
      }
    }
    isoBox(parking, -12.6, 45.9, 1.7, 1.2, 2, 'var(--plan-gold)', 'var(--plan-gold-side)');
    isoBox(parking, -9.6, 45.9, 1.7, 1.2, 2, 'var(--plan-maroon)', 'var(--plan-maroon-side)');
    isoBox(parking, -6.6, 45.9, 1.7, 1.2, 2, 'var(--plan-cream)', 'var(--plan-gold-side)');
    isoBox(parking, -3.6, 45.9, 1.7, 1.2, 2, 'var(--plan-gold)', 'var(--plan-gold-side)');
    isoBox(parking, -12.6, 49.3, 1.7, 1.2, 2, 'var(--plan-maroon)', 'var(--plan-maroon-side)');
    isoBox(parking, -9.6, 49.3, 1.7, 1.2, 2, 'var(--plan-cream)', 'var(--plan-gold-side)');
    const parkSign = P(-7, 51.5);
    make('circle', { cx: parkSign[0], cy: parkSign[1], r: 12, fill: 'var(--plan-cream)', stroke: 'var(--plan-gold)', 'stroke-width': '1.2' }, parking);
    const parkText = make('text', { x: parkSign[0], y: parkSign[1] + 3.6, 'text-anchor': 'middle', fill: 'var(--plan-maroon)', 'font-size': '12' }, parking);
    parkText.textContent = 'P';
    line(parking, P(0, 50), P(46, 56), { stroke: 'var(--plan-gold)', 'stroke-width': '1.2', 'stroke-dasharray': '4 6', opacity: '0.8' });

    const ferris = zoneGroup('ferris', 'Bianglala');
    const ferrisBase = P(62, 40);
    const hubX = ferrisBase[0];
    const hubY = ferrisBase[1] - 88;
    make('ellipse', { cx: hubX, cy: ferrisBase[1] + 2, rx: 54, ry: 25, fill: 'var(--plan-gold)', opacity: '0.16' }, ferris);
    line(ferris, [hubX - 48, ferrisBase[1]], [hubX, hubY], { stroke: 'var(--plan-gold)', 'stroke-width': '3' });
    line(ferris, [hubX + 48, ferrisBase[1]], [hubX, hubY], { stroke: 'var(--plan-gold)', 'stroke-width': '3' });
    line(ferris, [hubX - 56, ferrisBase[1] + 2], [hubX + 56, ferrisBase[1] + 2], { stroke: 'var(--plan-maroon)', 'stroke-width': '3' });
    const rotor = make('g', { transform: 'translate(' + hubX + ' ' + hubY + ')' }, ferris);
    const spinner = make('g', null, rotor);
    make('animateTransform', {
      attributeName: 'transform', type: 'rotate', from: '0 0 0', to: '360 0 0',
      dur: '70s', repeatCount: 'indefinite'
    }, spinner);
    make('circle', { cx: 0, cy: 0, r: 66, fill: 'none', stroke: 'var(--plan-wheel)', 'stroke-width': '2.2' }, spinner);
    make('circle', { cx: 0, cy: 0, r: 52, fill: 'none', stroke: 'var(--plan-wheel)', 'stroke-width': '0.7', opacity: '0.4' }, spinner);
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12;
      const x = Math.cos(angle) * 66;
      const y = Math.sin(angle) * 66;
      line(spinner, [0, 0], [x, y], { stroke: 'var(--plan-wheel)', 'stroke-width': '0.8', opacity: '0.55' });
      make('circle', { cx: x, cy: y, r: 4.7, fill: 'var(--plan-cream)', stroke: 'var(--plan-wheel)', 'stroke-width': '1.2' }, spinner);
    }
    make('circle', { cx: 0, cy: 0, r: 7, fill: 'var(--plan-cream)', stroke: 'var(--plan-wheel)', 'stroke-width': '1.6' }, rotor);

    const fireworks = zoneGroup('fireworks', 'Zona peluncuran kembang api');
    const fw = [210, 140];
    make('ellipse', { cx: fw[0], cy: fw[1] + 4, rx: 42, ry: 18, fill: 'var(--plan-ground)', stroke: 'var(--plan-boundary)', 'stroke-width': '1' }, fireworks);
    for (let i = 0; i < 5; i++) {
      make('rect', { x: fw[0] - 18 + i * 8, y: fw[1] - 12, width: 4, height: 15, rx: 1, fill: 'var(--plan-maroon)', stroke: 'var(--plan-ink)', 'stroke-width': '0.5' }, fireworks);
    }
    line(fireworks, [fw[0], fw[1] - 24], [fw[0], fw[1] - 64], { stroke: 'var(--plan-maroon)', 'stroke-width': '1.2', 'stroke-dasharray': '2 3' });

    const safety = make('g', { 'class': 'safety-only' }, scene);
    make('circle', {
      cx: fw[0], cy: fw[1], r: 120,
      fill: 'rgba(126,51,37,.06)', stroke: 'var(--plan-maroon)',
      'stroke-width': '1.5', 'stroke-dasharray': '6 6'
    }, safety);
    label(safety, fw[0], fw[1] + 126, 'RADIUS AMAN ±150 M', {
      'text-anchor': 'middle', fill: 'var(--plan-maroon)', 'font-size': '11'
    });
    make('path', {
      d: 'M668 472 Q 570 500 458 481',
      fill: 'none', stroke: '#53624f', 'stroke-width': '5', 'stroke-linecap': 'round',
      opacity: '0.82', 'marker-end': 'url(#evacArrow)'
    }, safety);
    make('path', {
      d: 'M668 472 Q 710 560 742 632',
      fill: 'none', stroke: '#53624f', 'stroke-width': '5', 'stroke-linecap': 'round',
      opacity: '0.82', 'marker-end': 'url(#evacArrow)'
    }, safety);
    make('path', {
      d: 'M458 481 Q 390 520 330 560',
      fill: 'none', stroke: '#53624f', 'stroke-width': '5', 'stroke-linecap': 'round',
      opacity: '0.82', 'marker-end': 'url(#evacArrow)'
    }, safety);
    make('circle', { cx: 320, cy: 560, r: 10, fill: '#53624f' }, safety);
    make('circle', { cx: 320, cy: 560, r: 18, fill: 'none', stroke: '#53624f', 'stroke-width': '1', 'stroke-dasharray': '3 4' }, safety);
    label(safety, 320, 592, 'TITIK KUMPUL', { 'text-anchor': 'middle', fill: '#3f4d3b', 'font-size': '10' });
    label(safety, 548, 516, 'JALUR EVAKUASI 6 M', { 'text-anchor': 'middle', fill: '#3f4d3b', 'font-size': '10' });

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
      ['gate', '01', 420, 524],
      ['stage', '02', 396, 238],
      ['ferris', '03', 714, 326],
      ['carousel', '04', 976, 404],
      ['kids', '05', 660, 630],
      ['food', '06', 300, 434],
      ['food', '06', 820, 548],
      ['medical', '07', 548, 560],
      ['fireworks', '08', 210, 70],
      ['parking', '09', 162, 370]
    ];
    markerData.forEach(function(item){
      const g = make('g', { 'class': 'marker', 'data-zone': item[0] }, scene);
      make('circle', { cx: item[2], cy: item[3], r: 12, 'class': 'mdot' }, g);
      const t = make('text', { x: item[2], y: item[3] + 3.6, 'text-anchor': 'middle' }, g);
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

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches && svg && svg.pauseAnimations) {
    svg.pauseAnimations();
  }
})();
