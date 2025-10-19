import { createBot } from "mineflayer"
import { headless, mineflayer as mineflayerViewer } from "prismarine-viewer"


const bot = createBot({
  username: 'Bot',
  host: "marvgame.net",
  port: 25565,
  auth: "microsoft"
})

bot.once('spawn', async () => {
  mineflayerViewer(bot, { port: 3000, firstPerson: true, viewDistance: 5 }) // Start the viewing server on port 3000
  while (1) {
    bot.setControlState('forward', true);
    bot.setControlState('back', false);
    await bot.waitForTicks(40);
    bot.setControlState('forward', false);
    bot.setControlState('back', true);
    await bot.waitForTicks(40);
  }
})