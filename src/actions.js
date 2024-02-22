import {
  decodeId,
  formatGQLString,
  formatMutation,
  formatPageQueryWithCount,
  formatQuery,
  graphql,
} from '@openimis/fe-core';

import { ACTION_TYPE, MUTATION_SERVICE } from './reducer';
import {
  CLEAR, ERROR, REQUEST, SUCCESS,
} from './utils/action-type';
import { isBase64Encoded } from './utils/advanced-filters-utils';
import { PAYROLL_STATUS } from './constants';

export const PAYMENT_POINT_PROJECTION = (modulesManager) => [
  'id',
  'name',
  'isDeleted',
  `location ${modulesManager.getProjection('location.Location.FlatProjection')}`,
  `ppm ${modulesManager.getProjection('admin.UserPicker.projection')}`,
];

const BENEFIT_CONSUMPTION_PROJECTION = () => [
  'id',
  'isDeleted',
  'jsonExt',
  'dateCreated',
  'dateUpdated',
  'dateValidFrom',
  'dateValidTo',
  'id',
  'code',
  'individual {firstName, lastName}',
  'benefitAttachment {bill {id, code, terms}}',
  'receipt',
  'photo',
  'amount',
  'type',
  'status',
  'dateDue',
];

const BENEFIT_ATTACHMENT_PROJECTION = () => [
  'benefit{id, status, code, dateDue, receipt, individual {firstName, lastName}}',
  'bill{id, code, terms, amountTotal}',
];

const PAYROLL_PROJECTION = (modulesManager) => [
  'id',
  'name',
  'paymentMethod',
  'paymentPlan { code, id, name, benefitPlan }',
  `paymentPoint { ${PAYMENT_POINT_PROJECTION(modulesManager).join(' ')} }`,
  'paymentCycle { runYear, runMonth }',
  // eslint-disable-next-line max-len
  'benefitConsumption{id, status, code, dateDue, receipt, individual {firstName, lastName}, benefitAttachment{bill{id, code, terms, amountTotal}}}',
  'jsonExt',
  'status',
  'dateValidFrom',
  'dateValidTo',
  'isDeleted',
];

const CSV_RECONCILIATION_PROJECTION = () => [
  'fileName',
  'status',
];

const PAYMENT_METHOD_PROJECTION = () => [
  'paymentMethods {name}',
];

const formatPaymentPointGQL = (paymentPoint) => `
  ${paymentPoint?.id ? `id: "${paymentPoint.id}"` : ''}
  ${paymentPoint?.name ? `name: "${formatGQLString(paymentPoint.name)}"` : ''}
  ${paymentPoint?.location ? `locationId: ${decodeId(paymentPoint.location.id)}` : ''}
  ${paymentPoint?.ppm ? `ppmId: "${decodeId(paymentPoint.ppm.id)}"` : ''}
  `;

const formatPayrollGQL = (payroll) => `
  ${payroll?.id ? `id: "${payroll.id}"` : ''}
  ${payroll?.name ? `name: "${formatGQLString(payroll.name)}"` : ''}
  ${payroll?.paymentPoint ? `paymentPointId: "${decodeId(payroll.paymentPoint.id)}"` : ''}
  ${payroll?.paymentPlan ? `paymentPlanId: "${decodeId(payroll.paymentPlan.id)}"` : ''}
  ${payroll?.paymentCycle ? `paymentCycleId: "${decodeId(payroll.paymentCycle.id)}"` : ''}
  ${payroll?.paymentMethod ? `paymentMethod: "${payroll.paymentMethod}"` : ''}
  ${`status: ${PAYROLL_STATUS.PENDING_APPROVAL}`}
  ${
  payroll?.jsonExt
    ? `jsonExt: ${JSON.stringify(payroll.jsonExt)}`
    : ''
}
  ${
  payroll?.dateValidFrom
    ? `dateValidFrom: "${payroll.dateValidFrom}"`
    : ''
}
  ${
  payroll?.dateValidTo
    ? `dateValidTo: "${payroll.dateValidTo}"`
    : ''
}
  ${
  payroll?.fromFailedInvoicesPayrollId
    ? `fromFailedInvoicesPayrollId: "${payroll.fromFailedInvoicesPayrollId}"`
    : ''
}
  `;

const PERFORM_MUTATION = (mutationType, mutationInput, ACTION, clientMutationLabel) => {
  const mutation = formatMutation(mutationType, mutationInput, clientMutationLabel);
  const requestedDateTime = new Date();
  return graphql(
    mutation.payload,
    [REQUEST(ACTION_TYPE.MUTATION), SUCCESS(ACTION), ERROR(ACTION_TYPE.MUTATION)],
    {
      actionType: ACTION,
      clientMutationId: mutation.clientMutationId,
      clientMutationLabel,
      requestedDateTime,
    },
  );
};

export function fetchPaymentPoints(modulesManager, params) {
  const payload = formatPageQueryWithCount('paymentPoint', params, PAYMENT_POINT_PROJECTION(modulesManager));
  return graphql(payload, ACTION_TYPE.SEARCH_PAYMENT_POINTS);
}

