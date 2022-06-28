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
  const isSelected = method.code === selected.code;
  const { registerPaymentAction } = useSubscribeProCheckoutFormContext();
  const performPlaceOrder = usePerformPlaceOrderByREST(method.code);
  const [selectedCard, setSelectedCard] = useState(undefined);

  const paymentSubmitHandler = useCallback(
    async (values) => {
      performPlaceOrder(values, {
        additionalData: {
          public_hash: vault[selectedCard].config.publicHash,
        },
      });
    },
    [performPlaceOrder, selectedCard]
  );

  useEffect(() => {
    registerPaymentAction(method.code, paymentSubmitHandler);
  }, [registerPaymentAction, paymentSubmitHandler]);

  function handleCardChange(event) {
    setSelectedCard(event.target.value);
  }

  return (
    <div>
      <div>
        <RadioInput
          value={method.code}
          label={method.title}
          name="paymentMethod"
          checked={isSelected}
          onChange={actions.change}
        />
      </div>
      {(subscribeProConfig.isActive && isSelected) && (
        <div class="border p-2 mt-2">
          {
            Object.keys(vault).map((key) => {
              return (
                <RadioInput
                  value={key}
                  label={vault[key].config.details.type + ' ending ' + vault[key].config.details.maskedCC + '( expires: ' + vault[key].config.details.expirationDate + ')'}
                  name="selectedCard"
                  checked={selectedCard == key}
                  onChange={handleCardChange}
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
