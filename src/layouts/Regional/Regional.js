// @flow

import React, { useState } from 'react';
import type { ComponentType } from 'react';

import Layout from 'components/Layout';
import BigNumber from 'components/BigNumber';
import PageTitle from 'components/PageTitle';
import RegionTable from 'components/RegionTable';
import Map from 'components/Map';
import Disclaimer from 'components/Disclaimer';
import LineChart from 'components/LineChart';
import BarChart from 'components/BarChart';
import ViewAs from 'components/ViewAs';
import AltChartTable from 'components/AltChartTable';
import NoScriptChartTables from 'components/NoScriptChartTables';
import NoScriptMapTables from 'components/NoScriptMapTables';
import { ExportCasesAsCSV, ExportDeathsAsCSV } from "components/Export";

import type { Props } from './Regional.types';
import * as Styles from './Regional.styles';

const formatAMPM = date => {

  let
    hours = date.getUTCHours(),
    minutes = date.getUTCMinutes(),
    ampm = hours >= 12 ? 'pm' : 'am';

  hours = (hours % 12) || 12;
  minutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}:${minutes} ${ampm}`

};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const formatDate = (d: string = "") => {

  if (d === "") return "";

  const date = new Date(d.toLowerCase().endsWith("z") ? d : `${d}Z`);

  return `${date.getUTCDate()} ${monthNames[date.getUTCMonth()]} ${date.getUTCFullYear()}, ${formatAMPM(date)} GMT`;

};

/**
 * Extracts the number of deaths from the latest date included in
 * the data, under: ``data.overview.K02000001.dailyDeaths``
 * @param data
 * @returns {number} Latest number of deaths or 0.
 */
const getLatestDailyDeaths = (data: any): number => {

  const defaultDate = '0000.00.00';

  try {
    return data?.overview?.K02000001?.dailyDeaths?.sort((a, b) =>
      new Date(b?.date ?? defaultDate) - new Date(a?.date ?? defaultDate)
    )[0]?.value ?? 0
  } catch (e) {
    return 0
  }

}; // getLatestDailyDeaths

const Regional: ComponentType<Props> = ({ pageContext: { data }}: Props) => {
  const [country, setCountry] = useState(null);
  const [region, setRegion] = useState(null);
  const [utla, setUtla] = useState(null);
  const [view, setView] = useState('chart');

  if (!data) {
    return null;
  }

  // Chart and table titles
  const titles = {
    totalCases: 'Total number of lab-confirmed cases in England by specimen date',
    dailyCases: 'Daily number of lab-confirmed cases in England by specimen date',
    totalDeaths: 'Total number of COVID-19 associated UK deaths in hospital by date reported',
    dailyDeaths: 'Daily number of COVID-19 associated UK deaths in hospital by date reported'
  };

  return (
    <Layout pathname="/">
      <Styles.Container className="govuk-width-container">
        <PageTitle
          title="Coronavirus (COVID-19) in the UK"
          subtitle={`Last updated ${formatDate(data?.lastUpdatedAt)}`}
        />
        <BigNumber
          caption="Total number of lab-confirmed UK cases"
          number={data?.overview?.K02000001?.totalCases?.value ?? 0}
        />
        <BigNumber
          caption="Latest daily number of lab-confirmed UK cases"
          number={data?.overview?.K02000001?.newCases?.value ?? 0}
        />
        <BigNumber
          caption="Total number of COVID-19 associated UK deaths in hospital"
          number={data?.overview?.K02000001?.deaths.value ?? 0}
        />
        <BigNumber
          caption="Latest daily number of COVID-19 associated UK deaths in hospital"
          number={getLatestDailyDeaths(data)}
        />
        <Styles.HideOnMobile>
          <RegionTable
            country={country}
            setCountry={setCountry}
            countryData={data?.countries}
            region={region}
            setRegion={setRegion}
            regionData={data?.regions}
            utla={utla}
            setUtla={setUtla}
            utlaData={data?.utlas}
          />
          <Map
            country={country}
            setCountry={setCountry}
            countryData={data?.countries}
            region={region}
            setRegion={setRegion}
            regionData={data?.regions}
            utla={utla}
            setUtla={setUtla}
            utlaData={data?.utlas}
          />
          <NoScriptMapTables
            countryData={data?.countries}
            regionData={data?.regions}
            utlaData={data?.utlas}
          />
        </Styles.HideOnMobile>
        <ExportCasesAsCSV data={data} />
        <ExportDeathsAsCSV data={data} />
        <ViewAs view={view} setView={setView} />
        {view === 'chart' && (
          <>
            <LineChart data={data?.countries?.E92000001?.dailyTotalConfirmedCases ?? []} header={titles.totalCases} tooltipText="cases" />
            <BarChart data={data?.countries?.E92000001?.dailyConfirmedCases ?? []} header={titles.dailyCases} tooltipText="cases" />
            <LineChart data={data?.overview?.K02000001?.dailyTotalDeaths ?? []} header={titles.totalDeaths} tooltipText="deaths" />
            <BarChart data={data?.overview?.K02000001?.dailyDeaths ?? []} header={titles.dailyDeaths} tooltipText="deaths" />
          </>
        )}
        {view === 'table' && (
          <>
            <AltChartTable data={data?.countries?.E92000001?.dailyTotalConfirmedCases ?? []} header={titles.totalCases} valueName="Total cases" />
            <AltChartTable data={data?.countries?.E92000001?.dailyConfirmedCases ?? []} header={titles.dailyCases} valueName="Daily cases" />
            <AltChartTable data={data?.overview?.K02000001?.dailyTotalDeaths ?? []} header={titles.totalDeaths} valueName="Total deaths" />
            <AltChartTable data={data?.overview?.K02000001?.dailyDeaths ?? []} header={titles.dailyDeaths} valueName="Daily deaths" />
          </>
        )}
      <NoScriptChartTables data={data} />
        <Disclaimer text={data?.disclaimer} />
      </Styles.Container>
    </Layout>
  );
};

export default Regional;
