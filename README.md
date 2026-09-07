# Phero Assignment Checker

A Chrome extension that speeds up assignment grading for Programming Hero
instructors. Load a JSON rubric, tick off what the student got right, and the
extension writes the feedback and suggests the mark.

## Features

- **Multiple rubrics at once.** Load any number of JSON files and switch the
  active one from the tools panel or the loader.
- **Feedback builder.** Every requirement and sub-requirement becomes a
  checkbox. Unchecking a requirement also unchecks everything under it.
- **Custom feedback per item.** Uncheck an item to add your own wording and
  partial marks.
- **Mark suggestion.** Marks are scaled to the assignment's total and can be
  copied to your clipboard automatically.
- **Keyboard driven.** Every action has a shortcut, and every shortcut is
  rebindable.
- **Auto-open submission links.** Optional, off by default.

## Install

Download the latest `chrome-mv3-prod.zip` from
[Releases](https://github.com/shahriyardx/assignment-checker/releases/latest),
unzip it, then load it in Chrome:

1. Go to `chrome://extensions`
2. Turn on **Developer mode**
3. Click **Load unpacked** and pick the unzipped folder

## Usage

On the instructor dashboard:

| Shortcut | Action |
| --- | --- |
| `Shift` + `\` | Open the JSON loader |
| `Shift` + `O` | Open the first assignment in the list |
| `]` | Show the feedback builder |
| `Shift` + `}` | Insert the feedback and fill in the mark |
| `Shift` + `Enter` | Submit the mark |

All of these except the loader can be rebound in the extension popup, under
**Settings → Shortcuts**.

There is also a **Tools** panel in the top-right of the dashboard with the same
actions, plus loading and switching rubrics.

## Rubric format

```json
{
  "type": "new",
  "highestMark": 60,
  "sections": [
    {
      "name": "Layout",
      "requirements": [
        {
          "data": {
            "description": "Navbar is responsive",
            "number": "5",
            "correct": true,
            "message": "not okay",
            "okayMessage": "okay",
            "notOkayMessage": "not okay"
          },
          "subRequirements": []
        }
      ]
    }
  ]
}
```

The older flat format is still accepted and converted automatically. See
[`examples/`](./examples) for sample files.

## Development

This project uses [bun](https://bun.sh).

```bash
bun install --ignore-scripts   # skip lifecycle scripts
bun run dev                    # tailwind watch + plasmo dev
bun run build                  # production build + zip
bun run typecheck              # tsc --noEmit
bun run lint                   # biome check
bun run format                 # biome check --write
```

Tailwind is compiled by its own CLI into `src/styles.css` (generated, not
committed) because Plasmo's bundler cannot load the Tailwind 4 PostCSS plugin.
Edit `src/styles.src.css` instead.

## Privacy

The extension stores your settings and rubrics locally and sends no personal
data anywhere. See [privacy.md](./privacy.md).

## License

[MIT](./LICENSE)
