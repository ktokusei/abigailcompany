# Abigail Properties — GreggAnn Herrern

Static site. No build step, no dependencies. Deploy to Vercel as-is
(Framework Preset: **Other**, no build command, output directory `.`).

```
index.html          markup
css/styles.css      all styling
js/data.js          ← the only file you edit month to month
js/main.js          rendering + hero avatar crop
img/                photos (see img/README.md)
```

## Updating recent sales

Open `js/data.js` and edit the `DEALS` array. Each entry:

```js
{
  role: "Sold · Represented seller",   // or "Bought · Represented buyer"
  address: "15 Los Altos Square",
  city: "Los Altos, CA",
  price: "$1,771,000",
  photo: "img/deal-1.jpg",
  blurb: "One or two sentences of context.",
  facts: ["4% above list", "11 days on market", "$1,226 / sq ft"]
}
```

Add or remove entries freely — the grid takes any number. Update
`DEALS_UPDATED` at the top of the file while you're there.

## Updating testimonials

Same file, `TESTIMONIALS` array. Set `photo` to an image path in `/img`
(or leave it `null` for the striped placeholder), and `linkedin` to the
person's real profile URL.

## Hero avatar framing

The round photo in the hero can be dragged to reposition and scrolled to
zoom; framing is saved per browser in localStorage. To ship one fixed
framing to all visitors, edit the `DEFAULT` values in `js/main.js`.
