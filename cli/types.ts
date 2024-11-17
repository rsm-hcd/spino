import type { parseCommands } from "./command-parser.ts";
import type { displayHelpCommand } from "./commands/help.ts";
import type { runTasksCommand } from "./commands/tasks.ts";
import type { upgradeCommand } from "./commands/upgrade.ts";
import type { listCommand } from "./commands/list.ts";
import type { Spy } from "@std/testing/mock";

export interface MainCliDependencies {
  parseCommands: typeof parseCommands;
  displayHelpCommand: typeof displayHelpCommand;
  runTasksCommand: typeof runTasksCommand;
  upgradeCommand: typeof upgradeCommand;
  listCommand: typeof listCommand;
}

export interface MainCliSpyDependencies {
  parseCommands: Spy<typeof parseCommands>;
  displayHelpCommand: Spy<typeof displayHelpCommand>;
  runTasksCommand: Spy<typeof runTasksCommand>;
  upgradeCommand: Spy<typeof upgradeCommand>;
  listCommand: Spy<typeof listCommand>;
}

export interface Task {
  package: string;
  task: string;
  script: string;
  cwd: string;
}
