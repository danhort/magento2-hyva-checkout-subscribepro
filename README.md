# SubscribePro Payment method for Hyvä Checkout

## Prerequisites

1. A working Magento site with SubscribePro configured.
2. [Hyvä React Checkout](https://github.com/hyva-themes/magento2-react-checkout) is installed and configured.

## How to use it with Hyvä Checkout?

1. Add payment method repository to package.json inside react application folder. Follow only one of the following steps (a or b). 
 
   a. if you've used [Hyvä CheckoutExample Module Template](https://github.com/hyva-themes/magento2-checkout-example) for customizations

       ```
       "config": {
           "paymentMethodsRepo": {
               "subscribepro": "git@github.com:danhort/magento2-hyva-checkout-subscribepro.git -b hyva-checkout-example-template"
           }
       },
       ```

   b. if you've installed Hyvä Checkout in the app/code folder 

       ```
       "config": {
           "paymentMethodsRepo": {
               "subscribepro": "git@github.com:danhort/magento2-hyva-checkout-subscribepro.git"
           }
       },
       ```

4. Run `npm install` inside react application.
5. Run `NODE_ENV=production npm run build` inside react application.

## More Info
1. https://hyva-themes.github.io/magento2-react-checkout/customize/
2. https://hyva-themes.github.io/magento2-react-checkout/payment-integration/
