function objectForEach(obj, cb) {
  Object.keys(obj).forEach(function(key) {
    cb(obj[key], key, obj);
  });
}
function arrayForEach(arr, cb) {
  arr.forEach(cb);
}
function getFullPath(obj, path, key, isArray) {
  var fullPath;
  if(isArray || Array.isArray(obj)) {
    fullPath = (path ? path+'[' : '')+key+(path ? ']' : '');
  } else {
    fullPath = (path ? path+'.' : '')+key;
  }
  return fullPath;
}

function onChange(obj, path, cb, changes) {
  var change, cPath, cType, cOld, cNew;
  while(changes.length) {
    change = changes.shift();
    cPath = getFullPath(obj, path, change.name);
    cType = change.type;
    cOld = change.oldValue;
    switch(change.type) {
      case 'add':
      case 'update':
        cNew = obj[change.name];
      break;
      case 'splice':
        cPath = getFullPath(obj, path, change.index, true);
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
      iterator(cNew, cb, cPath);
    }
    cb(cPath, cType, cNew, cOld);
  }
}

function iterator(obj, cb, path) {
  var type = Object;
  var forEach = objectForEach;
  if(Array.isArray(obj)) {
    type = Array;
    forEach = arrayForEach;
  }
  forEach(obj, function(val, key) {
    if(typeof val === "object") {
      iterator(val, cb, getFullPath(obj, path, key));
    }
  });
  type.observe(obj, onChange.bind(this, obj, path, cb));
}
function pathObserver(obj, cb) {
  iterator(obj, cb);
}