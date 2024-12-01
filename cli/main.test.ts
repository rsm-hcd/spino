import { assertRejects } from "@std/assert/rejects";
import { assertSpyCall, spy } from "@std/testing/mock";
import { parseCommands } from "./command-parser.ts";
import { main } from "./main.ts";
import type { MainCliSpyDependencies } from "./types.ts";

const createMockDeps = (): MainCliSpyDependencies => ({
  parseCommands: spy(parseCommands),
  displayHelpCommand: spy(),
  runTasksCommand: spy(),
  upgradeCommand: spy(),
  listCommand: spy(),
});

Deno.test({
  name: "cli/main - should show help when running with --help flag",
  fn: async () => {
    const deps = createMockDeps();
    const args = ["--help"];

    await main(deps, args);

    assertSpyCall(deps.displayHelpCommand, 0, {
      args: [undefined],
    });
  },
});

Deno.test({
  name: "cli/main - should show upgrade help when running with --help flag",
  fn: async () => {
    const deps = createMockDeps();
    const args = ["upgrade", "--help"];

    await main(deps, args);

    assertSpyCall(deps.displayHelpCommand, 0, {
      args: ["upgrade"],
    });
  },
});

Deno.test({
  name: "cli/main - should run upgrade command",
  fn: async () => {
    const deps = createMockDeps();
    const args = ["upgrade"];

    await main(deps, args);

    assertSpyCall(deps.upgradeCommand, 0, {
      args: [],
    });
  },
});

Deno.test({
  name: "cli/main - should run list command",
  fn: async () => {
    const deps = createMockDeps();
    const args = ["list"];

    await main(deps, args);

    assertSpyCall(deps.listCommand, 0, {
      args: [Deno.cwd()],
    });
  },
});

Deno.test({
  name: "cli/main - should run tasks when provided",
  fn: async () => {
    const deps = createMockDeps();
    const args = ["test:ci", "nonexistentTask"];

    await main(deps, args);

    assertSpyCall(deps.runTasksCommand, 0, {
      args: [Deno.cwd(), ["test:ci", "nonexistentTask"]],
    });
  },
});

Deno.test({
  name: "cli/main - should show help when no args are provided",
  fn: async () => {
    const deps = createMockDeps();
    const args: string[] = [];

    await main(deps, args);

    assertSpyCall(deps.displayHelpCommand, 0, {
      args: [undefined],
    });
  },
});

Deno.test({
  name: "cli/main - should handle errors in list command",
  fn: async () => {
    const deps = createMockDeps();
    deps.listCommand = spy(() => {
      throw new Error("List command error");
    });

    const args = ["list"];

    await assertRejects(
      async () => {
        await main(deps, args);
      },
      Error,
      "List command error",
    );
  },
});

Deno.test({
  name: "cli/main - should handle errors in runTasksCommand",
  fn: async () => {
    const deps = createMockDeps();
    deps.runTasksCommand = spy(() => {
      throw new Error("runTasksCommand error");
    });

    const args = ["task1"];

    await assertRejects(
      async () => {
        await main(deps, args);
      },
      Error,
      "runTasksCommand error",
    );
  },
});

Deno.test({
  name: "cli/main - should handle invalid commands",
  fn: async () => {
    const deps = createMockDeps();
    deps.parseCommands = spy(() => ({
      help: false,
      command: "invalid-command",
      tasks: [],
    }));
    const args = ["invalid-command"];

    await main(deps, args);

    assertSpyCall(deps.runTasksCommand, 0, {
      args: [Deno.cwd(), []],
    });
  },
});
