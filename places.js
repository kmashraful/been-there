/* ============================================================
   places.js · Been There
   ------------------------------------------------------------
   The single source of truth for every location on the site.
   The Home journey and the Gazetteer are both generated from
   this array. To add a place, copy the template at the bottom,
   fill it in, and append it to PLACES. No other file changes.

   Field reference
     id        unique slug, lowercase, hyphenated (used in URLs)
     name      display name
     state     full state name
     stateCode two letter postal code
     category  "city" or "park" (controls grouping and badge)
     coords    [latitude, longitude], decimal degrees, WGS84
     zoom      Leaflet zoom used when flying to the place
               (cities 11 to 12, large parks 9 to 10)
     visited   free text such as "June 2024", or "" if unknown
     blurb     one or two short sentences for the story card
     arrival   optional. How you traveled to this place. The
               Home page inserts an "in transit" scroll scene
               before the place: the map zooms out to the route
               and a plane icon flies it as you scroll.
                 mode      "plane" or "car" (icon and wording)
                 from      [lat, lng] of where you started
                 fromName  origin shown in the card and HUD
                 via       optional stopovers along the way:
                           [{ coords: [lat, lng], name: "..." }]
                           A stopover may add its own mode to
                           switch travel mode for the leg that
                           leaves it, so a trip can fly to the
                           stopover then drive on (see Chicago).
                 label     short route tag such as "PDX → SFO"
     story     optional array of story notes shown as extra
               scroll cards after the place card on the Home
               page. Each note has:
                 paragraphs  array of strings, one per paragraph
                 img         optional path to a web-sized photo
                 alt         what the photo shows, for screen
                             readers (avoid double quotes)
                 caption     optional short line under the photo
                 bleed       optional true. Drops the card panel
                             and floats the text over the map
                             behind a gradient that fades into
                             the basemap. Best on a text-only
                             opening note.
                 spot        optional location of the photo:
                             { coords: [lat, lng], label: "..." }
                             It lights up on the map while the
                             card is on screen, and the place
                             marker pulses larger.

   The order of this array is the order of the scroll journey
   on the Home page. Reorder entries to change it.
   ============================================================ */

