'use strict';
var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var expect = chai.expect;
chai.use(sinonChai);

//// HELPERS

// lazy version of it
function ita(condition, expectation) {
  return it(condition, function(done) {
    setTimeout(function() {
      expectation();
      done();
    }, 1);
  });
}

//// SUT
var pathObserver = require('../src/pathObserver');

//// TESTS
describe('pathObserver', function() {

  var sandbox;
  var observed;
  var callback;

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    callback = sandbox.spy();
  });

  afterEach(function() {
    sandbox.restore();
  });

  describe('when observing an object', function() {

    beforeEach(function() {
      observed = {
        a:1,
        b:2
      };
      pathObserver(observed, callback);
    });

    describe('when adding a property', function() {

      beforeEach(function() {
        observed.c = 3;
      })

      ita('should call the callback with the add signature', function() {
        expect(callback).to.have.been.calledWith('c', 'add', 3, undefined);
      });
    });

    describe('when removing a property', function() {

      beforeEach(function() {
        delete observed.a;
      });

      ita('should call the callback with the delete signature', function() {
        expect(callback).to.have.been.calledWith('a', 'delete', undefined, 1);
      });
    });

    describe('when changing a property', function() {

      beforeEach(function() {
        observed.a = 2;
      });

      ita('should call the callback with the update signature', function() {
        expect(callback).to.have.been.calledWith('a', 'update', 2, 1);
      });
    });

  });
  
  describe('when observing an array', function() {

    beforeEach(function() {
      observed = [0,1,2];
      pathObserver(observed, callback);
    });

    describe('when pushing a value', function() {

      beforeEach(function() {
        observed.push(1);
      });

      ita('should call the callback with the add signature', function() {
        expect(callback).to.have.been.calledWith('3', 'add', 1, undefined);
      });
    });

    describe('when popping', function() {

      beforeEach(function() {
        observed.pop();
      });

      ita('should call the callback with the remove signature', function() {
        expect(callback).to.have.been.calledWith('2', 'remove', undefined, 2);
      });
    });

    describe('when unshifting', function() {

      beforeEach(function() {
        observed.unshift(2);
      });

      ita('should call the callback with the add signature', function() {
        expect(callback).to.have.been.calledWith('0', 'add', 2, undefined);
      });
    });

    describe('when shifting', function() {

      beforeEach(function() {
        observed.shift();
      });

      ita('should call the callback with the remove signature', function() {
        expect(callback).to.have.been.calledWith('0', 'remove', undefined, 0);
      });
    });

    describe('when changing a value', function() {

      beforeEach(function() {
        observed[1] = 9;
      });

      ita('should call the callback with the update signature', function() {
        expect(callback).to.have.been.calledWith('1', 'update', 9, 1);
      });
    });

    describe('when inserting a value', function() {

      beforeEach(function() {
        observed.splice(1,0,9);
      });

      ita('should call the callback with the add signature', function() {
        expect(callback).to.have.been.calledWith('1', 'add', 9, undefined);
      });
    });

  });

  describe('when observing a nested object', function() {

    beforeEach(function() {
      observed = {
        a:1,
        b:2,
        c: {
          a:1,
          b:2
        }
      };
      pathObserver(observed, callback);
    });

    describe('when adding a property', function() {

      beforeEach(function() {
        observed.c.c = 3;
      })

      ita('should call the callback with the add signature', function() {
        expect(callback).to.have.been.calledWith('c.c', 'add', 3, undefined);
      });
    });

    describe('when removing a property', function() {

      beforeEach(function() {
        delete observed.c.a;
      });

      ita('should call the callback with the delete signature', function() {
        expect(callback).to.have.been.calledWith('c.a', 'delete', undefined, 1);
      });
    });

    describe('when changing a property', function() {

      beforeEach(function() {
        observed.c.a = 2;
      });

      ita('should call the callback with the update signature', function() {
        expect(callback).to.have.been.calledWith('c.a', 'update', 2, 1);
      });
    });

  });
  
  describe('when observing a nested array', function() {

    var nestedArray;

    beforeEach(function() {
      observed = [0,[0,1,2],2];
      nestedArray = observed[1];
      pathObserver(observed, callback);
    });

    describe('when pushing a value to the nested array', function() {

      beforeEach(function() {
        nestedArray.push(1);
      });

      ita('should call the callback with the add signature', function() {
        expect(callback).to.have.been.calledWith('1.3', 'add', 1, undefined);
      });
    });

    describe('when popping from the nested array', function() {

      beforeEach(function() {
        nestedArray.pop();
      });

      ita('should call the callback with the remove signature', function() {
        expect(callback).to.have.been.calledWith('1.2', 'remove', undefined, 2);
      });
    });

    describe('when unshifting a value to the nested array', function() {

      beforeEach(function() {
        nestedArray.unshift(2);
      });

      ita('should call the callback with the add signature', function() {
        expect(callback).to.have.been.calledWith('1.0', 'add', 2, undefined);
      });
    });

    describe('when shifting from the nested array', function() {

      beforeEach(function() {
        nestedArray.shift();
      });

      ita('should call the callback with the remove signature', function() {
        expect(callback).to.have.been.calledWith('1.0', 'remove', undefined, 0);
      });
    });

    describe('when changing a value on the nested array', function() {

      beforeEach(function() {
        nestedArray[1] = 9;
      });

      ita('should call the callback with the update signature', function() {
        expect(callback).to.have.been.calledWith('1.1', 'update', 9, 1);
      });
    });

    describe('when inserting a value to the nested array', function() {

      beforeEach(function() {
        nestedArray.splice(1,0,9);
      });

      ita('should call the callback with the add signature', function() {
        expect(callback).to.have.been.calledWith('1.1', 'add', 9, undefined);
      });
    });

  });

  describe('when observing an object with child arrays', function() {

    var childArray;

    beforeEach(function() {
      observed = {
        a:1,
        b:2,
        c:[0,1,2]
      };
      childArray = observed.c;
      pathObserver(observed, callback);
    });

    describe('when pushing a value', function() {

      beforeEach(function() {
        childArray.push(1);
      });

      ita('should call the callback with the add signature', function() {
        expect(callback).to.have.been.calledWith('c.3', 'add', 1, undefined);
      });
    });

    describe('when popping', function() {

      beforeEach(function() {
        childArray.pop();
      });

      ita('should call the callback with the remove signature', function() {
        expect(callback).to.have.been.calledWith('c.2', 'remove', undefined, 2);
      });
    });

    describe('when unshifting a value', function() {

      beforeEach(function() {
        childArray.unshift(2);
      });

      ita('should call the callback with the add signature', function() {
        expect(callback).to.have.been.calledWith('c.0', 'add', 2, undefined);
      });
    });

    describe('when shifting', function() {

      beforeEach(function() {
        childArray.shift();
      });

      ita('should call the callback with the remove signature', function() {
        expect(callback).to.have.been.calledWith('c.0', 'remove', undefined, 0);
      });
    });

    describe('when changing a value', function() {

      beforeEach(function() {
        childArray[1] = 9;
      });

      ita('should call the callback with the update signature', function() {
        expect(callback).to.have.been.calledWith('c.1', 'update', 9, 1);
      });
    });

    describe('when inserting a value', function() {

      beforeEach(function() {
        childArray.splice(1,0,9);
      });

      ita('should call the callback with the add signature', function() {
        expect(callback).to.have.been.calledWith('c.1', 'add', 9, undefined);
      });
    });

  });

  describe('when observing an array with child objects', function() {

    beforeEach(function() {
      observed = [{
        a:1
      }, {
        b:2
      }];
      pathObserver(observed, callback);
    });

    describe('when adding a property to a child object', function() {

      beforeEach(function() {
        observed[0].c = 3;
      })

      ita('should call the callback with the add signature', function() {
        expect(callback).to.have.been.calledWith('0.c', 'add', 3, undefined);
      });
    });

    describe('when removing a property from a child object', function() {

      beforeEach(function() {
        delete observed[0].a;
      });

      ita('should call the callback with the delete signature', function() {
        expect(callback).to.have.been.calledWith('0.a', 'delete', undefined, 1);
      });
    });

    describe('when changing a property on a child object', function() {

      beforeEach(function() {
        observed[0].a = 2;
      });

      ita('should call the callback with the update signature', function() {
        expect(callback).to.have.been.calledWith('0.a', 'update', 2, 1);
      });
    });

  });
  
});