describe('Table', function () {
  it('initially does not have any guest and have a default maximum capacity of 8', function () {
    var t = new Table();

    expect(t.guests.length()).toBe(0);
    expect(t.maximumCapacity).toBe(8);
  });

  it('initially has a remaining capacity that is the maximum capacity', function () {
    var t = new Table();

    expect(t.remainingCapacity()).toBe(t.maximumCapacity);
  });

  it('guests can be added to a table', function () {
    var t = new Table(8);

    t.add('guest1');
    expect(t.remainingCapacity()).toBe(6);
    t.add({name: 'guest2', quantity: 3});
    expect(t.remainingCapacity()).toBe(3);
    t.add(new Guest('guest3', 1));
    expect(t.remainingCapacity()).toBe(2);
  });
  
  it('Guest can be removed from a table', function () {
    var t = new Table(10);

    t.add({name: 'Bob', quantity: 8});
    expect(t.remainingCapacity()).toBe(2);
    t.remove('Bob');
    expect(t.remainingCapacity()).toBe(10);
  });

  it('Guest can be added to a table when it is exctly the remaining capacity', function () {
    var t = new Table(4);

    t.add(new Guest('g', 2));
    expect(t.remainingCapacity()).toBe(2);
    expect(function () {
      t.add('two people');
    }).not.toThrow(/* anything */);
    expect(t.remainingCapacity()).toBe(0);
  });

  it('Guest cannot be added if its quantity is above the remaining capacity of the table', function () {
    var t = new Table(4);
    var anException;

    t.add(new Guest('g', 3));
    expect(t.remainingCapacity()).toBe(1);
    expect(function () {
      t.add('two people');
    }).toThrow(anException);
    expect(t.remainingCapacity()).toBe(1);
  });

  it('can chain add call', function () {
    var t = new Table();

    expect(function () {
      t.add('1').add('2');
    }).not.toThrow(/* anything */);
  });

  it('can be emptied', function () {
    var t = new Table();
    var initialCapacity = t.remainingCapacity();

    t.add('1').add('2').add('3');
    t.empty();

    expect(t.remainingCapacity()).toBe(initialCapacity);
  });

});
