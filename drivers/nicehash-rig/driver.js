'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const homey_1 = __importDefault(require("homey"));
const lib_1 = __importDefault(require("../../nicehash/lib"));
class NiceHashRigDriver extends homey_1.default.Driver {
    /**
     * onInit is called when the driver is initialized.
     */
    async onInit() {
        this.log('NiceHashRigDriver has been initialized');
        this.niceHashLib = new lib_1.default();
        const setPowerModeAction = this.homey.flow.getActionCard('set_power_mode');
        setPowerModeAction.registerRunListener(async (args, state) => {
            var _a;
            await ((_a = this.niceHashLib) === null || _a === void 0 ? void 0 : _a.setRigPowerMode(args.device.details.rigId, args.power_mode));
            return true;
        });
        const setSmartModeAction = this.homey.flow.getActionCard('set_smart_mode');
        setSmartModeAction.registerRunListener(async (args, state) => {
            await args.device.setCapabilityValue('smart_mode', args.smart_mode);
            return true;
        });
        const setSmartModeMinProfitAction = this.homey.flow.getActionCard('set_smart_mode_min_profitability');
        setSmartModeMinProfitAction.registerRunListener(async (args, state) => {
            await args.device.setSmartModeMinProfitability(args.smart_mode_min_profitability);
            return true;
        });
    }
    /**
     * onPairListDevices is called when a user is adding a device and the 'list_devices' view is called.
     * This should return an array with the data of devices that are available for pairing.
     */
    async onPairListDevices() {
        var _a;
        this.rigs = await ((_a = this.niceHashLib) === null || _a === void 0 ? void 0 : _a.getRigs());
        const deviceArray = [];
        for (const rig of this.rigs.miningRigs) {
            deviceArray.push({
                name: rig.name,
                data: {
                    id: rig.rigId,
                },
            });
        }
        return deviceArray;
    }
}
module.exports = NiceHashRigDriver;
