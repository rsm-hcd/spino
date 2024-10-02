import type { Task } from "./types.ts";

/**
 * Find and read all packages (npm and deno) in monorepo.
 */
export function findAllTasks(cwd: string): Task[] {
  return findNestedTasks(cwd, cwd);
}

/**
 * Find and read all packages (npm and deno) in monorepo.
 */
function findNestedTasks(cwd: string, rootCwd: string): Task[] {
  const tasks: Task[] = [];

  for (const entry of Deno.readDirSync(cwd)) {
    if (entry.isDirectory) {
      // ignore node_modules
      if (entry.name === "node_modules") {
        continue;
      }

      tasks.push(...findNestedTasks(`${cwd}/${entry.name}`, rootCwd));
      continue;
    }

    if (cwd === rootCwd) {
      continue;
    }

    const relativeFolderName = cwd.slice(rootCwd.length + 1);

    try {
      if (entry.isFile && entry.name === "package.json") {
        const pkg = JSON.parse(
          Deno.readTextFileSync(`${cwd}/${entry.name}`),
        );
        if (pkg.scripts) {
          for (const name in pkg.scripts) {
            tasks.push({
              package: pkg.name ?? relativeFolderName,
              task: name,
              script: pkg.scripts[name],
              cwd,
            });
          }
        }

        continue;
      }

      if (entry.isFile && entry.name === "deno.json") {
        const { tasks: denoTasks, name: denoPackageName } = JSON.parse(
          Deno.readTextFileSync(`${cwd}/${entry.name}`),
        );
        if (denoTasks) {
          for (const name in denoTasks) {
            tasks.push({
              package: denoPackageName ?? relativeFolderName,
              task: name,
              script: denoTasks[name],
              cwd,
            });
          }
        }
      }
    } catch (error) {
      if (error instanceof Deno.errors.NotFound) {
        continue;
      }

      throw error;
    }
  }

  return tasks;
}
