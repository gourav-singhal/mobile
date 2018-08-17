// @flow

import * as React from 'react';
import { TextInput as OriginalTextInput, View } from 'react-native';
import { Text, StyleSheet, TextIcon } from '@kiwicom/mobile-shared';
import { Translation } from '@kiwicom/mobile-localization';
import { defaultTokens } from '@kiwicom/mobile-orbit';

type Props = {|
  +placeholder?: React.Element<typeof Translation>,
  +defaultValue?: string,
  +autoFocus?: boolean,
  +onChangeText?: (text: string) => void,
  +keyboardType?: 'email-address',
  +secureTextEntry?: boolean,
|};

type State = {|
  displayPlaceholder: boolean,
|};

export default class AddressLocationInput extends React.Component<
  Props,
  State,
> {
  constructor(props: Props) {
    super(props);
    const { defaultValue } = props;
    this.state = {
      displayPlaceholder: defaultValue == null || defaultValue === '',
    };
  }

  render = () => (
    <View style={styleSheet.wrapper}>
      <OriginalTextInput
        underlineColorAndroid="transparent"
        autoCorrect={false}
        {...this.props}
        placeholder={null}
        style={[styleSheet.text, styleSheet.input]}
        autoFocus={true}
      />

      <View style={styleSheet.placeholder}>
        <TextIcon code="B" style={styleSheet.icon} />
        <Text style={[styleSheet.text, styleSheet.placeholderText]}>
          <Translation id="mmb.trip_services.transportation.address_picker.input.placeholder" />
        </Text>
      </View>
    </View>
  );
}

const styleSheet = StyleSheet.create({
  text: {
    android: {
      fontSize: 16,
    },
    ios: {
      fontSize: 14,
    },
  },
  input: {
    flex: 1,
    marginEnd: -60,
    color: defaultTokens.paletteInkDark,
    backgroundColor: defaultTokens.backgroundInputDisabled,
    borderRadius: 6,
    paddingStart: 70,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 8,
    android: {
      elevation: 1,
      height: 48,
    },
    ios: {
      height: 47,
    },
  },
  placeholder: {
    flexDirection: 'row',
    alignSelf: 'center',
    position: 'absolute',
    paddingStart: 15,
  },
  placeholderText: {
    color: defaultTokens.paletteInkLight,
    paddingStart: 15,
  },
  icon: {
    fontSize: 14,
    alignSelf: 'center',
    color: defaultTokens.paletteInkLight,
  },
});
