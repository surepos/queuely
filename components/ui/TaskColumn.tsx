import { TaskColumnProps } from "@/lib/types";
import { useDrop } from "react-dnd";
import TaskCard from "./TaskCard";

const TaskColumn = ({ status, tasks, moveTask, colors, handleDelete, onPress}: TaskColumnProps) => {
  const [, drop] = useDrop({
    accept: 'task',
    drop: (item: { id: number }) => {
      moveTask(item.id, status);
    },
  });

  return (
    <div
      ref={(node) => {
        if (node) drop(node);
      }}
      className="min-h-[200px] rounded-lg p-4 ">
      <div className="bg-neutral-800 rounded-lg flex items-center h-12 gap-3">
        <div
          className={`h-full w-4 rounded-tl-lg rounded-bl-xl`}
          style={{ backgroundColor: colors }}
        />
        <h3 className="text-[12px] font-bold text-white">{status}</h3>
      </div>

      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} handleDelete={handleDelete} onPress={onPress}/>
      ))}
    </div>
  );
};

export default TaskColumn;