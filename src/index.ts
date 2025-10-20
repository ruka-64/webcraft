import blessed from 'blessed'
import { createBot } from 'mineflayer';
import { mineflayer as mineflayerViewer } from 'prismarine-viewer';

// TUIのセットアップ
const screen = blessed.screen({
  smartCSR: true,
  fullUnicode: true,
});

screen.title = 'Prismarine Viewer';

const logBox = blessed.log({
  top: 0,
  left: 0,
  height: '100%-1',
  width: '100%',
  keys: true,
  mouse: true,
  scrollable: true,
  alwaysScroll: true,
  scrollbar: {
    ch: ' ',
  },
  style: {
    fg: 'white',
    bg: 'black'
  }
});

const inputBar = blessed.textbox({
  bottom: 0,
  left: 0,
  height: 1,
  width: '100%',
  keys: true,
  mouse: true,
  inputOnFocus: true,
  style: {
    fg: 'white',
    bg: 'blue'
  }
});

screen.append(logBox);
screen.append(inputBar);

const log = (text:string) => {
  logBox.log(`[${new Date().toLocaleTimeString()}] ${text}`);
  screen.render();
};

// 終了キーの設定
screen.key(['escape', 'q', 'C-c'], () => {
  process.exit(0);
});

// 入力バーへのフォーカス
screen.key('enter', () => {
  inputBar.focus();
});

// Mineflayerボットのセットアップ
const bot = createBot({
  username: 'Bot',
  host: "marvgame.net",
  port: 25565,
  auth: "microsoft",
  version: '1.21.1'
});

// 入力バーが内容を送信（Enterキー）したときの処理
inputBar.on('submit', (text) => {
  if (text.trim() === '') {
    // 空行の場合は何もしない
  } else {
    // ボットにチャットを送信
    bot.chat(text);
    // TUIに送信したメッセージを表示
    log(`[Sent] ${text}`);
  }
  inputBar.clearValue();
  inputBar.focus();
});

// ボットイベントとTUIの統合
bot.once('spawn', async () => {
  log('Bot spawned. Starting viewer...');
  mineflayerViewer(bot, { port: 3000, firstPerson: true, viewDistance: 5 });
  
  log('Sending initial command: /helloworld');
  bot.chat('/helloworld');
  
  await bot.waitForTicks(40);
  
  log('Switching server: /server NeoEarth');
  bot.chat('/server NeoEarth');
});

bot.on('login', () => {
    log(`Logged in as ${bot.username}`);
    inputBar.focus(); // ログイン後にフォーカス
});

bot.on('kicked', (reason) => {
    log(`Kicked: ${reason}`);
});

bot.on('error', (err) => {
    log(`Error: ${err.message}`);
});

bot.on('end', () => {
    log('Disconnected from server.');
});

bot.on('messagestr', (msg) => {
  // MineflayerのチャットメッセージをTUIに表示
  log(`[Chat] ${msg}`);
});

// 初回レンダリングとフォーカス
log('Connecting to Minecraft server...');
inputBar.focus();
screen.render();