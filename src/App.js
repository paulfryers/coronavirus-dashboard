/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { Header, Footer } from 'govuk-react-jsx';

import useResponsiveLayout from 'hooks/useResponsiveLayout';
import Regional from 'pages/Regional';
import MobileRegionTable from 'pages/MobileRegionTable';
import About from 'pages/About';
import Accessibility from 'pages/Accessibility';
import Navigation from 'components/Navigation';
import CookieBanner from 'components/CookieBanner';

const F = props => <Footer
  {...props}
  meta={{
    children: [
      'For feedback email ',
      <a className="govuk-footer__link" href="mailto:coronavirus-tracker@phe.gov.uk?Subject=Coronavirus%20dashboard%20feedback" rel="noopener noreferrer" target="_blank">coronavirus-tracker@phe.gov.uk</a>,
    ],
    items: [
      { children: ['About the data'], href: '/about' },
      { children: ['Accessibility'], href: '/accessibility' },
    ],
    visuallyHiddenTitle: 'Items',
  }}
/>;

const App = () => {
  const layout = useResponsiveLayout(768);

  return (
    <>
      <CookieBanner />
      <Header
        // containerClassName="govuk-header__container--full-width"
        // navigationClassName="govuk-header__navigation--end"
        serviceName="Coronavirus (COVID-19) cases in the UK"
        serviceUrlTo="/"
        homepageUrlHref="https://gov.uk"
      />
      {layout === 'mobile' && <Navigation />}
      <Switch>
        <Route path="/region" component={MobileRegionTable} />
        <Route path="/about" component={About} />
        <Route path="/accessibility" component={Accessibility} />
        <Route path="/" component={Regional} />
        <Redirect to="/" />
      </Switch>
      <Switch>
        <Route path="/" exact component={F} />
        <Route path="/about" exact component={F} />
        <Route path="/accessibility" exact component={F} />
      </Switch>
    </>
  );
}

export default App;
