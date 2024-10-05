import { mergeReadableStreams } from "@std/streams/merge-readable-streams";
import { findAllTasks } from "../workspace.ts";
import { PrefixLogger } from "../prefix-logger.ts";

export async function runTasksCommand(rootCwd: string, tasks: string[]) {
  const allTasks = await findAllTasks({ cwd: rootCwd });

  const allRunningTasks = tasks.flatMap((taskName) => {
    const foundTasks = allTasks.filter((p) => p.task === taskName);
    if (foundTasks.length === 0) {
      console.log(`Task "${taskName}" not found.`);
      Deno.exit(1);
    }

    // Run all tasks in parallel
    const runningTasks = foundTasks.map(
      async ({ package: taskPackageName, task, cwd }) => {
        const logger = new PrefixLogger(taskPackageName);
        const command = new Deno.Command("deno", {
          cwd,
          args: ["task", task],
          stdout: "piped",
          stderr: "piped",
        });

        const { status, stdout, stderr } = command.spawn();

        await mergeReadableStreams(stdout, stderr)
          .pipeTo(
            new WritableStream<Uint8Array>(
              {
                write(chunk) {
                  return new Promise((resolve) => {
                    logger.log(chunk);
                    resolve();
                  });
                },
                abort(err) {
                  logger.error(`${err}`);
                },
              },
            ),
          );

        const { success } = await status;

        if (!success) {
          logger.error(`Failed to run task "${task}".`);
          Deno.exit(1);
        }
      },
    );

    return runningTasks;
  });

  // Wait for all tasks to finish
  await Promise.all(allRunningTasks);
}
