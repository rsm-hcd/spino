import { assertSpyCall, type MethodSpy, spy } from "@std/testing/mock";
import { beforeAll, describe, it } from "@std/testing/bdd";
import { PrefixLogger } from "./prefix-logger.ts";

describe("cli/prefix-logger", () => {
  let logSpy: MethodSpy<Console, unknown[], void>;

  beforeAll(() => {
    logSpy = spy(console, "log");
  });

  it("should log messages with a prefix", () => {
    // Arrange
    const prefix = "test";
    const task = "task";
    const message = "Hello, world!";
    const logger = new PrefixLogger(prefix, task);

    // Act
    logger.log("Hello, world!");

    // Assert
    assertSpyCall(logSpy, 0, {
      args: [`${logger.prefix} ${message}`],
    });
  });
});
