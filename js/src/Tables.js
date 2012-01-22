var Tables = (function () {
  function Tables(nbTable, maxCapacity) {
    var that = this;
    this.tables = [];
    _.times(nbTable, function () {
      that.tables.push(new Table(maxCapacity));
    });
  }

  Tables.prototype.remainingCapacity = function () {
    return _.reduce(this.tables, function (sum, table) {
      return sum + table.remainingCapacity();
    }, 0);
  };

  Tables.prototype.toString = function () {
    var tablesStr = _.map(this.tables, function (table) {
      return table.toString();
    });
    return '<' + tablesStr.join(';') + '>';
  };

  Tables.prototype.empty = function () {
    _.each(this.tables, function (table) {
      table.empty();
    });
  };

  Tables.prototype.eachTable = function (iterator, context) {
    _.each(this.tables, iterator, context);
  };

  Tables.prototype.eachGuest = function (iterator, context) {
    var that = this;

    _.each(this.tables, function (table) {
      table.guests.each(function (guest) {
        iterator.call(context, guest, table, table.guests, that.tables);
      });
    });
  };

  return Tables;
})();

