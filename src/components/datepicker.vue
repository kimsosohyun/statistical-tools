<template>
<div class="date-picker" v-clickoutside="close">
        <div @mouseenter="showCancel = true" @mouseleave="showCancel = false">
            <input
                type="text"
                class="text pointer"
                @click="togglePanel"
                :value="range ? value[0] + ' -- ' + value[1] : value"
                :name="name"
                :disabled="disabled"
                readonly
            />
            <div class="date-icons">
                <span class="icon-close pointer" v-show="showCancel" @click="clear"></span>
                <span class="icon-calendar pointer" v-show="!showCancel"></span>
            </div>
        </div>
        <transition name="toggle">
            <div class="date-panel" v-show="panelState" :style="coordinates">
                <div class="panel-header" v-show="panelType !== 'year'">
                    <div class="icon-arrow-left" @click="prevMonthPreview()"></div>
                    <div class="year-month-box">
                        <div class="year-box" @click="chType('year')" v-text="tmpYear"></div>
                        <div
                            class="month-box"
                            @click="chType('month')"
                        >{{tmpMonth + 1 | month(language)}}</div>
                    </div>
                    <div class="icon-arrow-left arrow-right" @click="nextMonthPreview()"></div>
                </div>
                <div class="panel-header" v-show="panelType === 'year'">
                    <div class="icon-arrow-left" @click="chYearRange(0)"></div>
                    <div class="year-range">
                        <span v-text="yearList[0]"></span> -
                        <span v-text="yearList[yearList.length - 1]"></span>
                    </div>
                    <div class="icon-arrow-left arrow-right" @click="chYearRange(1)"></div>
                </div>
                <div class="type-year" v-show="panelType === 'year'">
                    <ul class="year-list">
                        <li
                            v-for="item in yearList"
                            v-text="item"
                            :key="item"
                            :class="{active: isSelected('year', item), invalid: validateYear(item)}"
                            @click="selectYear(item)"
                        ></li>
                    </ul>
                </div>
                <div class="type-month" v-show="panelType === 'month'">
                    <ul class="month-list">
                        <li
                            v-for="(item, index) in monthList"
                            :key="item"
                            :class="{active: isSelected('month', index), invalid: validateMonth(index)}"
                            @click="selectMonth(index)"
                        >{{item | month(language)}}</li>
                    </ul>
                </div>
                <div class="type-date" v-show="panelType === 'date'">
                    <ul class="weeks">
                        <li v-for="item in weekList" :key="item">{{item | week(language)}}</li>
                    </ul>
                    <ul class="date-list">
                        <li
                            v-for="(item, index) in dateList"
                            :key="index"
                            :class="{preMonth: item.previousMonth, nextMonth: item.nextMonth,
                                invalid: validateDate(item), firstItem: (index % 7) === 0}"
                            @click="selectDate(item)"
                        >
                            <div class="msg-day" :class="{active: isSelected('date', item)}">
                                <div class="bg"></div>
                                <span v-text="item.value"></span>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
