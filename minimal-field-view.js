function MinimalFieldView(options) {
    // a name is required, so throw if there isn't one passed in
    if (!options || !options.name) throw Error('must pass in a name');
    // If given an element as part of an options object
    // the view *should* store an element as `this.el`.
    this.el = options.el;
    this.value = options.value;
    this.parent = options.parent;
    this.name = options.name;
    this.valid = !!options.value;
}

// All views should have a `render` method that creates, replaces, or
// fills in the `this.el` property.
// If passed in when created this view may already have a `this.el`.
// If so, your render would method would populate it, or create a new
// one and replace it (if already part of the DOM tree).
MinimalFieldView.prototype.render = function () {
    if (!this.el) this.el = document.createElement('div');
    // The important thing is after calling `render` the view should have
    // a `this.el` that is a *real* DOM element.
    this.el.textContent = 'hello, awesome developer!';
};

// Form fields have to have a setValue method that sets it to what is passed
MinimalFieldView.prototype.setValue = function (value) {
    this.value = value;
    this.valid = !!value;

    // if there is a parent call update
    if (this.parent) this.parent.update(this);
};

// It should have a `remove` method that does any tear down you may want
// to do. Including ideally removing itself from it's parent (if reasonable to do so)
MinimalFieldView.prototype.remove = function () {
    // you could do it with vanilla JS like this
    var parent = this.el.parentNode;
    if (parent) parent.removeChild(this.el);

    // ...or if you're using jQuery you could just do
    // $(this.el).remove();
};

// CommonJS module, of course
module.exports = MinimalFieldView;
