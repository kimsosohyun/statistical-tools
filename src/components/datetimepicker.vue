<template>
<div class="datetime-picker" v-clickoutside="close">
        <div :class="inputClass">
            <input
                type="text"
                class="text pointer"
                ref="input"
                @click="togglePanel"
                :value="value[0] ? value[0] + ' -- ' + value[1] : ''"
:placeholder="_('Start Time -- End Time')"
                :name="name"
                :disabled="disabled"
                readonly
            />
            <div @click="togglePanel" class="placeholder-text" v-if="!hasPlaceholder && !value[0]">{{_("Start Time -- End Time")}}</div>
            <div class="date-icons">
                <span class="icon-calendar pointer"></span>
            </div>
        </div>
        <transition name="toggle">
            <div
                ref="panel"
                class="date-panel"
                v-show="panelState"
                :style="{'top': dropdownTop + 'px'}"
            >
                <div class="clearfix" v-show="isSelectDate">
                    <div class="datetime-panel grid-6">
                        <div class="panel-header" v-show="panelType !== 'year'">
                            <div class="arrow-left">
                                <span @click="prevYearPreview()" class="iconfont icon-shuangjiantouzuo hover"></span>
                                <span @click="prevMonthPreview()" class="iconfont icon-jiantouzuo hover"></span>
                            </div>
                            <div class="year-month-box">
                                <span class="year-box" v-text="tmpYear"></span>
                                <span class="month-box">{{tmpMonth + 1 | month(language)}}</span>
                            </div>
                            <div class="arrow-right"></div>
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
                                    @click="selectDate(item, 'start')"
                                >
                                    <div
                                        class="msg-day"
                                        :class="{selected: isSelected(item, 'start'), active: isActive(item, 'start')}"
                                    >
                                        <div class="bg"></div>
                                        <span v-text="item.value"></span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="datetime-panel grid-6">
                        <div class="panel-header" v-show="panelType !== 'year'">
                            <div class="arrow-left"></div>
                            <div class="year-month-box">
                                <span
                                    class="year-box"
                                >{{(tmpMonth + 2) > 12 ? (tmpYear + 1) : tmpYear}}</span>
                                <span
                                    class="month-box"
                                >{{(tmpMonth + 2) > 12 ? 1 : (tmpMonth + 2) | month(language)}}</span>
                            </div>
                            <div class="arrow-right">
                                <span @click="nextMonthPreview()" class="iconfont icon-jiantouyou hover"></span>
                                <span @click="nextYearPreview()" class="iconfont icon-shuangjiantouyou hover"></span>
                            </div>
                        </div>
                        <div class="type-date" v-show="panelType === 'date'">
                            <ul class="weeks">
                                <li v-for="item in weekList" :key="item">{{item | week(language)}}</li>
                            </ul>
                            <ul class="date-list">
                                <li
                                    v-for="(item, index) in dateEndList"
                                    :key="index"
                                    :class="{preMonth: item.previousMonth, nextMonth: item.nextMonth,
                                        invalid: validateDate(item), firstItem: (index % 7) === 0}"
                                    @click="selectDate(item, 'end')"
                                >
                                    <div
                                        class="msg-day"
                                        :class="{selected: isSelected(item, 'end'), active: isActive(item, 'end')}"
                                    >
                                        <div class="bg"></div>
                                        <span v-text="item.value"></span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="clearfix" v-show="!isSelectDate">
                    <div class="grid-6">
                        <drop-down-time
                            ref="startTime"
                            :hour="tmpStartHour"
                            :minute="tmpStartMinute"
                            type="start"
                            @on-change-back="setTime"
                        >{{_('Start Time')}}</drop-down-time>
                    </div>
                    <div class="grid-6">
                        <drop-down-time
                            ref="endTime"
                            :hour="tmpEndHour"
                            :minute="tmpEndMinute"
                            type="end"
                            @on-change-back="setTime"
                        >{{_('End Time')}}</drop-down-time>
                    </div>
                </div>
                <div class="date-btn-group clearfix">
                    <div class="date-footer-group">
                        <div class="grid-6">
                            <div v-if="isDate && isTime">
                                <v-button
                                    css="text-left btn-normal-color"
                                    :callback="changeType"
                                    :title="isSelectDate ? _('Select Time') : _('Select Date')"
                                ></v-button>
                            </div>
                            <div v-else>
                                <span>&nbsp;</span>
                            </div>
                        </div>
                        <div class="text-right grid-6">
                            <v-button :callback="clear" :title="_('Clear All')" css="btn-normal-color"></v-button>
                            <v-button css="btn-active-color" :callback="setDate" :title="_('Confirm')"></v-button>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import dropDownTime from "./dropdown-time";
