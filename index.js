(function Web3SwiftJS() {
    require("./wk.bridge");
    const ZeroClientProvider = require('web3-provider-engine/zero.js');
    const Web3 = require("web3");
    const getAccountsProxified = function(cb) {
        console.log("JS bridging accounts access");
        if (typeof window !== 'undefined' && window.bridge) {
            window.bridge.post('eth_getAccounts', {}, (parameters, error) => {
                if (error) {
                    cb(error.description, null);
                }
                cb(null, parameters['accounts']);
            });
    
        } else {
            console.log("No bridge to native code is found");
            cb(true, null);
        }
    }
    const getCoinbaseProxified = function(cb) {
        console.log("JS bridging coinbase access");
        if (typeof window !== 'undefined' && window.bridge) {
            window.bridge.post('eth_coinbase', {}, (parameters, error) => {
                if (error) {
                    cb(error.description, null);
                }
                cb(null, parameters['coinbase']);
            });
    
        } else {
            console.log("No bridge to native code is found");
            cb(true, null);
        }
    }
    const getRPCurl = function(cb) {
        console.log("JS bridging rpc url access");
        if (typeof window !== 'undefined' && window.bridge) {
            window.bridge.post('getRPCurl', {}, (parameters, error) => {
                if (error) {
                    cb(error.description, null);
                }
                cb(null, parameters['rpcURL']);
            });
    
        } else {
            console.log("No bridge to native code is found");
            cb(true, null);
        }
    }
    const signTransactionProxified = function(tx, cb) {
        console.log("JS bridging sign transaction access");
        if (typeof window !== 'undefined' && window.bridge) {
            window.bridge.post('eth_signTransaction', {transaction: tx}, (parameters, error) => {
                if (error) {
                    cb(error.description, null);
                }
                cb(null, parameters['signedTransaction']);
            });
    
        } else {
            console.log("No bridge to native code is found");
            cb(true, null);
        }
    }
    const signPersonalMessageProxified = function(payload, cb) {
        console.log("JS bridging sign message access");
        if (typeof window !== 'undefined' && window.bridge) {
            window.bridge.post('eth_sign', {payload}, (parameters, error) => {
                if (error) {
                    cb(error.description, null);
                }
                const result = parameters['signedMessage'];
                cb(null, result);
            });
    
        } else {
            console.log("No bridge to native code is found");
            cb(true, null);
        }
    }


    getRPCurl(function(err, rpcUrl) {
        if (err) {
            console.log("Can not init web3 and proxy");
            return;
        }
        console.log("Using RPC URL " + rpcUrl);
        const engine = ZeroClientProvider({
            getAccounts: getAccountsProxified,
            signTransaction: signTransactionProxified,
            signMessage: signPersonalMessageProxified,
            signPersonalMessage: signPersonalMessageProxified,
            rpcUrl: rpcUrl,
        });
        window.Web3 = Web3;
        const web3 = new Web3();
        web3.setProvider(engine);
        if (typeof window !== 'undefined') {
            window.web3 = web3;
        }
          // log new blocks
        engine.on('block', function(block){
            console.log('BLOCK CHANGED:', '#'+block.number.toString('hex'), '0x'+block.hash.toString('hex'))
        })
    });
}());


  




