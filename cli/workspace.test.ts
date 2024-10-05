import { assertEquals } from "@std/assert";
import { before, describe, it } from "@std/testing/bdd";
import * as path from "@std/path";
import { findAllTasks } from "./workspace.ts";

describe("cli/workspace", () => {
  let cwd: string;

  before(() => {
    const { dirname } = import.meta;

    if (dirname === undefined) {
      throw new Error("import.meta.dirname is undefined");
    }

    cwd = path.join(dirname, "test-files");
  });

  it("should find all tasks in a workspace", async () => {
    const tasks = await findAllTasks({ cwd });
    assertEquals(tasks.length, 4);
  });
});
