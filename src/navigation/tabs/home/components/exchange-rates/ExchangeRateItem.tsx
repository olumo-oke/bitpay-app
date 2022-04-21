import React from 'react';
import styled from 'styled-components/native';
import {CurrencyImage} from '../../../../../components/currency-image/CurrencyImage';
import {
  ActiveOpacity,
  Column,
  CurrencyColumn,
  CurrencyImageContainer,
} from '../../../../../components/styled/Containers';
import {H7, Smallest} from '../../../../../components/styled/Text';
import {formatFiatAmount} from '../../../../../utils/helper-methods';
import GainArrow from '../../../../../../assets/img/home/exchange-rates/increment-arrow.svg';
import LossArrow from '../../../../../../assets/img/home/exchange-rates/decrement-arrow.svg';
import NeutralArrow from '../../../../../../assets/img/home/exchange-rates/flat-arrow.svg';
import {ExchangeRateItemProps} from './ExchangeRatesList';
import {Slate, SlateDark} from '../../../../../styles/colors';

const RowContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin: 10px 0;
`;

const NoteContainer = styled(Column)`
  align-items: flex-end;
`;

const SubTextContainer = styled.View`
  align-items: center;
  flex-direction: row;
`;

const ExchangeRateText = styled(H7)`
  font-weight: 500;
`;

const ExchangeRateSubText = styled(Smallest)`
  line-height: 20px;
  color: ${({theme}) => (theme.dark ? Slate : SlateDark)};
`;

const showLossGainOrNeutralArrow = (average: number | undefined) => {
  if (average === undefined) {
    return;
  }

  if (average > 0) {
    return <GainArrow style={{marginRight: 5}} />;
  } else if (average < 0) {
    return <LossArrow style={{marginRight: 5}} />;
  } else {
    return <NeutralArrow style={{marginRight: 5}} />;
  }
};

const ExchangeRateItem = ({
  item,
  onPress,
  defaultAltCurrencyIsoCode,
}: {
  item: ExchangeRateItemProps;
  onPress: () => void;
  defaultAltCurrencyIsoCode: string;
}) => {
  const {img, currencyName, currentPrice, average, currencyAbbreviation} = item;

  return (
    <RowContainer activeOpacity={ActiveOpacity} onPress={onPress}>
      <CurrencyImageContainer style={{width: 40, height: 40}}>
        <CurrencyImage img={img} size={40} />
      </CurrencyImageContainer>
      <CurrencyColumn>
        <ExchangeRateText ellipsizeMode="tail" numberOfLines={1}>
          {currencyName}
        </ExchangeRateText>
        <ExchangeRateSubText>
          {currencyAbbreviation?.toUpperCase()}
        </ExchangeRateSubText>
      </CurrencyColumn>
      <NoteContainer>
        {currentPrice && (
          <ExchangeRateText>
            {formatFiatAmount(currentPrice, defaultAltCurrencyIsoCode, {
              customPrecision: 'minimal',
              currencyAbbreviation,
            })}
          </ExchangeRateText>
        )}
        <SubTextContainer>
          {showLossGainOrNeutralArrow(average)}
          <ExchangeRateSubText>{average}%</ExchangeRateSubText>
        </SubTextContainer>
      </NoteContainer>
    </RowContainer>
  );
};

export default ExchangeRateItem;