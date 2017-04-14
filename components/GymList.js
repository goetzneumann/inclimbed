// @flow
import React from 'react'
import { View, Text, TextInput, ScrollView, Button } from 'react-native'
import GymListDisplay from './GymListDisplay'
import Logo from './Logo'
import {getCoordinates} from '../Utils/utils'
import type {Gym} from '../Utils/typesDefs'
import { Components }  from 'exponent';

type Props = {gyms: Array<Gym>, 
    gymSelectHandler: Function, 
    setSearchTermHandler: Function,
    searchTerm: ?string,
    searchBySearchTermHandler: Function,
    searchNearbyHandler: Function,
    showMap: boolean,
    mapViewModeHandler: Function
}

export default function GymList(props: Props){

      let items = <Text>loading...</Text>;
        if(props.gyms) {
         items = props.gyms.map((gym) => GymListDisplay(gym, (aGym) => {
           props.gymSelectHandler(gym)
          }
           )
           )  
      }

      let mainView = null;
      if(props.showMap) {
        let coordinates = getCoordinates(props.gyms[0]);
        mainView = ( <Components.MapView
scrollEnabled = {false}
zoomEnabled = {false}
          style={{height: 500}}
          region={{latitude: coordinates.latitude, longitude: coordinates.longitude, latitudeDelta: 1, longitudeDelta: 1}}
      > 
      {props.gyms.map(gym => (
    <Components.MapView.Marker
      key={gym.gymId}
      coordinate={getCoordinates(gym)}
      title={gym.name}
      description={gym.city}
    ><Components.MapView.Callout><Text>{gym.name}</Text></Components.MapView.Callout>
    </Components.MapView.Marker>
  ))}
      </Components.MapView>
      )
      } else {
      mainView = (<ScrollView>
        { items }
      </ScrollView>)
      }
   return (<View>
   <View style={{paddingLeft:10,paddingRight:10,paddingBottom:5,}}>
<TextInput 
        style={{height: 40,borderColor: '#000', borderWidth: 1, borderRadius: 10, padding: 5}}
        onChangeText={(searchTerm) => props.setSearchTermHandler(searchTerm)}
        value={props.searchTerm}
        returnKeyType={'search'}
        onSubmitEditing={() => props.searchBySearchTermHandler()}
/></View>
<View style={{paddingLeft:10,paddingBottom:5,marginTop:0,flexDirection: 'row',justifyContent: 'space-between'}}>
   <Logo />
  <View style={{marginRight:10,backgroundColor:'#EEF'}}>
    <Button title="Nearby"  onPress={() => props.searchNearbyHandler()} />
  </View>
  <View style={{marginRight:10,backgroundColor:'#EEF'}}>
    <Button title={props.showMap?'List':'Map'}  onPress={() => props.mapViewModeHandler(!props.showMap)} />
  </View>
  </View>
      
      {mainView}
      </View>)
  
}