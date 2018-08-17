// @flow

import * as React from 'react';
import { View, Linking } from 'react-native';
import MapView from 'react-native-maps';
import { HeaderBackButton } from 'react-navigation';
import { StyleSheet, PositionMarker } from '@kiwicom/mobile-shared';
import {
  HeaderButton,
  HeaderTitle,
  type NavigationType,
} from '@kiwicom/mobile-navigation';
import { Translation, Alert, DeviceInfo } from '@kiwicom/mobile-localization';
import { defaultTokens } from '@kiwicom/mobile-orbit';
import querystring from 'querystring';

import { withGoogleMapsContext } from '../../../context/GoogleMapsContext';
import MarkerLocationButton from './MarkerLocationButton';
import CurrentPositionButton from './CurrentPositionButton';
import AddressLocationLegend from './AddressLocationLegend';

type State = {|
  region: Region,
  markers: Markers,
  destination: string,
  showUserLocation: boolean,
  currentLocation: Region,
|};

type Region = {
  latitude: number,
  longitude: number,
  latitudeDelta: number,
  longitudeDelta: number,
};

type Markers = {
  markerA: Marker,
  markerB: Marker,
  isMarkerAChanged: boolean,
  isMarkerBChanged: boolean,
};

type Marker = {
  latitude: number,
  longitude: number,
};

type NativeEvent = {
  nativeEvent: {
    coordinate: {
      latitude: number,
      longitude: number,
    },
  },
};

type Props = {|
  +navigation: NavigationType,
  +googleMapsAPIKey: string,
  +params: {|
    +location: {| +lat: number, +lng: number |},
    +whitelabelURL: string,
  |},
  +openLink: () => void,
  +disabled: boolean,
|};

const language = DeviceInfo.getLanguage() || 'en-gb';
const currency = 'EUR';
// const date = DateFormatter(DateUtils().addDays(2)).formatForMachine();
const noop = () => {};

