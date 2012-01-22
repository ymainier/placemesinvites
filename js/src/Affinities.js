var Affinities = (function () {
  function Affinities() {
    this.people = {};
  }

  function nameIfItExists(value) {
    return value.name || value;
  }

  Affinities.prototype.setScores = function (someone, someoneElse, score) {
    var someoneName = nameIfItExists(someone);
    var someoneElseName = nameIfItExists(someoneElse);

    if (!this.people[someoneName]) {
      this.people[someoneName] = {};
    }
    this.people[someoneName][someoneElseName] = score;

    return this;
  };
  Affinities.prototype.setMutualScores = function (someone, someoneElse, score) {
    this.setScores(someone, someoneElse, score);
    this.setScores(someoneElse, someone, score);
    return this;
  };

  Affinities.prototype.score = function (someone, someoneElse) {
    var someoneName, someoneElseName, that, guestList;

    if (!(someoneElse instanceof Guests)) {
      // score of someone with someone else
      someoneName = nameIfItExists(someone);
      someoneElseName = nameIfItExists(someoneElse);

      if (!this.people[someoneName] || !this.people[someoneName][someoneElseName]) {
        return Affinities.defaultLevel;
      } else {
        return this.people[someoneName][someoneElseName];
      }
    } else {
      // Score of someone with a group
      that = this;
      guestList = someoneElse;
      return guestList.reduce(function (scoreSoFar, guest) {
        return scoreSoFar + that.score(someone, guest);
      }, 0);
    }
  };

  Affinities.prototype.scoreOfGuests = function (guests) {
    var score = 0, that = this;

    guests.each(function (guest) {
      score += that.score(guest, guests);
    });

    return score;
  };

  Affinities.prototype.tableScore = function (table) {
    return this.scoreOfGuests(table.guests);
  };

  Affinities.prototype.tablesScore = function (tables) {
    var that = this;

    return _.reduce(tables.tables, function (sum, table) {
      return sum + that.tableScore(table);
    }, 0);
  };

  Affinities.level = {
    LIKE: 100,
    COULD_LIKE: 10,
    NEUTRAL: 0,
    COULD_DISLIKE: -10,
    DISLIKE: -100
  };

  // Define method like, couldLike, couldDislike, dislike and incidentally neutral
  _.each(Affinities.level, function (_score, level) {
    var levelParts = level.split('_');
    var methodName = levelParts[0].toLowerCase() + _.map(levelParts.slice(1), function (lp) {
      return lp[0].toUpperCase() + lp.slice(1).toLowerCase();
    }).join('');

    Affinities.prototype[methodName] = function (someone, someoneElse) {
      this.setMutualScores(someone, someoneElse, Affinities.level[level]);
      return this;
    };
  });
  

  Affinities.defaultLevel = Affinities.level.NEUTRAL;

  return Affinities;
})();

