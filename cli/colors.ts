import type * as colors from "@std/fmt/colors";

type Color = keyof typeof colors;

export const randomColor = (() => {
  let index = 0;

  const availableColors = [
    "blue",
    "cyan",
    "green",
    "magenta",
    "brightRed",
    "yellow",
    "brightBlue",
  ].map((v) => ({
    color: v as keyof typeof colors,
    weight: Math.random(),
  })).sort((a, b) => a.weight - b.weight)
    .map((v) => v.color);

  return () => {
    if (index >= availableColors.length) {
      index = 0;
    }

    return availableColors[index++];
  };
})();