export default {
  name: "datetimepicker",
  components: {
    "drop-down-time": dropDownTime
  },
  data() {
    return {
      showCancel: false,
      panelState: false,
      panelType: "date",
      dropdownTop: 0,
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
      rangeStart: false,
      isSelectDate: true,
      hasSecond: false,
      tmpStartHour: "",
      tmpStartMinute: "",
      tmpStartSecond: "",
      tmpEndHour: "",
      tmpEndMinute: "",
      tmpEndSecond: ""
    };
  },
  props: {
    language: { default: "en" },
    min: { default: "2000-01-01" },
    max: { default: "2037-12-31" },
    name: { type: String },
    value: {
      type: [Array, String],
      default() {
        return ["", ""];
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    range: {
      type: Boolean,
      default: false
    },
    isDate: {
      type: Boolean,
      default: true
    },
    isTime: {
      type: Boolean,
      default: true
    },
    inputClass: { type: String }
  },
  created() {
    this.setOptionVal();
  },

  methods: {
    _(n){
      return n;
    },
    setOptionVal() {
      let now = new Date();
      let startDate, endDate, year, month, date, tmpYear, tmpMonth, tmpStartYear, tmpStartMonth, tmpStartDate, tmpEndYear, tmpEndMonth, tmpEndDate, tmpStartHour, tmpStartMinute, tmpStartSecond, tmpEndHour, tmpEndMinute, tmpEndSecond;

      startDate = this.value[0] ? new Date(this.value[0].replace(/[-]/g, "/")) : now;
      endDate = this.value[1] ? new Date(this.value[1].replace(/[-]/g, "/")) : now;

      year = startDate.getFullYear();
      month = startDate.getMonth();
      date = startDate.getUTCDate();

      tmpYear = startDate.getFullYear();
      tmpMonth = startDate.getMonth();

      tmpStartYear = startDate.getFullYear();
      tmpStartMonth = startDate.getMonth();
      tmpStartDate = startDate.getDate();

      tmpEndYear = endDate.getFullYear();
      tmpEndMonth = endDate.getMonth();
      tmpEndDate = endDate.getDate();
      if (this.isDate) {
        tmpStartHour = this.value[0] ? startDate.getHours() : "00";
        tmpStartMinute = this.value[0] ? startDate.getMinutes() : "00";
        tmpStartSecond = startDate.getSeconds();
        tmpEndHour = this.value[1] ? endDate.getHours() : "23";
        tmpEndMinute = this.value[1] ? endDate.getMinutes() : "59";
        tmpEndSecond = endDate.getSeconds();
      } else if (this.isTime) {
        tmpStartHour = this.value[0].split(":")[0] || "00";
        tmpStartMinute = this.value[0].split(":")[1] || "00";
        tmpEndHour = this.value[1].split(":")[0] || "23";
        tmpEndMinute = this.value[1].split(":")[1] || "59";
      }

      this.year = year;
      this.month = month;
      this.date = date;
      this.tmpYear = tmpYear;
      this.tmpMonth = tmpMonth;
      this.tmpStartYear = tmpStartYear;
      this.tmpStartMonth = tmpStartMonth;
      this.tmpStartDate = tmpStartDate;
      this.tmpStartHour = tmpStartHour;
      this.tmpStartMinute = tmpStartMinute;
      this.tmpStartSecond = tmpStartSecond;

      this.tmpEndYear = tmpEndYear;
      this.tmpEndMonth = tmpEndMonth;
      this.tmpEndDate = tmpEndDate;
      this.tmpEndHour = tmpEndHour;
      this.tmpEndMinute = tmpEndMinute;
      this.tmpEndSecond = tmpEndSecond;
    },
    togglePanel() {
      if (this.disabled) {
        this.panelState = false;
        return;
      }
      this.panelState = !this.panelState;
      this.rangeStart = false;
      if (this.isDate) {
        this.isSelectDate = true;
      } else if (this.isTime) {
        this.$nextTick(function () {
          this.$refs.startTime.setPosition();
          this.$refs.endTime.setPosition();
        });
      }
    },
    isSelected(item, type) {
      //判断是否在起始日期内
      let month = this.tmpMonth;

      if (type === "end") {
        month += 1;
      }

      if (item.previousMonth || item.nextMonth) {
        return false;
      }

      //第一次点击后
      if (this.rangeStart) {
        if (this.tmpStartMonth === month && this.tmpStartDate === item.value) {
          return true;
        }
        return false;
      }
      return new Date(this.tmpYear, month, item.value).getTime() >= new Date(this.tmpStartYear, this.tmpStartMonth, this.tmpStartDate).getTime() && new Date(this.tmpYear, month, item.value).getTime() <= new Date(this.tmpEndYear, this.tmpEndMonth, this.tmpEndDate).getTime();
    },
    isActive(item, type) {
      //判断是否是开始、结束日期
      let month = this.tmpMonth;

      if (type === "end") {
        month += 1;
      }

      if (item.previousMonth || item.nextMonth) {
        return false;
      }

      if (this.rangeStart) {
        if (this.tmpStartYear === this.tmpYear && this.tmpStartMonth === month && this.tmpStartDate === item.value) {
          return true;
        }
        return false;
      }

      return new Date(this.tmpYear, month, item.value).getTime() == new Date(this.tmpStartYear, this.tmpStartMonth, this.tmpStartDate).getTime() || new Date(this.tmpYear, month, item.value).getTime() == new Date(this.tmpEndYear, this.tmpEndMonth, this.tmpEndDate).getTime();
    },
    prevMonthPreview() {
      //上一月
      if (this.tmpMonth === 0) {
        if (this.tmpYear <= this.minYear) {
          this.tmpYear = this.minYear;
          return;
        }
        this.tmpYear -= 1;
        this.tmpMonth = 11;
      } else {
        this.tmpMonth -= 1;
      }
    },
    prevYearPreview() {
      //上一年
      if (this.tmpYear <= this.minYear) {
        this.tmpYear = this.minYear;
        return;
      }
      this.tmpYear -= 1;
    },
    nextMonthPreview() {
      //下一月
      if (this.tmpYear >= this.maxYear) {
        if (this.maxMonth === 1) {
          this.tmpYear = this.maxYear - 1;
          this.tmpMonth = 11;
          return;
        }
        if (this.tmpMonth >= this.maxMonth - 2) {
          this.tmpYear = this.maxYear;
          return;
        }
      }
      if (this.tmpMonth === 11) {
        this.tmpYear += 1;
        this.tmpMonth = 0;
      } else {
        this.tmpMonth += 1;
      }
    },
    nextYearPreview() {
      //下一年
      if (this.tmpYear >= this.maxYear) {
        this.tmpYear = this.maxYear;
        return;
      }
      this.tmpYear += 1;
    },

    selectDate(date, type) {
      //选择日期

      if (this.validateDate(date)) return;

      if (!this.rangeStart) {
        //第一次点击
        this.tmpStartYear = this.tmpYear;
        this.tmpStartMonth = this.tmpMonth;
        if (type === "end") {
          //点击右边的时间
          this.tmpStartMonth += 1;
        }
        if (date.previousMonth) {
          this.tmpStartMonth -= 1;
        } else if (date.nextMonth) {
          this.tmpStartMonth += 1;
        }

        if (this.tmpStartMonth >= 12) {
          this.tmpStartMonth = 0;
          this.tmpStartYear += 1;
        }

        this.tmpStartDate = date.value;
        this.rangeStart = true;
      } else {
        //第二次点击
        this.tmpEndYear = this.tmpYear;
        this.tmpEndMonth = this.tmpMonth;
        this.tmpEndDate = date.value;
        if (date.previousMonth) {
          this.tmpEndMonth -= 1;
        } else if (date.nextMonth) {
          this.tmpEndMonth += 1;
        }
        if (type === "end") {
          this.tmpEndMonth += 1;
          if (this.tmpEndMonth >= 12) {
            this.tmpEndMonth = 0;
            this.tmpEndYear += 1;
          }
        }
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
        this.rangeStart = false;
      }
    },
    setDate() {
      //设置时间，点击确定
      let rangeStart = "",
          rangeEnd = "";

      if (this.isDate) {
        //支持日期选择
        rangeStart += `${this.tmpStartYear}-${("0" + (this.tmpStartMonth + 1)).slice(-2)}-${("0" + this.tmpStartDate).slice(-2)} `;
        rangeEnd += `${this.tmpEndYear}-${("0" + (this.tmpEndMonth + 1)).slice(-2)}-${("0" + this.tmpEndDate).slice(-2)} `;
      }

      if (this.isTime) {
        //支持时间选择
        rangeStart += `${("0" + this.tmpStartHour).slice(-2)}:${("0" + this.tmpStartMinute).slice(-2)}`;
        rangeEnd += `${("0" + this.tmpEndHour).slice(-2)}:${("0" + this.tmpEndMinute).slice(-2)}`;
      }

      let value = [rangeStart, rangeEnd];
      this.$emit("input", value);
      this.$emit("on-change-back", value);
      this.panelState = false;
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
      if (this.isDate) {
        this.isSelectDate = true;
      }
    },
    clear() {
      //清空
      if (this.disabled) {
        return;
      }
      this.$emit("input", ["", ""]);
    },
    changeType() {
      //时间日期切换
      this.isSelectDate = !this.isSelectDate;
      if (!this.isSelectDate) {
        this.$refs.startTime.setPosition();
        this.$refs.endTime.setPosition();
      }
    },
    setTime(options) {
      //选择时间
      if (options.type == "start") {
        this.tmpStartHour = options.hour;
        this.tmpStartMinute = options.minute;
      } else {
        this.tmpEndHour = options.hour;
        this.tmpEndMinute = options.minute;
      }
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
    value(newVal, oldVal) {
      if (newVal === oldVal) return;
      this.$emit("input", newVal);
      this.setOptionVal();
    },
    panelState: {
      handler(newVal) {
        if (newVal) {
          this.$nextTick(function () {
            let dropdownHeight = this.$refs.panel.offsetHeight,
                inputRect = this.$refs.input.getBoundingClientRect(),
                bodyHeight = document.body.clientHeight;
            if (inputRect.bottom + dropdownHeight > bodyHeight) {
              this.dropdownTop = 0 - dropdownHeight - 8;
            } else {
              this.dropdownTop = inputRect.height;
            }
          });
        }
      }
    }
  },
  computed: {
    hasPlaceholder() {
      var i = document.createElement("input");
      return "placeholder" in i;
    },
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
    },
    dateEndList() {
      let currentMonthLength = new Date(this.tmpYear, this.tmpMonth + 2, 0).getDate();
      let dateList = Array.from({ length: currentMonthLength }, (val, index) => {
        return {
          currentMonth: true,
          value: index + 1
        };
      });
      let startDay = new Date(this.tmpYear, this.tmpMonth + 1, 1).getDay();
      let previousMongthLength = new Date(this.tmpYear, this.tmpMonth + 1, 0).getDate();

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
    });
    if (!this.isDate && this.isTime) {
      this.isSelectDate = false;
    }
  }
};
</script>

<style lang="scss">
ul {
    padding: 0;
    margin: 0;
    list-style: none;
}
.datetime-picker {
    position: relative;
    display: inline-block;
    height: 32px;
    // width: $elem-width * 2 !important;
    .placeholder-text {
        cursor: pointer;
    }
}
.input {
    height: 100%;
    width: 100%;
    font-size: inherit;
    padding-left: 4px;
    box-sizing: border-box;
    outline: none;
}

.datetime-panel {
    box-sizing: border-box;
    box-sizing: border-box;
    background-color: #fff;
    user-select: none;
    transform: translateY(4px);
    .arrow-left {
      display: inline-block;
      padding-left: 12px;
      width: 20%;
    }
    .arrow-right {
      display: inline-block;
      padding-left: 7px;
      width: 20%;
      text-align: right;
      // span {
      //   transform: rotate3d(0, 0, 1, 180deg);
      // }
    }
    .year-month-box {
        width: 54%;
    }
}
.date-btn-group {
    position: relative;
    top: 0;
    padding: 8px 0;
    border-top: 1px solid #eee;
    .date-footer-group {
        margin: 0 10px;
    }
    .btn-text {
        border: none;
        &:hover {
            border: none;
            color: $main-active-color;
        }
    }
}

.hover {
    display: inline-block;
    &:hover {
        color: $main-active-color;
        transform: scale(1.2);
    }
}

//新添组合样式:

//日期选择器样式:
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
.grid-6 {
    width: 50%;
    float: left;
}
//time-picker样式,时间选择器样式
.time-picker {
    display: inline-block;
    position: relative;
    width: 245px;
    font-family: sans-serif;
    vertical-align: middle;
    input.display-time {
        width: 100%;
        height: 30px;
        cursor: pointer;
    }
    .clear-btn {
        position: absolute;
        right: 8px;
        top: 0;
        line-height: 30px;
        text-align: center;
        color: #ccc;
        transition: color 0.2s;
        &:hover {
            color: #797979;
            cursor: pointer;
        }
    }
    .time-picker-overlay {
        z-index: 2;
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
    .dropdown {
        position: absolute;
        z-index: 5;
        top: 32px;
        left: 0;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.15);
        width: 100%;
        height: 200px;
        font-weight: normal;
        .select-list {
            width: 100%;
            height: 200px;
            overflow: hidden;
        }
        ul {
            padding: 0;
            margin: 0;
            list-style: none;
            height: 100%;
            overflow-x: hidden;
            overflow-y: auto;
               
            &.minutes, &.seconds, &.apms {
                border-left: 1px solid #fff;
            }
                /* 设置滚动条的样式 */
            &::-webkit-scrollbar {
                width: 4px;
                height: 4px;
            }
            
            /* 滚动条滑块 */
            &::-webkit-scrollbar-thumb {
                border-radius: 2px;
                background: rgba(0, 0, 0, 0.1);
            }
            /* 滚动槽 */
            &::-webkit-scrollbar-track {
                box-shadow: inset 0 0 6px rgba(0, 0, 0, 0);
                border-radius: 4px;
            }
        }
    }
}

.time-picker .dropdown ul li {
    text-align: center;
    line-height: 32px;
    height: 32px;
    color: #161616;
}

.time-picker .dropdown ul li:not(.hint):hover {
    background: rgba(#e9e9e9, .5);
    color: #161616;
    cursor: pointer;
}

.time-picker .dropdown ul li.active,
.time-picker .dropdown ul li.active:hover {
    background: rgba(#e9e9e9, .5);
    color: $main-active-color;
}

.time-picker .dropdown .hint {
    color: #a5a5a5;
    cursor: default;
    font-size: 12px;
}
//箭头样式:
.icon-jiantouzuo,.icon-jiantouyou {
  font-size: 13px;
  font-weight: bold;
}
</style>

