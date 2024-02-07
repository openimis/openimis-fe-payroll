/* eslint-disable no-param-reassign */
import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  Searcher, useModulesManager, useTranslations,
} from '@openimis/fe-core';
import { fetchBenefitConsumptions } from '../../actions';
import { DEFAULT_PAGE_SIZE, ROWS_PER_PAGE_OPTIONS } from '../../constants';
import BenefitConsumptionFilter from './BenefitConsumptionFilter';

function BenefitConsumptionSearcher({
  fetchBenefitConsumptions,
  fetchingBenefitConsumptions,
  fetchedBenefitConsumptions,
  errorBenefitConsumptions,
  benefitConsumptions,
  benefitConsumptionsPageInfo,
  benefitConsumptionsTotalCount,
  payrollUuid,
}) {
  const modulesManager = useModulesManager();
  const { formatMessageWithValues } = useTranslations('payroll', modulesManager);

  const fetch = (params) => fetchBenefitConsumptions(modulesManager, params);

  const headers = () => [
    'benefitConsumption.individual.firstName',
    'benefitConsumption.individual.lastName',
    'benefitConsumption.photo',
    'benefitConsumption.code',
    'benefitConsumption.dateDue',
    'benefitConsumption.receipt',
    'benefitConsumption.amount',
    'benefitConsumption.type',
    'benefitConsumption.status',
  ];

  const itemFormatters = () => [
    (benefitConsumption) => benefitConsumption?.individual?.firstName,
    (benefitConsumption) => benefitConsumption?.individual?.lastName,
    (benefitConsumption) => benefitConsumption?.photo,
    (benefitConsumption) => benefitConsumption?.code,
    (benefitConsumption) => benefitConsumption?.dateDue,
    (benefitConsumption) => benefitConsumption?.receipt,
    (benefitConsumption) => benefitConsumption?.amount,
    (benefitConsumption) => benefitConsumption?.type,
    (benefitConsumption) => benefitConsumption?.status,
  ];

  const rowIdentifier = (benefitConsumption) => benefitConsumption.id;

  const sorts = () => [
    ['individual_FirstName', true],
    ['individual_LastName', true],
    ['photo', true],
    ['code', true],
    ['dateDue', true],
    ['receipt', true],
    ['amount', true],
    ['type', true],
    ['status', true],
  ];

  const defaultFilters = () => ({
    isDeleted: {
      value: false,
      filter: 'isDeleted: false',
    },
    payrollUuid: {
      value: payrollUuid,
      filter: `payrollUuid: "${payrollUuid}"`,
    },
  });

  const benefitConsumptionFilter = ({ filters, onChangeFilters }) => (
    <BenefitConsumptionFilter filters={filters} onChangeFilters={onChangeFilters} />
  );

  return (
    <div>
      <Searcher
        module="payroll"
        FilterPane={benefitConsumptionFilter}
        fetch={fetch}
        items={benefitConsumptions}
        itemsPageInfo={benefitConsumptionsPageInfo}
        fetchingItems={fetchingBenefitConsumptions}
        fetchedItems={fetchedBenefitConsumptions}
        errorItems={errorBenefitConsumptions}
        tableTitle={
          formatMessageWithValues('benefitConsumption.searcherResultsTitle', { benefitConsumptionsTotalCount })
        }
        headers={headers}
        itemFormatters={itemFormatters}
        sorts={sorts}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        rowIdentifier={rowIdentifier}
        defaultFilters={defaultFilters()}
      />
    </div>
  );
}

const mapStateToProps = (state) => ({
  fetchingBenefitConsumptions: state.payroll.fetchingBenefitConsumptions,
  fetchedBenefitConsumptions: state.payroll.fetchedBenefitConsumptions,
  errorBenefitConsumptions: state.payroll.errorBenefitConsumptions,
  benefitConsumptions: state.payroll.benefitConsumptions,
  benefitConsumptionsPageInfo: state.payroll.benefitConsumptionsPageInfo,
  benefitConsumptionsTotalCount: state.payroll.benefitConsumptionsTotalCount,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(
  { fetchBenefitConsumptions },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(BenefitConsumptionSearcher);
