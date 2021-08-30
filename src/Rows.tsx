import React from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { AVR, MAX_VOLUME, VOLUME_INCREMENT } from './AVR';

export type CommonRowProps = {
    avr: AVR
}
export type PowerRowState = {
    isOn: boolean;
}

export class PowerRow extends React.Component<CommonRowProps, PowerRowState> {
    constructor(props: CommonRowProps) {
        super(props);
        this.state = {
            isOn: props.avr.status.isOn
        };
    }

    togglePower() {
        this.props.avr.togglePower((isOn: boolean) => {
            this.setState({ isOn });
        });
    }

    render() {
        const isOn = this.props.avr.status.isOn;
        const toggleTitle = isOn ? 'Turn Off' : 'Turn On';
        const buttonStyles = [styles.powerButton];
        if (!isOn) {
            buttonStyles.push(styles.powerButtonGreen);
        }
        return (
            <View style={styles.powerRow}>
                <TouchableOpacity onPress={() => this.togglePower()} style={buttonStyles}>
                    <Text style={styles.powerButtonLabel}>{toggleTitle}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const powerStyles: StyleSheet.NamedStyles<any> = {
    powerRow: {
        flex: 0.3,
        padding: 10
    },
    powerButton: {
        backgroundColor: '#aa1111',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    powerButtonGreen: {
        backgroundColor: '#11aa11'
    },
    powerButtonLabel: {
        fontSize: 40,
        color: 'white'
    },
};

type InputButtonProps = {
    id: string;
    name: string;

    onPress: Function;
};

class InputButton extends React.Component<InputButtonProps> {
    constructor(props: InputButtonProps) {
        super(props);
    }

    render() {
        const { id, name, onPress} = this.props;
        return (
            <TouchableOpacity style={styles.inputButton} onPress={() => onPress()}>
                <Text style={styles.inputButtonName}>{name}</Text>
                <Text style={styles.inputButtonId}>{id}</Text>
            </TouchableOpacity>
        );
    }
}

type InputRowState = {
    currentInput: string;
};

export class InputRow extends React.Component<CommonRowProps, InputRowState> {
    constructor(props: CommonRowProps) {
        super(props);
        this.state = {
            currentInput: props.avr.status.currentInput
        };
    }

    render() {
        const identity = () => {};
        return (
            <View style={styles.inputRow}>
                <View style={styles.currentInputRow}>
                    <Text style={{ fontSize: 20 }}>{this.state.currentInput}</Text>
                </View>
                <View style={styles.inputButtonRow}>
                    <InputButton id={'aaaaaa'} name={'Spotify'} onPress={identity} />
                    <InputButton id={'aaaaaa'} name={'Bluetooth'} onPress={identity} />
                    <InputButton id={'aaaaaa'} name={'Playstation'} onPress={identity} />
                </View>
                <View style={styles.inputButtonRow}>
                    <InputButton id={'aaaaaa'} name={'Spotify'} onPress={identity} />
                    <InputButton id={'aaaaaa'} name={'Bluetooth'} onPress={identity} />
                    <InputButton id={'aaaaaa'} name={'Playstation'} onPress={identity} />
                </View>
                <View style={styles.inputButtonRow}>
                    <InputButton id={'aaaaaa'} name={'Spotify'} onPress={identity} />
                    <InputButton id={'aaaaaa'} name={'Bluetooth'} onPress={identity} />
                    <InputButton id={'aaaaaa'} name={'Playstation'} onPress={identity} />
                </View>
            </View>
        );
    }
}

const inputStyles: StyleSheet.NamedStyles<any> = {
    inputRow: {
        backgroundColor: '#646464',
        paddingBottom: 5,
        flex: 3
    },
    currentInputRow: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputButtonRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 3
    },
    inputButton: {
        backgroundColor: '#323232',
        borderRadius: 10,
        justifyContent: 'space-around',
        alignItems: 'center',
        width: 130
    },
    inputButtonName: {
        fontSize: 20,
        color: 'white'
    },
    inputButtonId: {
        fontSize: 16,
        color: 'white'
    }
}

type VolumeRowState = {
    volume: number;
}

export class VolumeRow extends React.Component<CommonRowProps, VolumeRowState> {
    constructor(props: CommonRowProps) {
        super(props);
        this.state = {
            volume: props.avr.status.volume
        }
    }

    setVolume = (volume: number) => {
        this.props.avr.setVolume(volume, (actualVolume: number) => {
            this.setState({
                volume: actualVolume
            });
        });
    };

    volumeUp = () => {
        this.props.avr.setVolume(this.state.volume + VOLUME_INCREMENT, (volume: number) => {
            this.setState({ volume });
        })
    };

    volumeDown = () => {
        this.props.avr.setVolume(this.state.volume - VOLUME_INCREMENT, (volume: number) => {
            this.setState({ volume });
        })
    };

    updateVolumeLabel = (volume: number) => {
        this.setState({ volume });
    };

    render() {
        const volume = this.state.volume;
        return (
            <View style={styles.volumeRow}>
                <View style={{ flex: 0.7, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={styles.currentVolume}>{volume}</Text>
                </View>
                <View style={styles.volumeButtonsContainer}>
                    <TouchableOpacity style={styles.volumeButton} onPress={this.volumeDown}>
                        <Text style={{ fontSize: 20, color: 'black' }}>Down</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.volumeButton} onPress={this.volumeUp}>
                        <Text style={{ fontSize: 20, color: 'black' }}>Up</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.volumeSliderContainer}>
                    <Slider
                        style={styles.volumeSlider}
                        onSlidingComplete={this.setVolume}
                        onValueChange={this.updateVolumeLabel}
                        value={volume}
                        minimumValue={0}
                        maximumValue={MAX_VOLUME}
                        step={1}
                        minimumTrackTintColor="#FFFFFF"
                        maximumTrackTintColor="#000000"
                    />
                </View>
            </View>
        );
    }
}

const volumeStyles: StyleSheet.NamedStyles<any> = {
    volumeRow: {
        flex: 1.5
    },
    currentVolume: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white'
    },
    volumeSliderContainer: {
        flex: 1,
        backgroundColor: 'orange',
        justifyContent: 'center',
        alignItems: 'center',
    },
    volumeButtonsContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    volumeButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 20,
        color: 'black',
        borderRadius: 5,
        height: 50,
        marginHorizontal: 10,
        backgroundColor: '#646464'
    },
    volumeSlider: {
        flex: 1,
        height: 50,
        width: '100%',
        backgroundColor: '#646464',
        paddingLeft: 30
    }
};

const styles = StyleSheet.create({
    ...powerStyles,
    ...inputStyles,
    ...volumeStyles
});
