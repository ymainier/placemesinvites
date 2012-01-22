describe('Reception', function () {
  it('consists in guests, tables and affinities', function () {
    var reception = new Reception();

    expect(reception.guests).toBeA(Guests);
    expect(reception.tables).toBeA(Tables);
    expect(reception.affinities).toBeA(Affinities);
  });

  it('places a people on the best table for him', function () {
    var reception = new Reception(), t;

    reception.affinities.dislike('a', 'b').like('a', 'd');
    reception.tables = new Tables(4, 4);
    t = reception.tables.tables;
    t[1].add('b');
    t[2].add('c');
    t[3].add('d');

    reception.place({name: 'a', quantity: 2});

    expect(t[0].guests.get('a')).toBeUndefined();
    expect(t[1].guests.get('a')).toBeUndefined();
    expect(t[2].guests.get('a')).toBeUndefined();
    expect(t[3].guests.get('a').name).toBe('a');
  });

  it('can specify the maximum number of table and the maximum number of guest per table', function () {
    var reception = new Reception(10, 8);

    expect(reception.tables.tables.length).toBe(10);
    _.each(reception.tables.tables, function (table) {
      expect(table.maximumCapacity).toBe(8);
    });
  });

  it('can place all guests', function () {
    var reception = new Reception(2, 4),
      t = reception.tables.tables;

    reception.guests.add(['a', 'b', 'c']);
    reception.affinities.dislike('a', 'b').like('a', 'c');
    reception.placeAllGuests();

    expect(t[0].guests.get('a').name).toBe('a');
    expect(t[0].guests.get('c').name).toBe('c');
    expect(t[1].guests.get('b').name).toBe('b');
  });

  describe('Exchange', function () {
    it('is null to exchange the same guest', function () {
      var r = new Reception(2, 4), g, t1, t2;
      r.guests.add('1');

      g = r.guests.get('1');
      t1 = r.tables.tables[0];
      t2 = r.tables.tables[1];

      expect(r.scoreIfExchange(g, t1, g, t2)).toBe(0);
    });

    it('is null to exchange at the same table', function () {
      var r = new Reception(2, 4), g1, g2, t;
      r.guests.add(['1', '2']);

      g1 = r.guests.get('1');
      g2 = r.guests.get('2');
      t = r.tables.tables[0];

      expect(r.scoreIfExchange(g1, t, g2, t)).toBe(0);
    });

    it('gives a score', function () {
      var r = new Reception(2, 4), a, b, c, d, t1, t2;
      r.guests.add(['a', 'b', 'c', 'd']);

      r.tables.tables[0].add('a').add('b');
      r.tables.tables[1].add('c').add('d');

      r.affinities.like('a', 'c').dislike('c', 'b');

      a = r.guests.get('a');
      b = r.guests.get('b');
      c = r.guests.get('c');
      d = r.guests.get('d');

      t1 = r.tables.tables[0];
      t2 = r.tables.tables[1];

      expect(r.scoreIfExchange(a, t1, d, t2)).toBe(200);
      expect(r.scoreIfExchange(a, t1, c, t2)).toBe(-200);
    });

    it('gives an infinite negative score if exchange is not possible', function () {
      var r = new Reception(2, 5), a, c, d, t1, t2;
      r.guests.add([{name: 'a', quantity: 3}, 'b', {name: 'c', quantity: 3}, 'd']);
      a = r.guests.get('a');
      c = r.guests.get('c');
      d = r.guests.get('d');

      r.tables.tables[0].add(a).add('b');
      r.tables.tables[1].add(c).add('d');

      t1 = r.tables.tables[0];
      t2 = r.tables.tables[1];

      expect(r.scoreIfExchange(a, t1, d, t2)).toBe(-Infinity);
    });
    

    it('gives the best exchange for a guest at a table', function () {
      var r = new Reception(3, 4), a, b, c, d, t1, t2, bestExchange;
      r.guests.add(['a', 'b', 'c', 'd']);

      r.tables.tables[0].add('a').add('b');
      r.tables.tables[1].add('c').add('d');

      r.affinities.like('a', 'c').dislike('c', 'b');

      a = r.guests.get('a');
      b = r.guests.get('b');
      c = r.guests.get('c');
      d = r.guests.get('d');

      t1 = r.tables.tables[0];
      t2 = r.tables.tables[1];

      bestExchange = r.bestExchange(a, t1);

      expect(bestExchange.guest).toEqual(d);
      expect(bestExchange.table).toBe(t2);
      expect(bestExchange.score).toBeGreaterThan(0);
    });

    it('gives nothing if there is no better exchange for a guest at a table', function () {
      var r = new Reception(2, 4), a, b, c, d, t1, t2, bestExchange;
      r.guests.add(['a', 'b', 'c', 'd']);

      r.tables.tables[0].add('a').add('b');
      r.tables.tables[1].add('c').add('d');

      r.affinities.dislike('a', 'c').dislike('c', 'b');

      a = r.guests.get('a');
      b = r.guests.get('b');
      c = r.guests.get('c');
      d = r.guests.get('d');

      t1 = r.tables.tables[0];
      t2 = r.tables.tables[1];

      bestExchange = r.bestExchange(a, t1);

      expect(bestExchange).toBeUndefined();
    });

    it('can perform an exchange', function () {
      var r = new Reception(3, 4), a, c;
      r.guests.add(['a', 'b', 'c', 'd']);
      a = r.guests.get('a');
      c = r.guests.get('c');

      r.tables.tables[0].add('a').add('b');
      r.tables.tables[1].add('c').add('d');
      
      r.exchange(a, r.tables.tables[0], c, r.tables.tables[1]);

      expect(r.tables.tables[0].guests.get('c').name).toBe('c');
      expect(r.tables.tables[1].guests.get('a').name).toBe('a');
    });
  });

  it('can find the table and the guest by its name or a reference', function () {
    var r = new Reception(3, 4), found;
    r.guests.add(['a', 'b', 'c']);
    r.tables.tables[0].add('a');
    r.tables.tables[1].add('b');
    r.tables.tables[2].add('c');

    found = r.find('c');
    expect(found.guest).toEqual(r.guests.get('c'));
    expect(found.table).toBe(r.tables.tables[2]);
  });

  it('can switch place if there is a free place', function () {
    var r = new Reception(2, 4), a, t1, t2;
    r.guests.add(['a', 'b']);
    r.tables.tables[0].add('a').add('b');
    r.affinities.dislike('a', 'b');

    a = r.guests.get('a');
    t1 = r.tables.tables[0];
    t2 = r.tables.tables[1];

    expect(r.scoreIfSwitch(a, t1, t2)).toBe(200);;
  });

});

