import { parseArgs } from "@std/cli/parse-args";

interface ParsedCommands {
  help: boolean;
  command?: "upgrade";
  tasks: string[];
}

export function parseCommands(args: string[]): ParsedCommands {
  const { help, _ } = parseArgs(args);

  const { upgrade, tasks } = _.reduce((acc, arg) => {
    if (arg === "upgrade") {
      return { ...acc, upgrade: true };
    }

    return { ...acc, tasks: [...acc.tasks, `${arg}`] };
  }, { tasks: [] as string[], upgrade: false });

  return {
    help,
    command: upgrade ? "upgrade" : undefined,
    tasks,
  };
}
