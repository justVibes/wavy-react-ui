import { For } from "@chakra-ui/react";
import { sort } from "@wavy/fn";
import { useEffect, useState } from "react";
import Terminal from "../../high-level/terminal/Terminal";
import BasicDiv from "../../low-level/html/div/BasicDiv";
import { ItemInfo } from "../../low-level/item-info/ItemInfo";
import { TaskLog, UnsubscribeFunction } from "@wavy/util";

interface TaskLoggerProps {
  defaultTasks?: TaskLog[];
  relatedTaskData: { title: string; description: string; content: object }[];
  onSnapshot: (
    onChange: (
      ...args: [logs: TaskLog[]] | [{ logs: TaskLog[] }] | [log: TaskLog]
    ) => void
  ) => UnsubscribeFunction;
}
function TaskLogger(props: TaskLoggerProps) {
  const [tasks, setTasks] = useState<TaskLog[]>(props.defaultTasks || []);

  useEffect(() => {
    return props.onSnapshot((change) => {
      const logs = Array.isArray(change)
        ? change
        : "logs" in change
        ? change.logs
        : null;

      // console.log({change, tasks});

      if (logs) setTasks(sort(logs, "timestamp", "asc"));
      else setTasks([...tasks, change as TaskLog]);
    });
  }, []);

  return (
    <BasicDiv
      size='full'
      grid
      gridRows='1fr .85fr'
      spill={"hidden"}
      maxHeight={"full"}>
      <BasicDiv
        size='full'
        spill={{ x: "hidden", y: "auto" }}
        gap={"lg"}
        style={{ flexShrink: 0 }}
        maxHeight={"full"}>
        <For each={props.relatedTaskData}>
          {({ content, ...item }) => {
            return <ItemInfo item={item} info={content} />;
          }}
        </For>
      </BasicDiv>
      <Terminal
        initialMessage='Awaiting registration process...'
        logs={tasks}
      />
    </BasicDiv>
  );
}

export default TaskLogger;
