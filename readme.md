# {{project.name}}
> {{project.description}}

## usage
To get started, fork this repository and enter the following commands.
```sh
> scaffy   # replace template tags
> pkg-bump # update package.json dep versions
> npm i    # install deps
> make dev # watch files and start web server
```

## deps
- task runner: `make`
- JS: `esbuild`
- CSS: `sass`, `postcss`, `autoprefixer`, `cleancss`
- HTML: `html-minifier`
- file watcher: `chokidar`
- spritesheet creation/extraction: `jimp`, `pack`, `img-load`, `img-extract`
- animation logic: `lerp`
