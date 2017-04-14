// @flow
import type {Gym} from './typesDefs'

export function annotationForGym(gym: Gym) : Object {

  return {
      ...getCoordinates(gym),
      title: gym.name
    };
}

export function getCoordinates(gym: Gym) {
  return {
      longitude : parseFloat(gym.location.coordinates[0]),
      latitude : parseFloat(gym.location.coordinates[1])
  }
}

export function mapLinkForGym(gym: Gym) {
  let {longitude, latitude} = getCoordinates(gym);
  return `http://maps.apple.com/?ll=${latitude},${longitude}&q=${gym.name}`
}

export function formattedAddressForGym(gym: Gym) : string{
  switch(gym.country) {
    case 'US':
    return `${gym.street_address}, ${gym.aux_address}\r\n${gym.city}, ${gym.state} ${gym.zipcode}\r\n${gym.country}`;
    default:
        return `${gym.street_address}, ${gym.aux_address}\r\n${gym.zipcode} ${gym.city}\r\n${gym.country}`;
  }
}