<template>
  <div>
    <!--    <h1 style="text-align: center">青光眼病变识别系统</h1>-->
    <br/>
    <el-row :gutter="20">
      <el-col :span="9">
        <el-card shadow="hover" class="mgb20" style="height: 300px">
          <p class="my-custom-class">
            <h3 style="text-align: center">青光眼是什么</h3>
            &nbsp&nbsp&nbsp&nbsp青光眼（glaucoma）是一组以视乳头萎缩及凹陷、视野缺损及视力下降为共同特征的疾病，病理性眼压增高、视神经供血不足是其发病的原发危险因素，视神经对压力损害的耐受性也与青光眼的发生和发展有关。在房水循环途径中任何一环发生阻碍，均可导致眼压升高而引起的病理改变，但也有部分患者呈现正常眼压青光眼。青光眼是导致人类失明的三大致盲眼病之一，总人群发病率为1%，45岁以后为2%。临床上根据病因、房角、眼压描记等情况将青光眼分为原发性、继发性和先天性三大类。

          </p>
        </el-card>
        <el-card shadow="hover" style="height: 240px">
          <div  style="text-align: center;">
            <img src="src/assets/img/eye.jpg" alt="图片1" style="width: 320px; height: 240px;">
          </div>
        </el-card>
      </el-col>
      <el-col :span="15">

        <el-card shadow="hover" style="height: 561px">
          <div class="showImg" >
            <a v-for="(item) in imgArr" :key="item.id" :href="item.link" target="_blank">
              <img @mouseover="changeInterval(true)"
                   @mouseleave="changeInterval(false)"
                   :src="item.url"
                   alt="暂无图片"
                   v-show="item.id === currentIndex"
              >
            </a>

            //左侧按钮
            <div  @click="clickIcon('up')"   class="iconDiv icon-left">
              <i class="el-icon-caret-left"></i>
            </div>
            //右侧按钮
            <div  @click="clickIcon('down')"  class="iconDiv icon-right">
              <i class="el-icon-caret-right"></i>
            </div>
            //控制圆点
            <div class="banner-circle">
              <ul>
                <li @click="changeImg(image.id)"
                    v-for="(image) in imgArr"
                    :key="image.id"
                    :class="image.id === currentIndex? 'active' : '' "
                ></li>

              </ul>
            </div>


          </div>

          <div class=".my-custom-class">{{ currentImage.description }}</div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover" style="height: 340px">
          <template #header>
            <div class="clearfix">
              <span>青光眼健康普及</span>
            </div>
          </template>

          <el-table :show-header="false" :data="todoList" style="width: 100%">
            <el-table-column width="40">
              <template #default="scope">
                <!-- <el-checkbox v-model="scope.row.status" :disabled="true"></el-checkbox> -->
              </template>
            </el-table-column>
            <el-table-column>
              <template #default="scope">
                <div class="todo-item" :class="{'todo-item-del': scope.row.status}">
                  <a :href="scope.row.url" target="_blank">{{ scope.row.title }}</a>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <schart ref="line" class="schart" canvasId="line" :options="options2"></schart>
        </el-card>
      </el-col>
    </el-row>


  </div>
</template>

<script setup lang="ts" name="dashboard">
import { ref, onMounted } from 'vue';
import Schart from 'vue-schart';
import {computed, reactive} from 'vue';
import imgurl from '../assets/img/img.jpg';
import 'vue-better-slider/style.css'
// import { Swiper, SwiperSlide } from 'swiper';
import 'swiper/swiper-bundle.css';

const name = localStorage.getItem('ms_username');
const role: string = name === 'admin' ? '超级管理员' : '普通用户';



const currentIndex = ref(0);
let timer = null;


