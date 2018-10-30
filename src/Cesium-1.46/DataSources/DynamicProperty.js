define([
    '../Core/defined',
    '../Core/defineProperties',
    '../Core/Event'
], function(
    defined,
    defineProperties,
    Event
) {
    function DynamicProperty(value) {
        this._value = undefined;
        this._hasClone = false;
        this._hasEquals = false;
        this._definitionChanged = new Event();
        this._constant = false;
        this.setValue(value);
    }

    defineProperties(DynamicProperty.prototype, {
        isConstant : {
            get: function() {
                return this._constant;
            },
            set: function(value) {
                if (this._constant !== value) {
                    this._constant = value;
                    this._definitionChanged.raiseEvent(this);
                }
            }
        },
        definitionChanged : {
            get : function() {
                return this._definitionChanged;
            }
        }
    });

    DynamicProperty.prototype.getValue = function(time, result) {
        return this._hasClone ? this._value.clone(result) : this._value;
    };

    DynamicProperty.prototype.setValue = function(value) {
        var oldValue = this._value;
        if (oldValue !== value) {
            var isDefined = defined(value);
            var hasClone = isDefined && typeof value.clone === 'function';
            var hasEquals = isDefined && typeof value.equals === 'function';

            this._hasClone = hasClone;
            this._hasEquals = hasEquals;

            var changed = !hasEquals || !value.equals(oldValue);
            if (changed) {
                this._value = !hasClone ? value : value.clone();
                this._definitionChanged.raiseEvent(this);
            }
        }
    };

    DynamicProperty.prototype.equals = function(other) {
        return this === other || (other instanceof DynamicProperty && ((!this._hasEquals && (this._value === other._value)) || (this._hasEquals && this._value.equals(other._value))));
    };

    return DynamicProperty;
});