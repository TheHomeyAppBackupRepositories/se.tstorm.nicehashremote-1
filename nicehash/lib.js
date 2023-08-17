'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = __importDefault(require("./api"));
const fetch = require('node-fetch');
class Lib {
    async init(options) {
        try {
            // console.log('Init with options:')
            // console.log(options);
            Lib.niceHashApi = new api_1.default({
                apiHost: 'https://api2.nicehash.com',
                locale: options.locale,
                apiKey: options.apiKey,
                apiSecret: options.apiSecret,
                orgId: options.orgId,
            });
            await Lib.niceHashApi.getTime().catch((err) => { });
            console.log(`NiceHash server time is ${Lib.niceHashApi.time}`);
            const rigs = await this.getRigs();
            console.log(`${rigs.miningRigs.length} rigs found`);
            return true;
        }
        catch (ex) {
            console.log(ex);
        }
        return false;
    }
    async getRigs() {
        return await Lib.niceHashApi.get('/main/api/v2/mining/rigs2').catch((err) => { console.log(err.message); });
    }
    async getRigDetails(rigId) {
        return await Lib.niceHashApi.get(`/main/api/v2/mining/rig2/${rigId}`).catch((err) => { console.log(err.message); });
    }
    async getAlgorithms() {
        return await Lib.niceHashApi.get('/main/api/v2/mining/algorithms').catch((err) => { console.log(err.message); });
    }
    async setRigStatus(rigId, on) {
        const body = {
            rigId,
            action: (on ? 'START' : 'STOP'),
        };
        return await Lib.niceHashApi.post('/main/api/v2/mining/rigs/status2', { body }).catch((err) => { console.log(err.message); });
    }
    async setRigPowerMode(rigId, mode) {
        const body = {
            rigId,
            action: 'POWER_MODE',
            options: [mode],
        };
        return await Lib.niceHashApi.post('/main/api/v2/mining/rigs/status2', { body }).catch((err) => { console.log(err.message); });
    }
    getBitcoinRate(currency) {
        if (Lib.bitcoinTicker && Lib.bitcoinTicker[currency]) {
            return Lib.bitcoinTicker[currency];
        }
        return null;
    }
}
Lib.bitcoinTickerReq = (async function getBitcoinTicker() {
    setTimeout(getBitcoinTicker, 15 * 60 * 1000);
    fetch('https://blockchain.info/ticker')
        .then((res) => res.text())
        .then((text) => {
        Lib.bitcoinTicker = JSON.parse(text);
    })
        .catch((err) => { });
}());
exports.default = Lib;
