<template>
  <div class="chart-container bg-#fff p-20px rounded-4">
    <h2>{{ patientName }}的健康数据</h2>
    <!-- 时间选择 -->
    <el-radio-group v-model="selectedRange" @change="updateData" class="time-selection">
      <el-radio-button label="day">本日</el-radio-button>
      <el-radio-button label="month">本月</el-radio-button>
      <el-radio-button label="year">本年</el-radio-button>
    </el-radio-group>

    <!-- 心率图表 -->
    <div id="heartRateChart" class="chart"></div>

    <!-- 血压图表 -->
    <div id="bloodPressureChart" class="chart"></div>

    <!-- 体温图表 -->
    <div id="temperatureChart" class="chart"></div>
  </div>
</template>

<script setup>
import * as echarts from "echarts";
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
// const patient = route.params;
console.log("🚀 ~ route.params:", route.params);

const patientName = route.query.name || "未知病患";
console.log("🚀 ~ patientName :", patientName.value);

const selectedRange = ref("month"); // 默认显示本月数据

// 模拟数据：根据不同时间范围调整数据
const getHeartRateData = range => {
  if (range === "day") return [75, 80, 78, 76, 74];
  if (range === "month") return [72, 75, 78, 80, 74];
  if (range === "year") return [70, 73, 75, 77, 80];
};

const getBloodPressureData = range => {
  if (range === "day") return { systolic: [120, 118, 119, 121, 117], diastolic: [80, 78, 79, 81, 76] };
  if (range === "month") return { systolic: [130, 128, 129, 131, 127], diastolic: [85, 83, 84, 86, 82] };
  if (range === "year") return { systolic: [140, 138, 139, 141, 137], diastolic: [90, 88, 89, 91, 87] };
};

const getTemperatureData = range => {
  if (range === "day") return [36.5, 36.7, 36.6, 36.8, 36.5];
  if (range === "month") return [36.6, 36.8, 36.7, 36.9, 36.6];
  if (range === "year") return [36.7, 36.9, 36.8, 37.0, 36.7];
};

let heartRateChart, bloodPressureChart, temperatureChart; // 全局图表实例

// 更新图表数据
const updateCharts = (heartRateData, bloodPressureData, temperatureData) => {
  heartRateChart.setOption({ series: [{ data: heartRateData }] });
  bloodPressureChart.setOption({
    series: [{ data: bloodPressureData.systolic }, { data: bloodPressureData.diastolic }]
  });
  temperatureChart.setOption({ series: [{ data: temperatureData }] });
};

// 根据选择的时间范围更新数据
const updateData = () => {
  const heartRateData = getHeartRateData(selectedRange.value);
  const bloodPressureData = getBloodPressureData(selectedRange.value);
  const temperatureData = getTemperatureData(selectedRange.value);

  updateCharts(heartRateData, bloodPressureData, temperatureData);
};

onMounted(() => {
  // 初始化心率图表
  heartRateChart = echarts.init(document.getElementById("heartRateChart"));
  heartRateChart.setOption({
    title: { text: "心率图表", left: "center" },
    tooltip: { trigger: "axis" },
    legend: { data: ["心率"], bottom: "10px" },
    xAxis: { type: "category", data: ["1月", "2月", "3月", "4月", "5月"] },
    yAxis: { type: "value" },
    series: [{ name: "心率", type: "line", data: getHeartRateData(selectedRange.value), itemStyle: { color: "#ff6600" } }]
  });

  // 初始化血压图表
  bloodPressureChart = echarts.init(document.getElementById("bloodPressureChart"));
  bloodPressureChart.setOption({
    title: { text: "血压图表", left: "center" },
    tooltip: { trigger: "axis" },
    legend: { data: ["收缩压", "舒张压"], bottom: "10px" },
    xAxis: { type: "category", data: ["1月", "2月", "3月", "4月", "5月"] },
    yAxis: { type: "value" },
    series: [
      { name: "收缩压", type: "line", data: getBloodPressureData(selectedRange.value).systolic, itemStyle: { color: "#ff3333" } },
      { name: "舒张压", type: "line", data: getBloodPressureData(selectedRange.value).diastolic, itemStyle: { color: "#3399ff" } }
    ]
  });

  // 初始化体温图表
  temperatureChart = echarts.init(document.getElementById("temperatureChart"));
  temperatureChart.setOption({
    title: { text: "体温图表", left: "center" },
    tooltip: { trigger: "axis" },
    legend: { data: ["体温"], bottom: "10px" },
    xAxis: { type: "category", data: ["1月", "2月", "3月", "4月", "5月"] },
    yAxis: { type: "value" },
    series: [{ name: "体温", type: "line", data: getTemperatureData(selectedRange.value), itemStyle: { color: "#ffcc33" } }]
  });

  // 初次渲染时更新图表数据
  updateData();
});
</script>

<style scoped>
.chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

.chart {
  width: 600px;
  height: 400px;
  margin: 20px 0;
}

.time-selection {
  margin-bottom: 20px;
}
</style>
