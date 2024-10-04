import { parseArgs } from "@std/cli/parse-args";
import { displayHelpCommand } from "./commands/help.ts";
import { runTasksCommand } from "./commands/tasks.ts";

const rootCwd = Deno.cwd();
const { help, _: tasks } = parseArgs(Deno.args);

if (help || tasks.length === 0) {
  displayHelpCommand();
  Deno.exit(0);
}

await runTasksCommand(rootCwd, tasks as string[]);
