Ext.form.TextField = function(config){
    Ext.form.TextField.superclass.constructor.call(this, config);
};

Ext.extend(Ext.form.TextField, Ext.form.Field,  {
    initEvents : function(){
        Ext.form.TextField.superclass.initEvents.call(this);
        this.el.on(this.validationEvent, this.validate, this, {buffer: this.validationDelay});
        if(this.selectOnFocus){
            this.el.on("focus", function(){
                try{
                    this.dom.select();
                }catch(e){}
            });
        }
        if(this.maskRe || (this.vtype && this.disableKeyFilter !== true && (this.maskRe = Ext.form.VTypes[this.vtype+'Mask']))){
            this.el.on("keypress", this.filterKeys, this);
        }
    },

    filterKeys : function(e){
        var k = e.getKey();
        if(!Ext.isIE && (e.isNavKeyPress() || k == e.BACKSPACE || k == e.DELETE)){
            return;
        }
        var c = e.getCharCode();
        if(!this.maskRe.test(String.fromCharCode(c) || '')){
            e.stopEvent();
        }
    },

    validateValue : function(value){
        if(value.length < 1){ // if it's blank
             if(this.allowBlank){
                 this.clearInvalid();
                 return true;
             }else{
                 this.markInvalid(this.blankText);
                 return false;
             }
        }
        if(value.length < this.minLength){
            this.markInvalid(String.format(this.minLengthText, this.minLength));
            return false;
        }
        if(value.length > this.maxLength){
            this.markInvalid(String.format(this.maxLengthText, this.maxLength));
            return false;
        }
        if(this.vtype){
            var vt = Ext.form.VTypes;
            if(!vt[this.vtype](value)){
                this.markInvalid(this.vtypeText || vt[this.vtype +'Text']);
                return false;
            }
        }
        if(typeof this.validator == "function"){
            var msg = this.validator(value);
            if(msg !== true){
                this.markInvalid(msg);
                return false;
            }
        }
        if(this.regex && !this.regex.test(value)){
            this.markInvalid(this.regexText);
            return false;
        }
        return true;
    },

    selectText : function(start, end){
        var v = this.getRawValue();
        if(v.length > 0){
            start = start === undefined ? 0 : start;
            end = end === undefined ? v.length : end;

            var d = this.el.dom;
            if(d.setSelectionRange){
                d.setSelectionRange(start, end);
            }else if(d.createTextRange){
                var range = d.createTextRange();
                range.collapse(true);
                range.moveEnd("character", end);
                range.moveStart("character", start);
                range.select();
            }
        }
    },

    vtype : null,
    maskRe : null,
    disaleKeyFilter:false,
    allowBlank : true,
    minLength : 0,
    maxLength : Number.MAX_VALUE,
    minLengthText : "The minimum length for this field is {0}",
    maxLengthText : "The maximum length for this field is {0}",
    selectOnFocus : false,
    blankText : "This field is required",
    validator : null,
    regex : null,
    regexText : ""
});