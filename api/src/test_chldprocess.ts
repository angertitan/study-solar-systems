import { spawn } from 'child_process';

const cmd = spawn(`${__dirname}/spa`, ['1', '2', '3', '44.45', '553421.123133', '3']);

cmd.stdout.on('data', (data: unknown): void => {
  console.log(`stdout: ${data}`);
});
