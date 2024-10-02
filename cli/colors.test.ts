import { assertEquals, assertStrictEquals } from "@std/assert";
import { describe, it } from "@std/testing/bdd";

describe("cli/colors", () => {
  it("should export a function named randomColor", () => {
    import("./colors.ts").then((module) => {
      assertStrictEquals(typeof module.randomColor, "function");
    });
  });

  it("should return a color from the list", () => {
    import("./colors.ts").then((module) => {
      const color = module.randomColor();
      const availableColors = [
        "blue",
        "cyan",
        "green",
        "magenta",
        "brightRed",
        "yellow",
        "brightBlue",
      ];

      assertEquals(availableColors.includes(color), true);
    });
  });
});
