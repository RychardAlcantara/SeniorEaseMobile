import Task from "../../domain/entities/Task";

export function getNextTask(
  tasks: Task[],
): { task: Task; date: Date; time: number } | null {
  const now = Date.now();

  const candidates = tasks
    .filter((t) => !t.completed && !!t.expectedToBeDone)
    .map((t) => {
      const d = new Date(t.expectedToBeDone as string);
      const time = d.getTime();
      return Number.isNaN(time) ? null : { task: t, date: d, time };
    })
    .filter((x): x is { task: Task; date: Date; time: number } => x !== null)
    .filter(({ time }) => time >= now);

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => a.time - b.time);
  return candidates[0];
}
