// @flow
import React from 'react';
import _ from 'lodash'
import { Linking, StyleSheet, Text, View, ScrollView, StatusBar, TextInput, Button, TouchableOpacity, Image, WebView } from 'react-native';
import { Components }  from 'exponent';
import GymDetailDisplay from './components/GymDetailDisplay'
import GymList from './components/GymList'
import Autolink from 'react-native-autolink'
import type {Gym} from './Utils/typesDefs'

type State = {geomode: string, 
  locationError: ?string, 
  currentLat:number,
    currentLng:number,
    selectedGym: ?Gym,
    showMap: boolean,
    gyms: Array<Gym>,
    searchTerm: ?string,
};



export default class App extends React.Component {
  state: State;
constructor(){
    super();
    this.state = ({geomode:'location', 
                    locationError: null,
                    currentLat: 0,
                    currentLng: 0,
                    showMap: false,
                    selectedGym: null,
                    gyms: [],
                    searchTerm: null
                });
  }

  componentDidMount () {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(JSON.stringify(position))
        this.setState({...this.state,
          currentLat: position.coords.latitude,
          currentLng: position.coords.longitude,
          locationError: undefined
        });
        if(this.state.geomode === 'location') {
          this.handleSearchNearby()
        }
      },
      (error) => this.setState({...this.state, locationError: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    )

  }

  handleSearchNearby() {
          this.setState({...this.state,geomode:'location'});
    if(this.state.locationError === undefined || this.state.locationError === null) {
        fetch("https://inclimbed.com/gyms/?lng="+this.state.currentLng+"&lat="+this.state.currentLat).then(
              (result) => {
                result.json().then((gyms: Array<Gym>) => {
                      if(gyms.length > 0) {
                        this.setState({...this.state, gyms, searchTerm: undefined })
                      } else {
                        this.handleSearchFallback()
                      }
                  } 
                )
              }
              )
            } else {
              this.handleSearchFallback()
            }
      }

  handleSearchFallback() {
 fetch("https://inclimbed.com/gyms/").then(
              (result) => {
                result.json().then((text) => {
                      this.setState({...this.state, gyms : text,  searchTerm: undefined})
                  } 
                )
              }
              )
  }

  handleSearchTermSearch() {
    if(this.state.searchTerm !== undefined && this.state.searchTerm !== null && this.state.searchTerm.length > 0) {
      this.setState({...this.state,geomode:'searchTerm'});
      let locationSearch: ?string = this.state.searchTerm;
      if(locationSearch) {
      fetch("https://inclimbed.com/gyms/?location=" + locationSearch).then(
              (result) => {
                result.json().then((text) => {
                        this.setState({...this.state, gyms : text, /*showMap: false,*/  })
                  } 
                )
              }
              )
      }
  }
  }
  
  handleSelectGym(gym: Gym) {
    console.log(JSON.stringify(gym))
    this.setState({...this.state, selectedGym: gym})
  }
  
  render() {

     let display = null;
     if(!this.state.selectedGym) {
     display = (
    <GymList 
    gymSelectHandler={(gym) => {this.handleSelectGym(gym)}} 
    searchBySearchTermHandler={() => {this.handleSearchTermSearch()}}
    searchNearbyHandler={() => {this.handleSearchNearby()}}  
    setSearchTermHandler={(searchTerm) => {this.setState({...this.state, searchTerm: searchTerm})}}
    gyms={this.state.gyms}
    searchTerm={this.state.searchTerm}
    mapViewModeHandler={(showMap) => {this.setState({...this.state, showMap: showMap})}}
    showMap={this.state.showMap}
    />
     ) } else {
       display = <GymDetailDisplay selectedGym={this.state.selectedGym} clearSelectedGym={() => {this.setState({...this.state,selectedGym:undefined})}}/>
    }

    return (
     <View style={{flex:1,flexDirection: 'column',backgroundColor:'#EEE'}}>
         <StatusBar
     backgroundColor="blue"
     barStyle="default"
     hidden={false}
     networkActivityIndicatorVisible={true}
   />
   <View style={{paddingTop:20}}>

        </View>
   {display}
   </View>
   
    );
  }
}