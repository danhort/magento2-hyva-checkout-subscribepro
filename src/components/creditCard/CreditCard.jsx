/* eslint-disable */
import React, { useCallback, useEffect, useState } from 'react';
import { shape, func } from 'prop-types';
import RadioInput from '../../../../../components/common/Form/RadioInput';
import { subscribeProConfig } from './utility';
import { usePerformPlaceOrderByREST } from '../../../../../hook';
import { paymentMethodShape } from '../../../../../utils/payment';
import useSubscribeProCheckoutFormContext from '../../hooks/useSubscribeProCheckoutFormContext';

function CreditCard({ method, selected, actions }) {
  const [isScriptInitialized, setIsScriptInitialized] = useState(undefined);
  const [spreedlyInstance, setSpreedlyInstance] = useState(undefined);
  const isSelected = method.code === selected.code;
  const { registerPaymentAction } = useSubscribeProCheckoutFormContext();
  const performPlaceOrder = usePerformPlaceOrderByREST(method.code);

  const script = document.createElement('script');
  script.src = 'https://core.spreedly.com/iframe/iframe-v1.min.js';
  script.async = true;

  const paymentSubmitHandler = useCallback(
    async (values) => {
      spreedlyInstance.on('paymentMethod', (token, pmData) => {
        performPlaceOrder(values, {
          additionalData: {
            is_active_payment_token_enabler: true,
            payment_method_token: token,
          },
        });
      });

      var requiredFields = {};
      requiredFields["full_name"] = document.getElementById("full_name").value;
      requiredFields["month"] = document.getElementById("month").value;
      requiredFields["year"] = document.getElementById("year").value;

      spreedlyInstance.tokenizeCreditCard(requiredFields);
    },
    [spreedlyInstance, performPlaceOrder]
  );

  useEffect(() => {
    registerPaymentAction(method.code, paymentSubmitHandler);
  }, [registerPaymentAction, paymentSubmitHandler]);

  // When script loads, then init Iframe
  script.onload = () => {
    setSpreedlyInstance(Spreedly);
  };

  // Add script to body
  if (!isScriptInitialized) {
    document.body.appendChild(script);
    setIsScriptInitialized(true);
  }

  useEffect(() => {
    if (isSelected && subscribeProConfig.isActive) {
      spreedlyInstance.init(subscribeProConfig.environmentKey, {
        'numberEl': 'spreedly-number',
        'cvvEl': 'spreedly-cvv'
      });
  
      // Iframe is now initialized
      spreedlyInstance.on('ready', () => {
        Spreedly.setFieldType('text');
        Spreedly.setNumberFormat('prettyFormat');
        Spreedly.setStyle('number','padding: .45em .35em; font-size: 91%;');
        Spreedly.setStyle('cvv', 'padding: .45em .35em; font-size: 91%; width: 45px;');
      });
  
      // Validate completed
      spreedlyInstance.on('validate', () => {
        console.log('In on.validate.');
      });
  
      // Error occurred - Like invalid configuration, invalid method arguments, etc.
      spreedlyInstance.on('errors', (errors) => {
        for (var i=0; i < errors.length; i++) {
          var error = errors[i];
          console.log(error);
        };
      });
    }
  }, [isSelected, spreedlyInstance, subscribeProConfig]);

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
        <div>
          <input type="hidden"  name="payment_method_token" id="payment_method_token"/>
          <label for="full_name">Name</label>
          <input type="text" id="full_name" name="full_name"/><br/>
          <label>Credit Card Number</label>
          <div id="spreedly-number" style="width:225px; height:35px; border: 2px solid"></div>
          <label for="month">Expiration Date</label>
          <input type="text" id="month" name="month" maxlength="2"/>
          <input type="text" id="year" name="year" maxlength="4"/><br/>
          <label>CVV</label>
          <div id="spreedly-cvv" style="width:60px; height:35px; border: 2px solid "></div>
        </div>
      )}
    </div>
  );
}

CreditCard.propTypes = {
  method: paymentMethodShape.isRequired,
  selected: paymentMethodShape.isRequired,
  actions: shape({ change: func }).isRequired,
};

export default CreditCard;
