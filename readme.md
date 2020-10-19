# {{name}}
> {{description}}

## usage
To get started, run [`pkg-bump`][pkg-bump] to update deps in package.json to the latest version and then `npm i` to install. You will need to `chmod +x bin/sprites.js` before `make` can run the spritesheet builder.
```sh
> pkg-bump
> npm i
> sudo chmod +x bin/sprites.js
> git init
```

When you're ready, run `make dev` and start developing.

[pkg-bump]: https://npmjs.com/package/pkg-bump

## deps
- task runner: `make`
- JS: `rollup`, `babel`, `uglifyjs`
- CSS: `node-sass`, `postcss`, `autoprefixer`, `cleancss`
- HTML: `html-minifier`
- file watcher: `chokidar`
- dev server: `serve`
- deployment: `gh-pages`
- spritesheet creation/extraction: `jimp`, `pack`, `img-load`, `img-extract`
- keyboard input: `key-state`
- view logic: `lerp`
