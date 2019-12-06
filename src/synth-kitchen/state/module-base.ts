import { ModuleType, IConnector, IModule } from "./patch";
import { uniqueId } from "../io/utils/unique-id";
import { audioContext } from "../io/utils/audio-context";
import { IParameterProps } from "../ui/patch-module-parameter";
import { ISettingProps } from "../ui/patch-module-setting";
import { delay } from "q";

export interface IModuleDefinition {
    moduleKey: string;
    type: ModuleType;
    name: string;
    controls: ControlsArray;
    nodes: any;
    input: IConnector;
    output: IConnector;
    // parameters: IParameter[] ???
}

export interface IControl {
    connector: IConnector;
    parameter?: IParameterProps;
    setting?: ISettingProps;
}

type ControlsArray = Array<[IControl] | [IControl, IControl]>;


const uninitializedConnector = (): IConnector => ({ id: '', name: '', type: 'uninitialized', getter: () => { } });


export class Module implements IModuleDefinition {
    moduleKey = uniqueId() as string;
    name = '';
    controls: ControlsArray = [];
    nodes: any = {};
    input = uninitializedConnector();
    output = uninitializedConnector();

    constructor(public type: ModuleType, serializedState?: IModuleDefinition) {
        switch (this.type) {
            case 'DELAY':
                this.name = 'delay';
                this.nodes = {
                    delay: audioContext.createDelay()
                };
                this.input = {
                    id: `${this.moduleKey}_input`,
                    name: 'input',
                    type: 'SIGNAL_IN',
                    getter: () => this.nodes.delay
                };
                this.output = {
                    id: `${this.moduleKey}_output`,
                    name: 'output',
                    type: 'SIGNAL_OUT',
                    getter: () => this.nodes.delay
                };
                const delayTime: IConnector = {
                    id: `${this.moduleKey}_delayTime_cv`,
                    name: 'delay',
                    type: 'CV_IN',
                    getter: () => this.nodes.delay.delayTime
                };
                this.controls = [
                    [/* delayTime knob */{
                        connector: delayTime,
                        parameter: {
                            moduleKey: this.moduleKey,
                            id: delayTime.id,
                            name: delayTime.name
                        }
                    }]
                ];
                break;
            case 'FILTER':
                break;
            case 'GAIN':
                break;
            case 'OSCILLATOR':
                break;
        }
        this.init(serializedState);
    }

    init(serializedState?: IModuleDefinition) {
        if (serializedState) {
            console.log(serializedState);
        }
    }
}