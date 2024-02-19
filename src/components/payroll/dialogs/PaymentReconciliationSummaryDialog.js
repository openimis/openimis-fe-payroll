/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  useModulesManager,
  useTranslations,
  useHistory,
} from '@openimis/fe-core';
import {
  Paper,
  Grid,
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  MODULE_NAME,
  BENEFIT_CONSUMPTION_STATUS,
  PAYROLL_PAYROLL_ROUTE,
  PAYROLL_FROM_FAILED_INVOICES_URL_PARAM,
} from '../../../constants';
import downloadPayroll from '../../../utils/export';

import BenefitConsumptionSearcherModal from '../BenefitConsumptionSearcherModal';

function PaymentReconcilationSummarytDialog({
  classes,
  payroll,
}) {
  const history = useHistory();
  const modulesManager = useModulesManager();
  const { formatMessage, formatMessageWithValues } = useTranslations(MODULE_NAME, modulesManager);
  const [isOpen, setIsOpen] = useState(false);
  const [totalBeneficiaries, setTotalBeneficiaries] = useState(0);
  const [selectedBeneficiaries, setSelectedBeneficiaries] = useState(0);
  const [totalBillAmount, setTotalBillAmount] = useState(0);
  const [totalReconciledBillAmount, setTotalReconciledBillAmount] = useState(0);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleCreatePaymentForFailedInvoice = () => {
    history.push(
      `/${modulesManager.getRef(PAYROLL_PAYROLL_ROUTE)}/${payroll?.id}/${PAYROLL_FROM_FAILED_INVOICES_URL_PARAM}`,
    );
  };

  useEffect(() => {
    if (isOpen) {
      // Calculate total benefits and reconciled benefits
      const total = payroll.benefitConsumption.length;
      const selected = payroll.benefitConsumption.filter(
        (benefit) => benefit.status === BENEFIT_CONSUMPTION_STATUS.RECONCILED,
      ).length;

      setTotalBeneficiaries(total);
      setSelectedBeneficiaries(selected);

      let totalAmount = 0;
      let reconciledAmount = 0;
      if (payroll && payroll.benefitConsumption) {
        payroll.benefitConsumption.forEach((benefit) => {
          if (benefit.benefitAttachment && benefit.benefitAttachment.length > 0) {
            benefit.benefitAttachment.forEach((attachment) => {
              if (attachment.bill && attachment.bill.amountTotal) {
                totalAmount += parseFloat(attachment.bill.amountTotal);
                if (benefit.status === BENEFIT_CONSUMPTION_STATUS.RECONCILED) {
                  reconciledAmount += parseFloat(attachment.bill.amountTotal);
                }
              }
            });
          }
        });
      }
      setTotalBillAmount(totalAmount);
      setTotalReconciledBillAmount(reconciledAmount);
    }
  }, [isOpen, payroll]);

  const downloadPayrollData = (payrollUuid, payrollName) => {
    downloadPayroll(payrollUuid, payrollName);
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        variant="contained"
        color="primary"
        className={classes.button}
      >
        {formatMessage('payroll.viewReconciliationSummary')}
      </Button>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        PaperProps={{
          style: {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            width: '75%',
            maxWidth: '75%',
          },
        }}
      >
        <DialogTitle
          style={{
            marginTop: '10px',
          }}
        >
          {formatMessageWithValues('payroll.reconciliationSummary', { payrollName: payroll.name })}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography variant="h6" gutterBottom>
                  {formatMessage('payroll.summary.selectedBeneficiaries')}
                </Typography>
                <Typography variant="body1">
                  {formatMessageWithValues('payroll.summary.beneficiariesCount', { selectedBeneficiaries, totalBeneficiaries })}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography variant="h6" gutterBottom>
                  {formatMessage('payroll.summary.totalAmountForInvoice')}
                </Typography>
                <Typography variant="body1">
                  {totalBillAmount}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={4}>
              <Paper elevation={3} style={{ padding: '20px' }}>
                <Typography variant="h6" gutterBottom>
                  {formatMessage('payroll.summary.deliveredReconciliation')}
                </Typography>
                <Typography variant="body1">
                  {totalReconciledBillAmount}
                </Typography>
              </Paper>
            </Grid>
          </Grid>
          <div
            style={{ backgroundColor: '#DFEDEF' }}
          >
            <BenefitConsumptionSearcherModal payrollUuid={payroll.id} reconciledMode />
          </div>
        </DialogContent>
        <DialogActions
          style={{
            display: 'inline',
            paddingLeft: '10px',
            marginTop: '25px',
            marginBottom: '15px',
            width: '100%',
          }}
        >
          <div style={{ maxWidth: '3000px' }}>
            <div style={{ float: 'left' }}>
              <Button
                onClick={handleCreatePaymentForFailedInvoice}
                variant="contained"
                color="primary"
                disabled={totalBeneficiaries === selectedBeneficiaries}
                style={{
                  margin: '0 16px',
                  marginBottom: '15px',
                }}
              >
                {formatMessage('payroll.summary.createPaymentForFailedInvoice')}
              </Button>
              <Button
                onClick={() => downloadPayrollData(payroll.id, payroll.name)}
                variant="contained"
                color="primary"
                style={{
                  margin: '0 16px',
                  marginBottom: '15px',
                }}
              >
                {formatMessage('payroll.summary.download')}
              </Button>
            </div>
            <div style={{
              float: 'right',
              paddingRight: '16px',
            }}
            >
              <Button
                onClick={handleClose}
                variant="outlined"
                autoFocus
                style={{ margin: '0 16px' }}
              >
                {formatMessage('payroll.summary.close')}
              </Button>
            </div>
          </div>
        </DialogActions>
      </Dialog>
    </>
  );
}

const mapStateToProps = (state) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
  confirmed: state.core.confirmed,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PaymentReconcilationSummarytDialog);
