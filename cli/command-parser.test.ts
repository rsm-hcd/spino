import { describe, it } from "@std/testing/bdd";
import { parseCommands } from "./command-parser.ts";
import { assertEquals } from "@std/assert/equals";

describe("cli/parseCommands", () => {
  it("should return help true when --help is passed", () => {
    // Arrange
    const args = ["--help"];

    // Act
    const result = parseCommands(args);

    // Assert
    assertEquals(result.help, true);
  });

  it("should return command upgrade when upgrade is passed", () => {
    // Arrange
    const args = ["upgrade"];

    // Act
    const result = parseCommands(args);

    // Assert
    assertEquals(result.command, "upgrade");
  });

  it("should return tasks when tasks are passed", () => {
    // Arrange
    const args = ["task1", "task2"];

    // Act
    const result = parseCommands(args);

    // Assert
    assertEquals(result.tasks, ["task1", "task2"]);
  });
});
