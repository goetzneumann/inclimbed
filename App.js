import React from 'react';
import _ from 'lodash'
import { Linking, StyleSheet, Text, View, ScrollView, StatusBar, TextInput, Button, TouchableOpacity, Image, WebView} from 'react-native';
import { Components }  from 'exponent';
import Autolink from 'react-native-autolink'

export default class App extends React.Component {
constructor(){
    super();
    this.state = {geomode:'location'};
  }

  componentDidMount () {
    navigator.geolocation.getCurrentPosition(
      (position) => {
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
        fetch("https://inclimbed.com/gyms/?lng="+this.state.currentLat+"&lat="+this.state.currentLng).then(
              (result) => {
                result.json().then((text) => {
                      if(text.length > 0) {
                        this.setState({...this.state, gyms : text, searchTerm: undefined })
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
      fetch("https://inclimbed.com/gyms/?location="+this.state.searchTerm).then(
              (result) => {
                result.json().then((text) => {
                        this.setState({...this.state, gyms : text, /*showMap: false,*/  })
                  } 
                )
              }
              )
  }
  }
  
  handleSelectGym(gym) {
    console.log(JSON.stringify(gym))
    this.setState({...this.state, selectedGym: gym})
  }
  
  render() {

     let display = null;
     if(this.state.selectedGym === undefined) {
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

function GymDetailDisplay(props) {
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function GymListDisplay(gym, handlePress) {

  return (
  
  <TouchableOpacity key={gym.gymId} onPress={() => handlePress(gym)}>
    <View style={{borderWidth:1,flex:1,flexDirection: 'row',justifyContent: 'space-between'}}>
    
    <View style={{flex:2,flexDirection: 'column',justifyContent: 'space-between',backgroundColor: '#FEE'}}>
       <View>
         <Text style={{fontSize: 20,paddingLeft:5}}>
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

function GymList(props){

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
          style={{height: 500}}
          region={{latitude: coordinates.latitude, longitude: coordinates.longitude, latitudeDelta: 0.8, longitudeDelta: 0.8}}
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
/></View>
<View style={{paddingLeft:10,paddingBottom:5,marginTop:0,flexDirection: 'row',justifyContent: 'space-between'}}>
   <Logo />
  <View style={{backgroundColor:'#EFE'}}>
    <Button title="Search"  onPress={() => props.searchBySearchTermHandler()} />
  </View>
  <View style={{marginRight:10,backgroundColor:'#EEF'}}>
    <Button title="Nearby"  onPress={() => props.searchNearbyHandler()} />
  </View>
  <View style={{marginRight:10,backgroundColor:'#EEF'}}>
    <Button title={props.showMap?'List':'Map'}  onPress={() => props. mapViewModeHandler(!props.showMap)} />
  </View>
  </View>
      
      {mainView}
      </View>)
  
}


function annotationForGym(gym) {

  return {
      ...getCoordinates(gym),
      title: gym.name
    };
}

function getCoordinates(gym) {
  return {
      longitude : parseFloat(gym.location.coordinates[0]),
      latitude : parseFloat(gym.location.coordinates[1])
  }
}

function mapLinkForGym(gym) {
  let {longitude, latitude} = getCoordinates(gym);
  return `http://maps.apple.com/?ll=${latitude},${longitude}&q=${gym.name}`
}

function formattedAddressForGym(gym) {
  switch(gym.country) {
    case 'US':
    return `${gym.street_address}, ${gym.aux_address}\r\n${gym.city}, ${gym.state} ${gym.zipcode}\r\n${gym.country}`;
    default:
        return `${gym.street_address}, ${gym.aux_address}\r\n${gym.zipcode} ${gym.city}\r\n${gym.country}`;
  }
}

function Logo(props) {
  if(false) {
  return (<View><Image
          source={require('./assets/logo.png')}
          style={{height:30,width:63,resizeMode:'cover'}}
          resizeMode="cover"
        />
        </View>);
  } else {
    return null;
  }
}