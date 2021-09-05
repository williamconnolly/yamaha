import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type PowerRowProps = {
    isOn: boolean;
    togglePower: () => void;
};

export default class PowerRow extends React.Component<PowerRowProps> {
    constructor(props: PowerRowProps) {
        super(props);
    }

    render() {
        const { isOn, togglePower } = this.props;
        const toggleTitle = isOn ? 'Turn Off' : 'Turn On';
        const buttonStyles: Array<StyleProp<any>> = [styles.powerButton];
        if (!isOn) {
            buttonStyles.push(styles.powerButtonGreen);
        }
        return (
            <View style={styles.powerRow}>
                <TouchableOpacity onPress={togglePower} style={buttonStyles}>
                    <Text style={styles.powerButtonLabel}>{toggleTitle}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
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
});
