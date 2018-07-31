// @flow strict

import * as React from 'react';
import idx from 'idx';
import { ScrollView, View } from 'react-native';
import { LayoutSingleColumn, TextButton } from '@kiwicom/mobile-shared';
import { graphql, PublicApiRenderer } from '@kiwicom/mobile-relay';
import { Translation } from '@kiwicom/mobile-localization';
import {
  type RouteNamesType,
  type NavigationType,
} from '@kiwicom/mobile-navigation';

import InsuranceOverviewPassengerMenuGroup from '../InsuranceOverviewPassengerMenuGroup';
import DestinationImage from '../DestinationImage';
import OrderSummary from '../insuranceOverviewScene/OrderSummary';
import TripInfo from '../../../../components/header/TripInfo';
import BookingDetailContext from '../../../../context/BookingDetailContext';
import { RefundButton, PaymentButton } from './Buttons';
import { withInsuranceOverviewSceneContext } from './InsuranceOverviewSceneContext';
import type { InsuranceOverviewSceneQueryResponse } from './__generated__/InsuranceOverviewSceneQuery.graphql';

type Props = {|
  +data: InsuranceOverviewSceneQueryResponse,
  +navigation: NavigationType,
|};

type State = {|
  transactionAmount: number,
|};

class InsuranceOverviewScene extends React.Component<Props, State> {
  constructor(props) {
    super(props);
  }

  state = {
    transactionAmount: 0,
  };

  navigate = (routeName: RouteNamesType) => {
    this.props.navigation.navigate(routeName);
  };

  goToTheInsurancePayment = () => {
    this.navigate('mmb.trip_services.insurance.payment');
  };

  goToTheInsuranceRefund = () => {
    this.navigate('mmb.trip_services.insurance.refund');
  };

  componentDidMount() {
    const passengers = idx(this.props, _ => _.data.singleBooking.passengers);
    if (passengers) {
      this.props.initState(passengers);
    }
  }

  componentWillUnmount() {
    this.props.reset();
  }

  render = () => {
    const { data } = this.props;

    // console.log(data.singleBooking.passengers.map(px => px.databaseId));

    return (
      <React.Fragment>
        <ScrollView>
          <LayoutSingleColumn>
            <DestinationImage data={data.singleBooking} />

            <TripInfo data={data.singleBooking} />

            <InsuranceOverviewPassengerMenuGroup />

            <RefundButton
              displayed={this.state.transactionAmount < 0}
              onPress={this.goToTheInsuranceRefund}
            />
            <PaymentButton
              displayed={this.state.transactionAmount > 0}
              onPress={this.goToTheInsurancePayment}
            />
          </LayoutSingleColumn>
        </ScrollView>
        <OrderSummary displayed={this.state.transactionAmount !== 0} />
      </React.Fragment>
    );
  };
}

const InsuranceOverviewSceneWithContext = withInsuranceOverviewSceneContext(
  InsuranceOverviewScene,
);

type ContainerProps = {|
  navigation: NavigationType,
|};

export default class InsuranceOverviewSceneContainer extends React.Component<
  ContainerProps,
> {
  renderInnerComponent = (response: InsuranceOverviewSceneQueryResponse) => {
    return (
      <InsuranceOverviewSceneWithContext
        data={response}
        navigation={this.props.navigation}
      />
    );
  };

  render = () => {
    return (
      <BookingDetailContext.Consumer>
        {({ bookingId, authToken }) => (
          <PublicApiRenderer
            render={this.renderInnerComponent}
            query={graphql`
              query InsuranceOverviewSceneQuery(
                $bookingId: Int!
                $authToken: String!
              ) {
                singleBooking(id: $bookingId, authToken: $authToken) {
                  ... on BookingInterface {
                    ...DestinationImage
                    ...TripInfo
                    passengers {
                      databaseId
                      fullName
                      title
                      birthday
                      databaseId
                      insuranceType
                    }
                  }
                }
              }
            `}
            variables={{
              bookingId,
              authToken,
            }}
          />
        )}
      </BookingDetailContext.Consumer>
    );
  };
}
