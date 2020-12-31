#!/usr/bin/env node
const { join, extname, sep } = require('path')
const fs = require('fs')
const pack = require('pack')
const Jimp = require('jimp')
const dest = join(__dirname, '../dist')

;(async function main () {
  const sourcemap = {}
  const files = process.argv.slice(2)
  const paths = files.map(file => join(process.cwd(), file))
  let common = paths[0]
  for (let i = 1; i < paths.length; i++) {
    const path = paths[i]
    while (common.length && path.indexOf(common) !== 0) {
      common = common.slice(0, common.lastIndexOf(sep) + 1)
    }
    if (!common.length) {
      break
    }
  }

  if (paths.length === 1) {
    const index = common.lastIndexOf(sep)
    if (index >= 0) {
      common = common.slice(0, index + 1)
    } else {
      common = ''
    }
  }

  const names = paths.map(path => path.slice(common.length, -extname(path).length))
  const images = await Promise.all(paths.map(path => Jimp.read(path)))
  const sizes = images.map(image => [image.bitmap.width, image.bitmap.height])
  const layout = pack(sizes)
  const target = await new Jimp(layout.size[0], layout.size[1])
  for (let i = 0; i < images.length; i++) {
    const image = images[i]
    const name = names[i]
    const box = layout.boxes[i]
    const [w, h] = box.size
    const [x, y] = box.position
    target.blit(image, x, y, 0, 0, w, h)

    const path = name.split('/')
    let object = sourcemap
    for (let i = 0; i < path.length; i++) {
      const key = path[i]
      if (i === path.length - 1) {
        object[key] = [x, y, w, h]
      } else {
        if (typeof object[key] !== 'object') {
          object = object[key] = {}
        } else {
          object = object[key]
        }
      }
    }
  }

  target.write(join(dest, 'sprites.png'))
  fs.writeFileSync(join(dest, 'tmp/sprites.json'), JSON.stringify(sourcemap), 'utf8')
})()
