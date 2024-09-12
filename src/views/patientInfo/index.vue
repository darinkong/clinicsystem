<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getTableList"
      :init-param="initParam"
      :data-callback="dataCallback"
      @drag-sort="sortTable"
    >
      <!-- 表格 header 按钮 -->
      <template #tableHeader="scope">
        <!-- 新增病患按钮 -->
        <el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')">新增病患</el-button>

        <!-- 批量删除病患按钮 -->
        <el-button type="danger" :icon="Delete" plain :disabled="!scope.isSelected" @click="batchDelete(scope.selectedListIds)">
          批量删除病患
        </el-button>
      </template>

      <!-- Expand -->
      <template #expand="scope">
        {{ scope.row }}
      </template>

      <!-- 表格操作 -->
      <template #operation="scope">
        <div class="flex flex-row justify-center w-full">
          <el-button size="small" type="primary" @click="openHealthDataDialog(scope.row)">录入健康数据</el-button>
          <el-button size="small" type="success" @click="openDrawer('查看', scope.row)">查看</el-button>
          <el-button size="small" type="warning" @click="openDrawer('编辑', scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteAccount(scope.row)">删除</el-button>
        </div>
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
    <el-dialog v-model="healthDataDialogVisible" title="录入健康数据" width="30%">
      <el-form :model="healthDataForm" label-width="100px">
        <el-form-item label="数据类型">
          <el-select v-model="healthDataForm.type" placeholder="请选择录入类型">
            <el-option label="心率" value="heartRate"></el-option>
            <el-option label="血压" value="bloodPressure"></el-option>
            <el-option label="体温" value="temperature"></el-option>
          </el-select>
        </el-form-item>

        <!-- 心率输入框 -->
        <el-form-item v-if="healthDataForm.type === 'heartRate'" label="心率">
          <el-input v-model="healthDataForm.heartRate" placeholder="请输入心率 (bpm)" />
        </el-form-item>

        <!-- 血压输入框 -->
        <el-form-item v-if="healthDataForm.type === 'bloodPressure'" label="收缩压">
          <el-input v-model="healthDataForm.systolic" placeholder="请输入收缩压 (mmHg)" />
        </el-form-item>
        <el-form-item v-if="healthDataForm.type === 'bloodPressure'" label="舒张压">
          <el-input v-model="healthDataForm.diastolic" placeholder="请输入舒张压 (mmHg)" />
        </el-form-item>

        <!-- 体温输入框 -->
        <el-form-item v-if="healthDataForm.type === 'temperature'" label="体温">
          <el-input v-model="healthDataForm.temperature" placeholder="请输入体温 (°C)" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="healthDataDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitHealthData">提交</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="tsx" name="useProTable">
import { ref, reactive } from "vue";
import { User } from "@/api/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { ElMessage } from "element-plus";
import ProTable from "@/components/ProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import UserDrawer from "@/views/proTable/components/UserDrawer.vue";
import { ProTableInstance, ColumnProps } from "@/components/ProTable/interface";
import { CirclePlus, Delete } from "@element-plus/icons-vue";
import { getUserList, deleteUser, editUser, addUser, getUserGender } from "@/api/modules/user";

// 跳转详情页
import { useRouter } from "vue-router";

const router = useRouter();

// ProTable 实例
const proTable = ref<ProTableInstance>();

const initParam = reactive({ type: 1 });

const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total
  };
};

const getTableList = (params: any) => {
  let newParams = JSON.parse(JSON.stringify(params));
  newParams.createTime && (newParams.startTime = newParams.createTime[0]);
  newParams.createTime && (newParams.endTime = newParams.createTime[1]);
  delete newParams.createTime;
  return getUserList(newParams);
};

// 表格配置项
const columns = reactive<ColumnProps<User.ResUserList>[]>([
  { type: "selection", fixed: "left", width: 70 },
  {
    prop: "username",
    label: "病患姓名",
    search: { el: "input", tooltip: "我是搜索提示" },
    render: scope => {
      return (
        <el-button
          type="primary"
          link
          onClick={() => {
            router.push({
              path: `/healthData`,
              query: { username: scope.row.username }
            });
          }}
        >
          {scope.row.username}
        </el-button>
      );
    }
  },
  {
    prop: "gender",
    label: "性别",

    // 字典请求不带参数
    enum: getUserGender,
    // 字典请求携带参数
    // enum: () => getUserGender({ id: 1 }),
    search: { el: "select", props: { filterable: true } },
    fieldNames: { label: "genderLabel", value: "genderValue" }
  },
  {
    // 多级 prop
    prop: "user.detail.age",
    label: "年龄",
    search: {
      // 自定义 search 显示内容
      render: ({ searchParam }) => {
        return (
          <div class="flx-center">
            <el-input vModel_trim={searchParam.minAge} placeholder="最小年龄" />
            <span class="mr10 ml10">-</span>
            <el-input vModel_trim={searchParam.maxAge} placeholder="最大年龄" />
          </div>
        );
      }
    }
  },
  { prop: "idCard", label: "身份证号", search: { el: "input" } },
  { prop: "email", label: "邮箱" },
  { prop: "address", label: "居住地址" },

  { prop: "operation", label: "操作", fixed: "right", width: 330 }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
};

// 删除用户信息
const deleteAccount = async (params: User.ResUserList) => {
  await useHandleData(deleteUser, { id: [params.id] }, `删除【${params.username}】用户`);
  proTable.value?.getTableList();
};

// 批量删除用户信息
const batchDelete = async (id: string[]) => {
  await useHandleData(deleteUser, { id }, "删除所选用户信息");
  proTable.value?.clearSelection();
  proTable.value?.getTableList();
};

// 批量添加用户
const dialogRef = ref<InstanceType<typeof ImportExcel> | null>(null);

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref<InstanceType<typeof UserDrawer> | null>(null);
const openDrawer = (title: string, row: Partial<User.ResUserList> = {}) => {
  const params = {
    title,
    isView: title === "查看",
    row: { ...row },
    api: title === "新增" ? addUser : title === "编辑" ? editUser : undefined,
    getTableList: proTable.value?.getTableList
  };
  drawerRef.value?.acceptParams(params);
};

// 控制健康数据弹窗显示
const healthDataDialogVisible = ref(false);
const healthDataForm = reactive({
  type: "", // 健康数据类型
  heartRate: "",
  systolic: "",
  diastolic: "",
  temperature: ""
});
let selectedPatient = ref({}); // 用于存储当前选择的病患

// 打开健康数据录入弹窗
const openHealthDataDialog = patient => {
  selectedPatient.value = patient; // 记录当前病患
  healthDataDialogVisible.value = true;
};

// 提交健康数据
const submitHealthData = () => {
  console.log("录入的健康数据:", healthDataForm);
  // 保存数据到相应病患的信息中
  healthDataDialogVisible.value = false;
  resetHealthDataForm();
};

// 重置表单
const resetHealthDataForm = () => {
  healthDataForm.type = "";
  healthDataForm.heartRate = "";
  healthDataForm.systolic = "";
  healthDataForm.diastolic = "";
  healthDataForm.temperature = "";
};
</script>
