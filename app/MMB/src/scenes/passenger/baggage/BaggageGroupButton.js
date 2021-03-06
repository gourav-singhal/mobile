// @flow strict

import * as React from 'react';
import { View, Platform } from 'react-native';
import { Touchable, StyleSheet, Icon } from '@kiwicom/mobile-shared';
import {
  type NavigationType,
  withNavigation,
} from '@kiwicom/mobile-navigation';
import { defaultTokens } from '@kiwicom/mobile-orbit';

type Props = {|
  +children: React.Node,
  +navigation: NavigationType,
|};

class BaggageGroupButton extends React.Component<Props> {
  goToBaggage = () => {
    this.props.navigation.navigate('mmb.flight_services.checked_baggage');
  };

  render = () => (
    <Touchable onPress={this.goToBaggage}>
      <View style={styles.row}>
        <View style={styles.children}>{this.props.children}</View>
        {Platform.select({
          android: <Icon name="mode-edit" size={20} style={styles.icon} />,
          ios: <Icon name="chevron-right" size={26} style={styles.icon} />,
        })}
      </View>
    </Touchable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  children: {
    flex: 1,
  },
  icon: {
    color: defaultTokens.paletteProductNormal,
    alignSelf: 'center',
  },
});

export default withNavigation(BaggageGroupButton);
