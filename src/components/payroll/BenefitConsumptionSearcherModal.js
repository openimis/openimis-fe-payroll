/* eslint-disable no-param-reassign */
import React, { useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import {
  Searcher, useModulesManager, useTranslations,
} from '@openimis/fe-core';
import PhotoCameraOutlinedIcon from '@material-ui/icons/PhotoCameraOutlined';
import { fetchBenefitAttachments } from '../../actions';
import { DEFAULT_PAGE_SIZE, ROWS_PER_PAGE_OPTIONS, PAYROLL_STATUS } from '../../constants';
import BenefitConsumptionFilterModal from './BenefitConsumptionFilterModal';
import ErrorSummaryModal from './dialogs/ErrorSummaryModal';

function BenefitConsumptionSearcherModal({
  fetchBenefitAttachments,
  fetchingBenefitAttachments,
  fetchedBenefitAttachments,
  errorBenefitAttachments,
  benefitAttachments,
  benefitAttachmentsPageInfo,
  benefitAttachmentsTotalCount,
  payrollUuid,
  reconciledMode,
  payrollDetail,
}) {
  const modulesManager = useModulesManager();
  const { formatMessage, formatMessageWithValues } = useTranslations('payroll', modulesManager);
  const [selectedBenefitAttachment, setSelectedBenefitAttachment] = useState(null);

  const fetch = (params) => {
    fetchBenefitAttachments(modulesManager, params);
  };

  const headers = () => [
    'benefitConsumption.photo',
    'benefitConsumption.individual.firstName',
    'benefitConsumption.individual.lastName',
    'benefitConsumption.amount',
    'benefitConsumption.receipt',
    'benefitConsumption.dateDue',
    'benefitConsumption.payedOnTime',
    'benefitConsumption.paymentDate',
    'benefitConsumption.status',
    '',
  ];

  const checkBenefitDueDate = (benefitAttachment) => {
    if (!benefitAttachment.benefit.receipt) {
      return ''; // return empty string if datePayed is null
    }

    return (
      benefitAttachment.benefit && benefitAttachment.benefit.dateDue >= benefitAttachment.bill.datePayed)
      ? 'True' : 'False';
  };

  const itemFormatters = () => [
    (benefitAttachment) => (
      benefitAttachment.benefit.receipt ? (
        <PhotoCameraOutlinedIcon style={{ fontSize: 150 }} />
      ) : null
    ),
    (benefitAttachment) => benefitAttachment?.benefit?.individual?.firstName,
    (benefitAttachment) => benefitAttachment?.benefit?.individual?.lastName,
    (benefitAttachment) => benefitAttachment?.bill?.amountTotal,
    (benefitAttachment) => benefitAttachment?.benefit?.receipt,
    (benefitAttachment) => benefitAttachment?.benefit?.dateDue,
    (benefitAttachment) => checkBenefitDueDate(benefitAttachment),
    (benefitAttachment) => (
      !benefitAttachment.benefit.receipt
        ? ''
        : benefitAttachment?.bill?.datePayed
    ),
    (benefitAttachment) => benefitAttachment?.benefit?.status,
    (benefitAttachment) => (
      <Button
        onClick={() => {}}
        variant="contained"
        color="primary"
        disabled={!!benefitAttachment.benefit.receipt}
      >
        {formatMessage('payroll.summary.confirm')}
      </Button>
    ),
    (benefitAttachment) => (
      payrollDetail.paymentMethod === 'StrategyOnlinePayment' && payrollDetail.status === 'RECONCILED'
        && benefitAttachment.benefit.status !== 'RECONCILED' && (
          <Button
            onClick={() => setSelectedBenefitAttachment(benefitAttachment)}
            variant="contained"
            style={{ backgroundColor: '#b80000', color: 'white' }}
          >
            {formatMessage('payroll.summary.benefit_error')}
          </Button>
      )
    ),
  ];

  const rowIdentifier = (benefitAttachment) => benefitAttachment.id;

  const sorts = () => [
    ['benefit_photo', false],
    ['benefit_individual_FirstName', true],
    ['benefit_individual_LastName', true],
    ['bill_amountTotal', true],
    ['benefit_receipt', true],
    ['benefit_dateDue', true],
  ];

  const defaultFilters = () => {
    const filters = {
      isDeleted: {
        value: false,
        filter: 'isDeleted: false',
      },
      payrollUuid: {
        value: payrollUuid,
        filter: `payrollUuid: "${payrollUuid}"`,
      },
    };
    if (reconciledMode && payrollDetail.paymentMethod !== 'StrategyOnlinePayment') {
      filters.benefit_Status = {
        value: 'RECONCILED',
        filter: `benefit_Status: ${PAYROLL_STATUS.RECONCILED}`,
      };
    }
    return filters;
  };

  const benefitConsumptionFilterModal = ({ filters, onChangeFilters }) => (
    <BenefitConsumptionFilterModal filters={filters} onChangeFilters={onChangeFilters} />
  );

  return (
    <div>
      <Searcher
        module="payroll"
        FilterPane={benefitConsumptionFilterModal}
        fetch={fetch}
        items={benefitAttachments}
        itemsPageInfo={benefitAttachmentsPageInfo}
        fetchingItems={fetchingBenefitAttachments}
        fetchedItems={fetchedBenefitAttachments}
        errorItems={errorBenefitAttachments}
        tableTitle={
          formatMessageWithValues('benefitAttachment.searcherResultsTitle', { benefitAttachmentsTotalCount })
        }
        headers={headers}
        itemFormatters={itemFormatters}
        sorts={sorts}
        rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
        defaultPageSize={DEFAULT_PAGE_SIZE}
        rowIdentifier={rowIdentifier}
        defaultFilters={defaultFilters()}
      />
      {selectedBenefitAttachment && (
        <ErrorSummaryModal
          open={!!selectedBenefitAttachment}
          onClose={() => setSelectedBenefitAttachment(null)}
          benefitAttachment={selectedBenefitAttachment}
        />
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  fetchingBenefitAttachments: state.payroll.fetchingBenefitAttachments,
  fetchedBenefitAttachments: state.payroll.fetchedBenefitAttachments,
  errorBenefitAttachments: state.payroll.errorBenefitAttachments,
  benefitAttachments: state.payroll.benefitAttachments,
  benefitAttachmentsPageInfo: state.payroll.benefitAttachmentsPageInfo,
  benefitAttachmentsTotalCount: state.payroll.benefitAttachmentsTotalCount,
});

const mapDispatchToProps = (dispatch) => bindActionCreators(
  { fetchBenefitAttachments },
  dispatch,
);

export default connect(mapStateToProps, mapDispatchToProps)(BenefitConsumptionSearcherModal);
