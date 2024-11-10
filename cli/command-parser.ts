import { parseArgs } from "@std/cli/parse-args";

interface ParsedCommands {
  help: boolean;
  upgrade: boolean;
  list: boolean;
  command?: "upgrade" | "list" | undefined;
  tasks: string[];
}

export function parseCommands(args: string[]): ParsedCommands {
  const { help, _ } = parseArgs(args);

  return _.reduce((acc, arg) => {
    if (arg == "upgrade" || arg == "list") {
      return {
        ...acc,
        [arg as string]: true,
        command: arg,
      };
    }

    return { ...acc, tasks: [...acc.tasks, `${arg}`] };
  }, {
    help,
    tasks: [],
    upgrade: false,
    list: false,
    command: undefined,
  } as ParsedCommands);
}
