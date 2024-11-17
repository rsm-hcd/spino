import { mergeReadableStreams } from "@std/streams/merge-readable-streams";
import { findAllWorkspaceTasks } from "../workspace.ts";
import { PrefixLogger } from "../prefix-logger.ts";

export async function runTasksCommand(rootCwd: string, tasks: string[]) {
  const allWorkspaceTasks = await findAllWorkspaceTasks({ cwd: rootCwd });

  const allRunningTasks = tasks.flatMap((taskName) => {
    const foundTasks = allWorkspaceTasks.filter((p) => p.task === taskName);
    if (foundTasks.length === 0) {
      console.log(`Task "${taskName}" not found.`);
      return;
    }

    // Run all tasks in parallel
    const runningTasks = foundTasks.map(
      async ({ package: taskPackageName, task, cwd }) => {
        const logger = new PrefixLogger(taskPackageName, task);
        const command = new Deno.Command(Deno.execPath(), {
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
