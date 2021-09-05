import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { produce } from 'immer';
import { AppState as ReactNativeAppState, StyleSheet, View, Text } from 'react-native';
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

    componentDidMount() {
        this.avr.getStatus(status => {
            this.avr.getInputs(inputs => {
                this.setState({
                    isLoaded: true,
                    status,
                    inputs
                });
            });
        });
        // in case manually changed with remote while app is in background
        registerOnActivate(() => {
            this.avr.getStatus(status => {
                this.setState({ status });
            });
        })
    }

    togglePower = () => {
        const isOn = !this.state.status.isOn;
        this.avr.setPower(isOn, () => {
            this.setState(produce(this.state, (draftState) => {
                draftState.status.isOn = isOn;
                return draftState;
            }));
        })
    };

    toggleMute = () => {
        const isMute = !this.state.status.isMute;
        this.avr.setMute(isMute, () => {
            this.setState(produce(this.state, (draftState) => {
                draftState.status.isMute = isMute;
                return draftState;
            }));
        })
    };

    setVolume = (volume: number) => {
        this.avr.setVolume(volume, () => {
            this.setState(produce(this.state, (draftState) => {
                draftState.status.volume = volume;
                return draftState;
            }));
        })
    };

    setInput = (input: string) => {
        this.avr.setInput(input, () => {
            this.setState(produce(this.state, (draftState) => {
                draftState.status.currentInput = input;
                return draftState;
            }));
        })
    };

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
                <PowerRow isOn={isOn}
                          togglePower={this.togglePower}
                />
                <InputRow currentInput={currentInput}
                          inputs={inputs}
                          setInput={this.setInput}
                />
                <VolumeRow volume={volume}
                           isMute={isMute}
                           setVolume={this.setVolume}
                           toggleMute={this.toggleMute}
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
