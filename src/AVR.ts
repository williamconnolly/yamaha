const ZONE = 'main';

export const VOLUME_INCREMENT = 1;
export const MAX_VOLUME = 161;

export enum PowerMode {
    ON = 'on',
    STANDBY = 'standby'
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

export type AVRInputNameMap = { [id: string]: string };

export type AVRStatus = {
    isOn: boolean;
    volume: number,
    isMute: boolean,
    currentInput: string,
};

type Callback = () => void;

function mapStatus(json: any): AVRStatus {
    return {
        isOn: json.power === PowerMode.ON,
        isMute: json.mute,
        volume: json.volume,
        currentInput: json.input
    }
}

export class AVR {
    ip: string;

    constructor() {
        this.ip = '192.168.7.96';
    }

    GET(...components: Array<string>): Promise<any> {
        const url = [`http://${this.ip}`, 'YamahaExtendedControl/v1', ...components].join('/');
        return fetch(url).then(response => response.json());
    }

    async getStatus(): Promise<AVRStatus> {
        return this.GET(ZONE, 'getStatus').then(status => {
            return mapStatus(status);
        });
    }

    async getInputs(): Promise<AVRInputNameMap> {
        return this.GET('system', 'getNameText').then(body => {
            const inputs: Array<AVRInput> = body.input_list;
            const inputNameMap: AVRInputNameMap = inputs
                .filter(input => ALL_INPUT_IDS.includes(input.id))
                .reduce((map, current) => {
                    return {
                        ...map,
                        [current.id]: current.text
                    }
                }, {});
            return inputNameMap;
        });
    }

    async setInput(input: string): Promise<void> {
        return this.GET(ZONE, `setInput?input=${input}`);
    }

    async setPower(isOn: boolean): Promise<void> {
        const mode = isOn ? PowerMode.ON : PowerMode.STANDBY;
        return this.GET(ZONE, `setPower?power=${mode}`);
    }

    async setMute(isMute: boolean): Promise<void> {
        return this.GET(ZONE, `setMute?enable=${isMute}`);
    }

    async setVolume(volume: number): Promise<void> {
        return this.GET(ZONE, `setVolume?volume=${volume}`);
    }
}
