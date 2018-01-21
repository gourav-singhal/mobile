// @flow

import * as React from 'react';
import { ScrollView, View } from 'react-native';

import StarsFilter from './stars/StarsFilter';
import PriceFilter from './price/PriceFilter';
import HotelFacilitiesFilter from './hotelFacilities/HotelFacilitiesFilter';
import type {
  FilterParams,
  OnChangeFilterParams,
} from './FilterParametersType';

const styles = {
  view: {
    width: '100%',
    backgroundColor: '#fff',
  },
  scrollView: {
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
};

type Props = {|
  onChange: OnChangeFilterParams => void,
  filter: FilterParams,
  currency: string,
|};

export default function FilterStripe(props: Props) {
  const { starsRating, minPrice, maxPrice, hotelFacilities } = props.filter;
  return (
    <View style={styles.view}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        <StarsFilter stars={starsRating} onChange={props.onChange} />
        <PriceFilter
          onChange={props.onChange}
          start={minPrice}
          end={maxPrice}
          currency={props.currency}
        />
        <HotelFacilitiesFilter
          onChange={props.onChange}
          facilities={hotelFacilities}
        />
      </ScrollView>
    </View>
  );
}
