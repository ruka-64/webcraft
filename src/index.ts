import { createBot } from "mineflayer"
import { mineflayer as mineflayerViewer } from "prismarine-viewer"
import repl from 'repl'

const bot = createBot({
  username: 'Bot',
  host: "marvgame.net",
  port: 25565,
  auth: "microsoft",
  version: '1.21.1'
})

bot.once('spawn', async () => {
  mineflayerViewer(bot, { port: 3000, firstPerson: true, viewDistance: 5 }) // Start the viewing server on port 3000
  bot.chat('/helloworld');
  await bot.waitForTicks(40);
  bot.chat('/server NeoEarth');
})

bot.on('messagestr', (msg) => {
  console.log(msg);
});