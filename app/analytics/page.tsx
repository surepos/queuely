"use client";
import { TaskType, Status } from "@/lib/types";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function AnalyticsDashboard() {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get<TaskType[]>("https://backend-xe17.onrender.com/api/tasks/");
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Calculate completion rate
  const completionRate = tasks.length
    ? Math.round(
        (tasks.filter((task) => task.status === Status.Completed).length /
          tasks.length) *
          100
      )
    : 0;

  // Tasks by status
  const tasksByStatus = Object.values(Status).map((status) => ({
    name: status,
    value: tasks.filter((task) => task.status === status).length,
  }));

  // Tasks by priority
  const tasksByPriority = [
    { name: "High", value: tasks.filter((task) => task.priority === "High").length },
    { name: "Medium", value: tasks.filter((task) => task.priority === "Medium").length },
    { name: "Low", value: tasks.filter((task) => task.priority === "Low").length },
  ];

  // Completion time analysis (example)
  const completedTasks = tasks.filter((task) => task.status === Status.Completed);
  const avgCompletionTime = completedTasks.length
    ? completedTasks.reduce((acc, task) => {
        const start = new Date(task.startDate).getTime();
        const end = new Date(task.dueDate).getTime();
        return acc + (end - start) / (1000 * 60 * 60 * 24); // days
      }, 0) / completedTasks.length
    : 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="px-4">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-neutral-800 p-6 rounded-lg shadow border border-neutral-700">
          <h3 className="text-gray-400">Total Tasks</h3>
          <p className="text-2xl font-bold text-white">{tasks.length}</p>
        </div>
        <div className="bg-neutral-800 p-6 rounded-lg shadow border border-neutral-700">
          <h3 className="text-gray-400">Completion Rate</h3>
          <p className="text-2xl font-bold text-white">{completionRate}%</p>
        </div>
        <div className="bg-neutral-800 p-6 rounded-lg shadow border border-neutral-700">
          <h3 className="text-gray-400">Avg Completion Time</h3>
          <p className="text-2xl font-bold text-white">
            {avgCompletionTime.toFixed(1)} days
          </p>
        </div>
        <div className="bg-neutral-800 p-6 rounded-lg shadow border border-neutral-700">
          <h3 className="text-gray-400">Overdue Tasks</h3>
          <p className="text-2xl font-bold text-white">
            {tasks.filter((task) => task.status === Status.Expired).length}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Tasks by Status */}
        <div className="bg-neutral-800 p-6 rounded-lg shadow border border-neutral-700">
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tasksByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  stroke="#262626"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {tasksByStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tasks by Priority */}
        <div className="bg-neutral-800 p-6 rounded-lg shadow border border-neutral-700">
        
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={tasksByPriority}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                <XAxis dataKey="name" stroke="#e5e7eb" />
                <YAxis stroke="#e5e7eb" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", borderColor: "#374151" }}
                />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Tasks" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Completed Tasks */}
      <div className="bg-neutral-800 border border-neutral-700 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-white mb-4">
          Recently Completed Tasks
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Completed On
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Days Taken
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {completedTasks
                .slice(0, 5)
                .sort(
                  (a, b) =>
                    new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
                )
                .map((task) => (
                  <tr key={task._id} className="hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {task.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {Math.round(
                        (new Date(task.dueDate).getTime() -
                          new Date(task.startDate).getTime()) /
                          (1000 * 60 * 60 * 24)
                      )}{" "}
                      days
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}