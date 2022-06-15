/* eslint-disable */
import React, { useCallback, useEffect, useState } from 'react';
import { shape, func } from 'prop-types';
import RadioInput from '../../../../../components/common/Form/RadioInput';
import { subscribeProConfig } from './utility';
import { usePerformPlaceOrderByREST } from '../../../../../hook';
import { paymentMethodShape } from '../../../../../utils/payment';
import useSubscribeProCheckoutFormContext from '../../hooks/useSubscribeProCheckoutFormContext';

function Card({ method, selected, actions }) {
  const isSelected = method.code === selected.code;
  const { registerPaymentAction } = useSubscribeProCheckoutFormContext();

  const radioInputTag = (
    <RadioInput
      value={method.code}
      label={method.title}
      name="paymentMethod"
      checked={isSelected}
      onChange={actions.change}
    />
  );

  if (isSelected) {
    const elementsTag = <div id="subscribe-pro"><p>test</p></div>;
    return [radioInputTag, elementsTag];
  }
  return radioInputTag;
}

Card.propTypes = {
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
  actions: shape({ change: func }).isRequired,
};

export default Card;
