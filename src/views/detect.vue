<template>
  <div>
    <div class="container">
      <div class="content-title">青光眼病变实例分割</div>
      <div class="plugins-tips">
        <p style="line-height: 30px">
        </p>
        <p style="line-height: 30px">
          系统主要使用Deeplabv3+进行眼底图像分析，对眼底图像进行预处理，包括图像去噪、对比度增强等操作，以提高图像质量，便于后续的特征提取和识别。在提取到的特征向量基础上，利用Deeplabv3+模型进行视杯视盘的分割。通过设定阈值或采用其他分割算法，将视杯和视盘从眼底图像中分割出来。再对分割结果进行后处理，包括去除小区域、平滑边缘等操作，以得到更准确的视杯视盘识别结果。
        </p>

        <p style="line-height: 30px">
        </p>
      </div>
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


        <el-table-column align="center" label="处理" width="200px">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
              识别
            </el-button>
          </template>
        </el-table-column>

      </el-table>
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
          label-width="100px"
          class="demo-ruleForm"
      >
        <el-form-item label="序号" prop="id">
          <el-input v-model="file_form.id" autocomplete="off" />
        </el-form-item>
        <el-form-item label="文件名" prop="name">
          <el-input v-model="file_form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model="file_form.type" autocomplete="off" />
        </el-form-item>
        <el-form-item label="文件位置" prop="origin">
          <el-input v-model.number="file_form.origin" autocomplete="off" />
        </el-form-item>
        <!-- 图片预览 -->
        <!-- 图片预览 -->
        <el-form-item label="图片预览">
          <el-image
              v-if="!processed_image_path"
              :src="'http://127.0.0.1:5000/get_image_save/' + file_form.name + '.jpg'"
              style="max-width: 50%; height: auto;"
              fit="contain"
          ></el-image>
          <el-image
              v-else
              :src="processed_image_path"
              style="max-width: 50%; height: auto;"
              fit="contain"
          ></el-image>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitEditForm()">
            识别
          </el-button>

        </el-form-item>

      </el-form>
    </el-dialog>

    <div>
<!--    <div>-->
<!--      <input type="file" @change="handleFileChange">-->
<!--      <el-button type="primary" :disabled="!file" @click="uploadImage">上传</el-button>-->
<!--      <img v-if="processedImagePath" :src="processedImagePath" alt="处理好的图片" class="my-image">-->
<!--    </div>-->

    <div>

      <div style="margin: 0 auto;width: 100%;">
        <!-- 数据表格 -->
        <el-table :data="results" style="margin: 20px auto ;">
          <el-table-column label="序号" prop="id"/>
          <el-table-column label="文件名" prop="name"/>
          <el-table-column label="视杯像素点" prop="optic_cup_num"/>
          <el-table-column label="视盘像素点" prop="optic_disc_num"/>
          <el-table-column label="视杯比例" align="center">
            <template #default="scope">
              {{ (scope.row.optic_cup_num / (scope.row.optic_cup_num + scope.row.optic_disc_num)).toFixed(2) }}
            </template>
          </el-table-column>

          <!-- 根据比例值判断并展示状态 -->
          <el-table-column label="状态" align="center">
            <template #default="scope">
              <template v-if="scope.row.optic_cup_num / (scope.row.optic_cup_num + scope.row.optic_disc_num) >= 0.6">
                青光眼
              </template>
              <template v-else>
                正常
              </template>
            </template>
          </el-table-column>
          <el-table-column align="center" label="图片预览">
            <template #default="scope">
              <el-image
                  :src="'http://127.0.0.1:5000/get_img_result/' +scope.row.name+'.jpg'"
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
    </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue';
import axios from 'axios';
import {ElMessageBox} from "element-plus";


const files = reactive([])
const results = reactive([])
const getFiles = () => {
  axios.get("http://localhost:5000/files",).then(res => {
    files.splice(0, files.length)
    files.push(...res.data.results)
    console.log('更新数据')
  })
}

const getResults=()=>{
  axios.get("http://localhost:5000/results",).then(res => {
    results.splice(0, results.length)
    results.push(...res.data.results)
    console.log('更新数据')
  })
}
// 页面渲染之后添加数据
onMounted(() => {
  getFiles()
  getResults()
})

const file = ref(null);
const processedImagePath = ref('');

const handleFileChange = (event) => {
  file.value = event.target.files[0];
};

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



/*表单添加*/
const add_dialog_visible = ref(false)
const ruleFormRef = ref()
const file_form = reactive({
  id: "",
  name: "",
  type: "",
  origin: "",
})
const result_form = reactive({
  id: "",
  name: "",
  optic_cup_num: "",
  optic_disc_num: "",
})
// 表单提交事件
const submitForm = (formEl) => {
  axios.post('http://localhost:5000/files', file_form).then(() => {
    add_dialog_visible.value = false
    formEl.resetFields()
    getFiles()
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
//编辑图片

const handleEdit = (index, scope) => {
    for (let key in scope) {
      file_form[key] = scope[key]
  }
  edit_dialog_visible.value = true
}
const handleEdit_result = (index, scope) => {
  for (let key in scope) {
    result_form[key] = scope[key]
  }
  edit_dialog_visible.value = true
}
// 编辑提交按钮
const processed_image_path = ref('');
const submitEditForm = () => {
  // 发起 GET 请求以获取图片
  fetch(`http://localhost:5000/get_image_save/${file_form.origin.replace('localhost://', '')}`)
      .then(response => response.blob())
      .then(blob => {
        const formData = new FormData();
        formData.append('image', blob, file_form.origin.replace('localhost://', ''));

        // 发起 POST 请求到后端接口
        axios
            .post('http://localhost:5000/upload', formData)
            .then(response => {
              // 成功返回后，将图片路径赋给 processed_image_path
              processed_image_path.value = response.data.image_path;
              // 显示弹窗
              edit_dialog_visible.value = true;
            })
            .catch(error => {
              console.error(error);
            });
      })
      .catch(error => {
        console.error(error);
      });
};

const handleDelete_file = (index, scope) => {
  axios.delete(`http://localhost:5000/files/${scope.id}`).then(() => {
    getResults()
  })
}
const handleDelete = (index, scope) => {
  axios.delete(`http://localhost:5000/results/${scope.id}`).then(() => {
    getResults()
  })
}




</script>



<style scoped>
.content-title {
  font-weight: 400;
  line-height: 50px;
  margin: 10px 0;
  font-size: 22px;
  color: #1f2f3d;
}
.upload-demo {
  width: 360px;
}

.handle-box {
  margin-bottom: 20px;
}

.handle-select {
  width: 120px;
}

.handle-input {
  width: 300px;
}
.table {
  width: 100%;
  font-size: 14px;
}
.red {
  color: red;
}

.primary{
  color: cornflowerblue;
}

.green{
  color: green;
}

.blue{
  color: aquamarine;
}

.mr10 {
  margin-right: 10px;
}
.table-td-thumb {
  display: block;
  margin: auto;
  width: 40px;
  height: 40px;
}

.my-label {
  background: var(--el-color-success-light-9);
}
.my-content {
  background: var(--el-color-danger-light-9);
}
.my-image {
  width: 300px;
  height: 300px;
}
</style>
