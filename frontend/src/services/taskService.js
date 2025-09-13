// Get all tasks
export async function getTasks() {
  return [
  ];
}

// Create new task
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
