const CoinHive = require('coin-hive');

(async () => {
  // Create miner
  const miner = await CoinHive('t5ThK1xaNOwj7FdO2foPnjxc2EZog5OA'); // CoinHive's Site Key

  // Start miner
  await miner.start();

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
})();
