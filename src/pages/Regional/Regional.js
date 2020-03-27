// @flow

import React, { useState } from 'react';
import type { ComponentType } from 'react';

import useLoadData from 'hooks/useLoadData';
import useResponsiveLayout from 'hooks/useResponsiveLayout';
import BigNumberBlock from 'components/BigNumberBlock';
import BigNumber from 'components/BigNumber';
import PageTitle from 'components/PageTitle';
import RegionTable from 'components/RegionTable';
import Map from 'components/Map';
import RegionTitle from 'components/RegionTitle';
import DailyConfirmedCases from 'components/DailyConfirmedCases';
import CumulativeTotalCases from 'components/CumulativeTotalCases';
import CumulativeDeaths from 'components/CumulativeDeaths';
import Disclaimer from 'components/Disclaimer';

import type { Props } from './Regional.types';
import * as Styles from './Regional.styles';

const LocalAuthorityal: ComponentType<Props> = ({}: Props) => {
  const [country, setCountry] = useState(null);
  const [nhsRegion, setNhsRegion] = useState(null);
  const [localAuthority, setLocalAuthority] = useState(null);
  const [overviewData, countryData, nhsRegionData, localAuthorityData] = useLoadData();
  const layout = useResponsiveLayout(768);

  if (!overviewData || !countryData || !nhsRegionData || !localAuthorityData) {
    return null;
  }

  return (
    <Styles.Container className="govuk-width-container">
      <PageTitle
        caption="Regional view"
        title="Coronavirus (COVID-19) in the UK"
        subtitle={`Last updated ${new Date(overviewData.lastUpdatedAt).toGMTString()}`}
      />
      {/* <BigNumberBlock data={overviewData?.['United Kingdom']} /> */}
      <BigNumber
        caption="Total number of UK cases"
        number={overviewData?.K02000001?.totalCases?.value ?? 0}
        percentageChange={5}
        subtext=""
      />
      <BigNumber
        caption="Number of people who have recovered"
        number={overviewData?.K02000001?.recovered?.value ?? 0}
        percentageChange={0}
        subtext=""
      />
      <BigNumber
        caption="Number of people who have died"
        number={overviewData?.K02000001?.deaths?.value ?? 0}
        percentageChange={20}
        subtext=""
      />
      <CumulativeTotalCases data={overviewData?.K02000001?.dailyTotalConfirmedCases ?? []} />
      <DailyConfirmedCases data={overviewData?.K02000001?.dailyConfirmedCases ?? []} />
      <CumulativeDeaths data={overviewData?.K02000001?.dailyDeaths ?? []} />
      <RegionTable
        country={country}
        setCountry={setCountry}
        countryData={countryData}
        nhsRegion={nhsRegion}
        setNhsRegion={setNhsRegion}
        nhsRegionData={nhsRegionData}
        localAuthority={localAuthority}
        setLocalAuthority={setLocalAuthority}
        localAuthorityData={localAuthorityData}
      />
      {layout === 'desktop' && (
        <Map
          country={country}
          setCountry={setCountry}
          countryData={countryData}
          nhsRegion={nhsRegion}
          setNhsRegion={setNhsRegion}
          nhsRegionData={nhsRegionData}
          localAuthority={localAuthority}
          setLocalAuthority={setLocalAuthority}
          localAuthorityData={localAuthorityData}
        />
      )}
     {layout === 'desktop' && <Disclaimer />}
    </Styles.Container>
  );
};

export default LocalAuthorityal;
