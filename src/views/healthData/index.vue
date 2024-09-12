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
          <!-- <el-button size="small" type="success" @click="openDrawer('查看', scope.row)">查看</el-button> -->
          <!-- <el-button size="small" type="warning" @click="openDrawer('编辑', scope.row)">编辑</el-button> -->
          <el-button size="small" type="primary" @click="viewHealthData(scope.row)">查看健康数据</el-button>
        </div>
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef" />
    <ImportExcel ref="dialogRef" />
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
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";

const route = useRoute();

const router = useRouter();

const viewHealthData = patient => {
  router.push({
    path: `/healthData/${patient.id}`,
    query: { name: patient.username }
  });
  console.log("🚀 ~ viewHealthData ~ patient:", patient);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars

// 跳转详情页

// ProTable 实例
const proTable = ref<ProTableInstance>();

// 如果表格需要初始化请求参数，直接定义传给 ProTable (之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({ type: 1 });

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 list && total 这些字段，可以在这里进行处理成这些字段
// 或者直接去 hooks/useTable.ts 文件中把字段改为你后端对应的就行
const dataCallback = (data: any) => {
  return {
    list: data.list,
    total: data.total
  };
};

// 如果你想在请求之前对当前请求参数做一些操作，可以自定义如下函数：params 为当前所有的请求参数（包括分页），最后返回请求列表接口
// 默认不做操作就直接在 ProTable 组件上绑定	:requestApi="getUserList"
const getTableList = (params: any) => {
  if (route.query.username) {
    params = { ...params, username: route.query.username };
  }
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
    search: { el: "input" }
  },
  {
    prop: "gender",
    label: "性别",
    // 字典数据（本地数据）
    // enum: genderType,
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

  { prop: "operation", label: "操作", fixed: "right", width: 330 }
]);

// 表格拖拽排序
const sortTable = ({ newIndex, oldIndex }: { newIndex?: number; oldIndex?: number }) => {
  console.log(newIndex, oldIndex);
  console.log(proTable.value?.tableData);
  ElMessage.success("修改列表排序成功");
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
</script>
