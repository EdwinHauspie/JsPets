Number.prototype.hasFlag = function (flag) { return !!(this & flag); };
Number.prototype.addFlag = function (flag) { return this | flag; };
Number.prototype.removeFlag = function (flag) { return (this | flag) ^ flag; };

Number.prototype.toggleFlag = function (flag, toggle) {
    var nr = this;
    return (function(undefined) {
        if (toggle == undefined) {
            return nr.hasFlag(flag) ? nr.removeFlag(flag) : nr.addFlag(flag);
        } else {
            return toggle ? nr.addFlag(flag) : nr.removeFlag(flag);
        }
    })();
};

Number.random = function (inclusiveLower, inclusiveUpper) {
	return Math.floor(Math.random() * (inclusiveUpper - inclusiveLower + 1) + inclusiveLower);
}

Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) { s = "0" + s; }
  return s;
}







Date.tryParse = function(inputString, format) { //Returns null when date could not be parsed
    var output = null;

    format = format || 'dd/MM/yyyy';

    switch (format) {
        case 'dd/MM/yyyy':
            try {
                var parts = inputString.split('/');
                if (parts.length !== 3 || isNaN(parts[0]) || isNaN(parts[1]) || isNaN(parts[2])) throw Error('Invalid date');
                var day = parseInt(parts[0], 10), month = parseInt(parts[1], 10), year = parseInt(parts[2], 10);
                var date = new Date(parts[2], parts[1] - 1, parts[0]);
                if (date.getDate() !== day || date.getMonth() + 1 !== month || date.getFullYear() !== year) throw Error('Invalid date');
                output = date;
            } catch(e) {}
            break;
        default: throw 'Date format not supported';
    }

    return output;
}

Date.prototype.format = function(format) {
    var output = null;

    format = format || 'dd/MM/yyyy';

    switch (format) {
        case 'dd/MM/yyyy':
            output = this.getDate().pad(2) + '/' + (this.getMonth() + 1).pad(2) + '/' + this.getFullYear();
            break;
        case 'MM/yyyy':
            output = (this.getMonth() + 1).pad(2) + '/' + this.getFullYear();
            break;
        case 'yyyy':
            output = this.getFullYear();
            break;
        default: throw 'Date format not supported';
    }

    return output;
}







Array._lambdaCache = {};

Array._parseLambda = function(lambda) {
    if (!Array._lambdaCache[lambda]) {
	    var parts = lambda.split('=>');
	    Array._lambdaCache[lambda] = new Function(parts[0].trim(), 'return ' + parts.slice(1).join(' => ').trim());
    }
    return Array._lambdaCache[lambda];
}

Array.prototype.where = function (predicate) {
    if (!predicate) return this;
    if (typeof (predicate) === 'string') predicate = Array._parseLambda(predicate);

    var output = [];

    for (var i = 0; i < this.length; i++)
        if (predicate(this[i], i))
            output.push(this[i]);

    return output;
};

Array.prototype.count = function (predicate) {
    if (!predicate) return this.length;
    if (typeof (predicate) === 'string') predicate = Array._parseLambda(predicate);

    var output = [];

    for (var i = 0; i < this.length; i++)
        if (predicate(this[i], i))
            output.push(this[i]);

    return output.length;
};

Array.prototype.first = function (predicate) {
    if (!this.length) return null;
    if (!predicate) return this[0];
    if (typeof (predicate) === 'string') predicate = Array._parseLambda(predicate);

    var output = null;
    for (var i = 0; i < this.length; i++)
        if (predicate(this[i], i)) {
            output = this[i];
            break;
        }
    return output;
};

Array.prototype.last = function (predicate) {
    if (!this.length) return null;
    if (!predicate) return this[this.length - 1];
    if (typeof (predicate) === 'string') predicate = Array._parseLambda(predicate);

    var output = null;
    for (var i = this.length - 1; i >= 0; i--)
        if (predicate(this[i], i)) {
            output = this[i];
            break;
        }
    return output;
};

Array.prototype.any = function (predicate) {
    if (!predicate) return !!this.length;
    if (typeof (predicate) === 'string') predicate = Array._parseLambda(predicate);

    var output = false;

    for (var i = 0; i < this.length; i++)
        if (predicate(this[i], i)) {
            output = true;
            break;
        }

    return output;
};

