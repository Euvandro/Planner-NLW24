import {View, Text, StyleSheet} from 'react-native';

export default function Index(){


    return (
        <View style={styles.container}>
            <Text>Hello Worl1d!</Text>
        </View>
    )


}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'gray',
        justifyContent:'center',
        alignItems:'center'
    }
})