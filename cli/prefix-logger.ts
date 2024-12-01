import * as colors from "@std/fmt/colors";
import { randomColor } from "./colors.ts";

export class PrefixLogger {
  private readonly decoder = new TextDecoder("utf-8");

  readonly prefix: string;

  constructor(packageName: string, taskName?: string) {
    const consoleColor = colors[randomColor()] as (str: string) => string;
    let prefix = `${packageName}:`;
    prefix += taskName ? `${taskName}:` : "";
    this.prefix = consoleColor(prefix);
  }

  log(message: string | Uint8Array) {
    this.console(console.log, message);
  }

  error(message: string | Uint8Array) {
    this.console(console.error, message);
  }

  private console(
    consoleFunc: (...args: unknown[]) => void,
    message: string | Uint8Array,
  ) {
    const decoded = typeof message === "string"
      ? message
      : this.decoder.decode(message, { stream: true });

    for (const line of decoded.split("\n")) {
      if (!line) {
        continue;
      }

      consoleFunc(`${this.prefix} ${line}`);
    }
  }
}
