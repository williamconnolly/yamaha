import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { AVR } from './src/AVR';
import { InputRow, PowerRow, VolumeRow } from './src/Rows';


type AppProps = {};
type AppState = {
    isLoaded: boolean;
}

class App extends React.Component<AppProps, AppState> {
    avr: AVR;

    constructor(props: any) {
        super(props);
        this.state = {
            isLoaded: false
        };
        this.avr = new AVR();
    }

    componentDidMount() {
        this.avr.initialize(() => {
            this.setState({ isLoaded: true });
        });
    }

    render() {
        if (!this.state.isLoaded) {
            return <View style={styles.container}>
                <Text>Loading</Text>
            </View>
        }
        return (
            <View style={styles.container}>
                <PowerRow avr={this.avr} />
                <InputRow avr={this.avr} />
                <VolumeRow avr={this.avr} />
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
