document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
  
    
    chrome.storage.local.get(['tasks'], (result) => {
      const tasks = result.tasks || [];
      tasks.forEach(task => addTaskToList(task));
    });
  
    // Add data
    addTaskButton.addEventListener('click', () => {
      const taskText = taskInput.value.trim();
      if (taskText) {
        const task = { id: Date.now(), text: taskText };
        addTaskToList(task);
        saveTask(task);
        taskInput.value = '';
      }
    });
  
    // Add data list
    function addTaskToList(task) {
      const listItem = document.createElement('li');
      listItem.setAttribute('data-id', task.id);
      listItem.innerHTML = `
        <span>${task.text}</span>
        <button class="edit">Edit</button>
        <button class="delete">Delete</button>
      `;
  
      // Edit data
      listItem.querySelector('.edit').addEventListener('click', () => {
        const newText = prompt('Edit data:', task.text);
        if (newText !== null) {
          task.text = newText.trim();
          listItem.querySelector('span').textContent = task.text;
          updateTask(task);
        }
      });
  
      // Delete data
      listItem.querySelector('.delete').addEventListener('click', () => {
        if (confirm('Are you sure you want to delete this dats?')) {
          listItem.remove();
          deleteTask(task.id);
        }
      });
  
      taskList.appendChild(listItem);
    }
  
    // data save
    function saveTask(task) {
      chrome.storage.local.get(['tasks'], (result) => {
        const tasks = result.tasks || [];
        tasks.push(task);
        chrome.storage.local.set({ tasks });
      });
    }
  
    // Update data in storage
    function updateTask(updatedTask) {
      chrome.storage.local.get(['tasks'], (result) => {
        let tasks = result.tasks || [];
        tasks = tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
        chrome.storage.local.set({ tasks });
      });
    }
  
    // Delete data from storage
    function deleteTask(taskId) {
      chrome.storage.local.get(['tasks'], (result) => {
        let tasks = result.tasks || [];
        tasks = tasks.filter(task => task.id !== taskId);
        chrome.storage.local.set({ tasks });
      });
    }
  });
  