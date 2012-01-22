/*jshint expr:true */
var Guest = (function () {
  function Guest(name, quantity) {
    quantity || (quantity = Guest.DEFAULT_QUANTITY);
    this.name = name;
    this.quantity = quantity;
  }

  Guest.DEFAULT_QUANTITY = 2;

  return Guest;
})();


