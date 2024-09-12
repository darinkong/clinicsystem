<template>
  <div class="bg-#fff p-20px rounded-4 min-h-80vh">
    <!-- 预约表单 -->
    <el-form :model="appointmentForm" label-width="80px" class="appointment-form">
      <el-form-item label="病患姓名">
        <el-input v-model="appointmentForm.name" />
      </el-form-item>
      <el-form-item label="预约时间">
        <el-date-picker v-model="appointmentForm.appointmentTime" type="datetime" placeholder="选择预约时间" />
      </el-form-item>
      <el-form-item label="提醒时间">
        <el-date-picker v-model="appointmentForm.reminder" type="datetime" placeholder="选择提醒时间" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addAppointment">添加预约</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 预约列表 -->
    <el-table :data="paginatedAppointments" style="width: 100%" border>
      <el-table-column prop="name" label="病患姓名" width="150" />
      <el-table-column prop="appointmentTime" label="预约时间" />
      <el-table-column prop="reminder" label="提醒时间" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="small" type="danger" @click="deleteAppointment(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页组件 -->
    <div class="flex justify-end">
      <el-pagination
        v-model:current-page="currentPage"
        background
        :page-size="pageSize"
        :total="appointments.length"
        layout="prev, pager, next"
        @current-change="handlePageChange"
        class="pagination"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import { ElNotification, ElMessageBox } from "element-plus";

// 表单数据
const appointmentForm = reactive({
  name: "",
  appointmentTime: "",
  reminder: ""
});

// 预约列表
const appointments = ref([]);

// 每页显示数量
const pageSize = 5;
const currentPage = ref(1);

// 计算当前页显示的数据
const paginatedAppointments = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return appointments.value.slice(start, end);
});

// 处理分页的变化
const handlePageChange = page => {
  currentPage.value = page;
};

// 加载存储在 localStorage 中的数据
onMounted(() => {
  const storedAppointments = localStorage.getItem("appointments");
  if (storedAppointments) {
    appointments.value = JSON.parse(storedAppointments);
  }
});

// 保存数据到 localStorage
const saveToLocalStorage = () => {
  localStorage.setItem("appointments", JSON.stringify(appointments.value));
};

// 添加预约
const addAppointment = () => {
  if (appointmentForm.name && appointmentForm.appointmentTime && appointmentForm.reminder) {
    appointments.value.push({ ...appointmentForm });
    saveToLocalStorage();
    resetForm();

    ElNotification({
      title: "成功",
      message: "预约已成功添加！",
      type: "success",
      duration: 3000
    });
  } else {
    ElNotification({
      title: "错误",
      message: "请完整填写表单",
      type: "error"
    });
  }
};

// 删除预约
const deleteAppointment = index => {
  ElMessageBox.confirm("确定要删除这条预约吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(() => {
      appointments.value.splice(index, 1);
      saveToLocalStorage();

      ElNotification({
        title: "成功",
        message: "预约已成功删除！",
        type: "success",
        duration: 3000
      });
    })
    .catch(() => {
      ElNotification({
        title: "取消",
        message: "已取消删除操作",
        type: "info",
        duration: 2000
      });
    });
};

// 重置表单
const resetForm = () => {
  appointmentForm.name = "";
  appointmentForm.appointmentTime = "";
  appointmentForm.reminder = "";
};

// 定期检查提醒时间并触发提醒
const checkReminders = () => {
  const now = new Date();
  appointments.value.forEach(appointment => {
    const reminderTime = new Date(appointment.reminder);
    if (reminderTime.getTime() - now.getTime() <= 0 && reminderTime.getTime() - now.getTime() >= -60000) {
      // 浏览器通知
      if (Notification.permission === "granted") {
        new Notification("预约提醒", {
          body: `病患 ${appointment.name} 的预约时间到了！`
        });
      }

      // 页面内提醒
      ElNotification({
        title: "预约提醒",
        message: `病患 ${appointment.name} 的预约时间到了！`,
        type: "warning",
        duration: 5000
      });

      // 将已经提醒过的预约从列表中移除，避免重复提醒
      appointments.value = appointments.value.filter(a => a !== appointment);
      saveToLocalStorage();
    }
  });
};

// 请求通知权限
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

// 每60秒检查一次提醒
setInterval(checkReminders, 60000);
</script>

<style scoped>
.appointment-form {
  margin-top: 20px;
  width: 400px;
}

.pagination {
  margin-top: 20px;
  text-align: right;
}
</style>
