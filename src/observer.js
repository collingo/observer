var walker = require('walker');
var WalkerObject = require('walker-object');

function getFullPath(path, key) {
  return path.concat(key);
}

function onChange(obj, path, cb, changes) {
  var change, cPath, cType, cOld, cNew;
  while(changes.length) {
    change = changes.shift();
    cPath = getFullPath(path, change.name);
    cType = change.type;
    cOld = change.oldValue;
    switch(change.type) {
      case 'add':
      case 'update':
        cNew = obj[change.name];
      break;
      case 'splice':
        cPath = getFullPath(path, change.index);
        if(change.removed.length) {
          cType = 'remove';
          cOld = change.removed[0];
          if(change.removed.length > 1) {
            changes.push({
              addedCount: change.addedCount,
              index: change.index + 1,
              object: change.object,
              removed: change.removed.slice(1),
              type: change.type
            });
          }
        } else if(change.addedCount) {
          cType = 'add';
          cNew = obj[change.index];
          if(change.addedCount > 1) {
            changes.push({
              addedCount: change.addedCount - 1,
              index: change.index + 1,
              object: change.object,
              removed: change.removed,
              type: change.type
            });
          }
        } else {
          cType = 'update';
          cOld = change.removed[0];
          cNew = obj[change.index];
        }
      break;
    }
    if(typeof cNew === "object") {
      pathObserver(cNew, cb, [].concat(cPath));
    }
    cb(cPath, cType, cNew, cOld);
  }
}

function pathObserver(obj, cb, path) {
  walker(new WalkerObject(path), obj, function(node, path) {
    if(typeof node === "object") {
      var type = Object;
      if(Array.isArray(node)) {
        type = Array;
      }
      type.observe(node, onChange.bind(this, node, [].concat(path), cb));
    }
  });
}
if(module && module.exports) {
  module.exports = pathObserver;
}