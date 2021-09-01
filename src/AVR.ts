const ZONE = 'main';

export const VOLUME_INCREMENT = 1;
export const MAX_VOLUME = 161;

export enum PowerMode {
    ON = 'on',
    OFF = 'standby'
}

// export type InputOption = {
//     "spotify",
//     "amazon_music",
//     "alexa",
//     "bluetooth",
//     "hdmi1",
//     "hdmi2",
//     "hdmi3",
//     "hdmi4",
//     "hdmi5",
//     "aux"
// }

export const INPUT_ROWS = [
    ['hdmi1', 'hdmi2'],
    ['hdmi3', 'hdmi4', 'hdmi5'],
    ['spotify', 'bluetooth']
];

const ALL_INPUT_IDS = INPUT_ROWS.flat();

export type AVRInput = {
    id: string;
    text: string;
}

export type Status = {
    isOn: boolean;
    volume: number,
    mute: boolean,
    currentInput: string,
    inputNames: { [id: string]: string };
};

function mapStatus(json: any): Status {
    return {
        isOn: json.power === PowerMode.ON,
        volume: json.volume,
        mute: json.mute,
        currentInput: json.input,
        inputNames: {}
    }
}

export class AVR {
    ip: string;
    status: Status;

    constructor() {
        this.ip = '192.168.7.96';
        this.status = mapStatus({});
    }

    _url(...components: Array<string>): string {
        return [`http://${this.ip}`, 'YamahaExtendedControl/v1', ...components].join('/');
    }

    _GET(...components: Array<string>): Promise<any> {
        return fetch(this._url(...components)).then(response => response.json());
    }

    initialize(cb: Function) {
        this.updateStatus(() => {
            this.getInputs(cb);
        });
    }

    updateStatus(cb: Function) {
        this._GET(ZONE, 'getStatus').then(status => {
            this.status = mapStatus(status);
            cb(status);
        });
    }

    getInputs(cb: Function) {
        this._GET('system', 'getNameText').then(body => {
            const inputs: Array<AVRInput> = body.input_list;
            this.status.inputNames = inputs.filter(input => ALL_INPUT_IDS.includes(input.id))
                .reduce((map, current) => {
                    return {
                        ...map,
                        [current.id]: current.text
                    }
                }, {});
            console.log('input names: ', this.status.inputNames);
            cb();
        });
    }

    setInput(input: string, cb: Function) {
        this._GET(ZONE, `setInput?input=${input}`).then(() => {
            cb(input);
        });
    }

    togglePower(cb: Function) {
        this._GET(ZONE, 'setPower?power=toggle').then(() => {
            this.status.isOn = !this.status.isOn;
            cb(this.status.isOn);
        });
    }

    setVolume(volume: number, cb: Function) {
        this._GET(ZONE, `setVolume?volume=${volume}`).then((response) => {
            this.status.volume = volume;
            cb(this.status.volume);
        });
    }
}
