# {{project.name}}
> {{project.description}}

A small but opinionated web game template designed for personal projects.

## usage
To get started, fork this repository and enter the following commands.
```sh
> scaffy   # replace template tags
> pkg-bump # update package.json
> npm i    # install deps
> git init # init repository
> make dev # watch files
```

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
