const signale = require('signale')
const puppeteer = require('puppeteer')

const getPageScreenshot = async (url, env, viewportConfig, dateString) => {
  const { height, width } = viewportConfig

  await signale.success('Initializing browser')

  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.setViewport({ width, height })
  await signale.success('Opening browser...')
  await signale.success('Navigating to the site ')
  await page.goto(url).catch(error => {
    signale.error('Could not reach the site ', url)
  })
  // process.exit(1);
  await page
    .waitForSelector('h1')
    .then(async () => {
      signale.success('Selector is on the screen...') // This is a fancy console.log()
      await page.screenshot({
        path: `scripts/visual-regresion-tests/images/${env + dateString}.png`
      })
      browser.close()
    })
    .catch(error => signale.error('Selector is not available', url))
}

module.exports.getPageScreenshot = getPageScreenshot
