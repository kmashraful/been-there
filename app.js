/* ============================================================
   app.js · Been There
   ------------------------------------------------------------
   Contents
     1. Config and helpers
     2. Map factory (base layers, markers, flight arcs)
     3. Story page (scroll driven journey on index.html)
     4. Gazetteer page (index and interactive map)
     5. Boot
   Requires: Leaflet 1.9 and places.js loaded first.
   ============================================================ */

(function () {
  "use strict";

  /* ---------- 1. Config and helpers ---------- */

  /* CARTO dark basemap via its public endpoint, no API key needed.
     The dusk navy cast comes from the .leaflet-tile filter in
     style.css. To change providers, swap this URL and attribution. */
  const BASEMAP_URL =
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
  const BASEMAP_ATTR =
    "Map &copy; <a href='https://carto.com/attributions'>CARTO</a> &copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors";

  const PREFERS_REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const MOBILE = window.matchMedia("(max-width: 760px)");

  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const pad2 = (n) => String(n).padStart(2, "0");

  function formatCoords(coords) {
    const lat = coords[0];
    const lng = coords[1];
    const ns = lat >= 0 ? "N" : "S";
    const ew = lng >= 0 ? "E" : "W";
    return Math.abs(lat).toFixed(4) + "\u00B0 " + ns + " \u00B7 " +
           Math.abs(lng).toFixed(4) + "\u00B0 " + ew;
  }

  function uniqueStates(places) {
    return Array.from(new Set(places.map((p) => p.stateCode)));
  }

  function setHash(id) {
    try {
      history.replaceState(null, "", id ? "#" + id : location.pathname + location.search);
    } catch (e) { /* file:// or sandboxed contexts may refuse; safe to ignore */ }
  }

  /* ---------- 2. Map factory ---------- */

  function createBaseMap(el, opts) {
    const interactive = !opts || opts.interactive !== false;
    const map = L.map(el, {
      zoomControl: interactive,
      dragging: interactive,
      scrollWheelZoom: interactive,
      touchZoom: interactive,
      doubleClickZoom: interactive,
      boxZoom: interactive,
      keyboard: interactive,
      zoomSnap: 0.5
    });
    map.attributionControl.setPrefix(false);
    L.tileLayer(BASEMAP_URL, { maxZoom: 18, attribution: BASEMAP_ATTR }).addTo(map);
    return map;
  }

  function gcpIcon(active, hub) {
    return L.divIcon({
      className: "gcp-wrap" + (active ? " is-active" : "") + (hub ? " is-hub" : ""),
      html: '<span class="gcp"><span class="gcp-pulse"></span></span>',
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });
  }

  /* Travel mode icons. The plane points north and is rotated along its
     heading; the car keeps its upright orientation. */
  const VEHICLE_PATHS = {
    plane: "M21,16V14L13,9V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5L21,16Z",
    car: "M18.92,6.01C18.72,5.42 18.16,5 17.5,5H6.5C5.84,5 5.29,5.42 5.08,6.01L3,12V20A1,1 0 0,0 4,21H5A1,1 0 0,0 6,20V19H18V20A1,1 0 0,0 19,21H20A1,1 0 0,0 21,20V12L18.92,6.01M6.5,16A1.5,1.5 0 0,1 5,14.5A1.5,1.5 0 0,1 6.5,13A1.5,1.5 0 0,1 8,14.5A1.5,1.5 0 0,1 6.5,16M17.5,16A1.5,1.5 0 0,1 16,14.5A1.5,1.5 0 0,1 17.5,13A1.5,1.5 0 0,1 19,14.5A1.5,1.5 0 0,1 17.5,16M5,11L6.5,6.5H17.5L19,11H5Z"
  };

  function vehicleIcon(mode) {
    return L.divIcon({
      className: "plane-wrap",
      html: '<span class="plane-rot"><svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">' +
            '<path fill="currentColor" d="' + (VEHICLE_PATHS[mode] || VEHICLE_PATHS.plane) + '"/>' +
            "</svg></span>",
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });
  }

  function spotIcon() {
    return L.divIcon({
      className: "spot-wrap",
      html: '<span class="spot"></span><span class="spot-pulse"></span>',
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });
  }

  /* Gentle curve between two points so a flight reads as a flight,
     not a ruler line. Quadratic bezier bowed perpendicular to the
     route, sampled as a polyline. k sets how far it bows: ~0.18
     for flights, much flatter for road trips. */
  function arcPoints(from, to, n, k) {
    if (k === undefined) k = 0.18;
    const cLat = (from[0] + to[0]) / 2 - (to[1] - from[1]) * k;
    const cLng = (from[1] + to[1]) / 2 + (to[0] - from[0]) * k;
    const pts = [];
    for (let i = 0; i <= n; i++) {
      const t = i / n;
      const u = 1 - t;
      pts.push([
        u * u * from[0] + 2 * u * t * cLat + t * t * to[0],
        u * u * from[1] + 2 * u * t * cLng + t * t * to[1]
      ]);
    }
    return pts;
  }

  /* Heading from a to b in degrees, 0 = north, for the plane icon. */
  function bearingDeg(a, b) {
    const dLng = (b[1] - a[1]) * Math.cos(((a[0] + b[0]) / 2) * Math.PI / 180);
    return Math.atan2(dLng, b[0] - a[0]) * 180 / Math.PI;
  }

  function addMarkers(map, places, onClick) {
    const markers = {};
    places.forEach(function (p, i) {
      const m = L.marker(p.coords, { icon: gcpIcon(false), title: p.name, keyboard: false });
      m.bindTooltip(pad2(i + 1) + " \u00B7 " + p.name, {
        direction: "top",
        offset: [0, -12],
        className: "gcp-tip"
      });
      if (onClick) m.on("click", function () { onClick(p); });
      m.addTo(map);
      markers[p.id] = m;
    });
    return markers;
  }

  function setActiveMarker(markers, id, hub) {
    Object.keys(markers).forEach(function (pid) {
      markers[pid].setIcon(gcpIcon(pid === id, hub && pid === id));
    });
  }

  /* Small labeled dot marking where an arrival route starts. */
  function originIcon() {
    return L.divIcon({
      className: "origin-wrap",
      html: '<span class="origin-dot"></span>',
      iconSize: [12, 12],
      iconAnchor: [6, 6]
    });
  }

  /* Fly so the marker lands in the open part of the viewport,
     offset away from the card column (x on desktop, y on mobile). */
  function flyToPlace(map, place, offset) {
    const zoom = place.zoom || 10;
    const point = map.project(L.latLng(place.coords), zoom);
    const center = map.unproject(point.subtract(L.point(offset[0], offset[1])), zoom);
    if (PREFERS_REDUCED) map.setView(center, zoom);
    else map.flyTo(center, zoom, { duration: 1.7 });
  }

  function flyToOverview(map, bounds) {
    if (PREFERS_REDUCED) map.fitBounds(bounds);
    else map.flyToBounds(bounds, { duration: 1.4 });
  }

  /* ---------- 3. Story page ---------- */

  function storyOffset() {
    if (MOBILE.matches) return [0, -Math.round(window.innerHeight * 0.16)];
    return [Math.round(Math.min(300, window.innerWidth * 0.16)), 0];
  }

  /* One story note (photo plus paragraphs, or text only) as HTML.
     Shared by the Home scroll cards and the Gazetteer detail card. */
  function noteHtml(note) {
    return (
      (note.img
        ? '<figure class="note-photo">' +
            '<img src="' + note.img + '" alt="' + (note.alt || "") + '" loading="lazy">' +
            (note.caption ? '<figcaption class="mono">' + note.caption + "</figcaption>" : "") +
          "</figure>"
        : "") +
      (note.paragraphs || []).map((t) => '<p class="note-text">' + t + "</p>").join("")
    );
  }

  function noteStepHtml(p, note, j) {
    /* A "bleed" note drops the card chrome and lets a gradient merge the
       text into the map. Otherwise it is a normal translucent panel. */
    const bleed = note.bleed;
    const sectionCls = "step step-note" + (bleed ? " step-bleed" : "");
    const cardCls = (bleed ? "" : "panel ") + "step-card note-card" + (bleed ? " note-bleed" : "");
    return (
      '<section class="' + sectionCls + '" data-step="' + p.id + '" data-note="' + (j + 1) +
        '" aria-label="' + p.name + ", part " + (j + 1) + '">' +
        '<article class="' + cardCls + '">' + noteHtml(note) + "</article>" +
      "</section>"
    );
  }

  /* Sentence describing the trip. Consecutive legs that share a mode are
     grouped into one run, so "fly, then drive, then drive" reads as
     "Flying in from Portland, then driving on from Las Vegas by way of
     Bryce Canyon." rather than repeating "driving on" for each leg. */
  function arrivalSentence(a) {
    const verbIn = { plane: "Flying in", car: "Driving in" };
    const verbOn = { plane: "flying on", car: "driving on" };
    /* Each stop carries the mode of the leg that leaves it toward the
       next stop (or the destination, for the last one). */
    const stops = [{ name: a.fromName, mode: a.mode }]
      .concat((a.via || []).map((v) => ({ name: v.name, mode: v.mode || a.mode })));
    const parts = [];
    let i = 0;
    while (i < stops.length) {
      const mode = stops[i].mode;
      const through = [];
      let j = i + 1;
      while (j < stops.length && stops[j].mode === mode) {
        through.push(stops[j].name);
        j++;
      }
      const verb = parts.length === 0
        ? (verbIn[mode] || "Coming in")
        : (verbOn[mode] || "continuing on");
      parts.push(verb + " from " + stops[i].name +
        (through.length ? " by way of " + through.join(" and ") : ""));
      i = j;
    }
    return parts.join(", then ") + ".";
  }

  /* Tall scroll scene shown before a place that has an arrival route.
     The extra height gives the plane room to fly under scroll control. */
  function transitStepHtml(p) {
    const a = p.arrival;
    return (
      '<section class="step step-transit" data-step="' + p.id + '" data-transit="1"' +
        ' aria-label="Traveling to ' + p.name + '">' +
        '<article class="panel step-card transit-card">' +
          '<p class="kicker mono">In transit</p>' +
          (a.label ? '<p class="transit-route mono">' + a.label + "</p>" : "") +
          '<p class="transit-note">' + arrivalSentence(a) + "</p>" +
        "</article>" +
      "</section>"
    );
  }

  function buildSteps(container) {
    const html = [];
    PLACES.forEach(function (p, i) {
      if (p.arrival) html.push(transitStepHtml(p));
      html.push(
        '<section class="step" data-step="' + p.id + '" aria-label="' + p.name + '">' +
          '<article class="panel step-card">' +
            '<p class="stop-label mono">Stop ' + pad2(i + 1) + " / " + pad2(PLACES.length) + "</p>" +
            "<h2>" + p.name + "</h2>" +
            '<p class="meta mono">' +
              '<span class="badge badge-' + p.category + '">' +
                (p.category === "park" ? "Park" : "City") + "</span>" +
              "<span>" + p.state + "</span>" +
              "<span>" + formatCoords(p.coords) + "</span>" +
            "</p>" +
            '<p class="blurb">' + p.blurb + "</p>" +
            (p.visited ? '<p class="visited mono">Visited: ' + p.visited + "</p>" : "") +
          "</article>" +
        "</section>"
      );
      (p.story || []).forEach(function (note, j) {
        html.push(noteStepHtml(p, note, j));
      });
    });
    container.innerHTML = html.join("");
  }

  function initStory() {
    const mapEl = $("#map");
    if (!mapEl || typeof L === "undefined") return;

    const map = createBaseMap(mapEl, { interactive: false });
    const bounds = L.latLngBounds(PLACES.map((p) => p.coords)).pad(0.25);
    map.fitBounds(bounds);
    const markers = addMarkers(map, PLACES, null);

    buildSteps($("#story"));
    const transitEls = Array.prototype.slice.call(
      document.querySelectorAll(".step-transit")
    );

    const heroCount = $("#heroCount");
    if (heroCount) {
      heroCount.textContent =
        pad2(PLACES.length) + " stops on the map \u00B7 more to come";
    }
    const outroStats = $("#outroStats");
    if (outroStats) {
      outroStats.textContent =
        pad2(PLACES.length) + " stops \u00B7 " +
        pad2(uniqueStates(PLACES).length) + " states \u00B7 still counting";
    }

    const hud = $("#hud");
    function setHud(a, b) {
      if (!hud) return;
      hud.innerHTML = '<span class="hud-a">' + a + '</span><span class="hud-b">' + b + "</span>";
    }

    /* Arrival flights: a dashed arc plus a plane that rides the scroll.
       Built once per place, shown only while its transit scene is active. */
    const flights = {};
    function ensureFlight(p) {
      let f = flights[p.id];
      if (f) return f;
      const a = p.arrival;
      const via = a.via || [];
      /* One arc per leg: origin, any stopovers, then the place itself.
         Each leg carries its own travel mode (a.mode for the first leg,
         via[k].mode for the leg leaving that stopover). A plane leg bows
         like a flight; a car leg runs nearly flat like a road. pointMode
         records the mode at each sampled point so the moving icon can
         switch from plane to car at the stopover where the trip changes. */
      const waypoints = [a.from].concat(via.map((v) => v.coords)).concat([p.coords]);
      const legModes = [a.mode].concat(via.map((v) => v.mode || a.mode));
      let pts = [];
      let pointMode = [];
      for (let i = 0; i < waypoints.length - 1; i++) {
        const m = legModes[i];
        const bow = m === "plane" ? 0.18 : 0.06;
        let seg = arcPoints(waypoints[i], waypoints[i + 1], 60, bow);
        if (i > 0) seg = seg.slice(1);
        for (let k = 0; k < seg.length; k++) pointMode.push(m);
        pts = pts.concat(seg);
      }
      const stops = [{ coords: a.from, name: a.fromName }].concat(via);
      f = flights[p.id] = {
        pts: pts,
        pointMode: pointMode,
        curMode: legModes[0],
        bounds: L.latLngBounds(pts).pad(0.22),
        line: L.polyline(pts, {
          className: "flight-path", color: "#fca311",
          weight: 2.5, opacity: 0.85, dashArray: "0.1 8",
          lineCap: "round", interactive: false
        }),
        stops: stops.map(function (s) {
          return L.marker(s.coords, { icon: originIcon(), interactive: false, keyboard: false })
            .bindTooltip(s.name, {
              permanent: true, direction: "right", offset: [10, 0], className: "gcp-tip"
            });
        }),
        plane: L.marker(pts[0], { icon: vehicleIcon(legModes[0]), interactive: false, keyboard: false }),
        onMap: false
      };
      return f;
    }
    function showFlight(p) {
      const f = ensureFlight(p);
      if (!f.onMap) {
        f.line.addTo(map);
        f.stops.forEach(function (m) { m.addTo(map); });
        f.plane.addTo(map);
        f.onMap = true;
      }
      if (PREFERS_REDUCED) map.fitBounds(f.bounds);
      else map.flyToBounds(f.bounds, { duration: 1.3 });
      updatePlanes();
    }
    function hideFlights() {
      Object.keys(flights).forEach(function (id) {
        const f = flights[id];
        if (f.onMap) {
          map.removeLayer(f.line);
          f.stops.forEach(function (m) { map.removeLayer(m); });
          map.removeLayer(f.plane);
          f.onMap = false;
        }
      });
    }
    function movePlane(f, t) {
      const last = f.pts.length - 1;
      const i = Math.min(last - 1, Math.floor(t * last));
      const frac = t * last - i;
      const a = f.pts[i];
      const b = f.pts[i + 1];
      f.plane.setLatLng([a[0] + (b[0] - a[0]) * frac, a[1] + (b[1] - a[1]) * frac]);
      /* Swap the icon when the leg's mode changes (e.g. plane to car). */
      const mode = f.pointMode[i];
      if (mode !== f.curMode) {
        f.plane.setIcon(vehicleIcon(mode));
        f.curMode = mode;
      }
      if (mode !== "plane") return; /* the car icon stays upright */
      const el = f.plane.getElement();
      if (el) {
        const rot = el.querySelector(".plane-rot");
        if (rot) rot.style.transform = "rotate(" + bearingDeg(a, b).toFixed(1) + "deg)";
      }
    }
    /* Progress runs from the moment the transit scene activates (its top
       near the viewport center) to the handoff to the place card, so the
       plane visibly departs the origin and touches down on arrival. */
    function updatePlanes() {
      const vh = window.innerHeight;
      transitEls.forEach(function (el) {
        const f = flights[el.dataset.step];
        if (!f || !f.onMap) return;
        const r = el.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) return;
        const t = Math.max(0, Math.min(1,
          ((vh * 0.6 - r.top) / (r.height - vh * 0.4)) * 1.1));
        movePlane(f, t);
      });
    }

    /* Story spots: the photo locations of the active place. Each lights
       up when its card arrives and stays lit while you read on. */
    let spotPlaceId = null;
    let spotMarkers = [];
    function ensureSpots(p) {
      if (spotPlaceId === p.id) return;
      clearSpots();
      spotPlaceId = p.id;
      (p.story || []).forEach(function (note, j) {
        if (!note.spot) return;
        const m = L.marker(note.spot.coords, { icon: spotIcon(), interactive: false, keyboard: false });
        m.bindTooltip(note.spot.label, { direction: "top", offset: [0, -10], className: "gcp-tip" });
        m.noteIndex = j + 1;
        m.addTo(map);
        const el = m.getElement();
        if (el) void el.offsetWidth; /* flush styles so the first light-up transitions */
        spotMarkers.push(m);
      });
    }
    function clearSpots() {
      spotMarkers.forEach(function (m) { map.removeLayer(m); });
      spotMarkers = [];
      spotPlaceId = null;
    }
    function setSpots(noteIdx) {
      spotMarkers.forEach(function (m) {
        const el = m.getElement();
        if (!el) return;
        el.classList.toggle("is-lit", m.noteIndex <= noteIdx);
        el.classList.toggle("is-current", m.noteIndex === noteIdx);
        if (m.noteIndex === noteIdx) m.openTooltip();
        else m.closeTooltip();
      });
    }

    /* Story notes share their place's data-step id, so the map only
       flies when the place actually changes, not on every note. */
    let currentPlaceId = null;

    function activate(stepId, el) {
      document.querySelectorAll(".step-card.is-active").forEach(function (c) {
        c.classList.remove("is-active");
      });
      if (stepId === "hero" || stepId === "outro") {
        currentPlaceId = null;
        setActiveMarker(markers, null);
        hideFlights();
        clearSpots();
        flyToOverview(map, bounds);
        setHud(stepId === "hero" ? "Overview" : "Journey complete",
               "United States \u00B7 " + pad2(PLACES.length) + " stops");
        return;
      }
      const place = PLACES.find((p) => p.id === stepId);
      if (!place) return;
      const card = el.querySelector(".step-card");
      if (card) card.classList.add("is-active");
      if (el.dataset.transit) {
        currentPlaceId = null;
        setActiveMarker(markers, null);
        clearSpots();
        showFlight(place);
        setHud("In transit", place.arrival.fromName + " \u2192 " + place.name);
        return;
      }
      hideFlights();
      if (currentPlaceId !== place.id) {
        clearSpots();
        flyToPlace(map, place, storyOffset());
        currentPlaceId = place.id;
      }
      const idx = PLACES.indexOf(place) + 1;
      const note = el.dataset.note ? parseInt(el.dataset.note, 10) : 0;
      if (note) {
        setActiveMarker(markers, place.id, true);
        ensureSpots(place);
        setSpots(note);
      } else {
        setActiveMarker(markers, place.id, false);
        if (spotPlaceId === place.id) setSpots(0);
      }
      const noteTag = note
        ? " \u00B7 note " + note + "/" + (place.story || []).length
        : "";
      const spot = note && place.story[note - 1] ? place.story[note - 1].spot : null;
      setHud("Stop " + pad2(idx) + " / " + pad2(PLACES.length) + noteTag,
             (spot ? spot.label : formatCoords(place.coords)) + " \u00B7 " + place.name);
    }

    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) activate(en.target.dataset.step, en.target);
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    document.querySelectorAll("[data-step]").forEach((s) => io.observe(s));

    const bar = $("#progressBar");
    let ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        if (bar) bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
        updatePlanes();
        ticking = false;
      });
    }, { passive: true });

    /* Zoom buttons: the fixed background map ignores the pointer, so
       these are the one way to lean in. The next stop re-frames it. */
    const zoomIn = $("#zoomIn");
    const zoomOut = $("#zoomOut");
    if (zoomIn) zoomIn.addEventListener("click", function () { map.zoomIn(); });
    if (zoomOut) zoomOut.addEventListener("click", function () { map.zoomOut(); });

    window.addEventListener("resize", function () { map.invalidateSize(); });
  }

  /* ---------- 4. Gazetteer page ---------- */

  function initGazetteer() {
    const mapEl = $("#map");
    if (!mapEl || typeof L === "undefined") return;

    const map = createBaseMap(mapEl, { interactive: true });
    const bounds = L.latLngBounds(PLACES.map((p) => p.coords)).pad(0.2);
    map.fitBounds(bounds);
    const markers = addMarkers(map, PLACES, function (p) { selectPlace(p.id); });

    const stats = $("#gazStats");
    if (stats) {
      stats.textContent =
        pad2(PLACES.length) + " places \u00B7 " +
        pad2(uniqueStates(PLACES).length) + " states";
    }

    /* Full index in journey order, grouped by category. Clicking the
       selected row again returns to the overview. */
    const groups = [["city", "Cities"], ["park", "Parks and wild places"]];
    const list = $("#indexList");
    list.innerHTML = groups.map(function (g) {
      const rows = PLACES.map(function (p, i) {
        if (p.category !== g[0]) return "";
        return (
          '<li><button type="button" class="index-row mono" data-id="' + p.id + '">' +
            '<span class="idx">' + pad2(i + 1) + "</span>" +
            '<span class="nm">' + p.name + "</span>" +
            '<span class="st">' + p.stateCode + "</span>" +
          "</button></li>"
        );
      }).join("");
      return rows ? '<li class="index-group mono">' + g[1] + "</li>" + rows : "";
    }).join("");
    let selectedId = "";
    list.addEventListener("click", function (e) {
      const btn = e.target.closest(".index-row");
      if (btn) selectPlace(btn.dataset.id === selectedId ? "" : btn.dataset.id);
    });

    /* "Back to 30,000 ft": climbs out to the overview. Shown whenever
       the map is meaningfully zoomed in or a place is selected, never
       on the overview itself. */
    const overviewBtn = $("#overviewBtn");
    const overviewZoom = map.getZoom();
    function updateOverviewBtn() {
      if (!overviewBtn) return;
      overviewBtn.hidden = !selectedId && map.getZoom() <= overviewZoom + 0.5;
    }
    if (overviewBtn) {
      overviewBtn.addEventListener("click", function () { selectPlace(""); });
      map.on("zoomend", updateOverviewBtn);
    }

    function selectPlace(id) {
      const card = $("#detailCard");
      selectedId = id || "";
      updateOverviewBtn();
      document.querySelectorAll(".index-row.is-active").forEach(function (r) {
        r.classList.remove("is-active");
      });
      if (!id) {
        setActiveMarker(markers, null);
        if (card) card.hidden = true;
        flyToOverview(map, bounds);
        setHash("");
        return;
      }
      const place = PLACES.find((p) => p.id === id);
      if (!place) return;
      setActiveMarker(markers, id);
      const row = document.querySelector('.index-row[data-id="' + id + '"]');
      if (row) row.classList.add("is-active");
      if (card) {
        card.hidden = false;
        card.innerHTML =
          '<p class="stop-label mono">Stop ' + pad2(PLACES.indexOf(place) + 1) +
            " / " + pad2(PLACES.length) + "</p>" +
          "<h2>" + place.name + "</h2>" +
          '<p class="meta mono">' +
            '<span class="badge badge-' + place.category + '">' +
              (place.category === "park" ? "Park" : "City") + "</span>" +
            "<span>" + place.state + "</span>" +
          "</p>" +
          '<p class="coords mono">' + formatCoords(place.coords) + "</p>" +
          '<p class="blurb">' + place.blurb + "</p>" +
          '<p class="visited mono">Visited: ' + (place.visited || "date pending") + "</p>" +
          (place.story && place.story.length
            ? '<div class="detail-story">' + place.story.map(noteHtml).join("") + "</div>"
            : "");
      }
      flyToPlace(map, place, [0, 0]);
      setHash(id);
    }

    /* Deep link support: gazetteer.html#crater-lake opens that entry */
    const initial = location.hash.replace("#", "");
    if (initial && PLACES.some((p) => p.id === initial)) selectPlace(initial);

    window.addEventListener("resize", function () { map.invalidateSize(); });
  }

  /* ---------- 5. Boot ---------- */

  /* Small-screen tip card: once dismissed it stays dismissed. */
  function initHint() {
    const hint = $("#desktopHint");
    if (!hint) return;
    const KEY = "bt-hint-dismissed";
    let dismissed = false;
    try { dismissed = localStorage.getItem(KEY) === "1"; } catch (e) {}
    if (dismissed) { hint.remove(); return; }
    const btn = $("#hintClose");
    if (btn) {
      btn.addEventListener("click", function () {
        hint.remove();
        try { localStorage.setItem(KEY, "1"); } catch (e) {}
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    const y = $("#year");
    if (y) y.textContent = new Date().getFullYear();
    initHint();
    if (document.body.classList.contains("page-story")) initStory();
    if (document.body.classList.contains("page-gazetteer")) initGazetteer();
  });
})();
