import { defineStore } from "pinia";

export const useTask = defineStore("tasks", {
  state: () => ({
    tasks: [],
  }),

  actions: {
    addTask(task) {
      this.tasks.push(task);
    },
  },
});
