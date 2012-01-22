var Guests = (function () {
  function Guests() {
    this.guests = [];
  }

  Guests.prototype.clone = function () {
    var g = new Guests();
    g.guests = _.clone(this.guests);

    return g;
  };

  Guests.prototype.shuffle = function () {
    this.guests = _.shuffle(this.guests);
    return this;
  };

  Guests.prototype.shuffle = function () {
    this.guests = _.shuffle(this.guests);
    return this;
  };

  Guests.prototype.sortBy = function (iterator, context) {
    this.guests = _.sortBy(this.guests, iterator, context);
    return this;
  };

  Guests.prototype.toString = function () {
    var guestsStr = this.reduce(function (str, guest) {
      return str + (str.length <= 0 ? '' : ',') + guest.name;
    }, "");
    return '[' + guestsStr + ']';
  };

  Guests.prototype.add = function (name, quantity) {
    var gs = [], that = this;
    if (!(name instanceof Array)) {
      // single add
      if(typeof name === 'string') {
        // guest.add('a_guest'...)
        gs.push({name: name, quantity: quantity});
      } else {
        // guest.add(new Guest('another', 3))
        gs.push(name);
      }
    } else {
      // Mass assignement
      gs = name;
    }

    _.each(gs, function(guest) {
      var n, q;
      if (typeof guest === 'string') {
        n = guest;
      } else {
        n = guest.name;
        q = guest.quantity;
      }

      that.guests.push(new Guest(n, q));
    });


    return this;
  };

  Guests.prototype.remove = function (name) {
    this.guests = _.reject(this.guests, function (guest) {
      return guest.name === name;
    });
    return this;
  };

  Guests.prototype.length = function () {
    return this.guests.length;
  };

  Guests.prototype.get = function (name) {
    return _.first(_.filter(this.guests, function (guest) {
        return guest.name === name;
    }));
  };

  Guests.prototype.each = function (iterator, context) {
    return _.each(this.guests, iterator, context);
  };
  Guests.prototype.reject = function (iterator, context) {
    return _.reject(this.guests, iterator, context);
  };
  Guests.prototype.reduce = function (iterator, memo, context) {
    return _.reduce(this.guests, iterator, memo, context);
  };

  Guests.prototype.totalQuantity = function () {
    return this.reduce(function (sum, guest) {
      return sum + guest.quantity;
    }, 0);
  };

  Guests.prototype.empty = function () {
    this.guests = [];
  };

  return Guests;
})();
