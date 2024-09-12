// stores/reminderStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";

export const useReminderStore = defineStore("reminderStore", () => {
  const reminders = ref();

  // 添加提醒
  const addReminder = reminder => {
    reminders.value.push(reminder);
  };

  // 获取提醒列表
  const getReminders = () => reminders.value;

  return {
    reminders,
    addReminder,
    getReminders
  };
});
