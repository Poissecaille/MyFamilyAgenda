import React from 'react';
import { Share, Image, TouchableOpacity, StyleSheet, View } from 'react-native';
import { colors } from '../utility/Global';

export const ShareComponent = () => {

  const styles = StyleSheet.create({
    shareView: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
    shareTouchable: {
      justifyContent: 'center',
      textAlign: 'center',
      backgroundColor: colors.Clearer3,
      height: 60,
      width: 60,
      borderRadius: 20,
      justifyContent: 'center',
      alignSelf: 'flex-end'
    },
    shareImage: {
      aspectRatio: 1,
      width: '50%',
      height: '50%',
      alignSelf: 'center'
    }
  })

  const onShare = async () => {
    try {
      const result = await Share.share({
        title: 'App link',
        message: 'Please install this app and stay safe , AppLink :https://play.google.com/store/apps/details?id=nic.goi.aarogyasetu&hl=en',
        url: 'https://play.google.com/store/apps/details?id=nic.goi.aarogyasetu&hl=en'
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <View style={styles.shareView}>
      <TouchableOpacity onPress={onShare} style={styles.shareTouchable}>
        <Image
          style={styles.shareImage}
          source={require('../assets/share2.png')}
        />
      </TouchableOpacity>
    </View>
  );
};