import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { MAX_VOLUME, AVRStatus, VOLUME_INCREMENT } from './AVR';


type VolumeRowProps = {
    volume: number;
    isMute: boolean;

    setVolume: (volume: number) => void;
    toggleMute: () => void;
};

type VolumeRowState = {
    volume: number;
};

export default class VolumeRow extends React.Component<VolumeRowProps, VolumeRowState> {
    constructor(props: VolumeRowProps) {
        super(props);
        this.state = {
            volume: props.volume
        };
    }

    setVolume = (volume: number) => {
        this.props.setVolume(volume);
        this.setState({ volume });
    };

    volumeUp = () => {
        this.setVolume(this.state.volume + VOLUME_INCREMENT);
    };

    volumeDown = () => {
        this.setVolume(this.state.volume - VOLUME_INCREMENT);
    };

    toggleMute = () => {
        this.props.toggleMute();
    };

    updateVolumeLabel = (volume: number) => {
        this.setState({ volume });
    };

    renderMuteButton() {
        const isMute = this.props.isMute;
        const muteButtonStyles: Array<StyleProp<any>> = [styles.muteButton];
        if (isMute) {
            muteButtonStyles.push(styles.muteButtonMuted);
        }
        return (
            <TouchableOpacity style={muteButtonStyles} onPress={this.toggleMute}>
                <Text style={styles.muteButtonText}>{isMute ? "Unmute" : "Mute"}</Text>
            </TouchableOpacity>
        );
    }

    render() {
        const volume = this.state.volume;
        const volumePercentage = Math.round((volume / MAX_VOLUME) * 100);
        return (
            <View style={styles.volumeRow}>
                <View style={{ flex: 0.7, flexDirection: 'row' }}>
                    {this.renderMuteButton()}
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={styles.currentVolume}>{volumePercentage}%</Text>
                    </View>
                    {this.renderMuteButton()}
                </View>
                <View style={styles.volumeButtonsContainer}>
                    <TouchableOpacity style={styles.volumeButton} onPress={this.volumeDown}>
                        <Text style={{ fontSize: 20, color: 'white' }}>Down</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.volumeButton} onPress={this.volumeUp}>
                        <Text style={{ fontSize: 20, color: 'white' }}>Up</Text>
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

const styles = StyleSheet.create({
    volumeRow: {
        flex: 1.5
    },
    currentVolume: {
        fontSize: 40,
        fontWeight: 'bold',
        color: 'white'
    },
    muteButton: {
        borderRadius: 5,
        backgroundColor: '#646464',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
        width: 125
    },
    muteButtonMuted: {
        backgroundColor: '#aa1111'
    },
    muteButtonText: {
        fontSize: 20,
        color: 'white'
    },
    volumeSliderContainer: {
        flex: 1,
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
});
