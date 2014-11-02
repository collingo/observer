[![Build Status](https://travis-ci.org/collingo/observer.svg)](https://travis-ci.org/collingo/observer)

# Observer

A wrapper round ES7's {Object|Array}.observe.

This adds the following...

- ability to observe changes on a nested Object/Array via keypaths
- simplification of the events down to the more managable 'add', 'delete', 'update' across both Objects and Arrays
- uniform callback signature of path, changeType, newValue, oldValue
- listeners are propagated to all new nested objects so change events are fired on the new keypaths automatically
- one event fired for every change rather than clustered as per the native implementation