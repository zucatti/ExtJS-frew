/**
 * @class Ext.data.Record
 * <p>Instances of this class encapsulate both Record <em>definition</em> information, and Record
 * <em>value</em> information for use in {@link Ext.data.Store} objects, or any code which needs
 * to access Records cached in an {@link Ext.data.Store} object.</p>
 * <p>Constructors for this class are generated by passing an Array of field definition objects to {@link #create}.
 * Instances are usually only created by {@link Ext.data.Reader} implementations when processing unformatted data
 * objects.</p>
 * <p>Note that an instance of a Record class may only belong to one {@link Ext.data.Store Store} at a time.
 * In order to copy data from one Store to another, use the {@link #copy} method to create an exact
 * copy of the Record, and insert the new instance into the other Store.</p>
 * <p>When serializing a Record for submission to the server, be aware that it contains many private
 * properties, and also a reference to its owning Store which in turn holds references to its Records.
 * This means that a whole Record may not be encoded using {@link Ext.util.JSON.encode}. Instead, use the
 * {@link data} and {@link id} properties.</p>
 * Record objects generated by this constructor inherit all the methods of Ext.data.Record listed below.
 * @constructor
 * This constructor should not be used to create Record objects. Instead, use {@link #create} to
 * generate a subclass of Ext.data.Record configured with information about its constituent fields.
 * @param {Object} data An object, the properties of which provide values for the new Record's fields.
 * @param {Object} id (Optional) The id of the Record. This id should be unique, and is used by the
 * {@link Ext.data.Store} object which owns the Record to index its collection of Records. If
 * not specified an {@link #Record.id integer id is automatically generated}.
 */
Ext.data.Record = function(data, id){
	// if no id, call the auto id method
	this.id = (id || id === 0) ? id : Ext.data.Record.id(this);
    this.data = data;
};

/**
 * Generate a constructor for a specific Record layout.
 * @param {Array} o An Array of <b>{@link Ext.data.Field Field}</b> definition objects.
 * The constructor generated by this method may be used to create new Record instances. The data
 * object must contain properties named after the {@link Ext.data.Field field}
 * <b><tt>{@link Ext.data.Field#name}s</tt></b>.  Example usage:<pre><code>
// create a Record constructor from a description of the fields
var TopicRecord = Ext.data.Record.create([ // creates a subclass of Ext.data.Record
    {{@link Ext.data.Field#name name}: 'title', {@link Ext.data.Field#mapping mapping}: 'topic_title'},
    {name: 'author', mapping: 'username', allowBlank: false},
    {name: 'totalPosts', mapping: 'topic_replies', type: 'int'},
    {name: 'lastPost', mapping: 'post_time', type: 'date'},
    {name: 'lastPoster', mapping: 'user2'},
    {name: 'excerpt', mapping: 'post_text', allowBlank: false},
    // In the simplest case, if no properties other than <tt>name</tt> are required,
    // a field definition may consist of just a String for the field name.
    'signature'
]);

// create Record instance
var myNewRecord = new TopicRecord(
    {
        title: 'Do my job please',
        author: 'noobie',
        totalPosts: 1,
        lastPost: new Date(),
        lastPoster: 'Animal',
        excerpt: 'No way dude!',
        signature: ''
    },
    id // optionally specify the id of the record otherwise {@link #Record.id one is auto-assigned}
);
myStore.{@link Ext.data.Store#add add}(myNewRecord);
</code></pre>
 * @method create
 * @return {function} A constructor which is used to create new Records according
 * to the definition. The constructor has the same signature as {@link #Ext.data.Record}.
 * @static
 */
Ext.data.Record.create = function(o){
    var f = Ext.extend(Ext.data.Record, {});
    var p = f.prototype;
    p.fields = new Ext.util.MixedCollection(false, function(field){
        return field.name;
    });
    for(var i = 0, len = o.length; i < len; i++){
        p.fields.add(new Ext.data.Field(o[i]));
    }
    f.getField = function(name){
        return p.fields.get(name);
    };
    return f;
};

Ext.data.Record.PREFIX = 'ext-record';
Ext.data.Record.AUTO_ID = 1;
Ext.data.Record.EDIT = 'edit';
Ext.data.Record.REJECT = 'reject';
Ext.data.Record.COMMIT = 'commit';


