<template>
  <div class="main">
    <div class="plan-list-view">
      <div class="plan-list-view__item" :class="{ 'no-border': true }">
        <div class="plan-list-view__header">
          <div class="plan-list-view__header-left">
            <div class="plan-list-view__point"></div>
            <div class="plan-list-view__title">深化设计（3天）</div>
          </div>
          <div class="plan-list-view__header-right">
            <div class="plan-list-view__headerdate">
              <span>03-01</span>
              <span>~</span>
              <span>03-03</span>
            </div>
            <lion-icon
              size="32"
              style="margin: 0"
              color="rgba(0, 0, 0, 0.28)"
              type="arrow-down"
            ></lion-icon>
          </div>
        </div>
        <div class="plan-list-view__content"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts"></script>

<style lang="scss" scoped>
.main {
  .plan-list-view {
    .plan-list-view__item {
      .plan-list-view__header {
        .plan-list-view__header-left {
          .plan-list-view__point {
          }
          .plan-list-view__title {
          }
        }
        .plan-list-view__header-right {
          .plan-list-view__headerdate {
            span {
            }
          }
        }
      }
      .plan-list-view__content {
      }
    }
    .no-border {
    }
  }
}
</style>
