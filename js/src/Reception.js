var Reception = (function () {
  function Reception(nbTable, maxCapacity) {
    this.guests = new Guests();
    this.tables = new Tables(nbTable, maxCapacity);
    this.affinities = new Affinities();
  }

  Reception.prototype.place = function (guest) {
    var bestScore = -Infinity, bestTable = -1, that = this;

    _.each(this.tables.tables, function (table, tableIndex) {
      if (table.remainingCapacity() >= guest.quantity) {
        var score = that.affinities.score(guest.name, table.guests);
        if (score > bestScore) {
          bestScore = score;
          bestTable = tableIndex;
        }
      }
    });

    if (bestTable >= 0) {
      this.tables.tables[bestTable].add(guest);
      return bestTable;
    } else {
      throw new Error('Not enough space left');
    }
  };

  Reception.prototype.placeAllGuests = function () {
    var guests = _.clone(this.guests), that = this;

    guests.each(function (guest) {
      that.place(guest);
    });
  };

  Reception.prototype.scoreIfExchange = function (guest1, table1, guest2, table2) {
    var guests1, guests2;

    if (guest1 === guest2 || table1 === table2) {
      return 0;
    } else {
      guests1 = table1.guests.clone().remove(guest1.name).add(guest2);
      guests2 = table2.guests.clone().remove(guest2.name).add(guest1);

      if(guests1.totalQuantity() > table1.maximumCapacity ||
         guests2.totalQuantity() > table2.maximumCapacity) {
        return -Infinity;
      }

      return this.affinities.scoreOfGuests(guests1) + this.affinities.scoreOfGuests(guests2) -
        (this.affinities.tableScore(table1) + this.affinities.tableScore(table2));
    }
  };

  Reception.prototype.bestExchange = function (guest1, table1) {
    var bestScore = -Infinity, bestGuest, bestTable, setBest;

    this.tables.eachGuest(function (guest, table) {
      var score = this.scoreIfExchange(guest1, table1, guest, table);
      if (score >= bestScore && table !== table1) {
        bestScore = score;
        bestGuest = guest;
        bestTable = table;
      }
    }, this);

    if (bestScore >= 0 && bestTable !== table1) {
      return {
        guest: bestGuest,
        table: bestTable,
        score: bestScore
      };
    }
  };

  Reception.prototype.exchange = function (guest1, table1, guest2, table2) {
    table1.guests.remove(guest1.name).add(guest2);
    table2.guests.remove(guest2.name).add(guest1);
  };

  Reception.prototype.scoreIfSwitch = function (guest, table1, table2) {
    var guest1, guest2;

    if (table1 === table2) {
      return 0;
    } else if (table2.remainingCapacity() < guest.quantity) {
      return -Infinity;
    } else {
      guests1 = table1.guests.clone().remove(guest.name);
      guests2 = table2.guests.clone().add(guest);
      
      return this.affinities.scoreOfGuests(guests1) + this.affinities.scoreOfGuests(guests2) -
        (this.affinities.tableScore(table1) + this.affinities.tableScore(table2));
    }
  };

  Reception.prototype.bestSwitch = function (guest1, table1) {
    var bestScore = -Infinity, bestGuest, bestTable, setBest;

    this.tables.eachTable(function (table) {
      var score = this.scoreIfSwitch(guest1, table1, table);
      if (score >= bestScore && table !== table1) {
        bestScore = score;
        bestTable = table;
      }
    }, this);

    if (bestScore >= 0 && bestTable !== table1) {
      return {
        table: bestTable,
        score: bestScore
      };
    }
  };

  Reception.prototype.switchOver = function (guest, table1, table2) {
    table1.guests.remove(guest.name);
    table2.guests.add(guest);
  };

  Reception.prototype.score = function () {
    return this.affinities.tablesScore(this.tables);
  };

  Reception.prototype.find = function (guest) {
    var g, t,
      name = guest.name || guest;

    this.tables.eachGuest(function (guest, table) {
      if (guest.name === name) {
        g = guest;
        t = table;
      }
    });

    if (g && t) {
      return {
        guest: g,
        table: t
      };
    }
  };

  Reception.prototype.exchangeRound = function () {
    this.guests.each(function (guest) {
      var guestAndTable = this.find(guest), betterMate;
      if (guestAndTable) {
        betterMate = this.bestExchange(guestAndTable.guest, guestAndTable.table);
        betterTable = this.bestSwitch(guestAndTable.guest, guestAndTable.table);
        if ((betterMate && betterTable && betterMate.score > betterTable.score) || 
            (betterMate && !betterTable)) {
          this.exchange(guestAndTable.guest, guestAndTable.table, betterMate.guest, betterMate.table);
        } else if ((betterMate && betterTable && betterTable.score >= betterMate.score) || 
                   (!betterMate && betterTable)) {        
          this.switchOver(guestAndTable.guest, guestAndTable.table, betterTable.table);
        }
      }
    }, this);
  };

  return Reception;
})();

