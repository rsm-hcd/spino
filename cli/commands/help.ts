const updgradeHelpMessage = `Upgrade spino to the latest version`;
const listAllTasksMessage = `List all available workspace tasks`;

export function displayHelpCommand(command?: string) {
  if (command === "upgrade") {
    console.log(`Usage: spino upgrade\n\n${updgradeHelpMessage}`);
    return;
  }
  if (command === "list") {
    console.log(`Usage: spino list\n\n${listAllTasksMessage}`);
    return;
  }

  console.log(
    `Usage: spino [task1] [task2] or spino [command]\n\nCommands:
  upgrade:  ${updgradeHelpMessage}
  list:     ${listAllTasksMessage}`,
  );
}
