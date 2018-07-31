// @flow

import * as React from 'react';
import { View, Image, TouchableWithoutFeedback } from 'react-native';
import { StyleSheet, Color, Text } from '@kiwicom/mobile-shared';
import { Translation } from '@kiwicom/mobile-localization';
import {
  SeparatorTrimmed,
  type NavigationType,
  withNavigation,
} from '@kiwicom/mobile-navigation';

import bannerImage from './insurance.png';
import VariantButtons from './variantButtons/VariantButtons';
import InsuranceSummary from './InsuranceSummaries';
import IconWithText from './IconWithText';
import PassengerInfo from './PassengerInfo';
import InsuranceOverviewSceneContext, {
  withInsuranceOverviewSceneContext,
} from '../insuranceOverviewScene/InsuranceOverviewSceneContext';
import type {
  InsuranceSelectionSceneQueryResponse,
  InsuranceType,
} from './__generated__/InsuranceSelectionSceneContainerQuery.graphql';

type Props = {|
  +navigation: NavigationType,
  +data: InsuranceSelectionSceneQueryResponse,
|};

type State = {|
  selectedVariant: InsuranceType,
|};

class InsuranceSelectionScene extends React.Component<Props, State> {
  // constructor(props) {

  //   this.state = {
  //     selectedVariant: 'NONE',
  //   };
  // }

  state = {
    selectedVariant: 'NONE',
  };

  goToMoreInfo = () =>
    this.props.navigation.navigate(
      'mmb.trip_services.insurance.selection.more_info',
    );

  selectVariant = (insuranceType: InsuranceType) => {
    this.setState({ selectedVariant: insuranceType });
    const { databaseId } = this.props.navigation.state.params;
    const passenger = this.props.passengers.find(
      px => px.databaseId === databaseId,
    );
    const updatedPassenger = {
      ...passenger,
      insuranceType,
    };
    this.props.onPassengerInsuranceChange(updatedPassenger);
  };

  render = () => {
    const { databaseId } = this.props.navigation.state.params;

    const passenger = this.props.passengers.find(
      px => px.databaseId === databaseId,
    );

    return (
      <View style={styleSheet.wrapper}>
        <Image resizeMode="contain" source={bannerImage} />
        <PassengerInfo
          title={passenger.title || ''}
          fullName={passenger.fullName || ''}
          birthday={passenger.birthday || null}
        />
        <SeparatorTrimmed gapSizeStart={0} />
        <View style={styleSheet.marginTop}>
          <Text>
            <Translation id="mmb.trip_services.insurance.selection.travel_insurance" />
            <Translation passThrough=" " />
            <Text style={styleSheet.colorInkLight}>
              <Translation passThrough="(" />
              <Translation id="mmb.trip_services.insurance.selection.provided_by_axa" />
              <Translation passThrough=")" />
            </Text>
          </Text>
        </View>
        <View style={styleSheet.variantsRow}>
          <VariantButtons
            data={this.props.data}
            selectedVariant={passenger.insuranceType}
            selectVariant={this.selectVariant}
          />
        </View>

        <InsuranceSummary selectedVariant={passenger.insuranceType} />
        <TouchableWithoutFeedback onPress={this.goToMoreInfo}>
          <View>
            <IconWithText
              textIconCode="F"
              text={
                <Translation id="mmb.trip_services.insurance.selection.insurance_summary.more_info" />
              }
              color={Color.product.normal}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };
}

export default withNavigation(
  withInsuranceOverviewSceneContext(InsuranceSelectionScene),
);

const styleSheet = StyleSheet.create({
  wrapper: {
    flex: 1,
    // TODO: every page should have white page by default instead (?)
    backgroundColor: Color.white,
    padding: 10,
  },
  variantsRow: {
    flexDirection: 'row',
    backgroundColor: Color.inputBackground,
    borderRadius: 5,
    marginTop: 4,
    marginBottom: 4,
    padding: 1,
  },
  colorInkLight: {
    color: Color.ink.light,
  },
  marginTop: {
    marginTop: 10,
  },
});
