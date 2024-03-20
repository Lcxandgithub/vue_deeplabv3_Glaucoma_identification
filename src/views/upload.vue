
<template>
  <div>
  <div>
    <div>
      <h1 style="text-align: center">上传图片管理</h1>
      <div class="plugins-tips">
        <p style="line-height: 20px">
          上传的图片格式为JPG
        </p>
      </div>

      <el-upload
          class="upload-demo"
          drag
          :limit="1"
          :show-file-list="true"
          :action="uploadUrl"
          multiple
          @on-success="handleUploadSuccess"
      >
        <!--   action是将图片file文件直接上传到后端服务器上，要想将图片附带的数据信息上传必须要实现额外函数 -->
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload>
    </div>

    <div style="margin: 0 auto;width: 100%;">
      <!-- 数据表格 -->
      <el-table :data="files" style="margin: 20px auto ;">
        <el-table-column label="序号" prop="id"/>
        <el-table-column label="文件名" prop="name"/>
        <el-table-column label="类型" prop="type"/>
        <el-table-column label="文件位置" prop="origin"/>
        <el-table-column align="center" label="图片预览">
          <template #default="scope">
            <el-image
                :src="'http://127.0.0.1:5000/get_image_save/' +scope.row.name+'.jpg'"
                style="width: 50px; height: 50px;"
                fit="cover"
                :z-index="10"
                :preview-src-list="[scope.row.name]"
                preview-teleported
            >
            </el-image>
          </template>
        </el-table-column>


        <el-table-column align="center" label="操作" width="200px">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
              编辑
            </el-button>
            <el-button
                size="small"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)"
            >
              删除
            </el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加图片页面 -->
    <el-dialog
        title="添加图片"
        v-model="add_dialog_visible"
        width="30%"
        :before-close="handleClose"
    >
      <el-form
          ref="ruleFormRef"
          :model="file_form"
          status-icon
          label-width="120px"
          class="demo-ruleForm"
      >
        <el-form-item label="序号" prop="id">
          <el-input v-model="file_form.id" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="文件名" prop="name">
          <el-input v-model="file_form.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model="file_form.type" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="文件位置" prop="origin">
          <el-input v-model.number="file_form.origin" autocomplete="off"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(ruleFormRef)">提交</el-button>
          <el-button @click="resetForm(ruleFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
    <!-- 编辑图片页面 -->
    <el-dialog
        title="编辑图片"
        v-model="edit_dialog_visible"
        width="30%"
        :before-close="handleClose"
    >
      <el-form
          ref="editFormRef"
          :model="file_form"
          status-icon
          label-width="120px"
          class="demo-ruleForm"
      >
        <el-form-item label="序号" prop="id">
          <el-input v-model="file_form.id" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="文件名" prop="name">
          <el-input v-model="file_form.name" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model="file_form.type" autocomplete="off"/>
        </el-form-item>
        <el-form-item label="文件位置" prop="origin">
          <el-input v-model.number="file_form.origin" autocomplete="off"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitEditForm(editFormRef)">提交</el-button>
          <el-button @click="resetForm(editFormRef)">重置</el-button>
        </el-form-item>
      </el-form>

    </el-dialog>


  </div>
</template>


<script setup>
import axios from 'axios'
import {reactive, ref, onMounted} from "vue";
import {ElMessageBox} from 'element-plus'


const uploadUrl= 'http://localhost:5000/upload/pic/'
const processedImagePath = ref('');
const uploadImage = () => {
  const formData = new FormData();
  formData.append('image', file.value);

  axios.post('http://localhost:5000/upload', formData)
      .then(response => {
        processedImagePath.value = response.data.image_path;
      })
      .catch(error => {
        console.error(error);
      });
};


const files = reactive([])
const getStudents = () => {
  axios.get("http://localhost:5000/files",).then(res => {
    files.splice(0, files.length)
    files.push(...res.data.results)
    console.log('更新数据')
  })

}
// 页面渲染之后添加数据
onMounted(() => {
  getStudents()

})

// 删除数据
const handleDelete = (index, scope) => {
  axios.delete(`http://localhost:5000/files/${scope.id}`).then(() => {
    getStudents()
  })
}

/*表单添加*/
const add_dialog_visible = ref(false)
const ruleFormRef = ref()
const file_form = reactive({
  id: "",
  name: "",
  type: "",
  origin: "",
})
// 表单提交事件
const submitForm = (formEl) => {
  axios.post('http://localhost:5000/files', file_form).then(() => {
    add_dialog_visible.value = false
    formEl.resetFields()
    getStudents()
  })
}
// 重置表单
const resetForm = (formEl) => {
  formEl.resetFields()
}

// 关闭弹窗前确认
const handleClose = (done) => {
  ElMessageBox.confirm('确认关闭？')
      .then(() => {
        done();
      })
      .catch(() => {
      });
}

/*编辑表单*/
const editFormRef = ref()
const edit_dialog_visible = ref(false)
const handleEdit = (index, scope) => {
  for (let key in scope) {
    file_form[key] = scope[key]
  }
  edit_dialog_visible.value = true
}
// 编辑提交按钮
const submitEditForm = (formEl) => {
  axios.put(`http://localhost:5000/files/${file_form.id}`, file_form).then((res) => {
    formEl.resetFields()
    edit_dialog_visible.value = false
    getStudents()
  })
}

// 处理上传成功的逻辑
// 更新表格数据
const handleUploadSuccess = (response, file, fileList) => {
  // 处理上传成功的逻辑
  // 在这里更新files数据
  files.push({
    id: fileList.length,
    name: file.name,
    type: file.type,
    origin: file.url // 根据实际需求更新文件位置
  });
};

</script>
