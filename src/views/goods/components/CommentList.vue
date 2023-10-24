<script setup lang="ts">
import { useGoodsStore } from "@/stores/GoodsStore";
import type { EvaluateRequestParams, EvaluateSpec } from "@/types/Goods";
import { onBeforeRouteUpdate } from "vue-router";

// 接收外部传递的评价列表请求参数
const props = defineProps<{ reqParams: EvaluateRequestParams }>();
// 获取用于存储商品信息的 store 对象
const goodsStore = useGoodsStore();
// 获取路由信息对象
const route = useRoute();
// 用于获取评价列表的方法
const { getEvaluateList } = goodsStore;
// 评价列表
const { evaluateList } = storeToRefs(goodsStore);
// 请求评价列表
getEvaluateList(route.params.id as string, props.reqParams);
// 请求参数变化, 重新获取评价列表
onBeforeRouteUpdate((to) => {
  getEvaluateList(to.params.id as string, props.reqParams);
});

// 格式化昵称
function formatNickname(nickname: string) {
  return (
    nickname.substring(0, 1) + "***" + nickname.substring(nickname.length - 1)
  );
}

// 格式化规格
function formatSpecs(specs: EvaluateSpec[]) {
  return specs.map((item) => `${item.name}: ${item.nameValue}`).join(" ");
}
</script>

<template>
  <div class="list">
    <div class="item" v-for="item in evaluateList.result.items">
      <div class="user">
        <img :src="item.member.avatar" alt="" />
        <span>{{ formatNickname(item.member.nickname) }}</span>
      </div>
      <div class="body">
        <div class="score">
          <i
            v-for="i in 5"
            :class="['iconfont', i <= item.score ? 'icon-wjx01' : 'icon-wjx02']"
          ></i>
          <span class="attr">
            {{ formatSpecs(item.orderInfo.specs) }}
          </span>
        </div>
        <div class="text">
          {{ item.content }}
        </div>
        <CommentImage :pictures="item.pictures" />
        <div class="time">
          <span>{{ item.createTime }}</span>
          <span class="zan"
            ><i class="iconfont icon-dianzan"></i>{{ item.praiseCount }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.list {
  padding: 0 20px;
  .item {
    display: flex;
    padding: 25px 10px;
    border-bottom: 1px solid #f5f5f5;
    .user {
      width: 160px;
      img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
      }
      span {
        padding-left: 10px;
        color: #666;
      }
    }
    .body {
      flex: 1;
      .score {
        line-height: 40px;
        .iconfont {
          color: #ff9240;
          padding-right: 3px;
        }
        .attr {
          padding-left: 10px;
          color: #666;
        }
      }
    }
    .text {
      color: #666;
      line-height: 24px;
    }
    .time {
      color: #999;
      display: flex;
      justify-content: space-between;
      margin-top: 5px;
    }
  }
}

.goods-comment-image {
  .list {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    a {
      width: 120px;
      height: 120px;
      border: 1px solid #e4e4e4;
      margin-right: 20px;
      margin-bottom: 10px;
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      &.active {
        border-color: @xtxColor;
      }
    }
  }
  .preview {
    width: 480px;
    height: 480px;
    border: 1px solid #e4e4e4;
    background: #f8f8f8;
    margin-bottom: 20px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    i {
      position: absolute;
      right: 0;
      top: 0;
      width: 30px;
      height: 30px;
      background: rgba(0, 0, 0, 0.2);
      color: #fff;
      text-align: center;
      line-height: 30px;
    }
  }
}
</style>
