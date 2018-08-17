// @flow strict

import * as React from 'react';
import { graphql, createFragmentContainer } from '@kiwicom/mobile-relay';
import idx from 'idx';

import LocationPopupButton from '../LocationPopupButton';
import type { LocationItem as LocationItemType } from './__generated__/TransportLocationItem.graphql';

type Props = {|
  +data: LocationItemType,
  +onPress: ({
    location: { lat: number, lng: number },
    whitelabelURL: string,
  }) => void,
  +whitelabelURL: string,
|};

class LocationItem extends React.Component<Props> {
  onPress = () => {
    const lat = idx(this.props.data, _ => _.location.lat) || 0;
    const lng = idx(this.props.data, _ => _.location.lng) || 0;
    const whitelabelURL = this.props.whitelabelURL;
    this.props.onPress({ location: { lat, lng }, whitelabelURL });
  };

  render = () => {
    const location = idx(this.props.data, _ => _.location);
    if (!location) {
      return null;
    }

    return (
      <LocationPopupButton
        whitelabelURL={this.props.whitelabelURL}
        data={this.props.data}
        onPress={this.onPress}
        displayIata={false}
      />
    );
  };
}

export default createFragmentContainer(
  LocationItem,
  graphql`
    fragment TransportLocationItem on Location {
      ...LocationPopupButton
      location {
        lat
        lng
      }
    }
  `,
);
