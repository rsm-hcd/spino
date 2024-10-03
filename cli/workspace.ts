import * as path from "@std/path";
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

  /**
   * (Optional) Ignore these folders
   * Defaults to ["node_modules", ".git"] if not set.
   */
  ignore?: string[];
}

/**
 * Find and read all packages (npm and deno) in monorepo.
 */
export function findAllTasks(options: FindAllTasksOptions): Task[] {
  const tasks: Task[] = [];
  const { cwd, rootCwd = cwd, ignore = ["node_modules", ".git"] } = options;

  for (const entry of Deno.readDirSync(cwd)) {
    const entryPath = path.join(cwd, entry.name);

    if (entry.isDirectory) {
      if (ignore.includes(entry.name)) {
        continue;
      }

      tasks.push(...findAllTasks({ cwd: entryPath, rootCwd }));
      continue;
    }

    if (cwd === rootCwd) {
      continue;
    }

    if (entry.isFile) {
      const relativeFolderName = cwd.slice(rootCwd.length + 1);
      tasks.push(
        ...parse(entryPath, relativeFolderName, cwd),
      );
    }
  }

  return tasks;
}
