<template>
<span class="time-picker">
        <div class="time-header">
            <slot></slot>
        </div>
        <div class="dropdown date-time">
            <div class="select-list clearfix">
                <ul class="hours" ref="hour" :class="hasSecond ? 'grid-4': 'grid-6'">
                    <li
                        v-for="hr in hours"
                        v-text="hr"
                        :key="hr"
                        :class="{active: hourVal == hr}"
                        @click.stop="select('hour', hr)"
                    ></li>
                </ul>
                <ul class="minutes" ref="minute" :class="hasSecond ? 'grid-4': 'grid-6'">
                    <li
                        v-for="m in minutes"
                        v-text="m"
                        :key="m"
                        :class="{active: minuteVal == m}"
                        @click.stop="select('minute', m)"
                    ></li>
                </ul>
                <ul
                    class="seconds"
                    ref="second"
                    v-if="hasSecond"
                    :class="hasSecond ? 'grid-4': 'grid-6'"
                >
                    <li
                        v-for="s in seconds"
                        :key="s"
                        v-text="s"
                        :class="{active: second == s}"
                        @click.stop="select('second', s)"
                    ></li>
                </ul>
            </div>
        </div>
    </span>
</template>

<script>
export default {
  data() {
    return {
      hasSecond: false,
      seconds: [],
      minutes: [],
      hours: [],
      hourVal: "",
      minuteVal: ""
    };
  },
  created() {
    const hoursCount = 24;
    this.hours = [];
    for (let i = 0; i < hoursCount; i++) {
      this.hours.push(this.formatValue(i));
    }
    for (let i = 0; i < 60; i += 1) {
      this.minutes.push(this.formatValue(i));

      this.seconds.push(this.formatValue(i));
    }
  },
  props: {
    hour: {
      type: [String, Number],
      default: "0"
    },
    minute: {
      type: [String, Number],
      default: "0"
    },
    second: {
      type: [String, Number],
      default: "0"
    },
    type: {
      type: [String, Number],
      default: ""
    },
    minuteInterval: {
      type: Number,
      default: 1
    },
    secondInterval: {
      type: Number,
      default: 1
    }
  },
  methods: {
    select(type, value) {
      if (type === "hour") {
        this.hourVal = value;
      } else if (type === "minute") {
        this.minuteVal = value;
      }
      this.$emit("on-change-back", {
        type: this.type,
        hour: this.hourVal,
        minute: this.minuteVal
      });
    },
    formatValue(i) {
      return i < 10 ? `0${i}` : String(i);
    },
    setPosition() {
      this.$nextTick(function () {
        let hourItem = this.$refs.hour.children[parseInt(this.hour, 10) - 1];
        let minuteItem = this.$refs.minute.children[parseInt(Number(this.minute) / this.minuteInterval, 10) - 1];

        this.$refs.hour.scrollTop = Number(this.hour) === 0 ? 0 : hourItem.offsetTop - 5;
        this.$refs.minute.scrollTop = Number(this.minute) === 0 ? 0 : minuteItem.offsetTop - 5;
        if (this.hasSecond) {
          let secondItem = this.$refs.second.children[parseInt(Number(this.second) / this.secondInterval, 10)];
          this.$refs.second.scrollTop = secondItem.offsetTop;
        }
      });
    }
  },
  watch: {
    hour: {
      handler(val) {
        this.hourVal = val;
      },
      immediate: true
    },
    minute: {
      handler(val) {
        this.minuteVal = val;
      },
      immediate: true
    }
  }
};
</script>

<style lang="scss">
.date-time {
        position: static !important;
        box-shadow: none !important;
        height: auto !important;
        .select-list {
            height: 270px !important;
            border-right: 1px solid #eee;
        }
        .hours {
            border-right: 1px solid #eee;
        }
    }
    .time-header {
        text-align: center;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #eee; 
    }
</style>

