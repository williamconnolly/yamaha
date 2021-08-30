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
        flex: 0.5,
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

};

class InputButton extends React.Component<InputButtonProps> {
    constructor(props: InputButtonProps) {
        super(props);
    }

    render() {
        
    }
}

type InputRowState = {};

export class InputRow extends React.Component<CommonRowProps> {
    constructor(props: CommonRowProps) {
        super(props);
    }

    render() {
        // const { currentInput, inputLeft, inputRight } = this.props;
        return (
            <View style={styles.inputRow}>
                <Text>Current input UR MOM</Text>
                {/*<View style={styles.inputButtons}>*/}
                {/*    <View style={styles.inputButtonContainer}>*/}
                {/*        <Button title="<--" onPress={() => inputLeft()} />*/}
                {/*    </View>*/}
                {/*    <View style={styles.inputButtonContainer}>*/}
                {/*        <Button title="-->" onPress={() => inputRight()} />*/}
                {/*    </View>*/}
                {/*</View>*/}
            </View>
        );
    }
}

const inputStyles: StyleSheet.NamedStyles<any> = {
    inputRow: {
        backgroundColor: '#646464',
        flex: 3
    },
    inputButtons: {
        flexDirection: 'row'
    },
    inputButtonContainer: {
        flex: 1
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
