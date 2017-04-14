// @flow
import React from 'react'
import {View, Text, WebView, TouchableOpacity, Button, Linking} from 'react-native'
import { Components }  from 'exponent';
import Autolink from 'react-native-autolink'
import type {Gym} from '../Utils/typesDefs'
import {getCoordinates, annotationForGym, mapLinkForGym, formattedAddressForGym} from '../Utils/utils'

export default function GymDetailDisplay(props: {selectedGym: Gym, clearSelectedGym:Function}) {
  let annotations = [annotationForGym(props.selectedGym)];
    let url = props.selectedGym.website;
    if(!url.startsWith('http://')&&!url.startsWith('https://')) {
      url = "http://"+url;
    }
    let coordinates = getCoordinates(props.selectedGym);
  return (
  <View style={{margin: 10}}>
    <Text>
      {props.selectedGym.name}
    </Text><Text style={{fontSize:10}}>
      {props.selectedGym.city}
    </Text>
          <Components.MapView
        style={{height: 200}}
        region={{latitude: coordinates.latitude, longitude: coordinates.longitude, latitudeDelta: 0.1, longitudeDelta: 0.1}}
        >
      <Components.MapView.Marker
      key={props.selectedGym.gymId}
      coordinate={getCoordinates(props.selectedGym)}
      title={props.selectedGym.name}
      description={props.selectedGym.city}
    /></Components.MapView>
    <WebView
        source={{uri: props.selectedGym.website}}
        style={{marginTop: 20}}
      />
    <TouchableOpacity onPress={() => Linking.openURL(mapLinkForGym(props.selectedGym)).catch(err => console.error('An error occurred', err))}>
    <Text numberOfLines={10}>{formattedAddressForGym(props.selectedGym)}</Text>
     </TouchableOpacity> 
    <Button onPress={() => {props.clearSelectedGym()}} title="Back"/>
    <Text>Phone: </Text><Autolink text={props.selectedGym.phone} />
    <Text>Email: </Text><Autolink text={props.selectedGym.email} />
    <Text>Web: </Text><Autolink text={props.selectedGym.website} />
    </View>)
}