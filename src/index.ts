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
  /*
  style: {
    fg: 'white',
    bg: 'black'
  }*/
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
screen.key(['C-c'], () => {
  log('Bye')
  bot.end();
  process.exit(0);
});

inputBar.key('escape', () => {
  const yes = toggleState('I')
  if (yes) {
    log('[Mode] Input')
    inputBar.focus();
  } else {
    log('[Mode] Control');
    logBox.focus()
  }
})
logBox.key('escape', () => {
  const yes = toggleState('I')
  if (yes) {
    log('[Mode] Input')
    inputBar.focus();
  } else {
    log('[Mode] Control');
    logBox.focus()
  }
})

type Keys = 'up' | 'down' | 'left' | 'right' | 'space' | 'shift' | 'w' | 'a' | 's' | 'd' | 'I'

const keyState:Record<Keys,boolean> = {
  up: false,
  down: false,
  left: false,
  right: false,
  space: false,
  shift: false,
  w: false,
  a: false,
  s: false,
  d: false,
  I: false,

}

const toggleState = (x: Keys) => {
  keyState[x] = !keyState[x];
  return keyState[x]
}

screen.key('w', () => {
  const e = bot.entity
  const pitch = e.pitch
  const yaw = e.yaw;
  bot.look(pitch + 5, yaw)
})
screen.key('s', () => {
  const e = bot.entity
  const pitch = e.pitch
  const yaw = e.yaw;
  bot.look(pitch - 5, yaw)
})
screen.key('a', () => {
  const e = bot.entity
  const pitch = e.pitch
  const yaw = e.yaw;
  bot.look(pitch, yaw - 5)
})
screen.key('d', () => {
  const e = bot.entity
  const pitch = e.pitch
  const yaw = e.yaw;
  bot.look(pitch, yaw + 5)
})

screen.key('up', () => {
  const bool = toggleState('up');
  bot.setControlState('forward', bool)
})

screen.key('down', () => {
  const bool = toggleState('down');
  bot.setControlState('back', bool)
})
screen.key('left', () => {
  const bool = toggleState('left');
  bot.setControlState('left', bool)
})
screen.key('right', () => {
  const bool = toggleState('right');
  bot.setControlState('right', bool)
})
screen.key('space', () => {
  const bool = toggleState('space');
  bot.setControlState('jump', bool)
})
screen.key('z', () => {
  const bool = toggleState('shift');
  bot.setControlState('sneak', bool)
})

// Mineflayerボットのセットアップ
const bot = createBot({
  username: 'Bot',
  host: "marvgame.net",
  port: 25565,
  auth: "microsoft",
  version: '1.21.1'
});

// 入力バーが内容を送信（Enterキー）したときの処理
inputBar.on('submit', (str) => {
  if (str.trim() === '') {
    // 空行の場合は何もしない
  } else {
    // execute
    eval(str)
    // TUIに送信したメッセージを表示
    log(`> ${str}`);
  }
  inputBar.clearValue();
  inputBar.focus();
});

// ボットイベントとTUIの統合
bot.once('spawn', async () => {
  mineflayerViewer(bot, { port: 3000, firstPerson: true, viewDistance: 5 });
  bot.chat('/helloworld');
  await bot.waitForTicks(40);
  bot.chat('/server NeoEarth');
});

bot.on('login', () => {
    log(`Logged in as ${bot.username}`);
    inputBar.focus();
});

bot.on('kicked', (reason) => {
    log('kicked:');
    log(reason)
});

bot.on('error', (err) => {
    log(`Error: ${err.message}`);
});

bot.on('end', () => {
    log('Disconnected from server.');
});

bot.on('messagestr', (msg) => {
  log(msg);
});

// 初回レンダリングとフォーカス
log('Connecting to Minecraft server...');
inputBar.focus();
screen.render();
