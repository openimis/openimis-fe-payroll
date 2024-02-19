// TODO: Change to proper rights after BE implementation
export const RIGHT_PAYROLL_SEARCH = 202001;
export const RIGHT_PAYROLL_CREATE = 202002;
export const RIGHT_PAYROLL_DELETE = 202004;

export const PAYROLL_PAYMENT_POINT_ROUTE = 'payroll.route.paymentPoint';
export const PAYROLL_PAYROLL_ROUTE = 'payroll.route.payroll';
export const RIGHT_PAYMENT_POINT_SEARCH = 201001;
export const RIGHT_PAYMENT_POINT_CREATE = 201002;
export const RIGHT_PAYMENT_POINT_UPDATE = 201003;
export const RIGHT_PAYMENT_POINT_DELETE = 201004;

export const DEFAULT_DEBOUNCE_TIME = 500;
export const DEFAULT_PAGE_SIZE = 10;
export const CONTAINS_LOOKUP = 'Icontains';
export const ROWS_PER_PAGE_OPTIONS = [10, 20, 50, 100];
export const EMPTY_STRING = '';

export const MAX_LENGTH = {
  NAME: 50,
};

export const MODULE_NAME = 'payroll';

export const BENEFIT_CONSUMPTION_LIST_TAB_VALUE = 'benefitConsumptionsTab';
export const PAYROLL_TASK_TAB_VALUE = 'payrollTaskTab';

export const PAYROLL_TABS_LABEL_CONTRIBUTION_KEY = 'payroll.TabPanel.label';
export const PAYROLL_TABS_PANEL_CONTRIBUTION_KEY = 'payroll.TabPanel.panel';

export const RIGHT_BILL_SEARCH = 156101;
export const RIGHT_BILL_CREATE = 156102;
export const RIGHT_BILL_UPDATE = 156103;
export const RIGHT_BILL_DELETE = 156104;

export const INVOICE_BILL_ROUTE = 'bill.route.bill';
export const GET_SUBJECT_AND_THIRDPARTY_TYPE_PICKER_REF = 'bill.util.getSubjectAndThirdpartyTypePicker';
export const ENUM_PREFIX_LENGTH = 2;

export const STATUS = {
  DRAFT: '0',
  VALIDATED: '1',
  PAYED: '2',
  CANCELLED: '3',
  DELETED: '4',
  SUSPENDED: '5',
};

export const CLEARED_STATE_FILTER = {
  field: '', filter: '', type: '', value: '',
};
export const BENEFIT_PLAN = 'BenefitPlan';
export const INTEGER = 'integer';
export const STRING = 'string';
export const BOOLEAN = 'boolean';
export const DATE = 'date';
export const BOOL_OPTIONS = [
  { value: 'True', label: 'True' },
  { value: 'False', label: 'False' },
];

export const PAYROLL_STATUS = {
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  APPROVE_FOR_PAYMENT: 'APPROVE_FOR_PAYMENT',
  REJECTED: 'REJECTED',
  RECONCILIATED: 'RECONCILIATED',
  RECONCILED: 'RECONCILED',
};

export const PAYROLL_STATUS_LIST = [
  PAYROLL_STATUS.PENDING_APPROVAL,
  PAYROLL_STATUS.APPROVE_FOR_PAYMENT,
  PAYROLL_STATUS.REJECTED,
  PAYROLL_STATUS.RECONCILIATED,
  PAYROLL_STATUS.RECONCILED,
];

export const BENEFIT_CONSUMPTION_STATUS = {
  ACCEPTED: 'ACCEPTED',
  CREATED: 'CREATED',
  APPROVE_FOR_PAYMENT: 'APPROVE_FOR_PAYMENT',
  REJECTED: 'REJECTED',
  DUPLICATE: 'DUPLICATE',
  RECONCILED: 'RECONCILED',
};

export const BENEFIT_CONSUMPTION_STATUS_LIST = [
  BENEFIT_CONSUMPTION_STATUS.ACCEPTED, BENEFIT_CONSUMPTION_STATUS.CREATED,
  BENEFIT_CONSUMPTION_STATUS.APPROVE_FOR_PAYMENT, BENEFIT_CONSUMPTION_STATUS.REJECTED,
  BENEFIT_CONSUMPTION_STATUS.DUPLICATE, BENEFIT_CONSUMPTION_STATUS.RECONCILED,
];

export const BENEFIT_PLAN_CONTENT_TYPE_ID = 175;

export const PAYROLL_FROM_FAILED_INVOICES_URL_PARAM = 'createPayrollFromFailedInvoices=true';
