// @flow

// @ flow

import * as React from 'react';

import type { InsuranceType } from '../__generated__/InsuranceOverviewPassengerMenuGroup.graphql';

const defaultState = {
  passengers: [],
  initialised: false,
  actions: {
    initState: () => {},
    onPassengerInsuranceChange: () => {},
    reset: () => {},
  },
};

const { Provider: ContextProvider, Consumer } = React.createContext({
  ...defaultState,
});

type Passenger = {|
  databaseId: ?number,
  insuranceType: ?InsuranceType,
|};

type Props = {|
  +children: React.Node,
|};

type State = {|
  initialised: boolean,
  passengers: Passenger[],
  +actions: {
    +initState: (passengers: Passenger[]) => void,
    +onPassengerInsuranceChange: (passenger: Passenger) => void,
    +reset: () => void,
  },
|};

class Provider extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      passengers: [],
      initialised: false,
      actions: {
        initState: this.initState,
        onPassengerInsuranceChange: this.onPassengerInsuranceChange,
        reset: this.reset,
      },
    };
  }

  initState = (passengers: Passenger[]) => {
    if (!this.state.initialised && passengers.length > 0) {
      this.setState({
        passengers,
        initialised: true,
      });
    }
    console.log(passengers, this.state);
  };

  reset = () => {
    this.setState({
      passengers: [],
      initialised: false,
    });
  };

  onPassengerInsuranceChange = (passenger: Passenger) => {
    const passengers = [...this.state.passengers];
    const passengerIndex = passengers.findIndex(
      px => px.databaseId === passenger.databaseId,
    );
    this.setState({
      passengers: [
        ...passengers.slice(0, passengerIndex),
        passenger,
        ...passengers.slice(passengerIndex + 1),
      ],
    });
  };

  render = () => (
    <ContextProvider value={this.state}>{this.props.children}</ContextProvider>
  );
}

export default { Consumer, Provider };

type PropsWithContext = {};

export function withInsuranceOverviewSceneContext(
  Component: React.ElementType,
) {
  const WithInsuranceOverviewSceneContext = (props: PropsWithContext) => (
    <Consumer>
      {({ actions, ...rest }) => (
        <Component {...props} {...rest} {...actions} />
      )}
    </Consumer>
  );
  // $FlowExpectedError: We need to pass on the navigationOptions if any, flow does not know about it, but a react component might have it
  if (Component.navigationOptions) {
    WithInsuranceOverviewSceneContext.navigationOptions =
      Component.navigationOptions;
  }
  return WithInsuranceOverviewSceneContext;
}
