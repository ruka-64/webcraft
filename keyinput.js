import blessed from 'blessed';

const screen = blessed.screen({
    smartCSR: true,
})

screen.key(['escape', 'q', 'C-c'], () => {
  process.exit(0);
});

screen.on('keypress', (x,y) => {
    console.log(x,y)
})