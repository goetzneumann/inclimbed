// @flow

import React from 'react'
import {View, Image} from 'react-native'

export default function Logo() {
  if(false) {
  return (<View><Image
          source={require('../assets/logo.png')}
          style={{height:30,width:63,resizeMode:'cover'}}
          resizeMode="cover"
        />
        </View>);
  } else {
    return null;
  }
}