Array.prototype.all = function (predicate) {
    if (!predicate) return this;
    if (typeof (predicate) === 'string') predicate = Array._parseLambda(predicate);

    for (var i = 0; i < this.length; i++)
        if (!predicate(this[i], i)) return false;

    return true;
};

Array.prototype.each = function (action) {
    if (!action) return this;
    if (typeof (action) === 'string')
        action = new Function(action.split('=>')[0].trim(), action.split('=>').slice(1).join(' => ').trim()); //Can't really use _parseLambda here because the function does not return any specific value

    for (var i = 0; i < this.length; i++) {
        var result = action(this[i], i);
        if (result === false) return false; //To break the "each" function, the callback should to return false
    }

    return this;
};

Array.prototype.select = function (action) {
    if (!action) return this;
    if (typeof (action) === 'string') action = Array._parseLambda(action);

    var output = [];

    for (var i = 0; i < this.length; i++)
        output.push(action(this[i], i));

    return output;
};

Array.prototype.selectMany = function (func) { //Func should return the child array
    if (!func) return this;
    if (typeof (func) === 'string') func = Array._parseLambda(func);

    var output = [];

    for (var i = 0; i < this.length; i++) {
        var childArray = func(this[i], i);
        if (childArray) output = output.concat(childArray);
    }

    return output;
};

Array.prototype.distinct = function (selectorFunc) {
    var output = [];
    if (typeof (selectorFunc) === 'string') selectorFunc = Array._parseLambda(selectorFunc);

    for (var i = 0; i < this.length; i++)
        if (!_contains(this[i]))
            output.push(this[i]);

    return output;

    function _contains(subject) {
        //Note: using === makes the difference between '1' and 1 but might be less efficient than working with a helper object ... http://stackoverflow.com/questions/1960473/unique-values-in-an-array 
        if (selectorFunc) {
            for (var j = 0; j < output.length; j++) {
                if (selectorFunc(output[j]) === selectorFunc(subject)) {
                    return true;
                }
            }
        } else {
            for (var j = 0; j < output.length; j++) {
                if (output[j] === subject) {
                    return true;
                }
            }
        }

        return false;
    }
};

Array.prototype.skip = function (count) { return this.slice(count); };

Array.prototype.take = function (count) { return this.slice(0, count); };

Array.prototype.orderBy = function (func) {
    if (!func) func = function(x) { return x; }
    if (typeof (func) === 'string') func = Array._parseLambda(func);

    var copiedCollection = [];
    for (var i = 0; i < this.length; i++) copiedCollection.push(this[i]);

    copiedCollection.sort(function (x, y) { //Don't do "this.sort" because it alters the original collection, which is not "LINQ-like"
        if (func(x) < func(y)) return -1;
        if (func(x) > func(y)) return 1;
        return 0;
    });

    return copiedCollection;
};

Array.prototype.orderByDescending = function (func) {
    if (!func) func = function(x) { return x; }
    if (typeof (func) === 'string') func = Array._parseLambda(func);

    var copiedCollection = [];
    for (var i = 0; i < this.length; i++) copiedCollection.push(this[i]);

    copiedCollection.sort(function (x, y) { //Don't do "this.sort" because it alters the original collection, which is not "LINQ-like"
        if (func(x) < func(y)) return -1;
        if (func(x) > func(y)) return 1;
        return 0;
    });

    return copiedCollection.reverse();
};

Array.prototype.contains = function (item) {
    if (Array.prototype.indexOf) {
        return (this.indexOf(item) !== -1);
    } else {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === item) return true;
        }
        return false;
    }
};

Array.prototype.groupBy = function (keySelectorFunc) {
    if (typeof (keySelectorFunc) === 'string') keySelectorFunc = Array._parseLambda(keySelectorFunc);

    var groups = {};
    for (var i = 0; i < this.length; i++) {
        var key = keySelectorFunc ? keySelectorFunc(this[i]) : this[i];
        var key_ = key + typeof key; //This makes it possible to use an object to store info instead of an array, while still differentiating between 1 and '1'
        groups[key_] = groups[key_] || [];
        groups[key_].key = key;
        groups[key_].push(this[i]);
    }

    var output = [];
    for (var j in groups) {
        output.push(groups[j]);
    }

    return output;
};

Array.prototype.log = function () {
    if (console) console.log(this);
    return this;
};