const PLACES = [
  {
    id: "nyc",
    name: "New York City",
    state: "New York",
    stateCode: "NY",
    category: "city",
    coords: [40.7128, -74.0060],
    zoom: 11,
    visited: "August 2024",
    blurb: "The city that looks impossible from above and feels bigger from below. At street level the grid dissolves into eight million separate stories.",
    arrival: {
      mode: "plane",
      from: [45.5152, -122.6784],
      fromName: "Portland, Oregon",
      via: [{ coords: [42.3314, -83.0458], name: "Detroit, Michigan" }],
      label: "PDX → DTW → NYC"
    },
    story: [
      {
        bleed: true,
        paragraphs: [
          "New York City had always existed in my imagination long before I ever saw it.",
          "For many of us from Asia, that introduction came through Hollywood. The city was a backdrop to car chases and love stories. It was the setting where superheroes swung between buildings and dreamers arrived with a suitcase and impossible ambition.",
          "Three hundred and twenty skyscrapers, they said. Three hundred and twenty? As a child, I tried to make sense of that number. I imagined a city where buildings stood shoulder to shoulder until they obscured the sky itself. A place where people lived in the shadows of giants made of steel and glass."
        ]
      },
      {
        img: "images/nyc/skyline-from-brooklyn.jpg",
        alt: "Lower Manhattan at sunset seen from the Brooklyn Bridge walkway, One World Trade Center rising at the center",
        caption: "The Manhattan skyline from the Brooklyn Bridge",
        spot: { coords: [40.7075, -74.0113], label: "Lower Manhattan" },
        paragraphs: [
          "In the summer of 2024, that imagination finally had a chance to meet reality. A buddy of mine who used to live in Michigan asked if I wanted to visit New York City with him. I did not have much going on at the time. Sometimes the best trips begin without elaborate planning. They begin with a simple question. \"Want to go?\"",
          "I flew to Michigan first. Soon after, we boarded another plane bound for New York. Then came the moment I had unknowingly rehearsed for years. I looked out of the airplane window. The skyline emerged beneath us. Man, the view was breathtaking, jaw-dropping, awe-striking! The skyscrapers rose from the earth like an entire forest built by human hands. Sunlight reflected off glass facades. Bridges stitched together pieces of the city. For a few moments, I forgot to blink.",
          "I remember thinking that nothing could beat this. It looked exactly how I had dreamed it would."
        ]
      },
      {
        img: "images/nyc/times-square.jpg",
        alt: "Crowds filling Times Square on a summer day, billboards and bright screens climbing the towers on every side",
        caption: "Times Square",
        spot: { coords: [40.7580, -73.9855], label: "Times Square" },
        paragraphs: [
          "After landing, we headed straight to Times Square. If the skyline was New York's grand introduction, Times Square was its heartbeat. What a spectacle. Neon lights climbed endlessly upward. Massive screens competed for attention. Music spilled into the streets. People moved in every direction, with purpose and complete confusion.",
          "Tourists posed for photographs. Street performers gathered crowds from nowhere. Languages from every corner of the world drifted through the air. It felt like a miniature version of Earth itself. Thousands of strangers sharing the same few blocks, each carrying their own stories and destinations."
        ]
      },
      {
        img: "images/nyc/brooklyn-bridge-1.jpg",
        alt: "The Brooklyn Bridge spanning the East River, one stone tower flying a flag, Manhattan buildings rising behind",
        caption: "Brooklyn Bridge",
        spot: { coords: [40.7061, -73.9969], label: "Brooklyn Bridge" },
        paragraphs: [
          "We navigated through the crowds and sampled whatever street food caught our attention. Before long, we found ourselves in Brooklyn."
        ]
      },
      {
        img: "images/nyc/brooklyn-bridge-2.jpg",
        alt: "The wooden walkway of the Brooklyn Bridge beneath its two neo-Gothic stone arches, busy with walkers on a summer day",
        caption: "Under the arches",
        paragraphs: [
          "Then came the Brooklyn Bridge. Its neo-Gothic arches stood like gateways from another century. The cables stretched outward with mathematical elegance."
        ]
      },
      {
        img: "images/nyc/skyline-from-hudson.jpg",
        alt: "Glass towers of Midtown West seen from the river, a small boat cutting a white wake across the water",
        caption: "From the water",
        spot: { coords: [40.7530, -74.0150], label: "On the Hudson" },
        paragraphs: [
          "Looking back toward Manhattan, the skyline appeared almost unreal. It is easy to forget that every skyscraper began as an idea in someone's mind. A sketch on paper. A problem waiting to be solved. Standing there, the city felt less like a collection of buildings and more like a monument to human imagination."
        ]
      },
      {
        img: "images/nyc/statue-of-liberty.jpg",
        alt: "The Statue of Liberty on her stone pedestal under a cloudy sky, visitors lining the edge of Liberty Island",
        caption: "The Statue of Liberty",
        spot: { coords: [40.6892, -74.0445], label: "Liberty Island" },
        paragraphs: [
          "Later, we boarded the ferry to Staten Island. We had come to see the lady. And there she was.",
          "The Statue of Liberty. Another postcard view. Another item on the bucket list. Ticked!",
          "Her color had the softness of an antique photograph. Yet somehow, she belonged perfectly within the modern skyline behind her. She had witnessed generations of arrivals, departures, celebrations, and uncertainties. The city changed around her. She remained."
        ]
      },
      {
        img: "images/nyc/the-met.jpg",
        alt: "The columned facade of the Metropolitan Museum of Art with fountains in front and crowds gathered on the steps",
        caption: "The Metropolitan Museum of Art",
        spot: { coords: [40.7794, -73.9632], label: "The Met" },
        paragraphs: [
          "Our final stop was the Metropolitan Museum of Art. From the outside, its grand classical facade made me wonder if I had somehow wandered into Europe. People sat on the famous steps enjoying the summer afternoon. Musicians filled the air with familiar melodies. The scent of New York pizza drifted through the crowds. Inside, the experience became even more astonishing.",
          "I found myself lingering in the ancient Egyptian galleries. Statues and artifacts stood silently behind glass, carrying stories older than imagination itself. The Greek collection had a similar effect. Civilizations separated by thousands of years suddenly felt close enough to touch."
        ]
      },
      {
        paragraphs: [
          "New York is often called a crazy city. The description is not entirely wrong.",
          "It is loud. It is crowded. It moves at a pace that dares you to keep up. Yet beneath the noise lies something extraordinary. A skyline that inspires wonder. Streets where the whole world seems to gather. Moments that remind you what human beings are capable of creating.",
          "Some places live up to the stories we hear about them. A few places exceed them. New York City, for me, did both."
        ]
      }
    ]
  },
  {
    id: "chicago",
    name: "Chicago",
    state: "Illinois",
    stateCode: "IL",
    category: "city",
    coords: [41.8781, -87.6298],
    zoom: 11,
    visited: "August 2024",
    blurb: "A city that rebuilt itself in steel beside an inland sea. From the shoreline, Lake Michigan reads like an ocean.",
    arrival: {
      mode: "plane",
      from: [45.5152, -122.6784],
      fromName: "Portland, Oregon",
      via: [{ coords: [42.3314, -83.0458], name: "Detroit, Michigan", mode: "car" }],
      label: "PDX → DTW → CHI"
    },
    story: [
      {
        bleed: true,
        paragraphs: [
          "One of my favorite cities in the United States is Chicago.",
          "Perhaps it is because Chicago feels familiar and grand at the same time. It has the confidence of a global city without the overwhelming intensity that some others carry. It invites you in before it impresses you."
        ]
      },
      {
        img: "images/chicago/downtown.jpg",
        alt: "Looking straight up a narrow canyon between two Chicago skyscrapers, a cluster of street lamps glowing against a strip of blue sky",
        caption: "Downtown Chicago",
        spot: { coords: [41.8800, -87.6300], label: "The Loop" },
        paragraphs: [
          "My buddy from Michigan and I decided to make a road trip out of it. We left Detroit in his Subaru Forester and headed west toward Chicago. There is something special about road trips with good friends. The conversations wander without direction. The miles disappear somewhere between laughter and music playing softly through the speakers. Then the skyline appeared.",
          "As we entered downtown Chicago, a thought immediately crossed my mind. Wait! This is where Christopher Nolan filmed Dark Knight. The streets suddenly felt familiar. The towering buildings, the dramatic canyons of glass and steel, the sense that something extraordinary could happen around the next corner."
        ]
      },
      {
        img: "images/chicago/willis-tower.jpg",
        alt: "Willis Tower rising above a wide, nearly empty downtown street lined with glass towers",
        caption: "Willis Tower",
        spot: { coords: [41.8789, -87.6359], label: "Willis Tower" },
        paragraphs: [
          "As if on cue, a black Lamborghini Murcielago drove past us. We looked at each other and burst into laughter. \"Maybe Bruce Wayne is late for a meeting.\""
        ]
      },
      {
        img: "images/chicago/the-bean.jpg",
        alt: "Cloud Gate, the mirrored Bean sculpture in Millennium Park, reflecting the skyline and summer clouds as crowds gather around it",
        caption: "Cloud Gate, the Bean",
        spot: { coords: [41.8827, -87.6233], label: "Cloud Gate" },
        paragraphs: [
          "Our first mission in Chicago was simple. Deep-dish pizza. We made our way toward Millennium Park with one goal in mind. People often debate whether deep-dish is really pizza. I honestly do not care what category it belongs to. I only know that it was delicious. After lunch, we walked over to Cloud Gate.",
          "Most people know it by another name. The Bean.",
          "And crowded does not even begin to describe it. People stood beneath it taking photographs from every possible angle. Children ran around its curved surface. Tourists admired their distorted reflections. I understood why. It looked like a giant drop of liquid mercury placed in the middle of the city. The polished surface reflected the skyscrapers above us. Glass towers stretched and bent across its curves. The blue summer sky folded into the cityscape.",
          "Quite the sight."
        ]
      },
      {
        img: "images/chicago/riverwalk.jpg",
        alt: "A white tour boat on the turquoise Chicago River below a cluster of downtown towers, seen from the Riverwalk",
        caption: "The Chicago Riverwalk",
        spot: { coords: [41.8880, -87.6260], label: "Chicago Riverwalk" },
        paragraphs: [
          "Later, we headed to the Riverwalk. As someone who studies urban planning, this part of Chicago fascinated me in a different way. We often read about waterfront development in textbooks. We discuss placemaking, accessibility, mixed-use spaces, and the importance of reconnecting cities with their waterways. But reading about something and experiencing it are entirely different things. People sat along the river enjoying the sunshine. Others strolled without hurry. Boats drifted through the water while conversations floated through the warm afternoon air. The water carried an almost turquoise hue beneath the summer sun. Towering above it stood some of Chicago's most recognizable buildings. There was the Trump Tower. Iconic and impossible to miss.",
          "For a moment, I stopped thinking like a student analyzing urban design principles. I simply enjoyed being there."
        ]
      },
      {
        img: "images/chicago/ice-cream.jpg",
        alt: "A white ice cream truck parked on a sunlit street with Chicago's East Side towers rising behind",
        caption: "Ice cream to finish",
        spot: { coords: [41.8835, -87.6190], label: "Maggie Daley Park" },
        paragraphs: [
          "We ended the day the best way possible. With ice cream. Perhaps it was the miles we had traveled. Perhaps it was the summer heat. Perhaps everything tastes better after a day spent exploring a city with a good friend. Whatever the reason, it was one of the best ice creams I have ever had."
        ]
      },
      {
        paragraphs: [
          "Chicago taught me that a city is more than its skyline. It is the joke shared at a red light when a black Lamborghini convinces you Bruce Wayne might actually exist. It is tomato sauce staining your fingertips after deep-dish pizza, sunlight dancing across polished steel at the Bean, and the cool sweetness of melting ice cream on a hot afternoon. Long after the famous buildings fade into memory, it is these small, ordinary moments that keep calling me back to Chicago."
        ]
      }
    ]
  },
  {
    id: "san-diego",
    name: "San Diego",
    state: "California",
    stateCode: "CA",
    category: "city",
    coords: [32.7157, -117.1611],
    zoom: 11,
    visited: "July 2025",
    blurb: "Where the continent runs out of west in the most agreeable way possible. Seventy miles of coast where the weather barely changes all year.",
    arrival: {
      mode: "plane",
      from: [45.5152, -122.6784],
      fromName: "Portland, Oregon",
      label: "PDX → SAN"
    },
    story: [
      {
        bleed: true,
        paragraphs: [
          "I visited San Diego in July of 2025 for a conference. At least, that was the official reason.",
          "Conferences have a way of justifying trips we secretly wanted to take anyway. I expected sunshine. I expected beaches. I expected Southern California to put on its usual performance. What was unexpected was how soothing summer could feel."
        ]
      },
      {
        img: "images/san-diego/bridge.jpg",
        alt: "A curving cable-stayed pedestrian bridge leading toward downtown San Diego, the ballpark and towers beyond under a deep blue sky",
        caption: "The waterfront bridge",
        spot: { coords: [32.7065, -117.1610], label: "Convention Center" },
        paragraphs: [
          "The convention center sat beside the waterfront. One day, I found myself walking across the pedestrian bridge connected to it. I learned that the area transforms during Comic-Con. Thousands of fans gather there every year dressed as superheroes, villains, and characters from imaginary worlds.",
          "For my visit, however, it belonged to researchers, presenters, and conference attendees carrying tote bags instead of capes."
        ]
      },
      {
        img: "images/san-diego/historic-district.jpg",
        alt: "An ornate Victorian building in the Gaslamp Quarter with a blue and cream facade and tall bay windows",
        caption: "The historic district",
        spot: { coords: [32.7110, -117.1595], label: "Gaslamp Quarter" },
        paragraphs: [
          "Outside the conference halls, San Diego revealed its gentler side. The historic district charmed me immediately. Colorful buildings lined the streets. Their vibrant facades seemed to celebrate a different era without becoming trapped by it."
        ]
      },
      {
        img: "images/san-diego/vibrant-buildings.jpg",
        alt: "A row of colorful Gaslamp Quarter storefronts, a vintage marquee and a red brick tower under a soft evening sky",
        caption: "Alive but never hurried",
        spot: { coords: [32.7125, -117.1600], label: "Fifth Avenue" },
        paragraphs: [
          "Music drifted from open doorways. Conversations spilled onto sidewalks.",
          "The city felt alive. But never hurried."
        ]
      },
      {
        img: "images/san-diego/coronado.jpg",
        alt: "The Hotel del Coronado sign on a manicured lawn fringed with palm trees, golden afternoon light behind",
        caption: "Over to Coronado",
        spot: { coords: [32.6809, -117.1785], label: "Coronado" },
        paragraphs: [
          "I took the ferry over to Coronado. The journey itself was part of the experience.",
          "The skyline slowly receded behind us while the bay opened wide ahead. The breeze carried the scent of salt and summer. Coronado greeted us with golden beaches and an unhurried rhythm. I had seen beautiful beaches before. Yet there was something different about this one. Perhaps it was the softness of the sand. Perhaps it was the ocean stretching endlessly toward the horizon. Or perhaps it was simply the realization that summer does not always have to arrive with unbearable heat and urgency."
        ]
      },
      {
        img: "images/san-diego/boathouse.jpg",
        alt: "The red-roofed Coronado boathouse beside a marina full of sailboats, their masts reflected in calm water",
        caption: "A cruise around the bay",
        spot: { coords: [32.6920, -117.1730], label: "Coronado Ferry Landing" },
        paragraphs: [
          "Sometimes summer soothes. I later joined a cruise around the bay. The city shimmered beneath the afternoon light. Sailboats drifted across the water. The breeze softened the warmth of July."
        ]
      },
      {
        img: "images/san-diego/seagull.jpg",
        alt: "A seagull standing on the wet sand of a wide beach, a person wading in the surf far behind under a soft sky",
        caption: "Another traveler",
        spot: { coords: [32.6850, -117.1840], label: "Coronado Beach" },
        paragraphs: [
          "Then, I found myself walking near the shoreline. I can see the open ocean! The Pacific!",
          "A seagull appeared nearby. It walked effortlessly on the wet sand. I remember smiling to myself. Another traveler. Another curious soul venturing into unfamiliar places."
        ]
      },
      {
        img: "images/san-diego/sunset.jpg",
        alt: "People standing at a pier railing in silhouette, watching the sun drop toward the water in a gold and orange sky",
        caption: "Turned toward the horizon",
        spot: { coords: [32.7150, -117.1740], label: "The Embarcadero" },
        paragraphs: [
          "By evening, the sky began its slow transformation. People stood quietly along the railings with the contentment that only water seems to bring. Gold softened into orange. People paused their conversations and turned toward the horizon."
        ]
      },
      {
        img: "images/san-diego/sunset-skyline.jpg",
        alt: "A wide beach at sunset with palm trees and a pier, the San Diego skyline glowing across the water at the last light",
        caption: "The last traces of light",
        spot: { coords: [32.6960, -117.1690], label: "Centennial Park" },
        paragraphs: [
          "Sunsets possess that quiet power. I stood there until the last traces of light disappeared."
        ]
      },
      {
        paragraphs: [
          "San Diego offered gentleness. And sometimes, the best part of a work trip has nothing to do with work at all."
        ]
      }
    ]
  },
  {
    id: "san-francisco",
    name: "San Francisco",
    state: "California",
    stateCode: "CA",
    category: "city",
    coords: [37.7749, -122.4194],
    zoom: 12,
    visited: "December 2023",
    blurb: "The red bridge I first met in a comic book, and a city gentler than the movies promised. Seven miles by seven miles, and no two blocks share a microclimate.",
    arrival: {
      mode: "plane",
      from: [45.5152, -122.6784],
      fromName: "Portland, Oregon",
      label: "PDX → SFO"
    },
    story: [
      {
        bleed: true,
        paragraphs: [
          "San Francisco had always lived in my imagination long before I ever set foot there. For me, it was never just a city. It was a picture. A picture of a vivid red bridge stretching through a veil of fog.",
          "I think I first saw it in the pages of a comic book. Childhood has a peculiar way of introducing us to places. We do not study them. We inherit them through stories. Somehow, the Golden Gate Bridge lodged itself in a quiet corner of my mind and stayed there.",
          "Years later, I found myself in San Francisco for a conference. The places that begin as fiction eventually ask to be visited in person. I could not miss the chance."
        ]
      },
      {
        img: "images/san-francisco/golden-gate.jpg",
        alt: "The Golden Gate Bridge in low afternoon light, its red towers rising over the bay with the Marin Headlands behind",
        caption: "Golden Gate Bridge",
        spot: { coords: [37.8199, -122.4783], label: "Golden Gate Bridge" },
        paragraphs: [
          "Standing before the Golden Gate Bridge, I realized photographs had failed it. The red was deeper than I expected. The scale was humbling. Cars moved across it with the indifference of routine while tourists stood beneath it trying to capture a feeling that refused to fit inside a camera frame.",
          "How strange, I thought. Millions cross this bridge as part of an ordinary Tuesday. Yet for someone who first saw it in a comic book, it feels almost sacred."
        ]
      },
      {
        img: "images/san-francisco/fishermans-wharf.jpg",
        alt: "The round Fisherman's Wharf of San Francisco sign above a busy crosswalk full of pedestrians",
        caption: "Fisherman's Wharf",
        spot: { coords: [37.8080, -122.4177], label: "Fisherman's Wharf" },
        paragraphs: [
          "The city had other surprises waiting. Fisherman's Wharf was one of them. If the bridge was San Francisco's grand introduction, the Wharf was its laughter.",
          "What a lively, vibrant place. There were street performers drawing circles of strangers into sudden audiences. A magician convincing people, if only for a few minutes, that impossible things might happen. Artists sat with charcoal-stained fingers sketching portraits of passersby. Children rode the merry-go-round with the kind of joy adults spend decades trying to rediscover.",
          "I remember holding fresh ice cream while the salty breeze drifted in from the bay. The smell of the sea. The distant cries of gulls. The sound of applause from a performer finishing his act. Amazing how happiness is often assembled from such ordinary ingredients."
        ]
      },
      {
        img: "images/san-francisco/streetcar.jpg",
        alt: "A cable car climbing a steep downtown street toward tall buildings, with red transit lanes underfoot",
        caption: "Cable car at Sutter Street",
        spot: { coords: [37.7894, -122.4083], label: "Powell & Sutter" },
        paragraphs: [
          "Then there were the streetcars. Icons on rails. In an age obsessed with replacing the old with the new, San Francisco seems comfortable having a conversation with its past. The city moves forward, yet it refuses to erase where it came from. The clang of the cable car bell echoes through streets lined with modern offices and glowing storefronts.",
          "Efficiency rarely leaves room for nostalgia. San Francisco somehow makes room for both."
        ]
      },
      {
        img: "images/san-francisco/night-lights.jpg",
        alt: "Downtown high-rises at dusk with lit office windows, people crossing the street, and a streetcar passing at left",
        caption: "Downtown at dusk",
        spot: { coords: [37.7907, -122.4014], label: "Downtown" },
        paragraphs: [
          "And then came the evenings. I had grown up watching Hollywood movies that painted cities in neon and noise. I expected something louder, more dramatic. Instead, what I found in December was gentleness. There were Christmas lights glowing softly against the winter darkness. Storefront windows dressed in festive colors. Couples walking unhurriedly beneath scarves and coats. The air carried that particular chill that invites reflection rather than urgency. It felt calm. Almost quiet.",
          "Travel has a curious way of teaching us that places are never exactly what we expect. The San Francisco of my childhood imagination was built from comics and cinema. The real San Francisco gave me something better. Perhaps that is why we travel. Not to confirm the stories we have heard, but to discover the details they forgot to mention.",
          "Some cities impress you. A few cities stay with you. San Francisco, for me, did both!"
        ]
      }
    ]
  },
  {
    id: "yellowstone",
    name: "Yellowstone",
    state: "Wyoming",
    stateCode: "WY",
    category: "park",
    coords: [44.4930, -110.8420],
    zoom: 11,
    visited: "July 2024",
    blurb: "The caldera that taught the world what a national park is. Half of Earth's geysers vent through this one restless plateau.",
    arrival: {
      mode: "plane",
      from: [45.5152, -122.6784],
      fromName: "Portland, Oregon",
      via: [
        { coords: [36.1699, -115.1398], name: "Las Vegas, Nevada", mode: "car" },
        { coords: [37.5930, -112.1871], name: "Bryce Canyon, Utah", mode: "car" }
      ],
      label: "PDX → LAS → Bryce → Yellowstone"
    },
    story: [
      {
        bleed: true,
        paragraphs: [
          "The earth breathed here. Steam rose like a prayer. Water glowed in colors that should not exist. And deep below, fire waited. Yellowstone felt less like a national park and more like a reminder that our planet is still very much alive.",
          "I had never seen anything like it. Before visiting Yellowstone, I thought of nature in familiar terms. Mountains. Lakes. Forests. Waterfalls. Beautiful, certainly. Predictable, perhaps. Yellowstone belonged to an entirely different category."
        ]
      },
      {
        img: "images/yellowstone/ys-1.jpg",
        alt: "A steaming turquoise hot spring sending up thick white plumes, with a boardwalk and forested hills beyond",
        caption: "Steam like a prayer",
        spot: { coords: [44.4658, -110.8378], label: "Black Sand Basin" },
        paragraphs: [
          "The geothermal landscape looked as though it had escaped from another world. Pools shimmered in shades of emerald, turquoise, and sapphire. Steam drifted upward in soft white plumes. The air carried the distinct scent of sulfur. Beneath the boardwalk, boiling water churned just below the Earth's surface."
        ]
      },
      {
        img: "images/yellowstone/ys-3.jpg",
        alt: "A vivid blue and green hot spring ringed with orange and rust mineral crust under a wide sky",
        caption: "Colors that should not exist",
        spot: { coords: [44.5250, -110.8382], label: "Midway Geyser Basin" },
        paragraphs: [
          "It was both beautiful and unsettling. The colors invited you closer. The steam reminded you to keep your distance."
        ]
      },
      {
        img: "images/yellowstone/ys-2.jpg",
        alt: "A long boardwalk running across a geyser basin past several pale blue pools toward the forest",
        caption: "Walking the basin",
        spot: { coords: [44.4869, -110.8567], label: "Biscuit Basin" },
        paragraphs: [
          "I remember walking through the basin in complete fascination. How could something so serene be born from such violence?"
        ]
      },
      {
        img: "images/yellowstone/ys-4.jpg",
        alt: "A deep emerald and turquoise hot spring rimmed with pale mineral crust, ringed by pine forest",
        caption: "The planet's inner workings",
        spot: { coords: [44.4720, -110.8400], label: "Upper Geyser Basin" },
        paragraphs: [
          "Millions of years ago, immense volcanic forces shaped this land. The heat never disappeared. It simply remained hidden beneath the surface. Yellowstone became one of the few places on Earth where you can witness the planet's inner workings in plain sight."
        ]
      },
      {
        paragraphs: [
          "The Old Faithful! There was an announced eruption time. People gathered long before the show began. Families searched for good seats. Children asked impatient questions. Cameras were prepared. Conversations softened into anticipation. We all waited. Hundreds of strangers sat side by side with their eyes fixed on a patch of steaming ground.",
          "It reminded me of waiting for fireworks on the Fourth of July. Or the curtain rising at a theater. Except no orchestra played. No stage lights dimmed. Nature needed no introduction."
        ]
      },
      {
        spot: { coords: [44.4605, -110.8281], label: "Old Faithful" },
        paragraphs: [
          "Then, suddenly, it happened. A powerful column of steaming water burst into the sky. The crowd responded with the same mixture of applause, laughter, and amazement that follows a great performance. For a few moments, age, nationality, and language ceased to matter. Everyone became a child again. Everyone simply pointed upward."
        ]
      },
      {
        paragraphs: [
          "You wait for a geyser that erupts according to its own timetable. Sometimes, if you are patient enough to watch, nature turns the page before your eyes."
        ]
      }
    ]
  },
  {
    id: "grand-teton",
    name: "Grand Teton",
    state: "Wyoming",
    stateCode: "WY",
    category: "park",
    coords: [43.7904, -110.6818],
    zoom: 10,
    visited: "July 2024",
    blurb: "No foothills and no warning. The range jumps four thousand feet straight out of the sagebrush at Jackson Hole.",
    arrival: {
      mode: "plane",
      from: [45.5152, -122.6784],
      fromName: "Portland, Oregon",
      via: [
        { coords: [36.1699, -115.1398], name: "Las Vegas, Nevada", mode: "car" },
        { coords: [37.5930, -112.1871], name: "Bryce Canyon, Utah", mode: "car" }
      ],
      label: "PDX → LAS → Bryce → Grand Teton"
    },
    story: [
      {
        bleed: true,
        paragraphs: [
          "Some of the best travel memories begin with a change of plans. Grand Teton was one of them."
        ]
      },
      {
        img: "images/grand-teton/arrival.jpg",
        alt: "The sharp peaks of the Cathedral Group rising behind a parking area where a few people stand beside their cars, framed by pines",
        caption: "Why not stop by",
        spot: { coords: [43.7960, -110.7030], label: "Cathedral Group" },
        paragraphs: [
          "We were driving from Yellowstone to Salt Lake City. The day had already been full. The logical thing would have been to continue south and call it a day. Then we heard that some friends were hiking in Grand Teton National Park. Why not stop by? Travel has taught me that \"why not?\" often leads to the best stories.",
          "By the time we arrived, evening had begun its slow descent across the valley. The light was different. Softer. And perhaps because of that, the Tetons revealed a different kind of beauty."
        ]
      },
      {
        img: "images/grand-teton/jackson-lake.jpg",
        alt: "The jagged Teton range rising straight from the far shore of a wide, dark lake under a pale evening sky",
        caption: "Grand indeed",
        spot: { coords: [43.8580, -110.5870], label: "Jackson Lake" },
        paragraphs: [
          "I had seen photographs of these mountains before. They were dramatic enough in broad daylight. Yet nothing prepared me for seeing them under the hues of evening. They rose abruptly from the valley floor without warning. No gradual transition. No foothills easing you into the experience.",
          "Grand indeed."
        ]
      },
      {
        img: "images/grand-teton/evening-light.jpg",
        alt: "The sun setting behind a jagged Teton peak, the last light flaring over a forested lake settling into shadow",
        caption: "The last light",
        spot: { coords: [43.7680, -110.7250], label: "Jenny Lake" },
        paragraphs: [
          "The mountains carried a quiet authority about them. Their sharp silhouettes stood against the fading light while patches of lingering snow caught the last rays of the sun. The valley below settled into shadow. The peaks remained illuminated just a little longer, as though reluctant to surrender the day."
        ]
      },
      {
        paragraphs: [
          "We found our friends and listened to stories from the trail. There was laughter. There was the familiar excitement that comes after spending a day outdoors. And all the while, the Tetons stood behind us like silent witnesses."
        ]
      }
    ]
  },
  {
    id: "crater-lake",
    name: "Crater Lake",
    state: "Oregon",
    stateCode: "OR",
    category: "park",
    coords: [42.9446, -122.1090],
    zoom: 12,
    visited: "June 2024",
    blurb: "Mount Mazama collapsed 7,700 years ago and left the deepest lake in the United States. The blue is not exaggerated in anyone's photographs.",
    arrival: {
      mode: "car",
      from: [44.5646, -123.2620],
      fromName: "Corvallis, Oregon",
      label: "Corvallis → Crater Lake"
    },
    story: [
      {
        bleed: true,
        paragraphs: [
          "If you want to see the bluest lake on Earth, you should come visit Crater Lake.",
          "I know every travel destination makes impossible promises. The tallest. The oldest. The most beautiful.",
          "Crater Lake sounds like another entry on that long list. Until you actually see it!"
        ]
      },
      {
        img: "images/crater-lake/crater-lake-1.jpg",
        alt: "Deep blue Crater Lake from the rim, the forested flank of Wizard Island in the foreground and the caldera walls beyond",
        caption: "The blue, sunglasses off",
        spot: { coords: [42.9415, -122.1632], label: "Watchman Overlook" },
        paragraphs: [
          "The first time I visited Crater Lake, I was wearing sunglasses. I looked out toward the water and thought the blue tint of my lenses was playing tricks on me. Surely no lake could look like that. I took them off. The blue remained. I blinked a few times and looked again. It was still there. I remember thinking that this blue could not possibly belong to Earth.",
          "Photographs prepare you for many things. They tell you what a place looks like. They rarely tell you how it feels. Standing at the rim of Crater Lake, I felt as if nature had accidentally spilled a piece of the sky into a giant stone bowl."
        ]
      },
      {
        img: "images/crater-lake/crater-lake-2.jpg",
        alt: "A wide panorama of the whole caldera filled with sapphire water, Wizard Island small at the left and a tiny boat on the surface",
        caption: "A basin of liquid sapphire",
        paragraphs: [
          "The story behind it only makes the scene more unbelievable. Thousands of years ago, a volcano collapsed into itself and left behind a massive crater. Today, that ancient wound holds some of the purest water in the world. It looked like as though a meteor had struck the Earth and left behind a perfect basin filled with liquid sapphire."
        ]
      },
      {
        img: "images/crater-lake/crater-lake-3.jpg",
        alt: "Wizard Island up close, a volcanic cone covered in conifers rising out of the still blue water",
        caption: "Wizard Island",
        spot: { coords: [42.9456, -122.1547], label: "Wizard Island" },
        paragraphs: [
          "In the middle of that impossible blue sat Wizard Island. A mysterious island rising from the lake's surface as if it had wandered out of a fantasy novel. Boats slid quietly through the water around it. From a distance, they appeared weightless. Tiny white strokes against an endless canvas of blue."
        ]
      },
      {
        img: "images/crater-lake/crater-lake-4.jpg",
        alt: "Crater Lake framed by rim cliffs and snow patches, Wizard Island at the center where the blue of the water meets the blue of the sky",
        caption: "Where one blue meets the other",
        paragraphs: [
          "Mesmerizing. I found myself staring at the lake for long stretches of time. Without blinking. The sky above carried its own shade of blue. The lake answered with another. Between them stood the rugged basalt cliffs and forested hills that framed the horizon. Where did one blue end and the other begin? I could not tell.",
          "The entire scene felt too precise to be accidental. As if someone had painted it with impossible patience. Every detail sat exactly where it belonged. The island. The cliffs. The water. The sky."
        ]
      },
      {
        paragraphs: [
          "Perfect.",
          "Crater Lake left me standing at the rim, searching for words while knowing none of them would ever be enough."
        ]
      }
    ]
  },
  {
    id: "mount-rainier",
    name: "Mount Rainier",
    state: "Washington",
    stateCode: "WA",
    category: "park",
    coords: [46.8523, -121.7603],
    zoom: 11,
    visited: "July 2024",
    blurb: "An ice-clad volcano so large it makes its own weather. On a clear day it floats above the horizon from a hundred miles away.",
    arrival: {
      mode: "car",
      from: [44.5646, -123.2620],
      fromName: "Corvallis, Oregon",
      label: "Corvallis → Mount Rainier"
    },
    story: [
      {
        bleed: true,
        paragraphs: [
          "One of the best national parks I have ever visited was Mount Rainier.",
          "Its beauty arrived slowly. Then all at once. They meander through forests of towering evergreens. You pass quiet campgrounds and rushing streams. The scenery is beautiful, certainly, but familiar enough that you settle into the rhythm of the drive. Then a bend in the road changes everything. Suddenly, there it is. Mount Rainier."
        ]
      },
      {
        img: "images/mount-rainier/rainier-1.jpg",
        alt: "Mount Rainier crowned with snow above a green meadow and a small cascade tumbling over rocks in the foreground",
        caption: "There it is",
        spot: { coords: [46.7880, -121.7330], label: "Paradise" },
        paragraphs: [
          "I remember being completely awestruck by its majesty. The mountain did not merely rise above the landscape. It dominated it. Snow and glaciers clung to its massive slopes even in summer. It stood with a quiet confidence that made everything around it feel smaller."
        ]
      },
      {
        img: "images/mount-rainier/rainier-2.jpg",
        alt: "The snow-covered mountain rising directly above a visitor center parking lot lined with cars and a few people on a path",
        caption: "From the parking lot",
        spot: { coords: [46.7858, -121.7355], label: "Paradise visitor center" },
        paragraphs: [
          "What surprised me most was how quickly the extraordinary became ordinary. Even the parking lot at the visitor center offered a breathtaking view. Imagine stepping out of your car to stretch your legs and finding one of the most magnificent mountains in North America staring back at you."
        ]
      },
      {
        img: "images/mount-rainier/rainier-3.jpg",
        alt: "People gathered near the visitor area with the jagged peaks of the Tatoosh Range rising across the valley",
        caption: "Views in every direction",
        spot: { coords: [46.7850, -121.7360], label: "Tatoosh Range" },
        paragraphs: [
          "Some places save their best views for the difficult hike. Mount Rainier seems generous. The meadows were equally unforgettable. Wildflowers painted the landscape in bursts of color. People wandered along the trails without urgency. Families stopped to admire views that would have been the highlight of an entire trip elsewhere."
        ]
      },
      {
        img: "images/mount-rainier/rainier-4.jpg",
        alt: "A rocky stream rushing through a green meadow below the snowfields of Mount Rainier",
        caption: "Nature's applause",
        spot: { coords: [46.7875, -121.7340], label: "Edith Creek" },
        paragraphs: [
          "Then there were the waterfalls. Cold mountain water rushed down rocky slopes with an energy that felt contagious. You could hear them before you saw them. The sound echoed through the forest like nature's applause."
        ]
      },
      {
        img: "images/mount-rainier/rainier-5.jpg",
        alt: "Mount Rainier reflected in the calm surface of a forest-lined lake, a band of cloud crossing its base",
        caption: "Reflection Lake",
        spot: { coords: [46.7700, -121.7340], label: "Reflection Lakes" },
        paragraphs: [
          "And finally, Reflection Lake.",
          "Perhaps my favorite moment of all. On calm days, the mountain appears again upon the water's surface. Two Rainiers."
        ]
      },
      {
        paragraphs: [
          "Mount Rainier asks you to slow down long enough to notice just how beautiful this world can be."
        ]
      }
    ]
  },
  {
    id: "north-cascades",
    name: "North Cascades",
    state: "Washington",
    stateCode: "WA",
    category: "park",
    coords: [48.6800, -120.9500],
    zoom: 9,
    visited: "July 2024",
    blurb: "The most rugged range in the Lower 48, and the least visited. Glaciers feed lakes the color of nothing else on Earth.",
    arrival: {
      mode: "car",
      from: [44.5646, -123.2620],
      fromName: "Corvallis, Oregon",
      label: "Corvallis → North Cascades"
    },
    story: [
      {
        bleed: true,
        paragraphs: [
          "I have always been drawn to a particular kind of landscape. A turquoise lake, snow-capped mountains in the background, the sort of view that appears on desktop wallpapers and travel magazines. Beautiful enough to seem almost fictional.",
          "I searched the internet one evening and discovered that Washington had exactly what I had been looking for. North Cascades National Park."
        ]
      },
      {
        img: "images/north-cascades/diablo-lake.jpg",
        alt: "Diablo Lake glowing turquoise below forested ridges, a snow-streaked peak rising at the head of the valley",
        caption: "Diablo Lake",
        spot: { coords: [48.7144, -121.1357], label: "Diablo Lake Overlook" },
        paragraphs: [
          "A road trip soon followed. We arrived early in the morning. It was around nine o'clock when we pulled over at the viewpoint overlooking Diablo Lake. I stood there in silence.",
          "What shade of blue was this? Turquoise did not seem sufficient. Emerald felt incomplete. The water carried a color that escaped definition. Perhaps it had borrowed its pigments from heaven. The surrounding mountains framed the lake so perfectly that the entire scene resembled a painting. I stood at the viewpoint for nearly thirty minutes. I did very little. I simply looked. Travel often encourages movement. See the next attraction. Take another photograph, keep going. Diablo Lake convinced me to remain still."
        ]
      },
      {
        img: "images/north-cascades/blue-lake.jpg",
        alt: "Blue Lake held in a bowl of jagged peaks, its clear water revealing the rocks along the shallow shore",
        caption: "Blue Lake",
        spot: { coords: [48.5940, -120.6680], label: "Blue Lake" },
        paragraphs: [
          "Later that morning, we made our way to Blue Lake. The hike took about five hours round trip. Parts of the trail felt rugged enough to remind us that beautiful places often demand a little effort. It was worth every step."
        ]
      },
      {
        img: "images/north-cascades/blue-lake-2.jpg",
        alt: "A wider view of Blue Lake ringed by talus and forest, a few small figures resting at the clear green water's edge",
        caption: "Not a place to rush",
        spot: { coords: [48.5950, -120.6700], label: "Blue Lake" },
        paragraphs: [
          "Blue Lake rested quietly in the embrace of towering mountains. The water was crystal clear. Fish moved beneath the surface as if they understood they lived somewhere extraordinary. The atmosphere around the lake felt wonderfully human. Some people slipped into the water to escape the summer heat. Others unpacked their lunches. Everyone seemed to understand that this was not a place to rush through."
        ]
      },
      {
        img: "images/north-cascades/ross-lake.jpg",
        alt: "Sun flaring over Ross Lake between dark forested ridges, with the floating cabins of the resort along the far shore",
        caption: "Ross Lake",
        spot: { coords: [48.7290, -121.0660], label: "Ross Lake" },
        paragraphs: [
          "On our way back, we stopped at Ross Lake. I suspect many people know Diablo Lake and drive right past what came next. That feels like a mistake."
        ]
      },
      {
        img: "images/north-cascades/ross-lake-2.jpg",
        alt: "A floating wooden dock with a small boat tied alongside the resort cabins, mountains framing the lake beyond",
        caption: "Ross Lake Resort",
        spot: { coords: [48.7310, -121.0680], label: "Ross Lake Resort" },
        paragraphs: [
          "Hidden deeper within the wilderness lies Ross Lake Resort. Floating cabins rest upon the water. Boats wait patiently nearby. Visitors can venture across the lake at their own pace. It struck me as one of the most beautiful resorts in the western United States. Imagine waking up surrounded by mountains and stepping directly onto a boat."
        ]
      },
      {
        paragraphs: [
          "We continued to Ross Dam and admired the view one last time. The lakes, the forests, the peaks, and the endless shades of blue seemed to blend into one memory. Perhaps that is what I will remember most about North Cascades. Not a single destination. Not a single hike. But the fifty shades of blue.",
          "The French painter Claude Monet once said, \"Color is my day-long obsession, joy, and torment.\" I thought of those words as we drove home."
        ]
      }
    ]
  },
  {
    id: "zion",
    name: "Zion National Park",
    state: "Utah",
    stateCode: "UT",
    category: "park",
    coords: [37.2690, -112.9480],
    zoom: 11,
    visited: "July 2025",
    blurb: "A canyon carved by the Virgin River through two thousand feet of Navajo sandstone. Here you look up at the geology instead of down.",
    arrival: {
      mode: "plane",
      from: [45.5152, -122.6784],
      fromName: "Portland, Oregon",
      via: [{ coords: [36.1699, -115.1398], name: "Las Vegas, Nevada", mode: "car" }],
      label: "PDX → LAS → ZION"
    },
    story: [
      {
        bleed: true,
        paragraphs: [
          "I had one plan in mind when I arrived at Zion National Park.",
          "I wanted to eat a Subway sandwich while looking out at the views of Zion. That was it. No ambitious checklist. No race to conquer every trail. Just a simple lunch with an extraordinary backdrop. Sometimes the smallest plans create the strongest memories."
        ]
      },
      {
        img: "images/zion/park-entrance.jpg",
        alt: "The sandstone peaks of Zion rising behind the park entrance, with an outfitter sign and a shuttle van in the lot below",
        caption: "Arriving at Zion",
        spot: { coords: [37.2008, -112.9873], label: "Park entrance" },
        paragraphs: [
          "Getting there was part of the experience."
        ]
      },
      {
        img: "images/zion/shuttle.jpg",
        alt: "View from a shuttle window of riders stepping off onto the canyon road beneath a sheer red cliff",
        caption: "The canyon shuttle",
        spot: { coords: [37.2592, -112.9510], label: "The Grotto" },
        paragraphs: [
          "The Zion shuttle bus moved quietly through the canyon. It carried visitors beneath towering sandstone walls. It felt less like transportation and more like an integral part of the park itself. Everyone looked out the windows with the same expression. Anticipation!"
        ]
      },
      {
        img: "images/zion/canyon-walls.jpg",
        alt: "Towering cream and red sandstone walls rising on both sides of the canyon, framed by green trees and a bright sky",
        caption: "Walls of cream and red",
        spot: { coords: [37.2851, -112.9477], label: "Temple of Sinawava" },
        paragraphs: [
          "Massive cliffs rose from the canyon floor in shades of cream, orange, and red. Millions of years ago, ancient rivers, deserts, and seas laid down layers of sediment that hardened into stone. Time and the Virgin River sculpted them into the landscape we see today."
        ]
      },
      {
        img: "images/zion/the-narrows.jpg",
        alt: "Hikers wading up the Virgin River between sheer canyon walls in the Narrows, sunlight catching the rock high above",
        caption: "The Narrows",
        spot: { coords: [37.2920, -112.9480], label: "The Narrows" },
        paragraphs: [
          "In the summer of 2025, I hiked the Narrows. Walking through the Virgin River is one of those experiences that sounds strange until you do it yourself. The canyon narrows around you while sheer rock walls stretch hundreds of feet overhead. The river becomes the trail.",
          "I expected the water to be freezing. It wasn't. In the dry desert heat of summer, the cool water felt refreshing with every step. Each splash washed away the fatigue of the day. Sunlight filtered into the canyon in narrow beams."
        ]
      },
      {
        paragraphs: [
          "Sometimes all you need is a shuttle ride through a canyon, a simple sandwich with a view, and the willingness to follow a river wherever it decides to lead you."
        ]
      }
    ]
  },
  {
    id: "bryce-canyon",
    name: "Bryce Canyon",
    state: "Utah",
    stateCode: "UT",
    category: "park",
    coords: [37.5930, -112.1871],
    zoom: 12,
    visited: "July 2025",
    blurb: "Not a canyon but an amphitheater of hoodoos eroding out of the Paunsaugunt Plateau. Frost does the carving, one winter at a time.",
    arrival: {
      mode: "plane",
      from: [45.5152, -122.6784],
      fromName: "Portland, Oregon",
      via: [{ coords: [36.1699, -115.1398], name: "Las Vegas, Nevada", mode: "car" }],
      label: "PDX → LAS → BRYCE"
    },
    story: [
      {
        bleed: true,
        paragraphs: [
          "People often talk about destinations that look unreal. Bryce Canyon felt like arriving on another planet.",
          "During the Fourth of July holiday in 2025, I decided to head to Utah in search of its otherworldly landscapes. One of those stops was Bryce Canyon, a place that had long occupied my travel wish list."
        ]
      },
      {
        img: "images/bryce-canyon/bryce-2.jpg",
        alt: "A vast amphitheater of red and cream rock spires stretching to a distant horizon under a wide blue sky with scattered clouds",
        caption: "First look from the rim",
        spot: { coords: [37.6044, -112.1577], label: "Bryce Point" },
        paragraphs: [
          "The first time I stood at the rim and looked down into the amphitheater below, I genuinely wondered if I was still on Earth."
        ]
      },
      {
        img: "images/bryce-canyon/bryce-1.jpg",
        alt: "A dense field of countless orange hoodoos packed close together across the floor of the Bryce amphitheater",
        caption: "An ancient city of stone",
        spot: { coords: [37.6093, -112.1635], label: "Inspiration Point" },
        paragraphs: [
          "The landscape stretched out before me in shades of red, orange, and cream. Thousands upon thousands of stone spires rose from the canyon floor. They stood so close together that they resembled an ancient city carved by giants. Or perhaps the remains of a civilization long forgotten."
        ]
      },
      {
        img: "images/bryce-canyon/bryce-5.jpg",
        alt: "Tall sculpted canyon walls rising on both sides of a sandy trail, with tiny hikers far below for scale",
        caption: "Down among the hoodoos",
        spot: { coords: [37.6258, -112.1668], label: "Wall Street" },
        paragraphs: [
          "Bryce Canyon is famous for its hoodoos. Odd name, isn't it?",
          "These towering rock formations were shaped over millions of years through a patient partnership between ice, rain, and wind. Water seeped into cracks during the day. It froze during cold desert nights. The expanding ice widened those fractures little by little until the rock surrendered.",
          "Nature, it turns out, is an artist with unlimited time."
        ]
      },
      {
        img: "images/bryce-canyon/bryce-3.jpg",
        alt: "Hoodoo crowns glowing gold in low evening sunlight while the lower rock and a switchback trail stay in deep red shadow",
        caption: "Crowns of gold",
        spot: { coords: [37.6283, -112.1652], label: "Navajo Loop" },
        paragraphs: [
          "Standing there, however, geology was the last thing on my mind. What I saw looked less like erosion and more like an assembly of ghosts. The evening sunlight touched the tops of the hoodoos first. Their crowns glowed gold."
        ]
      },
      {
        img: "images/bryce-canyon/bryce-6.jpg",
        alt: "A cluster of hoodoos with pale, almost white crowns above deep red bodies, green pine forest on the slopes behind",
        caption: "Ghosts of stone",
        spot: { coords: [37.6270, -112.1640], label: "Sunset Point" },
        paragraphs: [
          "The lower sections remained wrapped in shadow, revealing deep shades of red and burnt orange. The contrast made them appear alive. Pale figures emerged from crimson earth as though they had risen quietly to greet the dawn.",
          "Ghosts of stone. Frozen in place. Watching."
        ]
      },
      {
        img: "images/bryce-canyon/bryce-4.jpg",
        alt: "A lone hiker standing on a trail beneath a rock overhang, looking out toward sunlit cliffs and open sky",
        caption: "Standing still",
        spot: { coords: [37.6325, -112.1628], label: "Sunrise Point" },
        paragraphs: [
          "There are moments during travel when your brain struggles to categorize what it sees. You search for comparisons. A painting. A movie set. A dream. Bryce Canyon reminded me of Mars. The red terrain. The rugged cliffs. The feeling of standing somewhere untouched and ancient. Only the crisp mountain air reminded me that I was still in Utah.",
          "I stood there for a long time. Long enough to notice how the colors changed with the movement of the sun. Long enough to appreciate the stillness. Long enough to forget about checking my phone or taking another photograph."
        ]
      }
    ]
  }
];

/* Template for a new place. Copy, fill in, append to PLACES.
   The arrival and story blocks are optional. Leave them out
   until you have a route or photos and text for the place.
   Resize photos first with tools\resize-photo.ps1 (see README).

  {
    id: "",
    name: "",
    state: "",
    stateCode: "",
    category: "park",
    coords: [0.0000, 0.0000],
    zoom: 11,
    visited: "",
    blurb: "",
    arrival: {
      mode: "plane",
      from: [0.0000, 0.0000],
      fromName: "",
      via: [{ coords: [0.0000, 0.0000], name: "" }],
      label: ""
    },
    story: [
      {
        bleed: true,
        paragraphs: [
          ""
        ]
      },
      {
        img: "images/place-id/photo.jpg",
        alt: "",
        caption: "",
        spot: { coords: [0.0000, 0.0000], label: "" },
        paragraphs: [
          ""
        ]
      }
    ]
  },

*/
