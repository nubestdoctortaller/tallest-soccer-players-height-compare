# How Do You Measure Up Against the Tallest Soccer Players?

A small interactive page that lets visitors enter their height and see where they would rank among the 10 tallest active professional soccer players in the world in 2026.

Visitors can enter their height in feet and inches or in centimeters. The page places them in the lineup alongside the top 10 and the average professional outfield player, then tells them whether they would make the list.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page content and layout |
| `style.css` | Styling (Doctor Taller brand greens, Poppins font) |
| `script.js` | Player data, unit conversion, and lineup logic |
| `README.md` | This file |

## Publish with GitHub Pages

1. Create a new public repository and upload all four files to the root.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to *Deploy from a branch*, choose `main` and `/ (root)`, then click **Save**.
4. After a minute or two, the page will be live at `https://<your-username>.github.io/<repository-name>/`.

## Updating the data

Player names, positions, and heights are stored in the `PLAYERS` array at the top of `script.js`. Each entry has a height in centimeters (used for ranking and bar length) and a display string in feet and inches (shown on the page). Update both when the rankings change.

## Source

Player data comes from the full 2026 ranking on Doctor Taller, which includes club and league details, honorable mentions, an all-time ranking with retired players, and the sources behind each figure:
[Top 10 Tallest Soccer Players Right Now (2026 Update)](https://doctortaller.com/blogs/science-insight/top-10-tallest-soccer-players-right-now)
