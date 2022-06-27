/* eslint-disable */
import React, { useCallback, useEffect, useState } from 'react';
import { shape, func } from 'prop-types';
import RadioInput from '../../../../../components/common/Form/RadioInput';
import { vault } from './utility';
import { subscribeProConfig } from '../creditCard/utility';
import { usePerformPlaceOrderByREST } from '../../../../../hook';
import { paymentMethodShape } from '../../../../../utils/payment';
import useSubscribeProCheckoutFormContext from '../../hooks/useSubscribeProCheckoutFormContext';

function Vault({ method, selected, actions }) {
  const { registerPaymentAction } = useSubscribeProCheckoutFormContext();
  const performPlaceOrder = usePerformPlaceOrderByREST(method.code);
  const [selectedCard, setSelectedCard] = useState(undefined);

  console.log(vault);

  return (
    <div>
      {(subscribeProConfig.isActive) && (
        <div>
          {
            Object.keys(vault).map((key, index) => {
              return (
                <RadioInput
                  value={index}
                  label={vault[key].config.details.type + ' ending ' + vault[key].config.details.maskedCC + '( expires: ' + vault[key].config.details.expirationDate + ')'}
                  name="paymentMethod"
                  onChange={actions.change}
                  checked={selectedCard == key}
                />
              )
            })
          }
        </div>
      )}
    </div>
  );
}

Vault.propTypes = {
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
  actions: shape({ change: func }).isRequired,
};

export default Vault;
