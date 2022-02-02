<template>
  <div class="tooltip-box">
    <div class="tooltip-content-wrapper" @mouseover="startHover" @mouseout="endHover" @mousemove="updateMousePosition">
      <slot/>
    </div>
    <div class="tooltip-wrapper" v-if="hover">
      <div class="tooltip" :style="{ left: left + 'px', top: top + 'px' }">
        <pre class="tooltip-text">{{ text }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Tooltip",
  props: {
    text: {
      type: String,
      required: true
    },
    delay: {
      type: Number,
      required: false,
      default: 1000
    }
  },
  data() {
    return {
      hover: false,
      hoverTimeout: 0,
      left: 0,
      top: 0
    }
  },
  methods: {
    startHover: function () {
      this.hoverTimeout = setTimeout(() => {
        this.hover = true;
      }, this.delay);
    },
    endHover: function () {
      clearTimeout(this.hoverTimeout);
      this.hover = false;
    },
    updateMousePosition: function (event) {
      if (!this.hover) {
        this.top = event.pageY - 5 - window.scrollY;
        this.left = event.pageX;
      }
    }
  }
}

</script>

<style lang="scss" scoped>
.tooltip-box {
  position: relative;
  display: inline-block;
}

.tooltip-wrapper {
  position: absolute;
}

.tooltip {
  color: $tooltip-text-color;
  background: $tooltip-background-color;
  text-align: center;
  border-radius: 4px;


  position: fixed;
  z-index: 10;

  animation: fadein 0.5s;
  pointer-events: none;

  transform: translate(0, -100%);
}

.tooltip-text {
  margin: 3px 6px;
}

@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
