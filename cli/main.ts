import * as colors from "@std/fmt/colors";
import { mergeReadableStreams } from "@std/streams/merge-readable-streams";
import { findAllTasks } from "./workspace.ts";
import { randomColor } from "./colors.ts";

const rootCwd = Deno.cwd();
const decoder = new TextDecoder("utf-8");

Deno.args.forEach((arg) => {
  const foundTasks = findAllTasks({ cwd: rootCwd }).filter(({ task }) =>
    task === arg
  );

  if (foundTasks.length === 0) {
    console.log(`Task "${arg}" not found.`);
    Deno.exit(1);
  }

  // Run all tasks in parallel
  foundTasks.forEach(
    async ({ package: taskPackageName, task, cwd }) => {
      const command = new Deno.Command("deno", {
        cwd,
        args: ["run", task],
        stdout: "piped",
        stderr: "piped",
      });

      const { status, stdout, stderr } = command.spawn();

      const consoleColor = colors[randomColor()] as (str: string) => string;
      const prefix = consoleColor(
        `${taskPackageName}:`,
      );

      await mergeReadableStreams(stdout, stderr)
        .pipeTo(
          new WritableStream<Uint8Array>(
            {
              write(chunk) {
                return new Promise((resolve) => {
                  const decoded = typeof chunk === "string"
                    ? chunk
                    : decoder.decode(chunk, { stream: true });

                  for (const line of decoded.split("\n")) {
                    if (!line) {
                      continue;
                    }

                    console.log(`${prefix} ${line}`);
                  }

                  resolve();
                });
              },
              abort(err) {
                for (const line of `${err}`.split("\n")) {
                  if (!line) {
                    continue;
                  }

                  console.error(`${prefix} ${line}`);
                }
              },
            },
          ),
        );

      const { success } = await status;

      if (!success) {
        console.error(`${prefix} Failed to run task "${task}".`);
        Deno.exit(1);
      }
    },
  );
});
