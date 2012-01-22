describe('Tables', function () {
  it('are initialized with the number of table and a maximum capacity for each table', function () {
    var t = new Tables(10, 8);

    expect(t.tables.length).toBe(10);

    _.each(t.tables, function (table) {
      expect(table.maximumCapacity).toBe(8);
    });
  });

  it('have a remaining capacity', function () {
    var t = new Tables(10, 8);
    expect(t.remainingCapacity()).toBe(80);

    t.tables[0].add('01');
    t.tables[1].add('11').add('12');
    // Remaining capacity is initial capacity minus 3 couple
    expect(t.remainingCapacity()).toBe(80 - 3 * 2);
  });

  it('can be emptied', function () {
    var t = new Tables(10, 8);
    var initialCapacity = t.remainingCapacity();

    t.tables[0].add('01').add('02');
    t.tables[1].add('11');
    t.tables[2].add('21').add('22').add('23');
    expect(t.remainingCapacity()).toBe(initialCapacity - 12);

    t.empty();
    expect(t.remainingCapacity()).toBe(initialCapacity);
  });
});
