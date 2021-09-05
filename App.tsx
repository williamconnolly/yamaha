import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { produce } from 'immer';
import { AppState as ReactNativeAppState, StyleSheet, Vibration, View, Text } from 'react-native';
import FlashMessage, { MessageOptions, showMessage } from 'react-native-flash-message';
import { AVR, AVRInputNameMap, AVRStatus } from './src/AVR';
import VolumeRow from './src/VolumeRow';
import PowerRow from './src/PowerRow';
import InputRow from './src/InputRow';

type AppProps = {};
type AppState = {
    isLoaded: boolean;
    status: AVRStatus,
    inputs: AVRInputNameMap
}

function registerOnActivate(callback: () => void) {
    ReactNativeAppState.addEventListener(
        'change',
        nextAppState => {
            if (nextAppState === 'active') {
                callback();
            }
        }
    );
}

const MESSAGE_OPTIONS: MessageOptions = {
    message: 'Turn on AVR First',
    type: 'danger',
    hideOnPress: true,
    style: {
        width: 300,
        height: 150,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleStyle: {
        fontSize: 24,
        lineHeight: 30,
        fontWeight: 'bold',
        marginTop: 15,
        // alignItems: 'center',
        // justifyContent: 'center'
    }
};

class App extends React.Component<AppProps, AppState> {
    avr: AVR;

    constructor(props: any) {
        super(props);
        this.state = {
            isLoaded: false,
            status: {
                isOn: false,
                volume: 0,
                isMute: false,
                currentInput: ''
            },
            inputs: {}
        };
        this.avr = new AVR();
    }

    async componentDidMount() {
        const status = await this.avr.getStatus();
        const inputs = await this.avr.getInputs();
        this.setState({
            isLoaded: true,
            status,
            inputs
        });

        // in case manually changed with remote while app is in background
        registerOnActivate(async () => {
            this.setState({
                status: await this.avr.getStatus()
            });
        });
    }

    checkAllowed(checkIsOn: boolean): boolean {
        if (checkIsOn && !this.state.status.isOn) {
            Vibration.vibrate(500);
            showMessage(MESSAGE_OPTIONS);
            return false;
        }
        Vibration.vibrate(100);
        return true;
    }

    async togglePower() {
        this.checkAllowed(false);
        const isOn = !this.state.status.isOn;
        await this.avr.setPower(isOn);
        this.setState(produce(this.state, (draftState) => {
            draftState.status.isOn = isOn;
            return draftState;
        }));
    }

    async toggleMute() {
        if (!this.checkAllowed(true)) return;
        const isMute = !this.state.status.isMute;
        await this.avr.setMute(isMute);
        this.setState(produce(this.state, (draftState) => {
            draftState.status.isMute = isMute;
            return draftState;
        }));
    }

    async setVolume(volume: number): Promise<boolean> {
        if (!this.checkAllowed(true)) return false;
        await this.avr.setVolume(volume)
        this.setState(produce(this.state, (draftState) => {
            draftState.status.volume = volume;
            return draftState;
        }));
        return true;
    }

    async setInput(input: string) {
        if (!this.checkAllowed(true)) return;
        await this.avr.setInput(input);
        this.setState(produce(this.state, (draftState) => {
            draftState.status.currentInput = input;
            return draftState;
        }));
    }

    render() {
        if (!this.state.isLoaded) {
            return <View style={styles.container}>
                <Text>Loading</Text>
            </View>
        }
        const { currentInput, isOn, isMute, volume } = this.state.status;
        const inputs = this.state.inputs;
        return (
            <View style={styles.container}>
                <FlashMessage position={'center'} />
                <PowerRow isOn={isOn}
                          togglePower={() => this.togglePower()}
                />
                <InputRow currentInput={currentInput}
                          inputs={inputs}
                          setInput={input => this.setInput(input)}
                />
                <VolumeRow volume={volume}
                           isMute={isMute}
                           setVolumeIfAllowed={volume => this.setVolume(volume)}
                           toggleMute={() => this.toggleMute()}
                />
                <StatusBar style="auto" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#323232'
    }
});

export default App;
