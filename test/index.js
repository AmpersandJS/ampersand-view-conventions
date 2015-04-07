var test = require('tape');
var MinimalView = require('../minimal-view');
var MinimalFieldView = require('../minimal-field-view');
var viewCompliance = require('../ampersand-view-conventions');
var AmpersandView = require('ampersand-view');
//var AmpersandInputView = require('ampersand-input-view');

viewCompliance.view(test, MinimalView);
viewCompliance.formField(test, MinimalFieldView, {name: 'awesome'}, 'ok');


var SimpleView = AmpersandView.extend({
    template: "<div>Hi!</div>"
});

var FieldView = SimpleView.extend({
    props: {
        name: ['string', true, 'the-name'],
        value: 'string',
        parent: 'any'
    },
    derived: {
        valid: {
            deps: ['value'],
            fn: function () { return this.value === 'ok'; }
        }
    },
    initialize: function () {
        var self = this;
        this.on('change:value', function () {
            self.parent.update(self);
        });
    },
    setValue: function (value) {
        this.value = value;
    }
});

viewCompliance.view(test, SimpleView);
viewCompliance.formField(test, FieldView, {name: 'an-input'}, 'ok');
//viewCompliance.formField(test, AmpersandInputView, {name: 'an-input'}, 'ok');
