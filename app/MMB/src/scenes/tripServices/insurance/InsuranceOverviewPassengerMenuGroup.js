// @flow strict

import * as React from 'react';
import { createFragmentContainer, graphql } from '@kiwicom/mobile-relay';
import { TitledMenuGroup } from '@kiwicom/mobile-navigation';
import { Translation } from '@kiwicom/mobile-localization';
import idx from 'idx';

import PassengerInsuranceMenuItem from './menuItem/PassengerInsuranceMenuItem';
import InsuranceOverviewSceneContext from './insuranceOverviewScene/InsuranceOverviewSceneContext';
import type {
  InsuranceOverviewPassengerMenuGroup as PassengersType,
  InsuranceType,
} from './__generated__/InsuranceOverviewPassengerMenuGroup.graphql';

type Passenger = {|
  databaseId: ?number,
  insuranceType: ?InsuranceType,
|};

type PropsWithContext = {|
  +data: PassengersType,
  +initState: (passengers: Passenger[]) => void,
|};

const InsuranceOverviewPassengerMenuGroup = (props: PropsWithContext) => {
  const passengers = idx(props.data, _ => _.passengers) || [];
  // props.initState([...passengers]);

  return (
    <TitledMenuGroup title={<Translation id="mmb.trip_services.order.pax" />}>
      {passengers.map(passenger => (
        <PassengerInsuranceMenuItem
          data={passenger}
          key={idx(passenger, _ => _.databaseId)}
        />
      ))}
    </TitledMenuGroup>
  );
};

const InsuranceOverviewPassengerMenuGroupWithContext = () => (
  <InsuranceOverviewSceneContext.Consumer>
    {({ passengers, actions: { initState } }) => (
      <InsuranceOverviewPassengerMenuGroup
        initState={initState}
        data={{ passengers }}
      />
    )}
  </InsuranceOverviewSceneContext.Consumer>
);

export default InsuranceOverviewPassengerMenuGroupWithContext;
