import React, {useEffect, useState} from 'react';
import {useTheme, useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';
import cloneDeep from 'lodash.clonedeep';
import {
  // ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  // Linking,
  // Text,
} from 'react-native';
import {
  Action,
  LightBlack,
  NeutralSlate,
  SlateDark,
  White,
  Slate,
} from '../../../../styles/colors';
import {
  BaseText,
  // Link,
  // H5,
  H7,
  // Small,
} from '../../../../components/styled/Text';
import ArrowDown from '../../../../../assets/img/services/swap-crypto/down-arrow.svg';
import SelectorArrowDown from '../../../../../assets/img/selector-arrow-down.svg';
import Button from '../../../../components/button/Button';
import FromWalletSelectorModal from '../components/FromWalletSelectorModal';
import ToWalletSelectorModal from '../components/ToWalletSelectorModal';
import {Wallet} from '../../../../store/wallet/wallet.models';
import {SupportedCurrencyOptions} from '../../../../constants/SupportedCurrencyOptions';
import {CurrencyImage} from '../../../../components/currency-image/CurrencyImage';
import {ItemProps} from '../../../../components/list/CurrencySelectionRow';
import SelectorArrowRight from '../../../../../assets/img/selector-arrow-right.svg';
import {
  changellyGetPairsParams,
  changellyGetCurrencies,
  changellyGetFixRateForAmount,
} from '../utils/changelly-utils';
import {Currencies} from '../../../../constants/currencies';
import AmountModal from '../components/AmountModal';
import {GetPrecision} from '../../../../store/wallet/utils/currency';

// Images // TODO: for exchanges images create a component like this: /bitpay-app-v2/src/components/icons/info
import ChangellyLogo from '../../../../../assets/img/services/changelly/changelly-vector-logo.svg';
import ChangellyLogoDm from '../../../../../assets/img/services/changelly/changelly-vector-logo-dark.svg';

const CtaContainer = styled.View`
  margin: 20px 15px;
`;

const SwapCryptoCard = styled.View`
  border: 1px solid ${({theme: {dark}}) => (dark ? LightBlack : '#eaeaea')};
  border-radius: 9px;
  margin: 20px 15px;
  padding: 14px;
`;

const SummaryTitle = styled(BaseText)`
  color: ${({theme: {dark}}) => (dark ? White : SlateDark)};
  font-size: 14px;
  margin-bottom: 15px;
`;

const ArrowContainer = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const SelectorArrowContainer = styled.View`
  margin-left: 10px;
`;

const ActionsContainer = styled.View<{alignEnd?: boolean}>`
  display: flex;
  justify-content: ${({alignEnd}) => (alignEnd ? 'flex-end' : 'space-between')};
  flex-direction: row;
  align-items: center;
`;

const SelectedOptionContainer = styled.TouchableOpacity`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  padding: 0px 14px;
  background: ${({theme: {dark}}) => (dark ? LightBlack : NeutralSlate)};
  border-radius: 12px;
  opacity: ${({disabled}) => (disabled ? 0.2 : 1)};
`;

const SelectedOptionText = styled(BaseText)`
  color: ${({theme: {dark}}) => (dark ? White : SlateDark)};
  font-size: 16px;
  font-weight: 500;
`;

const SelectedOptionCol = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const CoinIconContainer = styled.View`
  width: 30px;
  height: 25px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const DataText = styled(BaseText)`
  color: ${({theme: {dark}}) => (dark ? White : SlateDark)};
  font-size: 18px;
`;

const BottomDataText = styled(BaseText)`
  color: ${({theme: {dark}}) => (dark ? White : SlateDark)};
  font-size: 14px;
  margin-top: 14px;
`;

const ProviderContainer = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
`;

const ProviderLabel = styled(H7)`
  color: ${({theme: {dark}}) => (dark ? White : SlateDark)};
  margin-right: 10px;
`;

export interface RateData {
  fixedRateId: string;
  amountTo: number;
  rate: number;
}

const SwapCryptoRoot: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [amountModalVisible, setAmountModalVisible] = useState(false);
  const [fromWalletSelectorModalVisible, setFromWalletSelectorModalVisible] =
    useState(false);
  const [walletSelectorModalVisible, setWalletSelectorModalVisible] =
    useState(false);
  const [fromWalletSelected, setFromWalletSelected] = useState<Wallet>();
  const [fromWalletData, setFromWalletData] = useState<ItemProps>();
  const [toWalletSelected, setToWalletSelected] = useState<Wallet>();
  const [toWalletData, setToWalletData] = useState<ItemProps>();
  const [amountFrom, setAmountFrom] = useState<number>(0);
  const [swapCryptoSupportedCoinsFrom, setSwapCryptoSupportedCoinsFrom] =
    useState<string[]>([]);
  const [swapCryptoSupportedCoinsTo, setSwapCryptoSupportedCoinsTo] = useState<
    string[]
  >([]);
  const [rateData, setRateData] = useState<RateData>();

  const SupportedCurrencies: string[] = Object.keys(Currencies);
  const SupportedChains: string[] = [
    ...new Set(Object.values(Currencies).map(({chain}: any) => chain)),
  ];
  let minAmount, maxAmount: number;

  const showModal = (id: string) => {
    switch (id) {
      case 'fromWalletSelector':
        setFromWalletSelectorModalVisible(true);
        break;
      case 'walletSelector':
        setWalletSelectorModalVisible(true);
        break;
      case 'amount':
        setAmountModalVisible(true);
        break;
      default:
        break;
    }
  };

  const hideModal = (id: string) => {
    switch (id) {
      case 'fromWalletSelector':
        setFromWalletSelectorModalVisible(false);
        break;
      case 'walletSelector':
        setWalletSelectorModalVisible(false);
        break;
      case 'amount':
        setAmountModalVisible(false);
        break;
      default:
        break;
    }
  };

  const canContinue = (): boolean => {
    return !!toWalletSelected && !!fromWalletSelected && amountFrom > 0;
  };

  const isToWalletEnabled = (): boolean => {
    return !!fromWalletSelected;
  };

  const updateWalletData = () => {
    if (fromWalletSelected) {
      setFromWalletData(
        SupportedCurrencyOptions.find(
          currency =>
            fromWalletSelected &&
            currency.id == fromWalletSelected.credentials.coin,
        ),
      );
    }
    if (toWalletSelected) {
      setToWalletData(
        SupportedCurrencyOptions.find(
          currency =>
            toWalletSelected &&
            currency.id == toWalletSelected.credentials.coin,
        ),
      );
    }
  };

  const updateReceivingAmount = () => {
    if (!fromWalletSelected || !toWalletSelected || !amountFrom) {
      // this.loading = false;
      return;
    }

    if (fromWalletSelected.balance && fromWalletSelected.balance.sat) {
      const unitToSatoshi = GetPrecision(
        fromWalletSelected.currencyAbbreviation,
      )?.unitToSatoshi;
      const unitDecimals = GetPrecision(
        fromWalletSelected.currencyAbbreviation,
      )?.unitDecimals;
      if (unitToSatoshi && unitDecimals) {
        const satToUnit = 1 / unitToSatoshi;

        const spendableAmount = parseFloat(
          (fromWalletSelected.balance.sat * satToUnit).toFixed(unitDecimals),
        );

        // const spendableAmount = this.txFormatProvider.satToUnit(
        //   fromWalletSelected.balance.sat,
        //   fromWalletSelected.coin
        // );

        if (spendableAmount < amountFrom) {
          // this.loading = false;
          showError(
            'You are trying to send more funds than you have available. Make sure you do not have funds locked by pending transaction proposals or enter a valid amount.',
          );
          return;
        }
      }
    }

    const pair =
      fromWalletSelected.currencyAbbreviation +
      '_' +
      toWalletSelected.currencyAbbreviation;
    console.log('Updating receiving amount with pair: ' + pair);

    const data = {
      amountFrom: amountFrom,
      coinFrom: fromWalletSelected.currencyAbbreviation,
      coinTo: toWalletSelected.currencyAbbreviation,
    };
    changellyGetFixRateForAmount(fromWalletSelected, data)
      .then((data: any) => {
        if (data.error) {
          const msg =
            'Changelly getFixRateForAmount Error: ' + data.error.message;
          showError(msg);
          return;
        }

        console.log('=========changellyGetFixRateForAmount data:', data);

        const newRateData: RateData = {
          fixedRateId: data.result[0].id,
          amountTo: Number(data.result[0].amountTo),
          rate: Number(data.result[0].result), // result == rate
        };
        setRateData(newRateData);
        // loading = false;
      })
      .catch((err: any) => {
        console.log('Changelly getFixRateForAmount Error: ', err);
        showError(
          'Changelly is not available at this moment. Please, try again later.',
        );
      });
  };

  const changellyGetRates = () => {
    // amountTo = null;
    // rate = null;
    if (!fromWalletSelected || !toWalletSelected || !amountFrom) {
      return;
    }

    // this.loading = true;
    let pair =
      fromWalletSelected.currencyAbbreviation +
      '_' +
      toWalletSelected.currencyAbbreviation;
    console.log('Updating max and min with pair: ' + pair);

    const data = {
      coinFrom: fromWalletSelected.currencyAbbreviation,
      coinTo: toWalletSelected.currencyAbbreviation,
    };
    changellyGetPairsParams(fromWalletSelected, data)
      .then(async (data: any) => {
        console.log('====== changellyGetPairsParamsData: ', data);
        if (data.error) {
          let secondBtnText,
            url,
            msg = null;
          msg = 'Changelly getPairsParams Error: ' + data.error.message;
          if (
            Math.abs(data.error.code) == 32602 &&
            data.error.message.indexOf('Invalid currency:') != -1
          ) {
            msg = `${data.error.message}. This is a temporary Changelly decision. If you have further questions please reach out to them.`;
            secondBtnText = 'Submit a ticket';
            url = 'https://support.changelly.com/en/support/tickets/new';
          }

          showError(msg);
          return;
        }

        if (
          data.result &&
          data.result[0] &&
          Number(data.result[0].maxAmountFixed) <= 0
        ) {
          const msg = `Changelly has temporarily disabled ${fromWalletSelected.currencyAbbreviation}-${toWalletSelected.currencyAbbreviation} pair. If you have further questions please reach out to them.`;
          const secondBtnText = 'Submit a ticket';
          const url = 'https://support.changelly.com/en/support/tickets/new';
          showError(msg);
          return;
        }

        minAmount = Number(data.result[0].minAmountFixed);
        maxAmount = Number(data.result[0].maxAmountFixed);
        console.log(`Min amount: ${minAmount} - Max amount: ${maxAmount}`);

        // TODO: send max
        // if (useSendMax && shouldUseSendMax()) {
        //   // onGoingProcessProvider.set('calculatingSendMax');
        //   sendMaxInfo = await getSendMaxInfo();
        //   if (sendMaxInfo) {
        //     console.log('Send max info', sendMaxInfo);
        //     amountFrom = txFormatProvider.satToUnit(
        //       sendMaxInfo.amount,
        //       fromWalletSelected.currencyAbbreviation
        //     );
        //     estimatedFee = txFormatProvider.satToUnit(
        //       sendMaxInfo.fee,
        //       fromWalletSelected.currencyAbbreviation
        //     );
        //   }
        // }
        // onGoingProcessProvider.clear();

        if (amountFrom > maxAmount) {
          console.log('Error: amountFrom > maxAmount');
          // TODO: Handle max amount
          //   const errorActionSheet = actionSheetProvider.createInfoSheet(
          //     'max-amount-allowed',
          //     {
          //       maxAmount: maxAmount,
          //       coin: fromWalletSelected.currencyAbbreviation.toUpperCase()
          //     }
          //   );
          //   errorActionSheet.present();
          //   errorActionSheet.onDidDismiss(option => {
          //     // loading = false;
          //     if (option) {
          //       amountFrom = maxAmount;
          //       useSendMax = null;
          //       updateReceivingAmount();
          //     }
          //   });
          //   return;
        }
        if (amountFrom < minAmount) {
          console.log('Error: amountFrom < minAmount');
          // TODO: Handle min amount
          // if (useSendMax && shouldUseSendMax()) {
          //   let msg;
          //   if (sendMaxInfo) {
          //     const warningMsg = exchangeCryptoProvider.verifyExcludedUtxos(
          //       fromWalletSelected.currencyAbbreviation,
          //       sendMaxInfo
          //     );
          //     msg = !_.isEmpty(warningMsg) ? warningMsg : '';
          //   }

          //   const errorActionSheet = actionSheetProvider.createInfoSheet(
          //     'send-max-min-amount',
          //     {
          //       amount: amountFrom,
          //       fee: estimatedFee,
          //       minAmount: minAmount,
          //       coin: fromWalletSelected.currencyAbbreviation.toUpperCase(),
          //       msg
          //     }
          //   );
          //   errorActionSheet.present();
          //   errorActionSheet.onDidDismiss(() => {
          //     // loading = false;
          //     useSendMax = null;
          //     amountFrom = null;
          //     amountTo = null;
          //     estimatedFee = null;
          //     sendMaxInfo = null;
          //     rate = null;
          //     fixedRateId = null;
          //   });
          //   return;
          // } else {
          // TODO : handle limits error
          // const errorActionSheet = actionSheetProvider.createInfoSheet(
          //   'min-amount-allowed',
          //   {
          //     minAmount: minAmount,
          //     coin: fromWalletSelected.currencyAbbreviation.toUpperCase()
          //   }
          // );
          // errorActionSheet.present();
          // errorActionSheet.onDidDismiss(option => {
          //   // loading = false;
          //   if (option) {
          //     amountFrom = minAmount;
          //     useSendMax = null;
          //     sendMaxInfo = null;
          //     updateReceivingAmount();
          //   }
          // });
          // return;
          // }
        }
        updateReceivingAmount();
      })
      .catch(err => {
        console.log('Changelly getPairsParams Error: ', err);
        showError(
          'Changelly is not available at this moment. Please, try again later.',
        );
      });
  };

  const showError = (message: string) => {
    console.log('Error: ' + message);
  };

  useEffect(() => {
    const country = 'US';
    const getChangellyCurrencies = async () => {
      const changellyCurrenciesData = await changellyGetCurrencies(true);

      if (
        changellyCurrenciesData &&
        changellyCurrenciesData.result &&
        changellyCurrenciesData.result.length > 0
      ) {
        const supportedCoinsWithFixRateEnabled = changellyCurrenciesData.result
          .filter(
            (coin: any) =>
              coin.enabled &&
              coin.fixRateEnabled &&
              [...SupportedChains, 'ERC20'].includes(
                coin.protocol.toUpperCase(),
              ),
          )
          .map(({name}: any) => name);

        console.log(
          '====== supportedCoinsWithFixRateEnabled: ',
          JSON.stringify(supportedCoinsWithFixRateEnabled),
        );

        // TODO: add support to float-rate coins supported by Changelly

        // Intersection
        const supportedCoins = SupportedCurrencies.filter(coin =>
          supportedCoinsWithFixRateEnabled.includes(coin),
        );

        const coinsToRemove = country == 'US' ? ['xrp'] : [];
        coinsToRemove.forEach((coin: string) => {
          const index = supportedCoins.indexOf(coin);
          if (index > -1) {
            console.log(`Removing ${coin} from Changelly supported coins`);
            supportedCoins.splice(index, 1);
          }
        });
        setSwapCryptoSupportedCoinsFrom(supportedCoins);
      }
    };

    getChangellyCurrencies().catch(console.error);
  }, []);

  useEffect(() => {
    updateWalletData();
  }, [fromWalletSelected, toWalletSelected]);

  useEffect(() => {
    changellyGetRates();
  }, [fromWalletSelected, toWalletSelected, amountFrom]);

  return (
    <>
      <ScrollView>
        <SwapCryptoCard>
          <SummaryTitle>From</SummaryTitle>
          {!fromWalletSelected && (
            <ActionsContainer>
              <SelectedOptionContainer
                style={{backgroundColor: Action}}
                onPress={() => {
                  console.log('Swap crypto card clicked 1');
                  showModal('fromWalletSelector');
                }}>
                <SelectedOptionText
                  style={{color: White}}
                  numberOfLines={1}
                  ellipsizeMode={'tail'}>
                  Select Wallet
                </SelectedOptionText>
                <SelectorArrowContainer>
                  <SelectorArrowDown
                    {...{width: 13, height: 13, color: White}}
                  />
                </SelectorArrowContainer>
              </SelectedOptionContainer>
            </ActionsContainer>
          )}
          {fromWalletSelected && (
            <>
              <ActionsContainer>
                <SelectedOptionContainer
                  style={{minWidth: 120}}
                  onPress={() => {
                    console.log('Swap crypto card clicked 1');
                    showModal('fromWalletSelector');
                  }}>
                  <SelectedOptionCol>
                    {fromWalletData && (
                      <CoinIconContainer>
                        <CurrencyImage img={fromWalletData.img} size={20} />
                      </CoinIconContainer>
                    )}
                    <SelectedOptionText
                      numberOfLines={1}
                      ellipsizeMode={'tail'}>
                      {fromWalletSelected.credentials.coin.toUpperCase()}
                    </SelectedOptionText>
                  </SelectedOptionCol>
                  <ArrowContainer>
                    <SelectorArrowDown
                      {...{
                        width: 13,
                        height: 13,
                        color: theme.dark ? White : SlateDark,
                      }}
                    />
                  </ArrowContainer>
                </SelectedOptionContainer>
                <SelectedOptionCol>
                  <TouchableOpacity
                    onPress={() => {
                      showModal('amount');
                    }}>
                    <DataText>
                      {amountFrom && amountFrom > 0 ? amountFrom : '0.00'}
                    </DataText>
                  </TouchableOpacity>
                </SelectedOptionCol>
              </ActionsContainer>
              <ActionsContainer>
                <BottomDataText>
                  {fromWalletSelected.balance.crypto}{' '}
                  {fromWalletSelected.currencyAbbreviation.toUpperCase()}{' '}
                  available to swap
                </BottomDataText>
              </ActionsContainer>
            </>
          )}
        </SwapCryptoCard>

        <ArrowContainer>
          <ArrowDown />
        </ArrowContainer>

        <SwapCryptoCard>
          <SummaryTitle>To</SummaryTitle>
          {!toWalletSelected && (
            <ActionsContainer>
              <SelectedOptionContainer
                style={{backgroundColor: Action}}
                disabled={!isToWalletEnabled()}
                onPress={() => {
                  if (!isToWalletEnabled()) {
                    return;
                  }
                  console.log('Swap crypto card clicked 2');
                  showModal('walletSelector');
                }}>
                <SelectedOptionText
                  style={{color: White}}
                  numberOfLines={1}
                  ellipsizeMode={'tail'}>
                  Select Wallet
                </SelectedOptionText>
                <SelectorArrowContainer>
                  <SelectorArrowDown
                    {...{width: 13, height: 13, color: White}}
                  />
                </SelectorArrowContainer>
              </SelectedOptionContainer>
            </ActionsContainer>
          )}
          {toWalletSelected && (
            <>
              <ActionsContainer>
                <SelectedOptionContainer
                  style={{minWidth: 120}}
                  onPress={() => {
                    if (!isToWalletEnabled()) {
                      return;
                    }
                    console.log('Swap crypto card clicked 2');
                    showModal('walletSelector');
                  }}>
                  <SelectedOptionCol>
                    {toWalletData && (
                      <CoinIconContainer>
                        <CurrencyImage img={toWalletData.img} size={20} />
                      </CoinIconContainer>
                    )}
                    <SelectedOptionText
                      numberOfLines={1}
                      ellipsizeMode={'tail'}>
                      {toWalletSelected.credentials.coin.toUpperCase()}
                    </SelectedOptionText>
                  </SelectedOptionCol>
                  <ArrowContainer>
                    <SelectorArrowDown
                      {...{
                        width: 13,
                        height: 13,
                        color: theme.dark ? White : SlateDark,
                      }}
                    />
                  </ArrowContainer>
                </SelectedOptionContainer>
                {rateData?.amountTo && (
                  <SelectedOptionCol>
                    <DataText>{rateData?.amountTo}</DataText>
                  </SelectedOptionCol>
                )}
              </ActionsContainer>
              {rateData?.rate && (
                <ActionsContainer alignEnd={true}>
                  <BottomDataText>
                    1 {fromWalletSelected?.currencyAbbreviation.toUpperCase()} ~{' '}
                    {rateData?.rate}{' '}
                    {toWalletSelected.currencyAbbreviation.toUpperCase()}
                  </BottomDataText>
                </ActionsContainer>
              )}
            </>
          )}
        </SwapCryptoCard>

        <CtaContainer>
          <Button
            buttonStyle={'primary'}
            disabled={!canContinue()}
            onPress={() => {
              navigation.navigate('SwapCrypto', {
                screen: 'ChangellyCheckout',
                params: {
                  fromWalletSelected: fromWalletSelected!,
                  toWalletSelected: toWalletSelected!,
                  fromWalletData: fromWalletData!,
                  toWalletData: toWalletData!,
                  fixedRateId: rateData!.fixedRateId,
                  amountFrom: amountFrom,
                  rate: rateData!.rate,
                  // useSendMax: useSendMax,
                  // sendMaxInfo: sendMaxInfo
                },
              });
            }}>
            Continue
          </Button>
        </CtaContainer>
        <ProviderContainer>
          <ProviderLabel>Provided By</ProviderLabel>
          {theme.dark ? (
            <ChangellyLogoDm width={100} height={30} />
          ) : (
            <ChangellyLogo width={100} height={30} />
          )}
        </ProviderContainer>
      </ScrollView>

      <FromWalletSelectorModal
        onPress={(fromWallet: Wallet) => {
          hideModal('fromWalletSelector');
          setFromWalletSelected(fromWallet);
          // const coinsTo = cloneDeep(swapCryptoSupportedCoinsFrom).splice(swapCryptoSupportedCoinsFrom.indexOf(fromWallet.credentials.coin), 1);
          const coinsTo = cloneDeep(swapCryptoSupportedCoinsFrom).filter(
            coin => coin != fromWallet.credentials.coin,
          );
          // debugger;
          // const index = swapCryptoSupportedCoinsFrom.indexOf(fromWallet.credentials.coin);
          // let coinsTo: string[] = [];
          // if (index > -1) {
          //   console.log(
          //     `Removing ${fromWallet.credentials.coin.toUpperCase()} from Changelly supported coins`
          //   );
          //   const daga = cloneDeep(swapCryptoSupportedCoinsFrom);
          //   coinsTo = daga.splice(index, 1);
          // }
          setSwapCryptoSupportedCoinsTo(coinsTo);
        }}
        customSupportedCurrencies={swapCryptoSupportedCoinsFrom}
        isVisible={fromWalletSelectorModalVisible}
        onBackdropPress={() => hideModal('fromWalletSelector')}
      />

      <ToWalletSelectorModal
        isVisible={walletSelectorModalVisible}
        customSupportedCurrencies={swapCryptoSupportedCoinsTo}
        onDismiss={(toWallet?: Wallet) => {
          hideModal('walletSelector');
          if (toWallet) {
            setToWalletSelected(toWallet);
          }
        }}
      />

      <AmountModal
        isVisible={amountModalVisible}
        onDismiss={(newAmount?: number) => {
          if (newAmount) {
            setAmountFrom(newAmount);
          }
          hideModal('amount');
        }}
      />
    </>
  );
};

export default SwapCryptoRoot;
