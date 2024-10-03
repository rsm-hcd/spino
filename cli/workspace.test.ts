import { assertEquals } from "@std/assert";
import { before, describe, it } from "@std/testing/bdd";
import * as path from "@std/path";
import { findAllTasks } from "./workspace.ts";

describe("cli/workspace", () => {
  let cwd: string;

  before(() => {
    cwd = path.join(Deno.cwd(), "test-files");
  });

  it("should find all tasks in a workspace", () => {
    const tasks = findAllTasks({ cwd });
    assertEquals(tasks.length, 4);
  });
});
