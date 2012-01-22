/*jshint expr:true */
var Table = (function () {
  function Table(maximumCapacity) {
    maximumCapacity || (maximumCapacity = 8);
    this.maximumCapacity = maximumCapacity;
    this.guests = new Guests();
  }

  Table.prototype.remainingCapacity = function () {
    return this.maximumCapacity - this.guests.totalQuantity();
  };

  Table.prototype.add = function (guest) {
    var quantity = guest.quantity || Guest.DEFAULT_QUANTITY;

    if(quantity <= this.remainingCapacity()) {
      this.guests.add(guest);
    } else {
      throw new Error("Cannot add this guest, not enough space left");
    }

    return this;
  };

  Table.prototype.remove = function (guest) {
    this.guests.remove(guest);
  };

  Table.prototype.toString = function () {
    return this.guests.toString();
  };

  Table.prototype.empty = function () {
    this.guests.empty();
  };
  
  return Table;
})();


