import React from 'react';
import {Path, Svg} from 'react-native-svg';
import {LuckySevens} from '../../styles/colors';
import {useTheme} from 'styled-components/native';

interface NestedArrowSvgProps {
  isDark: boolean;
}

const NestedArrowSvg: React.FC<NestedArrowSvgProps> = ({isDark}) => {
  return (
    <Svg width="12" height="10" viewBox="0 0 12 10" fill="none">
      <Path
        d="M-3.99186e-07 1.00051L-1.77403e-07 6.00051C-1.65639e-07 6.26572 0.105357 6.52008 0.292893 6.70761C0.480429 6.89515 0.734783 7.00051 1 7.00051L7 7.00051L7 9.50051C7.0001 9.59649 7.02782 9.69042 7.07986 9.77108C7.1319 9.85173 7.20606 9.9157 7.29347 9.95535C7.38089 9.995 7.47787 10.0086 7.57283 9.99467C7.66779 9.98069 7.75672 9.93967 7.829 9.87651L11.829 6.37651C11.8825 6.32958 11.9254 6.27176 11.9548 6.20692C11.9842 6.14207 11.9994 6.0717 11.9994 6.00051C11.9994 5.92931 11.9842 5.85894 11.9548 5.7941C11.9254 5.72926 11.8825 5.67144 11.829 5.62451L7.829 2.12451C7.75672 2.06135 7.66779 2.02033 7.57283 2.00635C7.47786 1.99237 7.38089 2.00602 7.29347 2.04566C7.20606 2.08531 7.1319 2.14928 7.07986 2.22994C7.02782 2.31059 7.0001 2.40452 7 2.50051L7 5.00051L2 5.00051L2 1.00051C2 0.735292 1.89464 0.480938 1.70711 0.293402C1.51957 0.105865 1.26522 0.000508254 1 0.000508265C0.734783 0.000508277 0.480429 0.105865 0.292893 0.293402C0.105356 0.480938 -4.1095e-07 0.735292 -3.99186e-07 1.00051H-3.99186e-07Z"
        fill={isDark ? LuckySevens : '#E1E4E7'}
      />
    </Svg>
  );
};

const NestedArrowIcon = () => {
  const theme = useTheme();
  return <NestedArrowSvg isDark={theme.dark} />;
};

export default NestedArrowIcon;