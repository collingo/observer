var observer = require('../src/observer');
window.model = {
  a:{
    b:1,
    d:[1,2,{
      test:'hello',
      carrot: 123
    }]
  },
  c:2
};
observer(model, function(path, action, newValue, oldValue) {
  console.log(path, action, JSON.stringify(newValue), JSON.stringify(oldValue));
});