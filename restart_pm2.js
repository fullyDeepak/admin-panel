const pm2 = require('pm2');
const { exit } = require('process');

pm2.connect((err) => {
  console.log('Connected to PM2 Daemon');
  if (err) {
    console.error(err);
    process.exit(2);
  }

  pm2.list((err, list) => {
    if (err) {
      console.error(err);
      exit(1);
    }
    const pid = list.find(
      (ele) => ele.pm2_env?.pm_cwd === process.cwd()
    )?.pm_id;
    if (!pid) {
      pm2.start(
        {
          name: 'admin-panel',
          script: 'pnpm',
          args: ' run start',
          cwd: process.cwd(),
        },
        (err, apps) => {
          if (err) {
            console.error(err);
            exit(1);
          }
          console.log("Process Started because it wasn't running.");
          pm2.disconnect();
          exit(0);
        }
      );
    } else {
      console.log('restarting process with id:', pid);
      pm2.restart(pid, (err, proc) => {
        if (err) {
          console.error(err);
          exit(1);
        }
        pm2.reloadLogs((err) => {
          console.log('reloading logs');
        });
        const process = list.find((ele) => ele.pid === pid);
        if (proc.status === 'errored') {
          exit(2);
        }
        pm2.disconnect();
      });
    }
  });
});
