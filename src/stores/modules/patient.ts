// stores/patientStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";

export const usePatientStore = defineStore("patientStore", {
  state: () => ({
    patients: ref(JSON.parse(localStorage.getItem("patients") || "[]"))
  }),
  actions: {
    addPatient(patient) {
      this.patients.push(patient); // 使用 push 确保 Vue 响应式
      this.saveToLocalStorage();
    },
    deletePatient(index) {
      this.patients.splice(index, 1); // 使用 splice 触发响应式
      this.saveToLocalStorage();
    },
    editPatient(index, updatedPatient) {
      this.patients[index] = updatedPatient; // 直接替换病患数据
      this.saveToLocalStorage();
    },
    saveToLocalStorage() {
      localStorage.setItem("patients", JSON.stringify(this.patients));
    }
  }
});