const todoList = reactive([
  {
    title: '世界青光眼周｜这种眼病是“视力杀手”，专家提醒“医患共管”至关重要',
    status: false,
    url: 'https://www.msn.cn/zh-cn/health/other/%E4%B8%96%E7%95%8C%E9%9D%92%E5%85%89%E7%9C%BC%E5%91%A8-%E8%BF%99%E7%A7%8D%E7%9C%BC%E7%97%85%E6%98%AF-%E8%A7%86%E5%8A%9B%E6%9D%80%E6%89%8B-%E4%B8%93%E5%AE%B6%E6%8F%90%E9%86%92-%E5%8C%BB%E6%82%A3%E5%85%B1%E7%AE%A1-%E8%87%B3%E5%85%B3%E9%87%8D%E8%A6%81/ar-BB1jKANM'
  },
  {
    title: '世界青光眼周 | 警惕“沉默的杀手”，青光眼需早诊早治_即时新闻_大众网',
    status: false,
    url: 'https://www.dzwww.com/xinwen/jishixinwen/202403/t20240313_13817800.htm'
  },
  {
    title: '关于青光眼，这些你要知道！--中国数字科技馆',
    status: false,
    url: 'https://www.cdstm.cn/frontier/yyjlk/202203/t20220309_1065764.html'
  },
  {
    title: '青光眼术后如何护理 - 专家文章 - 博禾医生',
    status: false,
    url: 'https://www.bohe.cn/article/view/eyywk0p4kmiwxuz.html'
  },
  {
    title: '青光眼术后怎么护理？ 应牢记5个注意事项！ - 家庭医生在线眼科频道频道 ',
    status: false,
    url: 'https://www.familydoctor.com.cn/eye/a/201904/2546455.html'
  },
  {
    title: '全国爱眼日 | 谈“青”色变大可不必，一文带你了解青光眼_澎湃号·湃客_澎湃新闻-The Paper',
    status: false,
    url: 'https://www.thepaper.cn/newsDetail_forward_23379480'
  }
]);


const links = [
  { id: 1, title: '链接1', url: 'https://www.sohu.com/a/763675065_121902293' },
  { id: 2, title: '链接2', url: 'https://www.sohu.com/a/763675065_121902293' },
  { id: 3, title: '链接3', url: 'https://www.sohu.com/a/763675065_121902293' },
]
// 使用 reactive 函数创建响应式数据对象
const state = reactive({

})

// 公开 links 数据

const imgArr = [
  { id: 0, url: "src/assets/img/p1.jpg",link: 'http://www.news.cn/politics/20240312/3678dffec294443faa9f1d93bb2fba80/c.html', description: '世界青光眼周：警惕这个“视力刺客” 早期诊断是关键-新华网 (news.cn)' },
  { id: 1, url: "src/assets/img/p2.jpg",link: 'https://www.msn.cn/zh-cn/news/other/%E7%99%BD%E5%86%85%E9%9A%9C%E4%B9%85%E6%8B%96%E4%B8%8D%E6%B2%BB%E5%AF%BC%E8%87%B4%E9%9D%92%E5%85%89%E7%9C%BC%E6%80%A5%E6%80%A7%E5%8F%91%E4%BD%9C-%E6%97%A5%E9%97%B4%E6%89%8B%E6%9C%AF%E5%8F%AF%E5%BD%93%E5%A4%A9%E5%87%BA%E9%99%A2/ar-BB1jLtpq', description: '白内障久拖不治导致青光眼急性发作！日间手术可当天出院 (msn.cn)'},
  { id: 2, url: "src/assets/img/p3.jpg",link: 'https://www.sohu.com/a/763675065_121902293', description: '青光眼有一定的遗传性 高危人群千万别大意_视力_治疗_眼压 (sohu.com)'},
  { id: 3, url: "src/assets/img/p4.jpg",link: 'https://www.thepaper.cn/newsDetail_forward_23330057', description: '《青光眼综合防治管理白皮书》发布，如何守护2000多万青光眼患者的光明？_公益湃_澎湃新闻'}
];