export default {
  name: "v-datepicker",
  data() {
    return {
      showCancel: false,
      panelState: false,
      panelType: "date",
      coordinates: {},
      year: "",
      month: "",
      date: "",
      tmpYear: "",
      tmpMonth: "",
      tmpStartYear: "",
      tmpStartMonth: "",
      tmpStartDate: "",
      tmpEndYear: "",
      tmpEndMonth: "",
      tmpEndDate: "",
      minYear: Number,
      minMonth: Number,
      minDate: Number,
      maxYear: Number,
      maxMonth: Number,
      maxDate: Number,
      yearList: Array.from({ length: 12 }, (value, index) => new Date().getFullYear() + index),
      monthList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      weekList: [0, 1, 2, 3, 4, 5, 6],
      rangeStart: false
    };
  },
  props: {
    language: { default: "en" },
    min: { default: "2000-01-01" },
    max: { default: "2037-12-31" },
    name: { type: String },
    value: {
      type: [String, Array],
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    range: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.setOptionVal();
  },

  methods: {
    setOptionVal() {
      let now = new Date();
      let startDate, endDate, year, month, date, tmpYear, tmpMonth, tmpStartYear, tmpStartMonth, tmpStartDate, tmpEndYear, tmpEndMonth, tmpEndDate;

      if (this.range) {
        startDate = this.value[0] ? new Date(this.value[0].replace(/[-]/g, '/')) : now;
        endDate = this.value[1] ? new Date(this.value[1].replace(/[-]/g, '/')) : now;

        year = endDate.getFullYear();
        month = endDate.getMonth();
        date = endDate.getDate();

        tmpYear = endDate.getFullYear();
        tmpMonth = endDate.getMonth();

        tmpStartYear = startDate.getFullYear();
        tmpStartMonth = startDate.getMonth();
        tmpStartDate = startDate.getDate();

        tmpEndYear = endDate.getFullYear();
        tmpEndMonth = endDate.getMonth();
        tmpEndDate = endDate.getDate();
      } else {
        startDate = endDate = this.value ? new Date(this.value.replace(/[-]/g, '/')) : now;

        year = endDate.getFullYear();
        month = endDate.getMonth();
        date = endDate.getDate();

        tmpYear = endDate.getFullYear();
        tmpMonth = endDate.getMonth();

        tmpStartYear = startDate.getFullYear();
        tmpStartMonth = startDate.getMonth();
        tmpStartDate = startDate.getDate();

        tmpEndYear = endDate.getFullYear();
        tmpEndMonth = endDate.getMonth();
        tmpEndDate = endDate.getDate();
      }

      this.year = year;
      this.month = month;
      this.date = date;
      this.tmpYear = tmpYear;
      this.tmpMonth = tmpMonth;
      this.tmpStartYear = tmpStartYear;
      this.tmpStartMonth = tmpStartMonth;
      this.tmpStartDate = tmpStartDate;
      this.tmpEndYear = tmpEndYear;
      this.tmpEndMonth = tmpEndMonth;
      this.tmpEndDate = tmpEndDate;
    },
    togglePanel() {
      if (this.disabled) {
        this.panelState = false;
        return;
      }
      this.panelState = !this.panelState;
      this.rangeStart = false;
    },
    isSelected(type, item) {
      switch (type) {
        case "year":
          if (!this.range) return item === this.tmpYear;
          return new Date(item, 0).getTime() >= new Date(this.tmpStartYear, 0).getTime() && new Date(item, 0).getTime() <= new Date(this.tmpEndYear, 0).getTime();
        case "month":
          if (!this.range) return item === this.tmpMonth && this.year === this.tmpYear;
          return new Date(this.tmpYear, item).getTime() >= new Date(this.tmpStartYear, this.tmpStartMonth).getTime() && new Date(this.tmpYear, item).getTime() <= new Date(this.tmpEndYear, this.tmpEndMonth).getTime();
        case "date":
          if (!this.range) return this.date === item.value && this.month === this.tmpMonth && item.currentMonth;
          let month = this.tmpMonth;
          item.previousMonth && month--;
          item.nextMonth && month++;
          return new Date(this.tmpYear, month, item.value).getTime() >= new Date(this.tmpStartYear, this.tmpStartMonth, this.tmpStartDate).getTime() && new Date(this.tmpYear, month, item.value).getTime() <= new Date(this.tmpEndYear, this.tmpEndMonth, this.tmpEndDate).getTime();
      }
    },
    chType(type) {
      this.panelType = type;
    },
    chYearRange(next) {

      if (next) {
        if (this.yearList[11] >= this.maxYear) {
          return;
        }
        this.yearList = this.yearList.map(i => i + 12);
      } else {
        if (this.yearList[0] <= this.minYear) {
          return;
        }
        this.yearList = this.yearList.map(i => i - 12);
      }
    },
    prevMonthPreview() {
      this.tmpMonth = this.tmpMonth === 0 ? 0 : this.tmpMonth - 1;
    },
    nextMonthPreview() {
      this.tmpMonth = this.tmpMonth === 11 ? 11 : this.tmpMonth + 1;
    },
    selectYear(year) {
      if (this.validateYear(year)) return;
      this.tmpYear = year;
      this.panelType = "month";
    },
    selectMonth(month) {
      if (this.validateMonth(month)) return;
      this.tmpMonth = month;
      this.panelType = "date";
    },
    selectDate(date) {
      setTimeout(() => {
        if (this.validateDate(date)) return;
        if (date.previousMonth) {
          if (this.tmpMonth === 0) {
            this.year -= 1;
            this.tmpYear -= 1;
            this.month = this.tmpMonth = 11;
          } else {
            this.month = this.tmpMonth - 1;
            this.tmpMonth -= 1;
          }
        } else if (date.nextMonth) {
          if (this.tmpMonth === 11) {
            this.year += 1;
            this.tmpYear += 1;
            this.month = this.tmpMonth = 0;
          } else {
            this.month = this.tmpMonth + 1;
            this.tmpMonth += 1;
          }
        }
        if (!this.range) {
          this.year = this.tmpYear;
          this.month = this.tmpMonth;
          this.date = date.value;
          let value = `${this.tmpYear}-${("0" + (this.month + 1)).slice(-2)}-${("0" + this.date).slice(-2)}`;
          this.$emit("input", value);
          this.panelState = false;
        } else if (this.range && !this.rangeStart) {
          this.tmpEndYear = this.tmpStartYear = this.tmpYear;
          this.tmpEndMonth = this.tmpStartMonth = this.tmpMonth;
          this.tmpEndDate = this.tmpStartDate = date.value;

          this.rangeStart = true;
        } else if (this.range && this.rangeStart) {
          this.tmpEndYear = this.tmpYear;
          this.tmpEndMonth = this.tmpMonth;
          this.tmpEndDate = date.value;

          let d1 = new Date(this.tmpStartYear, this.tmpStartMonth, this.tmpStartDate).getTime(),
              d2 = new Date(this.tmpEndYear, this.tmpEndMonth, this.tmpEndDate).getTime();
          if (d1 > d2) {
            let tmpY, tmpM, tmpD;
            tmpY = this.tmpEndYear;
            tmpM = this.tmpEndMonth;
            tmpD = this.tmpEndDate;

            this.tmpEndYear = this.tmpStartYear;
            this.tmpEndMonth = this.tmpStartMonth;
            this.tmpEndDate = this.tmpStartDate;

            this.tmpStartYear = tmpY;
            this.tmpStartMonth = tmpM;
            this.tmpStartDate = tmpD;
          }
          let RangeStart = `${this.tmpStartYear}-${("0" + (this.tmpStartMonth + 1)).slice(-2)}-${("0" + this.tmpStartDate).slice(-2)}`;
          let RangeEnd = `${this.tmpEndYear}-${("0" + (this.tmpEndMonth + 1)).slice(-2)}-${("0" + this.tmpEndDate).slice(-2)}`;

          let value = [RangeStart, RangeEnd];
          this.$emit("input", value);

          this.rangeStart = false;
          this.panelState = false;
        }
      }, 0);
    },
    validateYear(year) {
      return year > this.maxYear || year < this.minYear ? true : false;
    },
    validateMonth(month) {
      if (new Date(this.tmpYear, month).getTime() >= new Date(this.minYear, this.minMonth - 1).getTime() && new Date(this.tmpYear, month).getTime() <= new Date(this.maxYear, this.maxMonth - 1).getTime()) {
        return false;
      }
      return true;
    },
    validateDate(date) {
      let mon = this.tmpMonth;
      if (date.previousMonth) {
        mon -= 1;
      } else if (date.nextMonth) {
        mon += 1;
      }
      if (new Date(this.tmpYear, mon, date.value).getTime() >= new Date(this.minYear, this.minMonth - 1, this.minDate).getTime() && new Date(this.tmpYear, mon, date.value).getTime() <= new Date(this.maxYear, this.maxMonth - 1, this.maxDate).getTime()) {
        return false;
      }
      return true;
    },
    close(e) {
      this.panelState = false;
      this.rangeStart = false;
    },
    clear() {
      if (this.disabled) {
        return;
      }
      this.$emit("input", this.range ? ["", ""] : "");
    }
  },
  watch: {
    min(v) {
      let minArr = v.split("-");
      this.minYear = Number(minArr[0]);
      this.minMonth = Number(minArr[1]);
      this.minDate = Number(minArr[2]);
    },
    max(v) {
      let maxArr = v.split("-");
      this.maxYear = Number(maxArr[0]);
      this.maxMonth = Number(maxArr[1]);
      this.maxDate = Number(maxArr[2]);
    },
    range(newVal, oldVal) {
      if (newVal === oldVal) return;
      if (newVal && Object.prototype.toString.call(this.value).slice(8, -1) === "String") {
        this.$emit("input", ["", ""]);
      }
      if (!newVal && Object.prototype.toString.call(this.value).slice(8, -1) === "Array") {
        this.$emit("input", "");
      }
    },
    value(newVal, oldVal) {
      if (newVal === oldVal) return;
      this.$emit("input", newVal);
      this.setOptionVal();
    }
  },
  computed: {
    dateList() {
      let currentMonthLength = new Date(this.tmpYear, this.tmpMonth + 1, 0).getDate();
      let dateList = Array.from({ length: currentMonthLength }, (val, index) => {
        return {
          currentMonth: true,
          value: index + 1
        };
      });
      let startDay = new Date(this.tmpYear, this.tmpMonth, 1).getDay();
      let previousMongthLength = new Date(this.tmpYear, this.tmpMonth, 0).getDate();

      for (let i = 0, len = startDay; i < len; i++) {
        dateList = [{ previousMonth: true, value: previousMongthLength - i }].concat(dateList);
      }
      for (let i = dateList.length, item = 1; i < 42; i++, item++) {
        dateList[dateList.length] = { nextMonth: true, value: item };
      }
      return dateList;
    }
  },
  filters: {
    week: (item, lang) => {
      return {
        0: _("Sun."),
        1: _("Mon."),
        2: _("Tues."),
        3: _("Wed."),
        4: _("Thur."),
        5: _("Fri."),
        6: _("Sat.")
      }[item];
    },
    month: (item, lang) => {
      return item + _("Month");
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$el.parentNode.offsetWidth + this.$el.parentNode.offsetLeft - this.$el.offsetLeft <= 300) {
        this.coordinates = {
          right: "0",
          top: `${window.getComputedStyle(this.$el.children[0]).offsetHeight + 4}px`
        };
      } else {
        this.coordinates = {
          left: "0",
          top: `${window.getComputedStyle(this.$el.children[0]).offsetHeight + 4}px`
        };
      }
      let minArr = this.min.split("-");
      this.minYear = Number(minArr[0]);
      this.minMonth = Number(minArr[1]);
      this.minDate = Number(minArr[2]);

      let maxArr = this.max.split("-");
      this.maxYear = Number(maxArr[0]);
      this.maxMonth = Number(maxArr[1]);
      this.maxDate = Number(maxArr[2]);

      if (this.range) {
        if (Object.prototype.toString.call(this.value).slice(8, -1) !== "Array") {
          throw new Error("Binding value must be an array in range mode.");
        }
        if (this.value.length) {
          let rangeStart = this.value[0].split("-");
          let rangeEnd = this.value[1].split("-");
          this.tmpStartYear = Number(rangeStart[0]);
          this.tmpStartMonth = Number(rangeStart[1]) - 1;
          this.tmpStartDate = Number(rangeStart[2]);

          this.tmpEndYear = Number(rangeEnd[0]);
          this.tmpEndMonth = Number(rangeEnd[1]) - 1;
          this.tmpEndDate = Number(rangeEnd[2]);
        } else {
          this.$emit("input", ["", ""]);
        }
      }
      if (!this.value) {
        this.$emit("input", "");
      }
    });
  }
};
</script>

