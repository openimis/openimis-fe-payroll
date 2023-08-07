import {
  formatPageQueryWithCount,
  formatGQLString,
  formatMutation,
  decodeId,
  graphql,
} from '@openimis/fe-core';

import { ACTION_TYPE, MUTATION_SERVICE } from './reducer';
import {
  CLEAR, ERROR, REQUEST, SUCCESS,
} from './utils/action-type';
import { isBase64Encoded } from './utils/advanced-filters-utils';

export const PAYMENT_POINT_PROJECTION = (modulesManager) => [
  'id',
  'name',
  'isDeleted',
  `location ${modulesManager.getProjection('location.Location.FlatProjection')}`,
  `ppm ${modulesManager.getProjection('admin.UserPicker.projection')}`,
];

const BILL_FULL_PROJECTION = () => [
  'id',
  'isDeleted',
  'jsonExt',
  'dateCreated',
  'dateUpdated',
  'dateValidFrom',
  'dateValidTo',
  'replacementUuid',
  'thirdpartyType',
  'thirdpartyTypeName',
  'thirdpartyId',
  'thirdparty',
  'codeTp',
  'code',
  'codeExt',
  'dateDue',
  'datePayed',
  'amountDiscount',
  'amountNet',
  'amountTotal',
  'taxAnalysis',
  'status',
  'currencyTpCode',
  'currencyCode',
  'note',
  'terms',
  'paymentReference',
  'subjectType',
  'subjectTypeName',
  'subjectId',
  'subject',
  'dateBill',
];

const BENEFIT_PLAN_FULL_PROJECTION = () => [
  'id',
  'isDeleted',
  'dateCreated',
  'dateUpdated',
  'version',
  'dateValidFrom',
  'dateValidTo',
  'description',
  'replacementUuid',
  'code',
  'name',
  'type',
  'maxBeneficiaries',
  'ceilingPerBeneficiary',
  'jsonExt',
];

const PAYROLL_PROJECTION = (modulesManager) => [
  'id',
  'name',
  `benefitPlan { ${BENEFIT_PLAN_FULL_PROJECTION().join(' ')} }`,
  `paymentPoint { ${PAYMENT_POINT_PROJECTION(modulesManager).join(' ')} }`,
  `bill { ${BILL_FULL_PROJECTION().join(' ')} } `,
  'jsonExt',
  'dateValidFrom',
  'dateValidTo',
  'isDeleted',
];

const formatPaymentPointGQL = (paymentPoint) => {
  const paymentPointGQL = `
  ${paymentPoint?.id ? `id: "${paymentPoint.id}"` : ''}
  ${paymentPoint?.name ? `name: "${formatGQLString(paymentPoint.name)}"` : ''}
  ${paymentPoint?.location ? `locationId: ${decodeId(paymentPoint.location.id)}` : ''}
  ${paymentPoint?.ppm ? `ppmId: "${decodeId(paymentPoint.ppm.id)}"` : ''}
  `;
  return paymentPointGQL;
};

const formatPayrollGQL = (payroll) => {
  const payrollGQL = `
  ${payroll?.id ? `id: "${payroll.id}"` : ''}
  ${payroll?.name ? `name: "${formatGQLString(payroll.name)}"` : ''}
  ${payroll?.paymentPoint ? `paymentPointId: "${decodeId(payroll.paymentPoint.id)}"` : ''}
  ${payroll?.benefitPlan ? `benefitPlanId: "${decodeId(payroll.benefitPlan.id)}"` : ''}
  ${
  payroll.jsonExt
    ? `jsonExt: ${JSON.stringify(payroll.jsonExt)}`
    : ''
}
  ${
  payroll.dateValidFrom
    ? `dateValidFrom: "${payroll.dateValidFrom}"`
    : ''
}
  ${
  payroll.dateValidTo
    ? `dateValidTo: "${payroll.dateValidTo}"`
    : ''
}
  `;
  return payrollGQL;
};

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

export function fetchPayrollBills(modulesManager, params) {
  const payload = formatPageQueryWithCount('billByPayroll', params, BILL_FULL_PROJECTION());
  return graphql(payload, ACTION_TYPE.GET_PAYROLL_BILLS);
}

export const clearPayrollBills = () => (dispatch) => {
  dispatch({
    type: CLEAR(ACTION_TYPE.GET_PAYROLL_BILLS),
  });
};

export const clearPayroll = () => (dispatch) => {
  dispatch({
    type: CLEAR(ACTION_TYPE.GET_PAYROLL),
  });
};
