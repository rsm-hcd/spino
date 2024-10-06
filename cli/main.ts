import { parseCommands } from "./command-parser.ts";
import { displayHelpCommand } from "./commands/help.ts";
import { runTasksCommand } from "./commands/tasks.ts";
import { upgradeCommand } from "./commands/upgrade.ts";

const rootCwd = Deno.cwd();
const { help, command, tasks } = parseCommands(Deno.args);

if (!help && command === "upgrade") {
  upgradeCommand(import.meta.url);
  Deno.exit(0);
}

if (help || (command == null && tasks.length === 0)) {
  displayHelpCommand(command);
  Deno.exit(0);
}

await runTasksCommand(rootCwd, tasks);
