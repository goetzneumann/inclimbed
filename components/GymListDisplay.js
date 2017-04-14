// @flow
import React from 'react'
import {TouchableOpacity, View, Text } from 'react-native'
import type {Gym} from '../Utils/typesDefs'
import _ from 'lodash'

export default function GymListDisplay(gym: Gym, handlePress: Function) : React$Element<TouchableOpacity> {

  return (
  
  <TouchableOpacity key={gym.gymId} onPress={() => handlePress(gym)}>
    <View style={{borderWidth:1,flex:1,flexDirection: 'row',justifyContent: 'space-between'}}>
    
    <View style={{flex:2,flexDirection: 'column',justifyContent: 'space-between',backgroundColor: '#FEE'}}>
       <View>
         <Text style={{fontSize: 20, paddingLeft:5}}>
            {_.truncate(gym.name, {'length': 24})}
        </Text>
        </View>
   <View>
<Text style={{paddingLeft:5}}>{gym.city}</Text>
      </View>
</View>

    <View style={{backgroundColor: '#FFA',width:40,paddingRight:5,borderLeftWidth:2}}>
        <Text style={{textAlign:'right',fontSize: 18}}>{Math.round(gym.distance)}</Text><Text style={{textAlign:'right',fontSize: 10}}>km</Text>
      </View>
      
    </View>
</TouchableOpacity>
    
  )
}