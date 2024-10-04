import { parseArgs } from "@std/cli/parse-args";
import { runTasks } from "./commands/tasks.ts";

const rootCwd = Deno.cwd();
const { help, _: tasks } = parseArgs(Deno.args);

if (help || tasks.length === 0) {
  console.log(`Usage: spino [task1] [task2] ...`);
  Deno.exit(0);
}

await runTasks(rootCwd, tasks as string[]);
