# Been There · A Travel Story Map

My personal travel story map. It keeps the stories, photos, and memories from places I have visited in the United States, pinned to the map where they happened. It works like a travel blog, except the posts are organized by geography instead of by date.

The home page is a scroll-driven journey over a dark dusk-toned basemap. Each place becomes a numbered stop, and as you scroll the map flies from one stop to the next. A stop can carry a photo story: keep scrolling past it and the photos and the written story for that place appear one card at a time while the map holds position. The second tab, **The Gazetteer**, is a browsable index of every place, grouped into cities and parks, with a detail card and a fully interactive map. Whenever the map is zoomed in or a place is selected, a "Back to 30,000 ft" button appears on the map and climbs back out to the full overview. The home page has its own + and &minus; buttons on the right edge for leaning into the map mid-journey; the next stop re-frames the view automatically.

No build step. No API key. Static files only, ready for GitHub Pages.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Home page. The scroll journey and photo stories. |
| `gazetteer.html` | The Gazetteer. Grouped index, detail card, interactive map. |
| `places.js` | **The only file you edit to add places and stories.** One array of place objects. |
| `app.js` | All behavior for both pages. Reads `places.js`. |
| `style.css` | All styling, design tokens at the top under `:root`. |
| `images/` | Web-sized photos, one folder per place id. |
| `tools/resize-photo.ps1` | PowerShell script that resizes an original photo for the web. |
| `images_and_descrip/` | Original photos and draft text. Source material only. Do not push this folder; the originals are large. |
| `README.md` | This file. |

## Run locally

From the project folder:

```
python -m http.server
```

Then open `http://localhost:8000` in a browser. A local server is needed because the pages load `places.js` and `app.js` as separate files.

## Deploy to GitHub Pages

1. Create a new repository on GitHub (for example `been-there`).
2. Put the site files in the repository root and push to the `main` branch. Leave `images_and_descrip/` out.
3. On GitHub, open the repository **Settings**, then **Pages** in the left sidebar.
4. Under **Build and deployment**, set Source to **Deploy from a branch**.
5. Choose branch `main` and folder `/ (root)`, then save.
6. Wait a minute or two. The site appears at `https://YOURUSERNAME.github.io/been-there/`.

If you name the repository `YOURUSERNAME.github.io`, the site lives at that bare URL instead.

## Add a place

Open `places.js` and copy the template comment at the bottom. Paste a new object into the `PLACES` array and fill it in:

```js
{
  id: "mount-rainier",            // unique slug, used in URLs like gazetteer.html#mount-rainier
  name: "Mount Rainier",
  state: "Washington",
  stateCode: "WA",
  category: "park",               // "city" or "park"
  coords: [46.8523, -121.7603],   // [latitude, longitude]
  zoom: 11,
  visited: "August 2025",         // or "" to hide the date line
  blurb: "One or two sentences in your own words."
},
```

Two things to know:

1. **Array order is journey order.** The stop numbers and the scroll sequence follow the order of the array, top to bottom. Reorder objects to reorder the journey.
2. **Zoom guidance.** Cities read well at zoom 11 to 12. Large parks read well at 9 to 11. Tight landmarks can go higher.

Everything else updates itself: stop counts, state counts, the index, and the deep links.

## Add photos and a story

A place can carry an optional `story` array. Each entry becomes one extra scroll card on the home page, shown after the place card while the map holds position on that place. An entry with only `paragraphs` is a text card. An entry with `img` shows the photo above the text. Photos keep their own orientation, portrait or landscape. The same photos and story also appear in the Gazetteer detail card when you select the place from the index or the map. See the San Francisco entry in `places.js` for a complete worked example.

```js
story: [
  {
    img: "images/san-francisco/golden-gate.jpg",  // optional
    alt: "What the photo shows, for screen readers",
    caption: "Golden Gate Bridge",              // optional
    paragraphs: [
      "One paragraph per string.",
      "Two or three short paragraphs per card reads best."
    ]
  }
]
```

Resize photos before adding them. Originals from a phone or camera are several megabytes each, which makes the page slow. The included script shrinks a photo to 1600 px on the long edge at JPEG quality 80, which lands around 300 to 500 KB. From the project root in PowerShell:

```
powershell -File tools\resize-photo.ps1 -In "images_and_descrip\San_Francisco\goldengate.JPG" -Out "images\san-francisco\golden-gate.jpg"
```

The script fixes EXIF rotation, creates the output folder if needed, and strips metadata including GPS location. Keep one folder per place id under `images/` and use lowercase hyphenated file names.

## Arrival routes and photo spots

A place can also carry an `arrival` block describing how you traveled there. The home page then inserts an "in transit" scene before that place: the map zooms out to show a curved route from the origin, and a plane icon flies along it as you scroll. San Francisco uses this for the flight from Portland.

```js
arrival: {
  mode: "plane",
  from: [45.5152, -122.6784],   // [latitude, longitude] of the origin
  fromName: "Portland, Oregon", // shown in the transit card and HUD
  via: [                        // optional stopovers, each gets a labeled dot
    { coords: [42.3314, -83.0458], name: "Detroit, Michigan" }
  ],
  label: "PDX → DTW → NYC"      // short route tag, optional
},
```

Multi-leg trips draw one continuous arc through every stopover, as the New York City entry does for Portland to Detroit to New York. The mode can be `"plane"` or `"car"`. A car trip draws a flatter, road-like line with a car icon and the transit card reads "Driving in from" instead, as the Crater Lake entry does for the drive from Corvallis.

A single trip can change mode partway by giving a stopover its own `mode`. The leg leaving that stopover then switches: the line flattens, the moving icon changes from plane to car, and the transit card names the switch. The Chicago entry flies from Portland to Detroit, then drives the last leg to Chicago.

```js
via: [
  { coords: [42.3314, -83.0458], name: "Detroit, Michigan", mode: "car" }
]
```

Each story note can carry a `spot`, the real location of that photo. While the note is on screen its spot lights up on the map and is named in the HUD, earlier spots stay softly lit so the city fills with light as you read, and the place marker pulses with a larger ring the whole time.

```js
spot: { coords: [37.8199, -122.4783], label: "Golden Gate Bridge" },
```

A text-only note can also carry `bleed: true`. Instead of a card, the text floats directly on the map behind a gradient that fades into the basemap on the right and softens at the top and bottom, so the words read as if written onto the map. It suits an opening note. New York City, San Francisco, and Crater Lake all open this way.

```js
{ bleed: true, paragraphs: ["Your opening line...", "..."] },
```

Both blocks are optional and work for any place, not just San Francisco.

## Customize

The color system lives in `:root` at the top of `style.css`. The palette is white `#FFFFFF`, silver `#E5E5E5`, gold `#FCA311`, navy `#14213D`, and black `#000000`. Change the tokens there to re-skin the whole site. The intro copy is plain HTML near the top of `index.html`. The basemap tile URL is a constant at the top of `app.js` if you want a different map provider.

## A note on map tiles

The site uses CARTO's Dark Matter basemap via its public tile endpoint with attribution kept intact, no API key needed. The dusk navy color is not in the tiles themselves. It comes from a CSS filter on `.leaflet-tile` in `style.css`, where `hue-rotate` sets the hue and `saturate` sets the strength. I am not certain about the exact usage limits of the public endpoint. It is generally fine for light personal sites, but a high-traffic site may need a keyed provider. To get the exact Mapbox Dusk style instead, you would need a free Mapbox account and a switch from Leaflet to Mapbox GL JS, since that style is not served as plain tiles. Swapping raster providers only means editing the URL constant at the top of `app.js`.