/**
 *
 * Generates a sequential id. This method is typically called when a record is {@link #create}d
 * and {@link #Record no id has been specified}. The returned id takes the form:
 * <tt>&#123;PREFIX}-&#123;AUTO_ID}</tt>.<div class="mdetail-params"><ul>
 * <li><b><tt>PREFIX</tt></b> : String<p class="sub-desc"><tt>Ext.data.Record.PREFIX</tt>
 * (defaults to <tt>'ext-record'</tt>)</p></li>
 * <li><b><tt>AUTO_ID</tt></b> : String<p class="sub-desc"><tt>Ext.data.Record.AUTO_ID</tt>
 * (defaults to <tt>1</tt> initially)</p></li>
 * </ul></div>
 * @param {Record} rec The record being created.  The record does not exist, it's a {@link #phantom}.
 * @return {String} auto-generated string id, <tt>"ext-record-i++'</tt>;
 */
Ext.data.Record.id = function(rec) {
	rec.phantom = true;
	return [Ext.data.Record.PREFIX, '-', Ext.data.Record.AUTO_ID++].join('');
}

Ext.data.Record.prototype = {
    /**
     * <p><b>This property is stored in the Record definition's <u>prototype</u></b></p>
     * A MixedCollection containing the defined {@link Ext.data.Field Field}s for this Record.  Read-only.
     * @property fields
     * @type Ext.util.MixedCollection
     */
    /**
     * An object hash representing the data for this Record. Every field name in the Record definition
     * is represented by a property of that name in this object. Note that unless you specified a field
     * with {@link Ext.data.Field#name name} "id" in the Record definition, this will <b>not</b> contain
     * an <tt>id</tt> property.
     * @property data
     * @type {Object}
     */
    /**
     * The unique ID of the Record {@link #Record as specified at construction time}.
     * @property id
     * @type {Object}
     */
    /**
     * Readonly flag - true if this Record has been modified.
     * @type Boolean
     */
    dirty : false,
    editing : false,
    error: null,
    /**
     * This object contains a key and value storing the original values of all modified
     * fields or is null if no fields have been modified.
     * @property modified
     * @type {Object}
     */
    modified: null,
	/**
	 * <tt>false</tt> when the record does not yet exist in a server-side database (see
	 * {@link #markDirty}).  Any record which has a real database pk set as its id property
	 * is NOT a phantom -- it's real.
	 * @property phantom
	 * @type {Boolean}
	 */
	phantom : false,

    // private
    join : function(store){
        /**
         * The {@link Ext.data.Store} to which this Record belongs.
         * @property store
         * @type {Ext.data.Store}
         */
        this.store = store;
    },

    /**
     * Set the {@link Ext.data.Field#name named field} to the specified value.  For example:
     * <pre><code>
// record has a field named 'firstname'
var Employee = Ext.data.Record.{@link #create}([
    {name: 'firstname'},
    ...
]);

// update the 2nd record in the store:
var rec = myStore.{@link Ext.data.Store#getAt getAt}(1);

// set the value (shows dirty flag):
rec.set('firstname', 'Betty');

// commit the change (removes dirty flag):
rec.{@link #commit}();

// update the record in the store, bypass setting dirty flag,
// and do not store the change in the {@link Ext.data.Store#getModifiedRecords modified records}
rec.{@link #data}['firstname'] = 'Wilma'); // updates record, but not the view
rec.{@link #commit}(); // updates the view
     * </code></pre>
     *
     * @param {String} name The {@link Ext.data.Field#name name of the field} to set.
     * @param {Object} value The value to set the field to.
     */
    set : function(name, value){
        if(String(this.data[name]) == String(value)){
            return;
        }
        this.dirty = true;
        if(!this.modified){
            this.modified = {};
        }
        if(typeof this.modified[name] == 'undefined'){
            this.modified[name] = this.data[name];
        }
        this.data[name] = value;
        if(!this.editing){
            this.afterEdit();
        }
    },

	/**
	 * Used for un-phantoming a record after a successful database insert.  Sets the records pk along with any other new data.
	 * Will perform a commit as well, un-marking dirty-fields.  Store's "update" event will be suppressed.
	 * @param {Object} data The new record data to apply.  Must include the primary-key as reported by database.
	 * @param {String} idProperty The key in the data-object that represents the id-property of this record
	 */
	realize : function(data, id) {
		if (!id) {
			// TODO:  Make better exception message
			throw new Error("Second paramater to Record#realize must be provided");
		}
		this.editing = true;	// <-- prevent unwanted afterEdit calls by record.
		this.phantom = false;	// <-- The purpose of this method is to "un-phantom" a record
		this.id = id;
		this.fields.each(function(f) {	// <-- update record fields with data from server if was sent
			if (data[f.name] || data[f.mapping]) {
                this.set(f.name, f.convert((f.mapping) ? data[f.mapping] : data[f.name]));
            }
        },this);
		this.commit();
		this.editing = false;
	},

    // private
    afterEdit: function(){
        if(this.store){
            this.store.afterEdit(this);
        }
    },

    // private
    afterReject: function(){
        if(this.store){
            this.store.afterReject(this);
        }
    },

    // private
    afterCommit: function(){
        if(this.store){
            this.store.afterCommit(this);
        }
    },

    /**
     * Get the value of the {@link Ext.data.Field#name named field}.
     * @param {String} name The {@link Ext.data.Field#name name of the field} to get the value of.
     * @return {Object} The value of the field.
     */
    get : function(name){
        return this.data[name];
    },

    /**
     * Begin an edit. While in edit mode, no events are relayed to the containing store.
     */
    beginEdit : function(){
        this.editing = true;
        this.modified = this.modified || {};
    },

    /**
     * Cancels all changes made in the current edit operation.
     */
    cancelEdit : function(){
        this.editing = false;
        delete this.modified;
    },

    /**
     * End an edit. If any data was modified, the containing store is notified.
     */
    endEdit : function(){
        this.editing = false;
        if(this.dirty){
            this.afterEdit();
        }
    },

    /**
     * Usually called by the {@link Ext.data.Store} which owns the Record.
     * Rejects all changes made to the Record since either creation, or the last commit operation.
     * Modified fields are reverted to their original values.
     * <p>
     * Developers should subscribe to the {@link Ext.data.Store#update} event to have their code notified
     * of reject operations.
     * @param {Boolean} silent (optional) True to skip notification of the owning store of the change (defaults to false)
     */
    reject : function(silent){
        var m = this.modified;
        for(var n in m){
            if(typeof m[n] != "function"){
                this.data[n] = m[n];
            }
        }
        this.dirty = false;
        delete this.modified;
        this.editing = false;
        if(silent !== true){
            this.afterReject();
        }
    },

    /**
     * Usually called by the {@link Ext.data.Store} which owns the Record.
     * Commits all changes made to the Record since either creation, or the last commit operation.
     * <p>
     * Developers should subscribe to the {@link Ext.data.Store#update} event to have their code notified
     * of commit operations.
     * @param {Boolean} silent (optional) True to skip notification of the owning store of the change (defaults to false)
     */
    commit : function(silent){
        this.dirty = false;
        delete this.modified;
        this.editing = false;
        if(silent !== true){
            this.afterCommit();
        }
    },

    /**
     * Gets a hash of only the fields that have been modified since this Record was created or commited.
     * @return Object
     */
    getChanges : function(){
        var m = this.modified, cs = {};
        for(var n in m){
            if(m.hasOwnProperty(n)){
                cs[n] = this.data[n];
            }
        }
        return cs;
    },

    // private
    hasError : function(){
        return this.error != null;
    },

    // private
    clearError : function(){
        this.error = null;
    },

    /**
     * Creates a copy of this Record.
     * @param {String} id (optional) A new Record id, defaults to {@link #Record.id autogenerating an id}
     * @return {Record}
     */
    copy : function(newId) {
        return new this.constructor(Ext.apply({}, this.data), newId || this.id);
    },

    /**
     * Returns <tt>true</tt> if the passed field name has been {@link #modified} since the load or last commit.
     * @param {String} fieldName {@link Ext.data.Field.{@link Ext.data.Field#name}
     * @return {Boolean}
     */
    isModified : function(fieldName){
        return !!(this.modified && this.modified.hasOwnProperty(fieldName));
    },

	/**
	 * isValid
	 * By default returns <tt>false</tt> if any {@link Ext.data.Field field} within the
	 * record configured with <tt>{@link Ext.data.Field#allowBlank} = false</tt> returns
	 * <tt>true</tt> from an {@link Ext}.{@link Ext#isEmpty isempty} test.
	 * @return {Boolean}
	 */
	isValid : function() {
		return this.fields.find(function(f) {
			return (f.allowBlank == false && Ext.isEmpty(this.data[f.name])) ? true : false;
		},this) ? false : true;
	},

	/**
     * Marks all fields as <tt>{@link #dirty}</tt>.  Useful when adding <tt>{@link #phantom}</tt>
     * records to a grid which have not yet been inserted on the serverside.  Marking a new record
     * <tt>{@link #dirty}</tt> causes the phantom to be returned by {@link Ext.data.Store#getModifiedRecords}
     * where it will have a create action composed for it.
     */
    markDirty : function(){
        this.dirty = true;
        if(!this.modified){
            this.modified = {};
        }
        this.fields.each(function(f) {
			this.modified[f.name] = this.data[f.name];
		},this);
    }
};