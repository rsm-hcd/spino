import { parseCommands } from "./command-parser.ts";
import { displayHelpCommand } from "./commands/help.ts";
import { runTasksCommand } from "./commands/tasks.ts";
import { upgradeCommand } from "./commands/upgrade.ts";
import { listCommand } from "./commands/list.ts";
import type { MainCliDependencies } from "./types.ts";

export async function main(deps: MainCliDependencies, args: string[]) {
  const rootCwd = Deno.cwd();
  const { help, command, tasks } = deps.parseCommands(args);

  if (!help) {
    switch (command) {
      case "upgrade": {
        await deps.upgradeCommand();
        return;
      }
      case "list": {
        await deps.listCommand(rootCwd);
        return;
      }
    }
  }

  if (help || (command == null && tasks.length === 0)) {
    deps.displayHelpCommand(command);
    return;
  }

  await deps.runTasksCommand(rootCwd, tasks);
}

// Only run if this is the main module
if (import.meta.main) {
  const deps: MainCliDependencies = {
    parseCommands,
    displayHelpCommand,
    runTasksCommand,
    upgradeCommand,
    listCommand,
  };

  await main(deps, Deno.args);
}
