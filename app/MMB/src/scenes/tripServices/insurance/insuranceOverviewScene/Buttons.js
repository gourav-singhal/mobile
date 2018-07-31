// @flow

import * as React from 'react';
import { View } from 'react-native';
import { Translation } from '@kiwicom/mobile-localization';
import { TextButton, StyleSheet } from '@kiwicom/mobile-shared';

type ButtonProps = {|
  ...ButtonWithTitleProps,
  +title: React.Element<typeof Translation>,
|};

const Button = (props: ButtonProps) => {
  if (!props.displayed) {
    return null;
  }
  return (
    <View style={styles.container}>
      <TextButton title={props.title} onPress={props.onPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 10 },
});

type ButtonWithTitleProps = {|
  +displayed: boolean,
  +onPress: () => void,
|};

export const RefundButton = (props: ButtonWithTitleProps) => (
  <Button
    title={<Translation id="mmb.trip_services.order.process_to_refund" />}
    {...props}
  />
);

export const PaymentButton = (props: ButtonWithTitleProps) => (
  <Button
    title={<Translation id="mmb.trip_services.order.process_to_payment" />}
    {...props}
  />
);
