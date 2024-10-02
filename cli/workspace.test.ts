import { assertEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";
import { findAllTasks } from "./workspace.ts";

describe("cli/workspace", () => {
  it("should find all tasks in a workspace", () => {
    const tasks = findAllTasks(Deno.cwd());
    assertEquals(Array.isArray(tasks), true);
  });

  it("should parse package.json files correctly", () => {
    const tasks = findAllTasks(Deno.cwd());
    const packageJsonTasks = tasks.filter(task => task.script.includes("package.json"));
    assertEquals(packageJsonTasks.length > 0, true);
  });

  it("should parse deno.json files correctly", () => {
    const tasks = findAllTasks(Deno.cwd());
    const denoJsonTasks = tasks.filter(task => task.script.includes("deno.json"));
    assertEquals(denoJsonTasks.length > 0, true);
  });
});
