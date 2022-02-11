import React, {useLayoutEffect} from 'react';
import {Linking, ScrollView} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import LinearGradient from 'react-native-linear-gradient';
import {MerchantStackParamList} from '../MerchantStack';
import RemoteImage from '../../components/RemoteImage';
import styled from 'styled-components/native';
import {
  CtaContainerAbsolute,
  WIDTH,
} from '../../../../../components/styled/Containers';
import Button from '../../../../../components/button/Button';
import {
  getMastheadGradient,
  SectionContainer,
  SectionDivider,
  SectionSpacer,
} from '../../components/styled/ShopTabComponents';
import {H3, H5, Paragraph} from '../../../../../components/styled/Text';
import {useTheme} from '@react-navigation/native';

const GradientBox = styled(LinearGradient)`
  width: ${WIDTH}px;
  height: 80px;
`;

const ContentContainer = styled(SectionContainer)`
  padding: 0 3px;
`;

const MerchantName = styled(H3)`
  margin-bottom: 15px;
`;

const Divider = styled(SectionDivider)`
  margin: 25px 0;
`;

const SectionHeader = styled(H5)`
  margin-bottom: 15px;
`;

const FooterButton = styled(CtaContainerAbsolute)`
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

const MerchantDetails = ({
  route,
  navigation,
}: StackScreenProps<MerchantStackParamList, 'MerchantDetails'>) => {
  const theme = useTheme();
  const {directIntegration} = route.params;
  const iconHeight = 70;
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: directIntegration.displayName,
    });
  });
  return (
    <>
      <ScrollView>
        <GradientBox colors={getMastheadGradient(theme)} />
        <SectionContainer style={{marginTop: -iconHeight / 2}}>
          <RemoteImage
            uri={directIntegration.icon}
            height={iconHeight}
            width={iconHeight}
            borderRadius={50}
          />
          <SectionSpacer />
          <ContentContainer>
            <MerchantName>{directIntegration.displayName}</MerchantName>
            <Paragraph>{directIntegration.caption}</Paragraph>
            <Divider />
            <SectionHeader>Payment Instructions</SectionHeader>
            <Paragraph>{directIntegration.instructions}</Paragraph>
          </ContentContainer>
        </SectionContainer>
      </ScrollView>
      <FooterButton
        background={true}
        style={{
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 4},
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 5,
        }}>
        <Button
          onPress={() => Linking.openURL(directIntegration.link)}
          buttonStyle={'primary'}>
          Go to {directIntegration.displayName}
        </Button>
      </FooterButton>
    </>
  );
};

export default MerchantDetails;