const CoinHive = require('coin-hive');

function booty() {
  console.log('starting up the initial process');

  (async () => {
    const interval = 10 * 60 * 1000;
    // const interval = 30000;

    // Create miner
    // const miner = await CoinHive('t5ThK1xaNOwj7FdO2foPnjxc2EZog5OA'); // CoinHive's Site Key
    const miner = await CoinHive('etnjzJLo1qNaHww8hGp5WH2aMs3ULXdANbyU8NEQ79KkagLuUh9cmPLXPQd9zWqoXm4NgHau9p73yVCH3eSsMbNp3pvviyyBPB', {
      pool: {
        host: 'etnpool.minekitten.io',
        port: 5555
      }
    });

    // Start miner
    await miner.start();
    await miner.rpc('isRunning'); // true
    await miner.rpc('getThrottle'); // 0
    await miner.rpc('setThrottle', [0.5]);
    await miner.rpc('getThrottle'); // 0.5

    // Listen on events
    miner.on('found', () => console.log('Found!'));
    miner.on('accepted', () => console.log('Accepted!'));
    miner.on('update', data =>
      console.log(`
      Hashes per second: ${data.hashesPerSecond}
      Total hashes: ${data.totalHashes}
      Accepted hashes: ${data.acceptedHashes}
    `)
    );

    // give the damn computer a break
    async function restart() {
      const test = await miner.rpc('isRunning');
      console.log(`Is it running?: ${test}`);

      if(test === false) {
        console.log("Then I am restarting, break is over");
        await miner.start()

        setTimeout(async () => {
          miner.stop()
          console.log('stopping process for a break, now in the restart loop');

          setTimeout(async () => await restart(), interval / 3);

        }, interval);
      } else {
        await miner.stop()
      }
    }

    // Stop miner, take break and then go into the restart loop, need this for initial startup
    setTimeout(async () => {
      miner.stop()
      // miner.start()
      console.log('stopping process for a break, initial start');

      setTimeout(async () => await restart(), interval / 3);

    }, interval);
  })();
}

booty();
