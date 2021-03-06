// @flow

import * as React from 'react';
import { View } from 'react-native';
import { StyleSheet, TextInput, WithStorage } from '@kiwicom/mobile-shared';
import { graphql, PublicApiRenderer } from '@kiwicom/mobile-relay';
import { Translation } from '@kiwicom/mobile-localization';
import { defaultTokens } from '@kiwicom/mobile-orbit';

import RecentSearches from './RecentSearches';
import SuggestionList from './SuggestionList';
import HotelsSearchContext from '../../../HotelsSearchContext';
import type { LocationPickerScreen_cities_QueryResponse as LocationSuggestions } from './__generated__/LocationPickerScreen_cities_Query.graphql';

const RECENT_SEARCH_KEY = 'KiwiHotels:RecentSearches';

export type Location = {|
  id: string,
  name: string,
|};

type PropsWithContext = {
  ...Props,
  +onCitySelected: (cityId: string, cityName: string) => void,
  +storageValue: Location[],
  +saveToStorage: (value: any) => void,
};

type State = {|
  search: string,
|};

export class LocationPicker extends React.Component<PropsWithContext, State> {
  state = {
    search: this.props.location || '',
  };

  onTextChange = (search: string) => {
    this.setState({ search });
  };

  onCitySelected = (cityId: string, cityName: string) => {
    this.props.onCitySelected(cityId, cityName);
    this.saveRecentSearches(cityId, cityName);
    this.props.closeModal();
  };

  saveRecentSearches = (cityId: string, cityName: string) => {
    let recentSearches = this.props.storageValue;

    if (recentSearches.find(item => item.id === cityId) === undefined) {
      recentSearches.unshift({ id: cityId, name: cityName });
      recentSearches.slice(0, 20); // Limit recent searches to 20 locations

      this.props.saveToStorage(recentSearches);
    }
  };

  renderSuggestions = (rendererProps: LocationSuggestions) => {
    return (
      <SuggestionList
        data={rendererProps}
        onCitySelected={this.onCitySelected}
        search={this.state.search}
      />
    );
  };

  render = () => {
    return (
      <View style={styles.container}>
        <View style={styles.textInputContainer}>
          <TextInput
            defaultValue={this.state.search}
            onChangeText={this.onTextChange}
            placeholder={
              <Translation id="hotels_search.location_button.placeholder" />
            }
            autoFocus={true}
          />
        </View>
        {this.state.search === '' && this.props.storageValue.length > 0 ? (
          <RecentSearches
            locations={this.props.storageValue}
            onCitySelected={this.onCitySelected}
          />
        ) : (
          <PublicApiRenderer
            query={graphql`
              query LocationPickerScreen_cities_Query($prefix: String!) {
                ...SuggestionList_data @arguments(prefix: $prefix)
              }
            `}
            render={this.renderSuggestions}
            variables={{ prefix: this.state.search }}
          />
        )}
      </View>
    );
  };
}

type Props = {|
  +location: ?string,
  +closeModal: () => void,
|};

const LocationPickerWithStorage = WithStorage(
  LocationPicker,
  RECENT_SEARCH_KEY,
  [],
);

export default function LocationPickerWithStorageAndWithContext(props: Props) {
  return (
    <HotelsSearchContext.Consumer>
      {({ actions }) => (
        <LocationPickerWithStorage
          {...props}
          onCitySelected={actions.setCityIdAndLocation}
        />
      )}
    </HotelsSearchContext.Consumer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInputContainer: {
    padding: 10,
    backgroundColor: defaultTokens.paletteWhite,
  },
});