<style lang="scss">
ul {
    padding: 0;
    margin: 0;
    list-style: none;
}
.date-picker {
    position: relative;
    display: inline-block;
    height: 32px;
    width:auto;
}
.input {
    height: 100%;
    width: 100%;
    font-size: inherit;
    padding-left: 4px;
    box-sizing: border-box;
    outline: none;
}
.cancel-btn {
    height: 14px;
    width: 14px;
}
.date-panel {
    position: absolute;
    width: 100%;
    z-index: 5000;
    border: 1px solid #eee;
    border-radius: 4px;
    user-select: none;
    box-shadow: 0 2px 8px 0 rgba(0,0,0,0.15);
    background-color: #fff;
    transform: translateY(4px);
}
.date-icons {
    position: absolute;
    right: 8px;
    top: 1px;
    z-index: 9;
    color: rgba(0, 0, 0, .25);
    height: 32px;
    line-height: 32px;
    text-align: center;
}
.panel-header {
    width: 100%;
    border-bottom: 1px solid #eee;
}
.icon-arrow-left {
    width: 18.1%;
    display: inline-block;
    font-size: 14px;
    line-height: 24px;
    background-color: #fff;
    text-align: center;
    cursor: pointer;
    &.arrow-right {
      transform: rotate3d(0, 0, 1, 180deg);
    }
}
.year-range {
    // font-size: 20px;
    // line-height: 2;
    display: inline-block;
    width: 60%;
    text-align: center;
    font-weight: 600;
}
.year-month-box {
    display: inline-block;
    font-weight: bold;
    text-align: center;
    width: 60%;
}
.type-year,
.type-month,
.date-list {
    background-color: #fff;
}

