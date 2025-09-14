/**
 * Get all available tasks.
 * Note: Currently the response is simulated, there is no connection to the backend.
 * @async
 * @function getTasks
 * @returns {Promise<Object[]>}  A promise that resolves to an array of task objects.
 */
export async function getTasks() {
  return [
  ];
}

/**
* Create a new task.
*
* Note: Simulates the creation of a task with a 1-second delay
* and returns an object with a generated `id` and input data.
*
* @async
* @function createTask
* @param {Object} taskData: Data for the task to be created.
* @param {string} taskData.title: Title of the task.
* @param {string} [taskData.detail]: Detail or observation of the task.
* @param {string} [taskData.date]: Date associated with the task.
* @param {string} [taskData.time]: Time associated with the task.
* @param {string} [taskData.status]: Status of the task ("To Do", "In Progress", "Done").
* @returns {Promise<Object>}: A promise that resolves to the created task object. * @throws {Error} If an unexpected error occurs in the simulation.
*/
export async function createTask(taskData) {
  try {
    // Simulation (no backend)
    const fakeResponse = {
      id: Date.now(), 
      ...taskData,
    };

    // We simulate a small delay (1s) to show spinner
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return fakeResponse;

  } catch (err) {
    console.error("Error en createTask:", err);
    throw err;
  }
}