Array.equals = function (arr1, arr2) {
    if (arr1 == arr2) return true;
    if (!arr1 && arr2) return false;
    if (arr1 && !arr2) return false;
    if (arr1.length !== arr2.length) return false;

    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }

    return true;
};

Array.prototype.equals = function(arr2) {
    return Array.equals(this, arr2);
};

Array.intersect = function(arr1, arr2) {
    if (arr1 == arr2) return arr1;
    if (!arr1 && !arr2 || arr1 && !arr2 || !arr1 && arr2) return [];

    var output = [];

    for (var i = 0; i < arr1.length; i++) {
        for (var j = 0; j < arr2.length; j++) {
            if (arr1[i] == arr2[j]) output.push(arr1[i]);
        }
    }

    return output;
};

Array.prototype.intersect = function(arr2) {
    return Array.intersect(this, arr2);
};

Array.prototype.aggregate = function (workObject, aggregateFunc) {
    if (typeof (aggregateFunc) === 'string') aggregateFunc = Array._parseLambda(aggregateFunc);

    for (var i = 0; i < this.length; i++) {
        workObject = aggregateFunc(this[i], workObject, i);
    }

    return workObject;
};

Array.prototype.flatten = function (childrenSelectorFunc) {
    if (typeof (childrenSelectorFunc) === 'string') childrenSelectorFunc = Array._parseLambda(childrenSelectorFunc);

    var recursiveSelectMany = function (x) { return [x].concat(childrenSelectorFunc(x).selectMany(recursiveSelectMany)); };
    return this.selectMany(recursiveSelectMany);
};






String.join = function (seperator/*, stringArg1, stringArg2, stringArg3, ...*/) { //Join strings while removing empty entries
    var nonEmptyStrings = [];
    for (var i = 1; i < arguments.length; i++) {
        var arg = arguments[i];
        if (arg) nonEmptyStrings.push(arg);
    }
    return nonEmptyStrings.join(seperator);
};

String.split = function (splitter, input, keepEmpty/*False by default*/) {
    var output = [];
    if (!input) return output;
    keepEmpty = false || keepEmpty;
    var splitStr = input.split(splitter);
    for (var i = 0; i < splitStr.length; i++) {
        var s = splitStr[i];
        if (s || keepEmpty) output.push(s);
    }
    return output;
};

if (!String.trim) String.trim = function (str) { return (str || '').toString().replace(/^\s+|\s+$/g, ''); };
if (!String.prototype.trim) String.prototype.trim = function () { return String.trim(this); };

String.startsWith = function (str, startStr) { return (str || '').substring(0, startStr.length) === startStr; };
String.prototype.startsWith = function (startStr) { return this.substring(0, startStr.length) === startStr; };

String.contains = function (str, search) { return (str || '').indexOf(search) !== -1; };
String.prototype.contains = function (search) { return this.indexOf(search) !== -1; };

String.prototype.isLike = function (/*patternArg1, patternArg2, patternArg3, ...*/) {
    for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        if (typeof arg === 'undefined') return false;
        if (!(new RegExp(arg, 'i').test(this))) return false;
    }
    return true;
};

String.prototype.isLikeAny = function (/*patternArg1, patternArg2, patternArg3, ...*/) {
    for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        if (typeof arg !== 'undefined' && new RegExp(arg, 'i').test(this))
            return true;
    }
    return false;
};

String.prototype.log = function () {
    if (console) console.log(this.toString());
    return this;
};

String.format = function () {
    var args = arguments;
    if (!args[0]) return args[0];

    return args[0].replace(/{(\d+)}/g, function (match, index) {
        index = parseInt(index);
        return typeof args[index + 1] != 'undefined' ? args[index + 1] : match;
    });
};

String.stripHtml = function (str) {
    if (!str) return str;
    return str.replace(/<(?:.|\n)*?>/gm, '');
};

String.random = function(length) {
    var output = '';
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++)
        output += chars.charAt(Math.floor(Math.random() * chars.length));

    return output;
};

String.isNullOrWhitespace = function(str) {
    if (typeof str === 'undefined' || str == null) return true;
    return str.replace(/\s/g, '').length < 1;
};

String.ellipsis = function(str, len) {
    if (!str || !len) return '';
    if (str.length <= len) return str;
    return str.slice(0, len).replace(/\s[^\s]*$/gi, '') + '...';
};