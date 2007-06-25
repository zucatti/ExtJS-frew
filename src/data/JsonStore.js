/**
 * @class Ext.data.JsonStore
 * @extends Ext.data.Store
 * Small helper class to make creating Stores for JSON data easier. <br/>
 * <b>Note: Although they are not listed, this class inherits all of the config options of Store,
 * JsonReader and HttpProxy (unless inline data is provided).</b>
 * @cfg {Array} fields An array of field definition objects, or field name strings.
 * @constructor
 * @param {Object} config
 */
Ext.data.JsonStore = function(c){
    Ext.data.JsonStore.superclass.constructor.call(this, Ext.apply(c, {
        proxy: !c.data ? new Ext.data.HttpProxy({url: c.url}) : undefined,
        reader: new Ext.data.JsonReader(c, c.fields)
    }));
};
Ext.extend(Ext.data.JsonStore, Ext.data.Store);