const startInterval = () => {
  clearInterval(timer);
  timer = setInterval(() => {
    currentIndex.value++;
    if (currentIndex.value > imgArr.length - 1) {
      currentIndex.value = 0;
    }
  }, 3000);
};

const clickIcon = (val) => {
  if (val === 'down') {
    currentIndex.value++;
    if (currentIndex.value === imgArr.length) {
      currentIndex.value = 0;
    }
  } else {
    if (currentIndex.value === 0) {
      currentIndex.value = imgArr.length;
    }
    currentIndex.value--;
  }
};

const changeImg = (id) => {
  currentIndex.value = id;
}


const changeInterval = (val) => {
  if (val) {
    clearInterval(timer);
  } else {
    startInterval();
  }
};


// 计算属性，用于获取当前显示的图片对象
const currentImage = computed(() => {
  return imgArr.find(item => item.id === currentIndex.value);
});
onMounted(() => {
  startInterval();
});
const options2 = {
  type: 'line',
  title: {
    text: '2015-2023年中国青光眼患病人数统计'
  },
  bgColor: '#fbfbfb',
  labels: ['2015', '2016', '2017', '2018', '2019','2020','2021','2022','2023'],
  datasets: [
    {
      label: '人数(百万人)',
      data: [18.1, 18.5, 18.9, 19.4, 19.6,19.9,20.3,20.6,21]
    }
  ]
};
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
/* 清除li前面的圆点 */
li {
  list-style-type: none;
}
.showImg{
  position: relative;
  width: 100%;
  height: 490px;
  margin: auto;
  overflow: hidden;
}
/* 轮播图片 */
.showImg img{
  width: 100%;
  height: 140%;
}

/* 箭头图标 */
.iconDiv{
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  border: 1px solid #666;
  border-radius: 15px;
  background-color: rgba(125,125,125,.2);
  line-height: 30px;
  text-align: center;
  font-size: 25px;
  cursor: pointer;
}
.iconDiv:hover{
  background-color: white;
}
.icon-left{
  left: 10px;
}
.icon-right{
  right: 10px;
}

/* 控制圆点 */
.banner-circle{
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 20px;
}
.banner-circle ul{
  margin: 0 50px;
  height: 100%;
  text-align: right;
}
.banner-circle ul li{
  display: inline-block;
  width: 14px;
  height: 14px;
  margin: 0 5px;
  border-radius: 7px;
  background-color: rgba(125,125,125,.8);
  cursor: pointer;
}
.active{
  background-color: black !important;
}

.my-custom-class {
  font-size: 18px;
  font-family: 'Microsoft YaHei', '微软雅黑', sans-serif;
}

.el-row {
  margin-bottom: 20px;
}

.grid-content {
  display: flex;
  align-items: center;
  height: 100px;
}

.grid-cont-right {
  flex: 1;
  text-align: center;
  font-size: 14px;
  color: #999;
}

.grid-num {
  font-size: 30px;
  font-weight: bold;
}

.grid-con-icon {
  font-size: 50px;
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  color: #fff;
}

.grid-con-1 .grid-con-icon {
  background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
  color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
  background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
  color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
  background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
  color: rgb(242, 94, 67);
}

.user-info {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
  border-bottom: 2px solid #ccc;
  margin-bottom: 20px;
}

.user-info-cont {
  padding-left: 50px;
  flex: 1;
  font-size: 14px;
  color: #999;
}

.user-info-cont div:first-child {
  font-size: 30px;
  color: #222;
}

.user-info-list {
  font-size: 14px;
  color: #999;
  line-height: 25px;
}

.user-info-list span {
  margin-left: 70px;
}

.mgb20 {
  margin-bottom: 20px;
}

.todo-item {
  font-size: 14px;
}

.todo-item-del {
  text-decoration: line-through;
  color: #999;
}

.schart {
  width: 100%;
  height: 300px;
}
</style>
