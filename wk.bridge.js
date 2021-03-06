/* wk.bridge.min.js | v0.2 */
(function() {
    if (window.isIOS) {
        return
    }
    window.isIOS = function () {
        return navigator && navigator.userAgent && (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent))
    }
}());
(function() {
    if (window.bridge) {
        return
    }
    window.bridge = function() {
        var callbacks = [], callbackID = 0, registerHandlers = [];
        document.addEventListener('PacificDidReceiveNativeCallback', function(e) {
            if (e.detail) {
                var detail = e.detail;
                var id = isNaN(parseInt(detail.id)) ? -1 : parseInt(detail.id)
                if (id != -1) {
                    callbacks[id] && callbacks[id](detail.parameters, detail.error);
                    delete callbacks[id];
                }
            }
        }, false);
        document.addEventListener('PacificDidReceiveNativeBroadcast', function(e) {
            if (e.detail) {
                var detail = e.detail;
                var name = detail.name
                if (name !== undefined && registerHandlers[name]) {
                    var namedListeners = registerHandlers[name]
                    if (namedListeners instanceof Array) {
                        var parameters = detail.parameters
                        // 使用压缩的话， 这句话压缩不过
                        // (handler) => { handler(parameters) }
                        namedListeners.forEach(function(handler){handler(parameters)})    
                    }
                }
            }
        }, false);
        return {
            'post': function(action, parameters, callback, print) {
                var id = callbackID++;
                callbacks[id] = callback
                if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.pacific) {
                    window.webkit.messageHandlers.pacific.postMessage({'action':action, 'parameters':parameters, 'callback': id, 'print': print || 0})
                }
            },
            'on': function(name, callback) {
                var namedListeners = registerHandlers[name]
                if (!namedListeners) {
                    registerHandlers[name] = namedListeners = []
                }
                namedListeners.push(callback);
                return function() {
                    namedListeners[indexOf(namedListeners, callback)] = null
                }
            },
            'off': function(name) {
                delete registerHandlers[name];
            }
        }
    }()
}());
/* window.bridge.post('test', {'key': 'value'}, (parameters, error)=>{ <# print parameters, error #> }); */
/* var unregisterHandler = window.bridge.on('userDidLogin', (parameters) => { <# receive notify from native #> } ); Call unregisterHandler() when cancel a listen. */