const valid = {
  num: function (str, min, max) {
    if (isNaN(Number(str))) {
      return "只能包含数字"
    }
  }
}

export default valid