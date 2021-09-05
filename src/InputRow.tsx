import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AVRInputNameMap, INPUT_ROWS } from './AVR';

type InputButtonProps = {
    id: string;
    name: string;
    isCurrentInput: boolean;

    onPress: () => void;
};

class InputButton extends React.Component<InputButtonProps> {
    constructor(props: InputButtonProps) {
        super(props);
    }

    render() {
        const { id, name, isCurrentInput, onPress } = this.props;

        const buttonStyle: Array<StyleProp<any>> = [styles.inputButton];
        if (isCurrentInput) {
            buttonStyle.push(styles.currentInput);
        }
        return (
            <TouchableOpacity style={buttonStyle} onPress={() => onPress()}>
                <Text style={styles.inputButtonName}>{name}</Text>
                <Text style={styles.inputButtonId}>{id}</Text>
            </TouchableOpacity>
        );
    }
}

type InputRowProps = {
    currentInput: string;
    inputs: AVRInputNameMap;
    setInput: (input: string) => void;
}

export default class InputRow extends React.Component<InputRowProps> {
    constructor(props: InputRowProps) {
        super(props);
    }

    setInput(id: string) {
        this.props.setInput(id);
    }

    renderRow(items: Array<string>) {
        const { inputs, currentInput } = this.props;
        return (
            <View key={items.toString()} style={styles.inputButtonRow}>
                {items.map((id) =>
                    <InputButton key={id}
                                 id={id}
                                 name={inputs[id]}
                                 isCurrentInput={id === currentInput}
                                 onPress={() => this.setInput(id)} />
                )}
            </View>
        )
    }

    render() {
        const currentInputName = this.props.inputs[this.props.currentInput];
        return (
            <View style={styles.inputRow}>
                <View style={styles.currentInputRow}>
                    <Text style={{ fontSize: 32 }}>{currentInputName}</Text>
                </View>
                {INPUT_ROWS.map((items) => this.renderRow(items))}
            </View>
        );
    }
}

const styles = StyleSheet.create({
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
        justifyContent: 'flex-end',
        padding: 3
    },
    inputButton: {
        backgroundColor: '#323232',
        borderRadius: 10,
        justifyContent: 'space-around',
        alignItems: 'center',
        width: 130,
        marginRight: 5
    },
    currentInput: {
        backgroundColor: '#888888',
        color: 'black',
        fontWeight: 'bold'
    },
    inputButtonName: {
        fontSize: 20,
        color: 'white'
    },
    inputButtonId: {
        fontSize: 16,
        color: 'white'
    }
});
