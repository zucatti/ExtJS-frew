
/**
 * @class Ext.Button
 * @extends Ext.Component
 * Simple Button class
 * @cfg {String} text The button text
 * @cfg {String} icon The path to an image to display in the button (the image will be set as the background-image
 * CSS property of the button by default, so if you want a mixed icon/text button, set cls:"x-btn-text-icon")
 * @cfg {Function} handler A function called when the button is clicked (can be used instead of click event)
 * @cfg {Object} scope The scope of the handler
 * @cfg {Number} minWidth The minimum width for this button (used to give a set of buttons a common width)
 * @cfg {String/Object} tooltip The tooltip for the button - can be a string or QuickTips config object
 * @cfg {Boolean} hidden True to start hidden (defaults to false)
 * @cfg {Boolean} disabled True to start disabled (defaults to false)
 * @cfg {Boolean} pressed True to start pressed (only if enableToggle = true)
 * @cfg {String} toggleGroup The group this toggle button is a member of (only 1 per group can be pressed)
 * @cfg {Boolean/Object} repeat True to repeat fire the click event while the mouse is down. This can also be
  an {@link Ext.util.ClickRepeater} config object (defaults to false).
 * @constructor
 * Create a new button
 * @param {Object} config The config object
 */
Ext.Button = Ext.extend(Ext.BoxComponent, {
    /**
     * Read-only. True if this button is hidden
     * @type Boolean
     */
    hidden : false,
    /**
     * Read-only. True if this button is disabled
     * @type Boolean
     */
    disabled : false,
    /**
     * Read-only. True if this button is pressed (only if enableToggle = true)
     * @type Boolean
     */
    pressed : false,
    /**
     * The Button's owner {@link Ext.Panel} (defaults to undefined, and is set automatically when
     * the Button is added to a container).  Read-only.
     * @type Ext.Panel
     * @property ownerCt
     */

    /**
     * @cfg {Number} tabIndex Set a DOM tabIndex for this button (defaults to undefined)
     */

    /**
     * @cfg {Boolean} allowDepress
     * False to not allow a pressed Button to be depressed (defaults to undefined). Only valid when {@link #enableToggle} is true.
     */

    /**
     * @cfg {Boolean} enableToggle
     * True to enable pressed/not pressed toggling (defaults to false)
     */
    enableToggle: false,
    /**
     * @cfg {Function} toggleHandler
     * Function called when a Button with {@link #enableToggle} set to true is clicked. Two arguments are passed:<ul class="mdetail-params">
     * <li><b>button</b> : Ext.Button<div class="sub-desc">this Button object</div></li>
     * <li><b>state</b> : Boolean<div class="sub-desc">The next state if the Button, true means pressed.</div></li>
     * </ul>
     */
    /**
     * @cfg {Mixed} menu
     * Standard menu attribute consisting of a reference to a menu object, a menu id or a menu config blob (defaults to undefined).
     */
    /**
     * @cfg {String} menuAlign
     * The position to align the menu to (see {@link Ext.Element#alignTo} for more details, defaults to 'tl-bl?').
     */
    menuAlign : "tl-bl?",

    /**
     * @cfg {String} iconCls
     * A css class which sets a background image to be used as the icon for this button
     */
    /**
     * @cfg {String} type
     * submit, reset or button - defaults to 'button'
     */
    type : 'button',

    // private
    menuClassTarget: 'tr:nth(2)',

    /**
     * @cfg {String} clickEvent
     * The type of event to map to the button's event handler (defaults to 'click')
     */
    clickEvent : 'click',

    /**
     * @cfg {Boolean} handleMouseEvents
     * False to disable visual cues on mouseover, mouseout and mousedown (defaults to true)
     */
    handleMouseEvents : true,

    /**
     * @cfg {String} tooltipType
     * The type of tooltip to use. Either "qtip" (default) for QuickTips or "title" for title attribute.
     */
    tooltipType : 'qtip',

    /**
     * @cfg {String} buttonSelector
     * <p>(Optional) A {@link Ext.DomQuery DomQuery} selector which is used to extract the active, clickable element from the
     * DOM structure created.</p>
     * <p>When a custom {@link #template} is used, you  must ensure that this selector results in the selection of
     * a focussable element.</p>
     * <p>Defaults to <b><tt>"button:first-child"</tt></b>.</p>
     */
    buttonSelector : "button:first-child",

    /**
     * @cfg {String} scale
     * <p>(Optional) The size of the Button. Three values are allowed:</p>
     * <ul class="mdetail-params">
     * <li>"small"<div class="sub-desc">Results in the button element being 16px high.</div></li>
     * <li>"medium"<div class="sub-desc">Results in the button element being 24px high.</div></li>
     * <li>"large"<div class="sub-desc">Results in the button element being 32px high.</div></li>
     * </ul>
     * <p>Defaults to <b><tt>"small"</tt></b>.</p>
     */
    scale: 'small',

    /**
     * @cfg {String} iconAlign
     * <p>(Optional) The side of the Button box to render the icon. Four values are allowed:</p>
     * <ul class="mdetail-params">
     * <li>"top"<div class="sub-desc"></div></li>
     * <li>"right"<div class="sub-desc"></div></li>
     * <li>"bottom"<div class="sub-desc"></div></li>
     * <li>"left"<div class="sub-desc"></div></li>
     * </ul>
     * <p>Defaults to <b><tt>"left"</tt></b>.</p>
     */
    iconAlign : 'left',

    /**
     * @cfg {String} arrowAlign
     * <p>(Optional) The side of the Button box to render the arrow if the button has an associated {@link #menu}.
     * Two values are allowed:</p>
     * <ul class="mdetail-params">
     * <li>"right"<div class="sub-desc"></div></li>
     * <li>"bottom"<div class="sub-desc"></div></li>
     * </ul>
     * <p>Defaults to <b><tt>"right"</tt></b>.</p>
     */
    arrowAlign : 'right',

    /**
     * @cfg {Ext.Template} template (Optional)
     * An {@link Ext.Template} with which to create the Button's main element. This Template must
     * contain numeric substitution parameter 0 if it is to display the text property. Changing the template could
     * require code modifications if required elements (e.g. a button) aren't present.
     */
    /**
     * @cfg {String} cls
     * A CSS class string to apply to the button's main element.
     */

    initComponent : function(){
        Ext.Button.superclass.initComponent.call(this);

        this.addEvents(
            /**
             * @event click
             * Fires when this button is clicked
             * @param {Button} this
             * @param {EventObject} e The click event
             */
            "click",
            /**
             * @event toggle
             * Fires when the "pressed" state of this button changes (only if enableToggle = true)
             * @param {Button} this
             * @param {Boolean} pressed
             */
            "toggle",
            /**
             * @event mouseover
             * Fires when the mouse hovers over the button
             * @param {Button} this
             * @param {Event} e The event object
             */
            'mouseover',
            /**
             * @event mouseout
             * Fires when the mouse exits the button
             * @param {Button} this
             * @param {Event} e The event object
             */
            'mouseout',
            /**
             * @event menushow
             * If this button has a menu, this event fires when it is shown
             * @param {Button} this
             * @param {Menu} menu
             */
            'menushow',
            /**
             * @event menuhide
             * If this button has a menu, this event fires when it is hidden
             * @param {Button} this
             * @param {Menu} menu
             */
            'menuhide',
            /**
             * @event menutriggerover
             * If this button has a menu, this event fires when the mouse enters the menu triggering element
             * @param {Button} this
             * @param {Menu} menu
             * @param {EventObject} e
             */
            'menutriggerover',
            /**
             * @event menutriggerout
             * If this button has a menu, this event fires when the mouse leaves the menu triggering element
             * @param {Button} this
             * @param {Menu} menu
             * @param {EventObject} e
             */
            'menutriggerout'
        );
        if(this.menu){
            this.menu = Ext.menu.MenuMgr.get(this.menu);
        }
        if(typeof this.toggleGroup === 'string'){
            this.enableToggle = true;
        }
    },

    // protected
    getTemplateArgs : function(){
        var cls = (this.cls || '');
        cls += this.iconCls ? (this.text ? ' x-btn-text-icon' : ' x-btn-icon') : ' x-btn-noicon';
        if(this.pressed){
            cls += ' x-btn-pressed';
        }
        return [this.text || '&#160;', this.type, this.iconCls || '', cls, 'x-btn-' + this.scale + ' x-btn-icon-' + this.scale + '-' + this.iconAlign, this.getMenuClass()];
    },

    // protected
    getMenuClass : function(){
        return this.menu ? (this.arrowAlign != 'bottom' ? 'x-btn-arrow' : 'x-btn-arrow-bottom') : '';
    },

    // private
    onRender : function(ct, position){
        if(!this.template){
            if(!Ext.Button.buttonTemplate){
                // hideous table template
                Ext.Button.buttonTemplate = new Ext.Template(
                    '<table cellspacing="0" class="x-btn {3}"><tbody class="{4}">',
                    '<tr><td class="x-btn-tl"><i>&#160;</i></td><td class="x-btn-tc"></td><td class="x-btn-tr"><i>&#160;</i></td></tr>',
                    '<tr><td class="x-btn-ml"><i>&#160;</i></td><td class="x-btn-mc"><em class="{5}" unselectable="on"><button class="x-btn-text {2}" type="{1}">{0}</button></em></td><td class="x-btn-mr"><i>&#160;</i></td></tr>',
                    '<tr><td class="x-btn-bl"><i>&#160;</i></td><td class="x-btn-bc"></td><td class="x-btn-br"><i>&#160;</i></td></tr>',
                    "</tbody></table>");
                Ext.Button.buttonTemplate.compile();
            }
            this.template = Ext.Button.buttonTemplate;
        }

        var btn, targs = this.getTemplateArgs();

        if(position){
            btn = this.template.insertBefore(position, targs, true);
        }else{
            btn = this.template.append(ct, targs, true);
        }
        var btnEl = btn.child(this.buttonSelector);
        this.mon(btnEl, 'focus', this.onFocus, this);
        this.mon(btnEl, 'blur', this.onBlur, this);

        this.initButtonEl(btn, btnEl);

        Ext.ButtonToggleMgr.register(this);
    },

    // private
    initButtonEl : function(btn, btnEl){
        this.el = btn;

        if(this.id){
            this.el.dom.id = this.el.id = this.id;
        }
        if(this.icon){
            btnEl.setStyle('background-image', 'url(' +this.icon +')');
        }
        if(this.tabIndex !== undefined){
            btnEl.dom.tabIndex = this.tabIndex;
        }
        if(this.tooltip){
            if(typeof this.tooltip == 'object'){
                Ext.QuickTips.register(Ext.apply({
                      target: btnEl.id
                }, this.tooltip));
            } else {
                btnEl.dom[this.tooltipType] = this.tooltip;
            }
        }

        if(this.handleMouseEvents){
        	this.mon(btn, 'mouseover', this.onMouseOver, this);
        	this.mon(btn, 'mousedown', this.onMouseDown, this);
        	
            // new functionality for monitoring on the document level
            //this.mon(btn, "mouseout", this.onMouseOut, this);
        }

        if(this.menu){
        	this.mon(this.menu, 'show', this.onMenuShow, this);
        	this.mon(this.menu, 'hide', this.onMenuHide, this);
        }

        if(this.repeat){
            var repeater = new Ext.util.ClickRepeater(btn,
                typeof this.repeat == "object" ? this.repeat : {}
            );
            this.mon(repeater, 'click', this.onClick, this);
        }
		
        this.mon(btn, this.clickEvent, this.onClick, this);
    },

    // private
    afterRender : function(){
        Ext.Button.superclass.afterRender.call(this);
        if(Ext.isIE6){
            this.doAutoWidth.defer(1, this);
        }else{
            this.doAutoWidth();
        }
    },

    /**
     * Sets the CSS class that provides a background image to use as the button's icon.  This method also changes
     * the value of the {@link iconCls} config internally.
     * @param {String} cls The CSS class providing the icon image
     */
    setIconClass : function(cls){
        if(this.el){
            this.el.child(this.buttonSelector).replaceClass(this.iconCls, cls);
        }
        this.iconCls = cls;
    },

    // private
    beforeDestroy: function(){
    	if(this.rendered){
	        var btnEl = this.el.child(this.buttonSelector);
	        if(btnEl){
                if(typeof this.tooltip == 'object'){
                    Ext.QuickTips.unregister(btnEl);
                }
	        }
	    }
        Ext.destroy(this.menu);
    },

    // private
    onDestroy : function(){
        if(this.rendered){
            Ext.ButtonToggleMgr.unregister(this);
        }
    },

    // private
    doAutoWidth : function(){
        if(this.el && this.text && typeof this.width == 'undefined'){
            this.el.setWidth("auto");
            if(Ext.isIE7 && Ext.isStrict){
                var ib = this.el.child(this.buttonSelector);
                if(ib && ib.getWidth() > 20){
                    ib.clip();
                    ib.setWidth(Ext.util.TextMetrics.measure(ib, this.text).width+ib.getFrameWidth('lr'));
                }
            }
            if(this.minWidth){
                if(this.el.getWidth() < this.minWidth){
                    this.el.setWidth(this.minWidth);
                }
            }
        }
    },

    /**
     * Assigns this button's click handler
     * @param {Function} handler The function to call when the button is clicked
     * @param {Object} scope (optional) Scope for the function passed in
     */
    setHandler : function(handler, scope){
        this.handler = handler;
        this.scope = scope;
    },

    /**
     * Sets this button's text
     * @param {String} text The button text
     */
    setText : function(text){
        this.text = text;
        if(this.el){
            this.el.child("td.x-btn-mc " + this.buttonSelector).update(text);
        }
        this.doAutoWidth();
    },

    /**
     * Gets the text for this button
     * @return {String} The button text
     */
    getText : function(){
        return this.text;
    },

    /**
     * If a state it passed, it becomes the pressed state otherwise the current state is toggled.
     * @param {Boolean} state (optional) Force a particular state
     * @param {Boolean} supressEvent (optional) True to ttop events being fired when calling this method.
     */
    toggle : function(state, suppressEvent){
        state = state === undefined ? !this.pressed : !!state;
        if(state != this.pressed){
            this.el[state ? 'addClass' : 'removeClass']("x-btn-pressed");
            this.pressed = state;
            if(!suppressEvent){
                this.fireEvent("toggle", this, state);
                if(this.toggleHandler){
                    this.toggleHandler.call(this.scope || this, this, state);
                }
            }
        }
    },

    /**
     * Focus the button
     */
    focus : function(){
        this.el.child(this.buttonSelector).focus();
    },

    // private
    onDisable : function(){
        if(this.el){
            if(!Ext.isIE6 || !this.text){
                this.el.addClass(this.disabledClass);
            }
            this.el.dom.disabled = true;
        }
        this.disabled = true;
    },

    // private
    onEnable : function(){
        if(this.el){
            if(!Ext.isIE6 || !this.text){
                this.el.removeClass(this.disabledClass);
            }
            this.el.dom.disabled = false;
        }
        this.disabled = false;
    },

    /**
     * Show this button's menu (if it has one)
     */
    showMenu : function(){
        if(this.menu){
            this.menu.show(this.el, this.menuAlign);
        }
        return this;
    },

    /**
     * Hide this button's menu (if it has one)
     */
    hideMenu : function(){
        if(this.menu){
            this.menu.hide();
        }
        return this;
    },

    /**
     * Returns true if the button has a menu and it is visible
     * @return {Boolean}
     */
    hasVisibleMenu : function(){
        return this.menu && this.menu.isVisible();
    },

    // private
    onClick : function(e){
        if(e){
            e.preventDefault();
        }
        if(e.button != 0){
            return;
        }
        if(!this.disabled){
            if(this.enableToggle && (this.allowDepress !== false || !this.pressed)){
                this.toggle();
            }
            if(this.menu && !this.menu.isVisible() && !this.ignoreNextClick){
                this.showMenu();
            }
            this.fireEvent("click", this, e);
            if(this.handler){
                //this.el.removeClass("x-btn-over");
                this.handler.call(this.scope || this, this, e);
            }
        }
    },

    // private
    isMenuTriggerOver : function(e, internal){
        return this.menu && !internal;
    },

    // private
    isMenuTriggerOut : function(e, internal){
        return this.menu && !internal;
    },

    // private
    onMouseOver : function(e){
        if(!this.disabled){
            var internal = e.within(this.el,  true);
            if(!internal){
                this.el.addClass("x-btn-over");
                if(!this.monitoringMouseOver){
                    Ext.getDoc().on('mouseover', this.monitorMouseOver, this);
                    this.monitoringMouseOver = true;
                }
                this.fireEvent('mouseover', this, e);
            }
            if(this.isMenuTriggerOver(e, internal)){
                this.fireEvent('menutriggerover', this, this.menu, e);
            }
        }
    },

    // private
    monitorMouseOver : function(e){
        if(e.target != this.el.dom && !e.within(this.el)){
            if(this.monitoringMouseOver){
                Ext.getDoc().un('mouseover', this.monitorMouseOver, this);
                this.monitoringMouseOver = false;
            }
            this.onMouseOut(e);
        }
    },

    // private
    onMouseOut : function(e){
        var internal = e.within(this.el) && e.target != this.el.dom;
        this.el.removeClass("x-btn-over");
        this.fireEvent('mouseout', this, e);
        if(this.isMenuTriggerOut(e, internal)){
            this.fireEvent('menutriggerout', this, this.menu, e);
        }
    },
    // private
    onFocus : function(e){
        if(!this.disabled){
            this.el.addClass("x-btn-focus");
        }
    },
    // private
    onBlur : function(e){
        this.el.removeClass("x-btn-focus");
    },

    // private
    getClickEl : function(e, isUp){
       return this.el;
    },

    // private
    onMouseDown : function(e){
        if(!this.disabled && e.button == 0){
            this.getClickEl(e).addClass("x-btn-click");
            Ext.getDoc().on('mouseup', this.onMouseUp, this);
        }
    },
    // private
    onMouseUp : function(e){
        if(e.button == 0){
            this.getClickEl(e, true).removeClass("x-btn-click");
            Ext.getDoc().un('mouseup', this.onMouseUp, this);
        }
    },
    // private
    onMenuShow : function(e){
        this.ignoreNextClick = 0;
        this.el.addClass("x-btn-menu-active");
        this.fireEvent('menushow', this, this.menu);
    },
    // private
    onMenuHide : function(e){
        this.el.removeClass("x-btn-menu-active");
        this.ignoreNextClick = this.restoreClick.defer(250, this);
        this.fireEvent('menuhide', this, this.menu);
    },

    // private
    restoreClick : function(){
        this.ignoreNextClick = 0;
    }



    /**
     * @cfg {String} autoEl @hide
     */
});
Ext.reg('button', Ext.Button);

// Private utility class used by Button
Ext.ButtonToggleMgr = function(){
   var groups = {};

   function toggleGroup(btn, state){
       if(state){
           var g = groups[btn.toggleGroup];
           for(var i = 0, l = g.length; i < l; i++){
               if(g[i] != btn){
                   g[i].toggle(false);
               }
           }
       }
   }

   return {
       register : function(btn){
           if(!btn.toggleGroup){
               return;
           }
           var g = groups[btn.toggleGroup];
           if(!g){
               g = groups[btn.toggleGroup] = [];
           }
           g.push(btn);
           btn.on("toggle", toggleGroup);
       },

       unregister : function(btn){
           if(!btn.toggleGroup){
               return;
           }
           var g = groups[btn.toggleGroup];
           if(g){
               g.remove(btn);
               btn.un("toggle", toggleGroup);
           }
       },

       /**
        * Gets the pressed button in the passed group or null
        * @param {String} group
        * @return Button
        */
       getPressed : function(group){
           var g = groups[group];
           if(g){
               for(var i = 0, len = g.length; i < len; i++){
                   if(g[i].pressed === true){
                       return g[i];
                   }
               }
           }
           return null;
       }
   };
}();