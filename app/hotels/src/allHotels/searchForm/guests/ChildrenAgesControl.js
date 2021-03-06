// @flow strict

import * as React from 'react';
import { View } from 'react-native';
import { StyleSheet } from '@kiwicom/mobile-shared';
import { Translation } from '@kiwicom/mobile-localization';
import { defaultTokens } from '@kiwicom/mobile-orbit';

import AgeControl from './AgeControl';
import type { ChildAge } from './GuestsTypes';

type Props = {|
  +childrenAges: ChildAge[],
  +onChange: (childrenAges: ChildAge[]) => void,
|};

export default class ChildrenAgesControl extends React.Component<Props> {
  handleAgeChange = (index: number) => (age: number) => {
    const childrenAges = [...this.props.childrenAges];
    childrenAges[index] = { age };
    this.props.onChange(childrenAges);
  };

  renderItem = (item: ChildAge, index: number) => {
    const isLastItem = index === this.props.childrenAges.length - 1;
    return (
      <View key={index} style={isLastItem ? null : styles.ageControlContainer}>
        <AgeControl
          label={
            <Translation
              id="hotels_search.guests_modal.children_index"
              values={{ index: index + 1 }}
            />
          }
          age={item.age}
          onChange={this.handleAgeChange(index)}
          style={styles.ageControl}
        />
      </View>
    );
  };

  render() {
    const { childrenAges } = this.props;
    const items = [];
    for (let i = 0; i < childrenAges.length; i++) {
      items.push({ age: childrenAges[i].age });
    }

    return (
      <View style={styles.container}>
        <View style={styles.list}>
          {items.map((item, index) => this.renderItem(item, index))}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: defaultTokens.paletteWhite,
  },
  list: {
    paddingStart: 15,
  },
  ageControlContainer: {
    borderBottomColor: defaultTokens.paletteCloudLight,
    borderBottomWidth: 1,
  },
  ageControl: {
    paddingEnd: 15,
  },
});
