"use client"
import { Status, TaskType} from "@/lib/types";
import axios from "axios";
import { useEffect, useState } from "react";

const statusColors = {
  [Status.ToDo]: "bg-[#0088FE] text-blue-100",
  [Status.WorkInProgress]: "bg-[#FFBB28] text-yellow-100",
  [Status.Expired]: "bg-[#F7374F] text-red-100",
  [Status.Completed]: "bg-[#00C49F] text-green-100",
};

const priorityColors = {
  "Low": "bg-[#00C49F] text-gray-300",
  "Medium": "bg-[#0088FE] text-blue-100",
  "High": "bg-[#F7374F] text-red-100",
};

export default function TaskTable() {
  const [tasks, setTasks] = useState<TaskType[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get<TaskType[]>('https://backend-xe17.onrender.com/api/tasks/');
        setTasks(response.data.map(task => ({
          ...task,
          status: task.status || Status.ToDo // Default to "To Do" if undefined
        })));
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Type guard for status
  const isValidStatus = (status: string | undefined): status is Status => {
    return Object.values(Status).includes(status as Status);
  };

  // Type guard for priority
  const isValidPriority = (priority: string): priority is keyof typeof priorityColors => {
    return priority in priorityColors;
  };

  return (
    <div className="px-4">
      <div className="overflow-x-auto rounded-lg border border-neutral-700 shadow-sm">
        <table className="min-w-full divide-y divide-neutral-700">
          <thead className="bg-neutral-900">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Description
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Priority
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Start Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Due Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-neutral-800 divide-y divide-neutral-700">
            {tasks.map((task) => {
              const status = isValidStatus(task.status) ? task.status : Status.ToDo;
              const priority = isValidPriority(task.priority) ? task.priority : "Medium";
              
              return (
                <tr key={task._id} className="hover:bg-neutral-700 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{task.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-normal max-w-xs">
                    <div className="text-sm text-[#ccc] line-clamp-2">{task.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[status]}`}>
                      {status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityColors[priority]}`}>
                      {priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#ccc]">
                    {formatDate(task.startDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#ccc]">
                    {formatDate(task.dueDate)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-[#ccc]">
          Showing <span className="font-medium">1</span> to <span className="font-medium">{tasks.length}</span> of{' '}
          <span className="font-medium">{tasks.length}</span> results
        </div>
      </div>
    </div>
  );
}