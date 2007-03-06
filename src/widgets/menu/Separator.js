/**
 * @class Ext.menu.Separator
 * @extends Ext.menu.BaseItem
 * @constructor
 */
Ext.menu.Separator = function(){
    Ext.menu.Separator.superclass.constructor.call(this);
};
Ext.extend(Ext.menu.Separator, Ext.menu.BaseItem, {
    itemCls : "x-menu-sep",
    hideOnClick : false,
    onRender : function(li){
        var s = document.createElement("span");
        s.className = this.itemCls;
        s.innerHTML = "&#160;";
        this.el = s;
        li.addClass("x-menu-sep-li");
        Ext.menu.Separator.superclass.onRender.apply(this, arguments);
    }
});