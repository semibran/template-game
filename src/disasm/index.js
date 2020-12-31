import srcmap from '../dist/tmp/sprites.json'
import loadImage from 'img-load'
import disasm from '../lib/disasm'
import disasmFonts from './fonts'
import * as fontdata from '../fonts'

export let fonts = null

export async function load (path) {
  const sheet = await loadImage(path)
  const images = disasm(sheet, srcmap)
  fonts = disasmFonts(images, fontdata)
}
