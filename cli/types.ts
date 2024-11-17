import type { parseCommands } from "./command-parser.ts";
import type { displayHelpCommand } from "./commands/help.ts";
import type { runTasksCommand } from "./commands/tasks.ts";
import type { upgradeCommand } from "./commands/upgrade.ts";
import type { listCommand } from "./commands/list.ts";

export interface MainCliDependencies {
  parseCommands: typeof parseCommands;
  displayHelpCommand: typeof displayHelpCommand;
  runTasksCommand: typeof runTasksCommand;
  upgradeCommand: typeof upgradeCommand;
  listCommand: typeof listCommand;
}

export interface Task {
  package: string;
  task: string;
  script: string;
  cwd: string;
}
