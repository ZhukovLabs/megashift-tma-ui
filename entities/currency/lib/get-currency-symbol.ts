import {CURRENCIES} from '../model/constants';
import {Currency} from '../model/types';

export const getCurrencySymbol = (currency: Currency | undefined) => {
    return CURRENCIES.find(({value}) => currency === value);
}