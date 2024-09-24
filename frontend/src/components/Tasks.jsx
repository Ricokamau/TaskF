import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import Loader from './utils/Loader';
import Tooltip from './utils/Tooltip';

const Tasks = () => {

  const authState = useSelector(state => state.authReducer);
  const [tasks, setTasks] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Add state for search term
  const [filteredTasks, setFilteredTasks] = useState([]); // State to store filtered tasks
  const [fetchData, { loading }] = useFetch();

  // Fetch tasks from the API
  const fetchTasks = useCallback(() => {
    const config = { url: "/tasks", method: "get", headers: { Authorization: authState.token } };
    fetchData(config, { showSuccessToast: false }).then(data => {
      setTasks(data.tasks);
      setFilteredTasks(data.tasks); // Initialize filtered tasks
    });
  }, [authState.token, fetchData]);

  useEffect(() => {
    if (!authState.isLoggedIn) return;
    fetchTasks();
  }, [authState.isLoggedIn, fetchTasks]);

  // Handle task deletion
  const handleDelete = (id) => {
    const config = { url: `/tasks/${id}`, method: "delete", headers: { Authorization: authState.token } };
    fetchData(config).then(() => fetchTasks());
  }

  // Handle search functionality
  const handleSearch = () => {
    const searchResults = tasks.filter(task => 
      (task.description || "").toLowerCase().includes(searchTerm.toLowerCase()) // Case-insensitive search, with default description check
    );
    setFilteredTasks(searchResults);
  }

  return (
    <>
      <div className="my-2 mx-auto max-w-[700px] py-4">

        {/* Search Input */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update searchTerm state on input change
            className="border border-gray-300 p-2 rounded-md w-3/4"
          />
          <button
            onClick={handleSearch} // Trigger the search function when clicked
            className="bg-purple-500 text-white hover:bg-purple-600 font-medium rounded-md px-4 py-2 ml-2"
          >
            Search
          </button>
        </div>

        {/* Display filtered tasks */}
        {filteredTasks.length !== 0 && (
          <h2 className='my-2 ml-2 md:ml-0 text-xl'>Your tasks ({filteredTasks.length})</h2>
        )}
        {loading ? (
          <Loader />
        ) : (
          <div>
            {filteredTasks.length === 0 ? (
              <div className='w-[600px] h-[300px] flex items-center justify-center gap-4'>
                <span>No tasks found</span>
                <Link to="/tasks/add" className="bg-purple-500 text-white hover:bg-purple-600 font-medium rounded-md px-4 py-2">
                  + Add new task
                </Link>
              </div>
            ) : (
              filteredTasks.map((task, index) => (
                <div key={task._id} className='bg-purple-200 my-4 p-4 text-gray-600 rounded-md shadow-md'>
                  <div className='flex'>
                    <span className='font-medium'>Task #{index + 1}</span>
                    <Tooltip text={"Edit this task"} position={"top"}>
                      <Link to={`/tasks/${task._id}`} className='ml-auto mr-2 text-purple-500 cursor-pointer'>
                        <i className="fa-solid fa-pen"></i>
                      </Link>
                    </Tooltip>
                    <Tooltip text={"Delete this task"} position={"top"}>
                      <span className='text-red-300 cursor-pointer' onClick={() => handleDelete(task._id)}>
                        <i className="fa-solid fa-trash"></i>
                      </span>
                    </Tooltip>
                  </div>
                  <div className='whitespace-pre'>{task.description}</div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Tasks;
