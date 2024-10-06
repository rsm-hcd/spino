const updgradeHelpMessage = `Upgrade spino to the latest version`;

export function displayHelpCommand(command?: string) {
  if (command === "upgrade") {
    console.log(`Usage: spino upgrade\n\n${updgradeHelpMessage}`);
    return;
  }

  console.log(
    `Usage: spino [task1] [task2] or spino [command]\n\nCommands:\n  upgrade: ${updgradeHelpMessage}`,
  );
}
