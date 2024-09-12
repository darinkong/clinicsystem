<template>
  <div class="home card box flex items-center justify-center min-h-600px text-40 text-#1e6ce1 relative">
    <img class="home-bg" src="@/assets/images/home-bg.png" alt="welcome" />
    <div class="overlay-container tracking-wider">
      <div class="overlay-welcome">欢迎</div>
      <div class="overlay-text">来到社区门诊</div>
    </div>
  </div>
</template>

<script setup lang="ts" name="home"></script>

<style scoped lang="scss">
@import "./index.scss";
</style>
<style scoped>
.box {
  min-height: calc(100vh - 50px);
}

.overlay-container {
  position: absolute;
  top: 47%;
  left: 25%;
  transform: translate(-50%, -50%);
  text-align: left;
  z-index: 2;
}

.overlay-welcome {
  color: #3d88ff;
  font-size: 3vw;
  font-weight: 600;
  margin-bottom: 16px;
}

.overlay-text {
  color: #333;
  font-size: 2vw;
  font-weight: 500;
}
</style>
