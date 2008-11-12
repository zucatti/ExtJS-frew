Ext.direct.RemotingProvider = Ext.extend(Ext.direct.JsonProvider, {
    priority: 1,
    enableBuffer: 10,
    maxRetries: 1,

    constructor : function(config){
        Ext.direct.RemotingProvider.superclass.constructor.call(this, config);
        this.addEvents('beforecall', 'call');
        this.namespace = this.namespace || window;
        this.transactions = {};
        this.callBuffer = [];
    },

    initAPI : function(){
        var o = this.actions;
        for(var c in o){
            var cls = this.namespace[c] || (this.namespace[c] = {});
            var ms = o[c];
            for(var i = 0, len = ms.length; i < len; i++){
                var m = ms[i];
                cls[m.name] = this.createMethod(c, m);
            }
        }
    },

    isConnected: function(){
        return !!this.connected;
    },

    connect: function(){
        if(this.url){
            this.initAPI();
            this.connected = true;
            this.fireEvent('connect', this);
        }else if(!this.url){
            throw 'Error initializing RemotingProvider, no url configured.';
        }
    },

    disconnect: function(){
        if(this.connected){
            this.connected = false;
            this.fireEvent('disconnect', this);
        }
    },

    onData: function(opt, success, xhr){
        if(success){
            var events = this.getEvents(xhr);
            for(var i = 0, len = events.length; i < len; i++){
                var e = events[i];
                var t = e.getTransaction();
                this.fireEvent('data', this, e);
                if(t){
                    this.doCallback(t, e, true);
                    Ext.Direct.removeTransaction(t);
                }
            }
        }else{
            var ts = [].concat(opt.ts);
            for(var i = 0, len = ts.length; i < len; i++){
                var t = this.getTransaction(opt.ts[i]);
                if(t && t.retryCount < this.maxRetries){
                    t.retry();
                }else{
                    var e = new Ext.Direct.ExceptionEvent({
                        data: e,
                        transaction: t,
                        code: Ext.Direct.exceptions.TRANSPORT,
                        message: 'Unable to connect to the server.',
                        xhr: xhr
                    });
                    this.fireEvent('data', this, e);
                    if(t){
                        this.doCallback(t, e, false);
                        Ext.Direct.removeTransaction(t);
                    }
                }
            }
        }
    },

    getCallData: function(t){
        return {
            action: t.action,
            method: t.method,
            data: t.data,
            type: 'rpc',
            tid: t.tid
        };
    },

    doSend : function(data){
        var o = {
            url: this.url,
            callback: this.onData,
            scope: this
        };

        // send only needed data
        var callData;
        if(Ext.isArray(data)){
            callData = [];
            for(var i = 0, len = data.length; i < len; i++){
                callData.push(this.getCallData(data[i]));
            }
        }else{
            callData = this.getCallData(data);
        }

        if(this.enableUrlEncode){
            var params = {};
            params[typeof this.enableUrlEncode == 'string' ? this.enableUrlEncode : 'data'] = Ext.encode(callData);
            o.params = params;
        }else{
            o.jsonData = callData;
        }
        Ext.Ajax.request(o);
    },

    combineAndSend : function(){
        var len = this.callBuffer.length;
        if(len > 0){
            this.doSend(len == 1 ? this.callBuffer[0] : this.callBuffer);
            this.callBuffer = [];
        }
    },

    queueTransaction: function(t){
        this.callBuffer.push(t);
        if(this.enableBuffer){
            if(!this.callTask){
                this.callTask = new Ext.util.DelayedTask(this.combineAndSend, this);
            }
            this.callTask.delay(typeof this.enableBuffer == 'number' ? this.enableBuffer : 10);
        }else{
            this.combineAndSend();
        }
    },

    doCall : function(c, m, args){
        var data = null, hs = args[m.len], scope = args[m.len+1];

        if(m.len !== 0){
            data = args.slice(0, m.len);
        }

        var t = new Ext.Direct.Transaction({
            provider: this,
            args: args,
            action: c,
            method: m.name,
            data: data,
            cb: scope && typeof hs == 'function' ? hs.createDelegate(scope) : hs
        });

        if(this.fireEvent('beforecall', this, t) !== false){
            Ext.Direct.addTransaction(t);
            this.queueTransaction(t);
            this.fireEvent('call', this, t);
        }
    },

    doForm : function(c, m, form, callback, scope){
        var t = new Ext.Direct.Transaction({
            provider: this,
            action: c,
            method: m.name,
            args:[form, callback, scope],
            cb: scope && typeof callback == 'function' ? callback.createDelegate(scope) : callback
        });

        if(this.fireEvent('beforecall', this, t) !== false){
            Ext.Direct.addTransaction(t);

            form = Ext.getDom(form);
            var isUpload = String(form.getAttribute("enctype")).toLowerCase() == 'multipart/form-data';

            var params = {
                extTID: t.tid,
                extAction: c,
                extMethod: m.name,
                extUpload: String(isUpload)
            };
            if(callback && typeof callback == 'object'){
                Ext.apply(params, callback.params);
            }
            Ext.Ajax.request({
                url: this.url,
                params: params,
                callback: this.onData,
                scope: this,
                form: form,
                isUpload: isUpload,
                ts: t
            });
        }
    },

    createMethod : function(c, m){
        var f;
        if(!m.formHandler){
            f = function(){
                this.doCall(c, m, Array.prototype.slice.call(arguments, 0));
            }.createDelegate(this);
        }else{
            f = function(form, callback, scope){
                this.doForm(c, m, form, callback, scope);
            }.createDelegate(this);
        }
        f.directCfg = {
            action: c,
            method: m
        };
        return f;
    },

    getTransaction: function(opt){
        return opt && opt.tid ? Ext.Direct.getTransaction(opt.tid) : null;
    },

    doCallback: function(t, e){
        var fn = e.status ? 'success' : 'failure';
        if(t && t.cb){
            var hs = t.cb;
            var result = e.result || e.data;
            if(typeof hs == 'function'){
                hs(result, e);
            } else{
                Ext.callback(hs[fn], hs.scope, [result, e]);
                Ext.callback(hs.callback, hs.scope, [result, e]);
            }
        }
    }
});
Ext.Direct.PROVIDERS['remoting'] = Ext.direct.RemotingProvider;