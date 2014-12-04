# ampersand view conventions


The core purpose of a view is to manage the contents, events, and behavior or a single DOM element.

In ampersand, **a "view" doesn't have to actually be an "ampersand-view"** at all.

But in order to maintain the ability to write a collection renderer or to be able to render sub-views it's useful to have a few simple conventions we follow.

**Any** object can be a view if it follows these rules.

For convenience, compliance can be tested via this npm module.

The rules are most easily explained by an example, here is a well-commented absolutely bare-minimum `view`.

In fact, this is the view we use to test the compliance test.

```javascript
function MinimalView(options) {
    // If given an element as part of an options object
    // the view *should* store an element as `this.el`.
    this.el = options.el;
}

// All views should have a `render` method that creates, replaces, or
// fills in the `this.el` property.
// If passed in when created this view may already have a `this.el`.
// If so, your render would method would populate it, or create a new
// one and replace it (if already part of the DOM tree).
MinimalView.prototype.render = function () {
    if (!this.el) this.el = document.createElement('div');
    // The important thing is after calling `render` the view should have
    // a `this.el` that is a *real* DOM element.
    this.el.textContent = 'hello, awesome developer!';
};

// It should have a `remove` method that does any tear down you may want
// to do. Including ideally removing itself from its parent (if reasonable to do so)
MinimalView.prototype.remove = function () {
    // you could do it with vanilla JS like this
    var parent = this.el.parentNode;
    if (parent) parent.removeChild(this.el);

    // ...or if you're using jQuery you could just do
    // $(this.el).remove();
};

// CommonJS module, of course
module.exports = MinimalView;
```

## install

```
npm install ampersand-view-conventions
```

## example

The view compliance tests are written for tape. Simply pass in the test instance and your view constructor.

If there are additional required options for instantiating your view, pass those as a third argument.

```javascript
var test = require('tape');
var viewCompliance = require('ampersand-view-conventions');
var YourView = require('your-awesome-view');

// if there are no additional required arguments, you can just pass in
// the constructor
viewCompliance.view(test, YourView);

// if there's additional arguments required to instantiate your view
// pass those in too. This is just minimal amount required to be able
// to instantiate an instance of your view.
viewCompliance.view(test, YourView, {some: 'option object'});

// your other tests
test('something', function (t) {
    t.pass();
    t.end();
})
```

# form fields

If you have a form field that complies with the [ampersand form field conventions](http://ampersandjs.com/learn/forms#form-input-view-conventions),
you can make sure it plays nicely with [ampersand-form-view](https://github.com/ampersandjs/ampersand-form-view).

Use the `formField` method and pass in the test instance, the view constructor, required options and a valid value.

```javascript
var test = require('tape');
var viewCompliance = require('ampersand-view-conventions');
var YourFormFieldView = require('your-wicked-form-field-view');

// you need at least a name for the required options and a valid value
viewCompliance.formField(test, YourFormFieldView, {name: 'field'}, 'valid value');

// also run the view tests if you like, for good measure
viewCompliance.view(test, YourFormFieldView, {name: 'field'});
```

Refer to [minimal-field-view.js](https://github.com/AmpersandJS/ampersand-view-conventions/blob/master/minimal-field-view.js) for an example form field
that implements the conventions.

## license

MIT
