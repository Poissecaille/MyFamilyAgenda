import { View, StyleSheet, Text, Image, TouchableOpacity, Animated } from "react-native"
import React, { useState, useEffect, useRef } from 'react';
import { colors, discordSounds, random } from "../utility/Global";
let Sound = require('react-native-sound');


export const DialogBox = (props) => {
    const [text, setText] = useState(JSON.stringify(props.textArray));
    const [index, setIndex] = useState(0);
    const [restartAnimation, setRestartAnimation] = useState(false);
    const startValue = new Animated.Value(-5)
    const endValue = 5

    useEffect(() => {
        Animated.loop(
            Animated.spring(startValue, {
                toValue: endValue,
                bounciness: 2,
                speed: 2,
                useNativeDriver: true,
            }),
            { iterations: 5 },
        ).start();
    }, [])

    useEffect(() => {
        let whoosh = new Sound(discordSounds[random(discordSounds)], Sound.MAIN_BUNDLE, (error) => {
            if (error) {
                console.log('failed to load the sound', error);
            } else {
                whoosh.play((success) => {
                    if (success) {
                        whoosh.release();
                    }
                })
            }
        });
        Animated.loop(
            Animated.spring(startValue, {
                toValue: endValue,
                bounciness: 2,
                speed: 2,
                useNativeDriver: true,
            }),
            { iterations: 5 },
        ).start();
    }, [restartAnimation])

    const handleOnClick = () => {
        setIndex(index + 1);
        setRestartAnimation(!restartAnimation);
        props.resetDiscord();
        if (index >= props.textArray.length - 1) {
            props.resetDialog();
            setIndex(0);
        }
    };

    const styles = StyleSheet.create({
        bull: {
            backgroundColor: colors.White,
            padding: 20,
            borderRadius: 60,
            borderColor: colors.Black,
            borderWidth: 2,
            flexDirection: 'row',
        },
        innerBull1: {
            flex: 10
        },
        innerBull2: {
            flex: 1,
            transform: [
                { translateY: startValue }
            ]
        },
        textBull: {
            fontFamily: 'Roboto_500Medium',
            textAlign: 'center',
            color: colors.Black
        }
    });
    return (
        <>
            <TouchableOpacity style={styles.bull}
                onPress={handleOnClick}
            >
                <View style={styles.innerBull1}>
                    <Text style={styles.textBull}>{JSON.parse(text)[index]}</Text>
                </View>
                <Animated.View style={styles.innerBull2}>
                    <Image source={require('../assets/ic_touch_app.png')} />
                </Animated.View>
            </TouchableOpacity>
        </>
    )
}