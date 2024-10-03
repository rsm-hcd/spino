import * as path from "@std/path";
import type { Task } from "./types.ts";

export function parse(
  filePath: string,
  relativeFolderName: string,
  cwd: string,
): Task[] {
  switch (path.basename(filePath)) {
    case "package.json":
      return parsePackageJson(filePath, relativeFolderName, cwd);
    case "deno.json":
      return parseDenoJson(filePath, relativeFolderName, cwd);
    default:
      return [];
  }
}

function parsePackageJson(
  filePath: string,
  relativeFolderName: string,
  cwd: string,
): Task[] {
  const tasks: Task[] = [];
  const contents = Deno.readTextFileSync(filePath);
  const json = JSON.parse(contents);
  const { scripts, ...pkg } = json;

  if (scripts) {
    for (const name in scripts) {
      tasks.push({
        package: pkg.name ?? relativeFolderName,
        task: name,
        script: scripts[name],
        cwd,
      });
    }
  }

  return tasks;
}

function parseDenoJson(
  filePath: string,
  relativeFolderName: string,
  cwd: string,
): Task[] {
  const tasks: Task[] = [];
  const contents = Deno.readTextFileSync(filePath);
  const json = JSON.parse(contents);
  const { tasks: denoTasks, name: denoPackageName } = json;

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
  return tasks;
}
