var extend = require('extend-object');
var isFunction = require('is-function');

if (!Function.prototype.bind) {
    Function.prototype.bind = require('function-bind');
}

function hasPropertyDefinition(object, fieldName) {
    //truthy
    if (object[fieldName]) { return true; }

    //defined on the object, but not truthy
    if (object.hasOwnProperty(fieldName)) { return true; }

    //Defined as a getter/setter on the prototype chain
    var current = object.constructor.prototype;
    var fieldDefinition;

    while (current !== Object.getPrototypeOf({})) {
        fieldDefinition = Object.getOwnPropertyDescriptor(current, fieldName);
        if (fieldDefinition && fieldDefinition.get) { return true; }

        current = Object.getPrototypeOf(current);
    }

    return false;
}


exports.view = function (test, ViewClass, requiredOptions) {
    var tests = {
        'basics': function (t) {
            var view = new ViewClass(requiredOptions || {});
            t.ok(view, 'should init with `new`');
            t.ok(isFunction(view.render), 'has `render` method');
            t.ok(isFunction(view.remove), 'has `remove` method');
            t.end();
        },
        'root element handling': function (t) {
            var container = document.createElement('div');
            var viewRoot = document.createElement('div');
            container.appendChild(viewRoot);
            var view = new ViewClass(extend(requiredOptions || {}, {el: viewRoot}));

            // note it's possible this isn't the same element as passed in, it's ok to autorender
            // and replace the element you were passed.
            t.ok(view.el.nodeName, 'should have a `this.el` that is an element if passed into constructor');
            t.equal(view.el.parentNode, container, 'parent container should be the same');

            // these should still be true, post-`render()`
            t.doesNotThrow(function () {
                view.render();
            }, 'should not error when calling render');

            t.ok(view.el.nodeName, 'should have a `this.el` that is an element if passed into constructor');
            t.equal(view.el.parentNode, container, 'parent container should be the same');

            // calling remove should remove itself from the DOM
            view.remove();
            t.ok(!view.el.parentNode, 'after calling remove should no longer have a parent node');
            t.ok(container.children.length === 0, 'container should have no children');
            t.end();
        }
    };

    for (var item in tests) {
        test('view-compliance: ' + item, tests[item]);
    }
};


// for testing rules for form fields
exports.formField = function (test, ViewClass, requiredOptions, validValue) {
    var tests = {
        'basics': function (t) {
            var counter;
            var parent = {
                update: function (field) {
                    counter++;
                    this.passedField = field;
                }
            };
            var view = new ViewClass(extend(requiredOptions || {}, {parent: parent}));

            // helper we can call
            function ensureProperties(str) {
                str = str || '';
                t.ok(hasPropertyDefinition(view, 'value'), 'has `value` property' + str);
                t.equal(typeof view.name, 'string', 'has `name` property that is a string' + str);
                t.notEqual(view.name, '', '`name` property should not be empty string' + str);
                t.ok(isFunction(view.setValue), 'has `setValue` method' + str);
                t.equal(typeof view.valid, 'boolean', 'has `valid` property that is a boolean' + str);
                t.equal(parent, view.parent, 'has same `parent` property' + str);
            }

            t.ok(view, 'should init with `new`');
            ensureProperties();

            counter = 0;

            t.doesNotThrow(function () {
                view.setValue(validValue);
            }, 'should not error when setting valid value');

            t.notEqual(counter, 0, 'should have called `update` on parent when value changed');
            t.equal(parent.passedField, view, 'should have passed itself to the parent when changed');

            // all this should still be true after setting a value
            ensureProperties(' after setting a value');

            // all this should be true after calling `beforeSubmit`, if present.
            if (isFunction(view.beforeSubmit)) {
                view.beforeSubmit();
                ensureProperties(' after `beforeSubmit`');
            }

            t.end();
        },
        'handling values passed in instantiation': function (t) {
            var parent = {update: function () {}};
            var view = new ViewClass(extend(requiredOptions || {}, {
                value: validValue,
                parent: parent,
                name: 'awesome name'
            }));

            t.equal(view.value, validValue, 'should have maintained its value');
            t.strictEqual(view.valid, true, 'should be `valid` at init when passed valid value');
            t.equal(view.parent, parent, 'should have kept its `parent`');
            t.equal(view.name, 'awesome name', 'should have kepts its `name`');

            t.end();
        }
    };

    for (var item in tests) {
        test('input-view-compliance: ' + item, tests[item]);
    }
};
