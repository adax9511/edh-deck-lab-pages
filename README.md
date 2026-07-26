# EDH Lab — published site

Built output only. Source lives in the private `edh-deck-lab` repo; edit there, run
`npm run build`, then copy `public/` here and push (same flow as the Lorandal wiki).

Live: https://adax9511.github.io/edh-deck-lab-pages/

## Note on this deployment

GitHub Pages is static hosting, so the two features that need a server are unavailable
here: infinite-combo detection (Commander Spellbook only accepts requests from approved
origins) and Archidekt URL import. The app detects this and says so in place, with a
direct link to Commander Spellbook. Everything else — curve, land math, colour
consistency, composition, the playtest simulation, brackets and suggestions — runs
locally in the browser and is unaffected.
