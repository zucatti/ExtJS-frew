/*
 * Sample Image Organizer utilizing Ext.Direct
 * Tagging/Organizing into galleries
 * Image uploading
 * Title & Descriptions
 */

Ext.ns('Imgorg','Imgorg.App');
Imgorg.App = function() {
    var swfu;
    SWFUpload.onload = function() {
        var settings = {
            flash_url: "SWFUpload/Flash/swfupload.swf",
            upload_url: "php/router.php",
            file_size_limit: "20 MB",
            file_types: "*.*",
            file_types_description: "Image Files",
            file_upload_limit: 20,
            file_queue_limit: 20, 
            debug: true,
            button_placeholder_id: "btnUploadHolder",
            button_cursor: SWFUpload.CURSOR.HAND,
            button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
            file_queued_handler: function() {
                swfu.startUpload();
            },
            minimum_flash_version: "9.0.28",
            post_params: {
                extAction: 'Images',
                extUpload: true,
                extMethod: 'upload'
            }
        };
        swfu = new SWFUpload(settings);
    }
    var view, thumbPanel;
    return {
        debugSWF: true,
        init: function() {
            Ext.QuickTips.init();
            Ext.Direct.addProvider(Imgorg.REMOTING_API);
            
            new Ext.Viewport({
                layout: 'border',
                items: [{
                    xtype: 'img-albums',
                    id: 'album-tree',
                    region: 'west',
                    width: 180,
                    minWidth: 180,
                    maxWidth: 180,
                    collapsible: true,
                    split: true,
                    collapseMode: 'mini',
                    margins: '5 0 5 5',
                    cmargins: '0 0 0 0',
                    tbar: [{
                        text: 'Add Album',
                        iconCls: 'add',
                        scale: 'large',
                        handler: function() {
                            Ext.getCmp('album-tree').addAlbum();
                        }
                    },{
                        text: 'Upload',
                        iconCls: 'upload',
                        scale: 'large',
                        handler: function() {
                            swfu.selectFiles();
                        }
                    }],
                    listeners: {
                        click: this.onAlbumClick,
                        scope: this
                    }
                },{
                    xtype: 'tabpanel',
                    region: 'center',
                    id: 'img-tabpanel',
                    margins: '5 5 5 0',
                    activeItem: 0,
                    tabscroll: true,
                    items: this.getTabs()
                }]
            });
            
            thumbPanel = Ext.getCmp('images-view');
        },
        
        getTabs: function() {
            var tabs = [{
                xtype: 'img-thumbpanel',
                id:'images-view',
                dvConfig: {
                    listeners: {
                        dblclick: function(view, idx, node, e) {
                            var p = this.openImage(view.getStore().getAt(idx));
                            p.show();
                        },
                        viewitem: function(view, node) {
                            var recs = view.getSelectedRecords();
                            for (var i = 0;i < recs.length;i++) {
                                this.openImage(recs[i]);
                            }
                        },
                        scope: this
                    }
                }
            }];
            
            if (this.debugSWF) {
                tabs.push({
                    title: 'debug',
                    contentEl: 'SWFUpload_Console',
                    listeners: {
                        render: function() {
                            Ext.fly('SWFUpload_Console').applyStyles({height: '100%', width: '100%'});
                        }
                    }
                });
            }
            return tabs;
        },
        
        openImage: function(rec) {
            return Ext.getCmp('img-tabpanel').add({
                xtype: 'img-panel',
                title: rec.data.filename,
                url: rec.data.url
            });
        },
        
        onAlbumClick: function(node, e) {
            thumbPanel.albumFilter(node.attributes);
        }
    }
}();

Ext.onReady(Imgorg.App.init,Imgorg.App);

Ext.override(Ext.CompositeElementLite,{
    removeElement : function(keys, removeDom){
        var me = this, els = this.elements, el;	    	
	    Ext.each(keys, function(val){
		    if (el = (els[val] || els[val = me.indexOf(val)])) {
		    	if(removeDom) 
		    		el.dom ? el.remove() : Ext.removeNode(el);
		    	els.splice(val, 1);		    	
			}
	    });
        return this;
    }
});
