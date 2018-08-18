const fs = require('fs')
const pixelmatch = require('pixelmatch')
const { PNG } = require('pngjs/')
const colors = require('colors')
const signale = require('signale')

const imageFromFile = filename =>
  new Promise(resolve => {
    const img = fs
      .createReadStream(filename)
      .pipe(new PNG())
      .on('parsed', () => {
        resolve(img.data)
      })
  })

const compareScreenShots = async (FILENAME_A, FILENAME_B, viewportConfig) => {
  const IMAGES_FOLDER_PATH = './scripts/visual-regresion-tests/images/'
  const { height, width } = viewportConfig

  console.log(IMAGES_FOLDER_PATH + FILENAME_A.green);
  console.log(process.cwd())
  const newLayout = await imageFromFile(IMAGES_FOLDER_PATH + FILENAME_A) // './automation/images/local_host_layout.png'
  const oldLayout = await imageFromFile(IMAGES_FOLDER_PATH + FILENAME_B) // './automation/images/local_host_layout.png'
  signale.success(viewportConfig.green)
  const diff = await new PNG(viewportConfig)
  const diffPixels = await pixelmatch(
    newLayout,
    oldLayout,
    diff.data,
    width,
    height,
    {
      threshold: 0
    }
  )

  if (diffPixels === 0) {
    console.log('Success! No difference in rendering'.green)
  } else {
    console.log(
      `Uh-oh! Ther are ${diffPixels} different pixels in new render!`.bgRed
    )
  }
}

module.exports.conmpareScreenShots = compareScreenShots