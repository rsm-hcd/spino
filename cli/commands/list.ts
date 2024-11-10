import { findAllWorkspaceTasks } from "../workspace.ts";
import { PrefixLogger } from "../prefix-logger.ts";
import type { Task } from "../types.ts";

export async function listCommand(rootCwd: string) {
    // TODO: Include root tasks
    const allWorkspaceTasks = await findAllWorkspaceTasks({ cwd: rootCwd });

    if (allWorkspaceTasks.length === 0) {
        console.log(`No tasks found`);
        Deno.exit(1);
    }

    // Group package tasks by workspace
    const groupedTasks = allWorkspaceTasks.reduce((acc, task) => {
        if (!acc[task.package]) {
            acc[task.package] = [];
        }
        acc[task.package].push(task);
        return acc;
    }, {} as Record<string, Task[]>);

    // Calculate the max length of all task names
    const taskNames: string[] = [];
    Object.entries(groupedTasks).forEach(([_, workspaceTasks]) => {
        workspaceTasks.forEach((task) => {
            taskNames.push(task.task);
        });
    });
    const maxTaskNameLength = Math.max(...taskNames.map((name) => name.length));

    // Log each task with left-aligned script
    Object.entries(groupedTasks).map(([workspace, workspaceTasks]) => {
        console.log(`${workspace}:`);
        workspaceTasks.forEach((workspaceTask) => {
            const { task, script } = workspaceTask;
            const taskLogger = new PrefixLogger(task.padStart(task.length + 4));
            taskLogger.log(
                script.padStart(
                    maxTaskNameLength - task.length + script.length + 4,
                ),
            );
        });
    });
}
