import { dirname, join, relative } from "@std/path";
import { walk } from "@std/fs/walk";
import type { Task } from "./types.ts";
import { parse } from "./package-parser.ts";

interface FindAllTasksOptions {
  /**
   * Current working directory.
   */
  cwd: string;

  /**
   * (Optional) Root directory of the monorepo.
   * Defaults to cwd if not set.
   */
  rootCwd?: string;
}

/**
 * Find and read all packages (npm and deno) in monorepo.
 */
export async function findAllTasks(
  options: FindAllTasksOptions,
): Promise<Task[]> {
  const tasks: Task[] = [];
  const { cwd, rootCwd = cwd } = options;

  const jsonEntries = walk(rootCwd, {
    exts: ["json"],
    skip: [/node_modules/, /dist/],
  });

  for await (const entry of jsonEntries) {
    if (entry.isFile) {
      const relativeFolderName = relative(
        rootCwd,
        dirname(entry.path),
      );

      // Skip root folder
      if (!relativeFolderName) {
        continue;
      }

      tasks.push(
        ...parse(
          entry.path,
          relativeFolderName,
          join(rootCwd, relativeFolderName),
        ),
      );
    }
  }

  return tasks;
}
