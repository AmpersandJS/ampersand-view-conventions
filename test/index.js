var test = require('tape');
var MinimalView = require('../minimal-view');
var MinimalFieldView = require('../minimal-field-view');
var viewCompliance = require('../ampersand-view-conventions');



viewCompliance.view(test, MinimalView);
viewCompliance.formField(test, MinimalFieldView, {name: 'awesome'}, 'ok');
