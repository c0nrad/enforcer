'use strict';

// 'script-src' -> 'srcipt'
function demote(directive) {
  return directive.split('-')[0];
}

// 'script' -> 'script-src'
function promote(directive) {
  if (directive.split('-').length === 1) {
    return directive + '-src';
  }
  return directive;
}

function Policy(policy) {
  // Allow empty policies
  if (!policy) {
    this.raw = '';
    this.directives = {};
    return this;
  }

  this.raw = policy;
  this.directives = {};

  var directives = this.raw.split(';');
  for (var i = 0; i < directives.length; ++i) {
    var directive = directives[i].trim();
    var tokens = directive.split(/\s+/);

    var name = tokens[0];
    if (!name) {
      continue;
    }
    var values = tokens.slice(1, tokens.length);
    this.directives[name] = values.join(' ');
  }
  return this;
}

Policy.prototype.get = function(directive) {
  directive = promote(directive);
  return this.directives[directive];
};

Policy.prototype.add = function(directive, value) {
  directive = promote(directive);
  if (!this.directives[directive]) {
    this.directives[directive] = [value];
  } else {
    this.directives[directive].push(value);
  }
  return this.directives[directive];
};

Policy.prototype.set = function(directive, value) {
  directive = promote(directive);

  if (!value) {
    console.log('value is empty!');
    delete this.directives[directive];
    return;
  }
  this.directives[directive] = value;
  return this.directives[directive];
};

Policy.prototype.remove = function(directive, value) {
  directive = promote(directive);
  if (!this.directives[directive]) {
    return;
  } else {
    var index = this.directives[directive].indexOf(value);
    if (index > -1) {
      this.directives[directive].splice(index, 1);
    }
  }
};

Policy.prototype.toString = Policy.prototype.string = function() {
  var out = '';
  for (var directive in this.directives) {
    if (this.directives[directive]) {
      out += directive + ' ' + this.directives[directive] + '; ';
    }
  }
  return out.trim();
};