class TransportationMap extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      region: {
        latitude: props.params.location.lat,
        longitude: props.params.location.lng,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
      },
      markers: {
        isMarkerAChanged: false,
        isMarkerBChanged: false,
        markerA: {
          latitude: 0,
          longitude: 0,
        },
        markerB: {
          latitude: 0,
          longitude: 0,
        },
      },
      destination: '',
      showUserLocation: false,
      currentLocation: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
    };
  }

  static navigationOptions = (props: Props) => {
    function goBack() {
      props.navigation.goBack(null);
    }

    return {
      headerLeft: (
        <HeaderBackButton
          tintColor={defaultTokens.paletteProductNormal}
          onPress={goBack}
        />
      ),
      headerTitle: (
        <HeaderTitle>
          <Translation id="mmb.trip_services.transportation.map.title" />
        </HeaderTitle>
      ),
      headerRight: (
        <HeaderButton.Right onPress={props.openLink} disabled={props.disabled}>
          <HeaderButton.Text>
            <Translation id="mmb.trip_services.transportation.map.right_button" />
          </HeaderButton.Text>
        </HeaderButton.Right>
      ),
      headerStyle: {
        backgroundColor: defaultTokens.paletteWhite,
        borderBottomWidth: 0,
      },
    };
  };

  componentDidMount() {
    this.props.navigation.setParams({ disabled: true, openLink: noop });
    this.getCurrentPosition();
  }

  componentDidUpdate() {
    const { navigation } = this.props;

    if (
      this.state.markers.isMarkerAChanged &&
      this.state.markers.isMarkerBChanged &&
      navigation.state.params.disabled
    ) {
      navigation.setParams({ disabled: false });
      navigation.setParams({ openLink: this.openLink });
    }
  }

  openLocationPicker = async () => {
    const { latitude, longitude } = this.state.currentLocation;

    const currentLocation = await this.getFormattedAddress(latitude, longitude);

    this.props.navigation.navigate('AddressPickerScreen', {
      currentLocation: currentLocation,
    });
  };

  openSettings = () => {
    Linking.openURL('app-settings:');
  };

  onRegionChange = (region: Region) => {
    this.setState({ region });
  };

  buildWhitelabelURL = (whitelabelURL: string) => {
    const { markerA, markerB } = this.state.markers;
    const pickup = `${markerA.latitude},${markerA.longitude}`;
    const dropoff = `${markerB.latitude},${markerB.longitude}`;

    const URLbase = whitelabelURL.replace(/\?.*/, '');
    const URLparameters = whitelabelURL.replace(/.*\?/, '');

    const parameters = querystring.parse(URLparameters);

    parameters.pickup = pickup;
    parameters.dropoff = dropoff;
    parameters.language = language;
    parameters.currency = currency;

    return URLbase + '?' + querystring.stringify(parameters);
  };

  openLink = () => {
    const whitelabelURL = this.props.params.whitelabelURL;
    const url = this.buildWhitelabelURL(whitelabelURL);

    this.props.navigation.navigate('mmb.trip_services.webview', {
      url,
    });
  };

  renderMarkerA = (e: NativeEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    this.setState(state => ({
      markers: {
        ...state.markers,
        isMarkerAChanged: true,
        markerA: {
          latitude,
          longitude,
        },
      },
    }));
  };

  renderMarkerB = (e: NativeEvent) => {
    const { latitude, longitude } = e.nativeEvent.coordinate;
    this.setDestination(latitude, longitude);
    this.setState(state => ({
      markers: {
        ...state.markers,
        isMarkerBChanged: true,
        markerB: {
          latitude,
          longitude,
        },
      },
    }));
  };

  getFormattedAddress = async (latitude: number, longitude: number) => {
    const address = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${
        this.props.googleMapsAPIKey
      }`,
    )
      .then(res => res.json())
      .then(json => json.results[0].address_components);

    const city = (address.find(x => x.types.includes('locality')) || {})
      .long_name;
    const route = (address.find(x => x.types.includes('route')) || {})
      .long_name;
    const streetNumber = (
      address.find(x => x.types.includes('street_number')) || {}
    ).long_name;

    const area = (
      address.find(x => x.types.includes('administrative_area_level_1')) || {}
    ).long_name;

    const streetAddress =
      route !== undefined && streetNumber !== undefined
        ? route.concat(' ', streetNumber)
        : route;

    const formattedAddress = [city, streetAddress, area]
      .filter(item => item !== undefined)
      .join(', ');

    return formattedAddress;
  };

  setDestination = async (latitude: number, longitude: number) => {
    const destination = await this.getFormattedAddress(latitude, longitude);
    this.setState({
      destination: destination,
    });
  };

  getCurrentPosition = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.0375,
          longitudeDelta: 0.0349,
        };

        this.setState(
          {
            currentLocation: currentLocation,
          },
          () => {
            return currentLocation;
          },
        );
      },
      () => {
        return Alert.translatedAlert(
          undefined,
          {
            id: 'mmb.trip_services.transportation.map.current_position_alert',
          },
          [
            {
              text: { passThrough: 'OK' },
              undefined,
              style: 'default',
            },
            {
              text: { passThrough: 'Settings' },
              onPress: this.openSettings,
              style: 'default',
            },
          ],
        );
      },
    );
  };

  showUserLocation = () => {
    this.setState(state => ({
      region: state.currentLocation,
      showUserLocation: true,
    }));
  };

  render() {
    const { destination, showUserLocation, markers } = this.state;
    const { markerA, markerB } = markers;

    return (
      <View style={{ flex: 1 }}>
        <MarkerLocationButton
          destination={destination}
          onPress={this.openLocationPicker}
        />
        <View style={{ flex: 1 }}>
          <MapView
            region={this.state.region}
            onRegionChangeComplete={this.onRegionChange}
            onPress={this.renderMarkerB}
            onLongPress={this.renderMarkerA}
            scrollEnabled={true}
            showsUserLocation={showUserLocation}
            userLocationAnnotationTitle=""
            style={[StyleSheet.absoluteFillObject, styles.mapBottom]}
          >
            {markerA &&
              markerA.latitude &&
              markerA.longitude && (
                <MapView.Marker
                  coordinate={{
                    latitude: markerA.latitude,
                    longitude: markerA.longitude,
                  }}
                >
                  <PositionMarker code="j" />
                </MapView.Marker>
              )}
            {markerB &&
              markerB.latitude &&
              markerB.longitude && (
                <MapView.Marker
                  coordinate={{
                    latitude: markerB.latitude,
                    longitude: markerB.longitude,
                  }}
                >
                  <PositionMarker
                    code="k"
                    color={defaultTokens.colorAlertIconWarning}
                  />
                </MapView.Marker>
              )}
          </MapView>
        </View>
        <AddressLocationLegend />
        <CurrentPositionButton onPress={this.showUserLocation} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mapBottom: {
    android: {
      bottom: -25,
    },
  },
});

export default withGoogleMapsContext(TransportationMap);
