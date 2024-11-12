import { parseCommands } from "./command-parser.ts";
import { displayHelpCommand } from "./commands/help.ts";
import { runTasksCommand } from "./commands/tasks.ts";
import { upgradeCommand } from "./commands/upgrade.ts";
import { listCommand } from "./commands/list.ts";

const rootCwd = Deno.cwd();
const { help, command, tasks } = parseCommands(Deno.args);

if (!help) {
  switch (command) {
    case "upgrade": {
      await upgradeCommand();
      break;
    }
    case "list": {
      await listCommand(rootCwd);
      break;
    }
  }
  Deno.exit(0);
}

if (help || (command == null && tasks.length === 0)) {
  displayHelpCommand(command);
  Deno.exit(0);
}

await runTasksCommand(rootCwd, tasks);
