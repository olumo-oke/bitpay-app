import {Currencies, SUPPORTED_TOKENS} from '../../../constants/currencies';

export const GetProtocolPrefix = (
  currency: string,
  network: string = 'livenet',
) => {
  // @ts-ignore
  return Currencies[currency].paymentInfo.protocolPrefix[network];
};

export const GetPrecision = (currencyAbbreviation: string) => {
  return Currencies[currencyAbbreviation].unitInfo;
};

export const IsUtxoCoin = (currencyAbbreviation: string): boolean => {
  return Currencies[currencyAbbreviation].properties.isUtxo;
};

export const IsCustomERCToken = (currencyAbbreviation: string) => {
  return (
    Currencies[currencyAbbreviation]?.properties.isCustom &&
    !SUPPORTED_TOKENS.includes(currencyAbbreviation)
  );
};

export const GetChain = (currencyAbbreviation: string): string => {
  return Currencies[currencyAbbreviation].chain;
};