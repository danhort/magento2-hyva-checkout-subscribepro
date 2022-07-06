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

  const paymentSubmitHandler = useCallback(async (values) => {
      spreedlyInstance.on('paymentMethod', (token, pmData) => {
        performPlaceOrder(values, {
          additionalData: {
            is_active_payment_token_enabler: true,
            payment_method_token: token,
          },
        });
      });

      var requiredFields = {};
      requiredFields["full_name"] = values.billing_address.fullName;
      requiredFields["first_name"] = values.billing_address.firstname;
      requiredFields["last_name"] = values.billing_address.lastname;
      requiredFields["month"] = document.getElementById("spreedly-month").value;
      requiredFields["year"] = document.getElementById("spreedly-year").value;

      spreedlyInstance.tokenizeCreditCard(requiredFields);
  }, [
    spreedlyInstance, 
    performPlaceOrder
  ]);

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
        Spreedly.setStyle('number','font-size: 16px; padding: .6rem; padding-left: .8rem; width: 100%;');
        Spreedly.setStyle('cvv', 'font-size: 16px; padding: .6rem; padding-left: .8rem; width: 100%;');
        Spreedly.setPlaceholder('cvv', "123");
        Spreedly.setPlaceholder('number',"4111111111111111");
      });

      spreedlyInstance.on('fieldEvent', (name, type, activeEl, inputProperties) => {
        let parent = document.getElementById("spreedly-" + name);

        if(type == "focus") { 
          parent.classList.add("focused"); 
        }

        if(type == "blur") { 
          parent.classList.remove("focused"); 
        }

        if(activeEl == 'number' && type == 'input' && !inputProperties["validNumber"]) {
          parent.classList.add('error');
        }
        if(activeEl == 'number' && type == 'input' && inputProperties["validNumber"]) {
          parent.classList.remove('error');
        }
        if(activeEl == 'cvv' && type == 'input' && !inputProperties["validCvv"]) {
          parent.classList.add('error');
        }
        if(activeEl == 'cvv' && type == 'input' && inputProperties["validCvv"]) {
          parent.classList.remove('error');
        }
      });
  
      // Error occurred - Like invalid configuration, invalid method arguments, etc.
      spreedlyInstance.on('errors', (errors) => {
        for (var i=0; i < errors.length; i++) {
          var error = errors[i];
          console.log(error);
          document.getElementById("spreedly-" + error.attribute).classList.add('error');
        };
      });
    }
  }, [isSelected, spreedlyInstance, subscribeProConfig]);

  const validateMonth = (event) => {
    if (/^(0[1-9]|1[0-2])$/.test(event.target.value)) {
      event.target.classList.remove('error');
    } else {
      event.target.classList.add('error');
    }
  }

  const validateYear = (event) => {
    if (/^[12][0-9]{3}$/.test(event.target.value)) {
      event.target.classList.remove('error');
    } else {
      event.target.classList.add('error');
    }
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
        <div class="ml-5 mt-5 grid grid-cols-7 gap-x-3 max-w-md">
          <input type="hidden" name="payment_method_token" id="payment_method_token"/>
          <div class="col-span-7">
            <label for="spreedly-number">Credit Card Number <sup>*</sup></label>
            <div id="spreedly-number" class="h-10 form-input"></div>
          </div>
          <div class="col-span-4">
            <label for="month">Expiration Date <sup>*</sup></label>
            <div class="flex gap-x-3">
              <input id="spreedly-month" type="text" class="form-input h-10" name="month" placeholder="MM" maxlength="2" onChange={validateMonth}/>
              <input id="spreedly-year" type="text" class="form-input h-10" name="year" placeholder="YYYY" maxlength="4" onChange={validateYear}/>
            </div>
          </div>
          <div class="col-span-2 col-start-6">
            <label for="spreedly-cvv">CVV <sup>*</sup></label>
            <div id="spreedly-cvv" class="h-10 form-input"></div>
          </div>
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
