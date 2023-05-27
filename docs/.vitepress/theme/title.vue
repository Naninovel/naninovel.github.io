<!-- https://github.com/vuejs/vitepress/blob/main/src/client/theme-default/components/VPNavBarTitle.vue -->

<template>
  <div class="VPNavBarTitle">
    <a class="title" href="https://naninovel.com">Naninovel</a>
  </div>
</template>

<style scoped>

.title {
  display: flex;
  align-items: center;
  border-bottom: 1px solid transparent;
  width: 100%;
  height: var(--vp-nav-height);
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  transition: opacity 0.25s;
}

@media (min-width: 960px) {
  .title {
    flex-shrink: 0;
  }

  .VPNavBarTitle .title {
    border-bottom-color: var(--vp-c-divider);
  }
}

</style>