.year-box,
.month-box {
    transition: all ease 0.1s;
    display: inline-block;
    padding: 0 8px;
    text-align: center;
    font-size: 14px;
    line-height: 2;
    cursor: pointer;
    background-color: #fff;
}
.year-list,
.month-list {
  padding: 30px 20px 10px;
    li {
        transition: all 0.45s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
        cursor: pointer;
        text-align: center;
        // font-size: 20px;
        width: 46px;
        display: inline-block;
        margin: 0 20px 20px 0;
        // padding: 10px 0;
        line-height: 24px;
        border-radius: 1px;
        border: 1px solid #fff;
        &:hover {
            border-color: $main-active-color;
            // color: #fff;
        }
        &.selected {
            background-color: #fceff0;
        }
        &.active {
            background-color: $main-active-color;
            color: #fff;
        }
        &.invalid {
            cursor: not-allowed;
            color: rgba(0, 0, 0, .25);
        }
        &:nth-of-type(3n) {
          margin: 0;
        }
    }
}
.date-list {
    .valid:hover {
        background-color: #eee;
    }
    li {
        transition: all ease 0.1s;
        cursor: pointer;
        display: inline-block;
        box-sizing: border-box;
        border-bottom: 1px solid #fff;
        position: relative;

        .msg-day {
            font-family: Roboto, sans-serif;
            font-weight: 400;
            font-size: 14px;
            position: relative;
            height: 24px;
            &.selected {
                .bg {
                    background-color: #fceff0;
                }
            }
            &.active {
                .bg {
                    background-color: $main-active-color;
                }
                span {
                    color: #fff;
                }
            }
            &:hover {
              .bg {
                border: 1px solid $main-active-color;
                border-radius: 1px;
              }
            }
            .bg {
                height: 24px;
                width: 100%;
                transition: all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
                position: absolute;
                z-index: 10;
                top: 0;
                left: 0;
            }
            span {
                position: absolute;
                z-index: 20;
                left: 0;
                width: 100%;
            }
        }
        &.invalid {
            cursor: not-allowed;
            color: rgba(0, 0, 0, .25);
        }
    }
}
.type-date {
  padding: 9px 11px 4px;
}
.weeks {
    li {
        font-weight: 600;
        display: inline-block;
        // &:nth-child(1) {
        //   margin-left: 0;
        // }
    }
}
.weeks,
.date-list {
    width: 100%;
    line-height: 20px;
    text-align: center;
    .preMonth,
    .nextMonth {
        color: rgba(0, 0, 0, .25);
    }
    li {
        // margin-left: 4px;
        width: 30px;
        height: 24px;
        text-align: center;
        line-height: 24px;
        &.firstItem {
          margin-left: 0;
        }
    }
}
.toggle-enter,
.toggle-leave-active {
    opacity: 0;
    transform: translateY(-10px);
}
.toggle-enter-active,
.toggle-leave-active {
    transition: all ease 0.2s;
}
.fade-enter,
.fade-leave-active {
    opacity: 0;
    transform: scale3d(0, 0, 0);
}
.fade-enter-active,
.fade-leave-active {
    transition: all ease 0.1s;
}
</style>