export function fetchPaymentPoint(modulesManager, params) {
  const payload = formatPageQueryWithCount('paymentPoint', params, PAYMENT_POINT_PROJECTION(modulesManager));
  return graphql(payload, ACTION_TYPE.GET_PAYMENT_POINT);
}

export function fetchPayrollPaymentFiles(modulesManager, params) {
  const payload = formatPageQueryWithCount('csvReconciliationUpload', params, CSV_RECONCILIATION_PROJECTION());
  return graphql(payload, ACTION_TYPE.GET_PAYROLL_PAYMENT_FILES);
}

export const clearPaymentPoint = () => (dispatch) => {
  dispatch({
    type: CLEAR(ACTION_TYPE.GET_PAYMENT_POINT),
  });
};

export function deletePaymentPoint(paymentPoint, clientMutationLabel) {
  const paymentPointUuids = `ids: ["${paymentPoint?.id}"]`;
  return PERFORM_MUTATION(
    MUTATION_SERVICE.PAYMENT_POINT.DELETE,
    paymentPointUuids,
    ACTION_TYPE.DELETE_PAYMENT_POINT,
    clientMutationLabel,
  );
}

export function createPaymentPoint(paymentPoint, clientMutationLabel) {
  return PERFORM_MUTATION(
    MUTATION_SERVICE.PAYMENT_POINT.CREATE,
    formatPaymentPointGQL(paymentPoint),
    ACTION_TYPE.CREATE_PAYMENT_POINT,
    clientMutationLabel,
  );
}

export function updatePaymentPoint(paymentPoint, clientMutationLabel) {
  return PERFORM_MUTATION(
    MUTATION_SERVICE.PAYMENT_POINT.UPDATE,
    formatPaymentPointGQL(paymentPoint),
    ACTION_TYPE.UPDATE_PAYMENT_POINT,
    clientMutationLabel,
  );
}

export function fetchPayrolls(modulesManager, params) {
  const payload = formatPageQueryWithCount('payroll', params, PAYROLL_PROJECTION(modulesManager));
  return graphql(payload, ACTION_TYPE.SEARCH_PAYROLLS);
}

export function fetchPayroll(modulesManager, params) {
  const payload = formatPageQueryWithCount('payroll', params, PAYROLL_PROJECTION(modulesManager));
  return graphql(payload, ACTION_TYPE.GET_PAYROLL);
}

export function deletePayrolls(payroll, clientMutationLabel) {
  const uuid = isBase64Encoded(payroll.id) ? decodeId(payroll?.id) : payroll?.id;
  const payrollUuids = `ids: ["${uuid}"]`;
  return PERFORM_MUTATION(
    MUTATION_SERVICE.PAYROLL.DELETE,
    payrollUuids,
    ACTION_TYPE.DELETE_PAYROLL,
    clientMutationLabel,
  );
}

export function createPayroll(payroll, clientMutationLabel) {
  return PERFORM_MUTATION(
    MUTATION_SERVICE.PAYROLL.CREATE,
    formatPayrollGQL(payroll),
    ACTION_TYPE.CREATE_PAYROLL,
    clientMutationLabel,
  );
}

export function fetchBenefitConsumptions(modulesManager, params) {
  const payload = formatPageQueryWithCount('benefitConsumptionByPayroll', params, BENEFIT_CONSUMPTION_PROJECTION());
  return graphql(payload, ACTION_TYPE.GET_BENEFIT_CONSUMPTION);
}

export function fetchBenefitAttachments(modulesManager, params) {
  const payload = formatPageQueryWithCount('benefitAttachmentByPayroll', params, BENEFIT_ATTACHMENT_PROJECTION());
  return graphql(payload, ACTION_TYPE.GET_BENEFIT_ATTACHMENT);
}

export const clearPayrollBills = () => (dispatch) => {
  dispatch({
    type: CLEAR(ACTION_TYPE.GET_BENEFIT_CONSUMPTION),
  });
};

export const clearPayroll = () => (dispatch) => {
  dispatch({
    type: CLEAR(ACTION_TYPE.GET_PAYROLL),
  });
};

export function fetchPaymentMethods(params) {
  const payload = formatQuery('paymentMethods', params, PAYMENT_METHOD_PROJECTION());
  return graphql(payload, ACTION_TYPE.GET_PAYMENT_METHODS);
}

export function closePayroll(payroll, clientMutationLabel) {
  const payrollUuids = `ids: ["${payroll?.id}"]`;
  return PERFORM_MUTATION(
    MUTATION_SERVICE.PAYROLL.CLOSE,
    payrollUuids,
    ACTION_TYPE.CLOSE_PAYROLL,
    clientMutationLabel,
  );
}

export function rejectPayroll(payroll, clientMutationLabel) {
  const payrollUuids = `ids: ["${payroll?.id}"]`;
  return PERFORM_MUTATION(
    MUTATION_SERVICE.PAYROLL.REJECT,
    payrollUuids,
    ACTION_TYPE.REJECT_PAYROLL,
    clientMutationLabel,
  );
}
