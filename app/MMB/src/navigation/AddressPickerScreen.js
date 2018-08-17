// @flow

import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Translation } from '@kiwicom/mobile-localization';
import {
  HeaderButton,
  MenuItem,
  type NavigationType,
} from '@kiwicom/mobile-navigation';
import { TextIcon } from '@kiwicom/mobile-shared';

import AddressLocationInput from '../scenes/tripServices/transportation/AddressLocationInput';

type Props = {
  +navigation: NavigationType,
  +currentLocation: string,
};

const todo = () => {
  console.warn('TODO');
};

export default class AddressPickerScreen extends React.Component<Props> {
  static navigationOptions = (props: Props) => {
    function goBack() {
      props.navigation.goBack();
    }

    return {
      headerLeft: (
        <HeaderButton.CloseModal
          onPress={goBack}
          text={
            <Translation id="mmb.trip_services.transportation.address_picker.cancel_button" />
          }
        />
      ),
      headerTitle: <AddressLocationInput onChangeText={todo} />,
    };
  };
  render() {
    const currentLocation = this.props.currentLocation;
    return (
      <ScrollView>
        <MenuItem
          onPress={todo}
          actionIcon={<View />}
          isActive={false}
          title={
            <Translation id="mmb.trip_service.transportation.address_picker.current_location_title" />
          }
          description={<Translation passThrough={currentLocation} />}
          icon={<TextIcon code="&quot;" />}
        />
      </ScrollView>
    );
  }
}
