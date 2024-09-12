<template>
  <el-drawer v-model="drawerVisible" :destroy-on-close="true" size="450px" :title="`${drawerProps.title}病患`">
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :disabled="drawerProps.isView"
      :model="drawerProps.row"
      :hide-required-asterisk="drawerProps.isView"
    >
      <el-form-item label="病患姓名" prop="name">
        <el-input v-model="drawerProps.row!.name" placeholder="请填写病患姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="drawerProps.row!.gender" placeholder="请选择性别" clearable>
          <el-option v-for="item in genderType" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input v-model="drawerProps.row!.age" placeholder="请填写病患年龄" clearable></el-input>
      </el-form-item>
      <el-form-item label="病史" prop="history">
        <el-input v-model="drawerProps.row!.history" placeholder="请填写病史" clearable type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="contact">
        <el-input v-model="drawerProps.row!.contact" placeholder="请填写联系方式" clearable></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts" name="PatientDrawer">
import { ref, reactive } from "vue";
import { genderType } from "@/utils/dict";
import { ElMessage, FormInstance } from "element-plus";

// 表单验证规则
const rules = reactive({
  name: [{ required: true, message: "请填写病患姓名" }],
  gender: [{ required: true, message: "请选择性别" }],
  age: [{ required: true, message: "请填写病患年龄" }],
  history: [{ required: true, message: "请填写病史" }],
  contact: [{ required: true, message: "请填写联系方式" }]
});

// 接口定义
interface DrawerProps {
  title: string;
  isView: boolean;
  row: Partial<any>;
  api?: (params: any) => Promise<any>;
  getTableList?: () => void;
}

// 弹窗控制与属性
const drawerVisible = ref(false);
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: "",
  row: {}
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params;
  drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
  ruleFormRef.value!.validate(async valid => {
    if (!valid) return;
    try {
      await drawerProps.value.api!(drawerProps.value.row);
      ElMessage.success({ message: `${drawerProps.value.title}病患成功！` });
      drawerProps.value.getTableList!();
      drawerVisible.value = false;
    } catch (error) {
      console.log(error);
    }
  });
};

defineExpose({
  acceptParams
});
</script>
