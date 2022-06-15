/* eslint-disable */
import RootElement from '../../../../../../utils/rootElement';

const config = RootElement.getPaymentConfig();
console.log(config);

export const subscribeProConfig = config?.subscribe_pro || {};
