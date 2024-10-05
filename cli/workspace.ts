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

  for await (const dirEntry of walk(rootCwd, { exts: ["json"] })) {
    if (dirEntry.isFile) {
      const relativeFolderName = relative(
        rootCwd,
        dirname(dirEntry.path),
      );

      // Skip root folder
      if (!relativeFolderName) {
        continue;
      }

      tasks.push(
        ...parse(
          dirEntry.path,
          relativeFolderName,
          join(rootCwd, relativeFolderName),
        ),
      );
    }
  }

  return tasks;
}
