beforeEach(function () {
  this.addMatchers({
    toBeA: function (type) {
      return this.actual instanceof type;
    }
  });
});
