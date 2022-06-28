/* eslint-disable */
import RootElement from '../../../../../../utils/rootElement';

const config = RootElement.getPaymentConfig();

export const subscribeProConfig = config?.subscribe_pro || {};
