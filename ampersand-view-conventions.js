var extend = require('extend-object');
var isFunction = require('is-function');


exports.view = function (test, ViewClass, requiredoptions) {
    var tests = {
        'basics': function (t) {
            var view = new ViewClass(requiredoptions || {});
            t.ok(view, 'should init with `new`');
            t.ok(isFunction(view.render), 'has `render` method');
            t.ok(isFunction(view.remove), 'has `remove` method');
            t.end();
        },
        'root element handling': function (t) {
            var container = document.createElement('div');
            var viewRoot = document.createElement('div');
            container.appendChild(viewRoot);
            var view = new ViewClass(extend(requiredoptions || {}, {el: viewRoot}));

            // note it's possible this isn't the same element as passed in, it's ok to autorender
            // and replace the element you were passed.
            t.ok(view.el.nodeName, 'should have a `this.el` that is an element if passed into constructor');
            t.equal(view.el.parentNode, container, 'parent container should be the same');

            // these should still be true, post-`render()`
            view.render()
            t.ok(view.el.nodeName, 'should have a `this.el` that is an element if passed into constructor');
            t.equal(view.el.parentNode, container, 'parent container should be the same');

            // calling remove should remove itself from the DOM
            view.remove();
            t.ok(!view.el.parentNode, 'should no longer have a parent node');
            t.ok(container.children.length === 0, 'container should have no children');
            t.end();
        }
    }

    for (var item in tests) {
        test('view-compliance: ' + item, tests[item]);
    }
}
