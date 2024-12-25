import { supabase } from "@/integrations/supabase/client";
import { RepaymentScheduleItem, Period, InterestModel, RepaymentSchedule } from "./loanTypes";
import { calculateInterest } from "./loanInterestCalculator";
import { addWeeks, addMonths, addYears } from "date-fns";
import { toast } from "sonner";

export const calculateTotalExpectedAmount = async (loanId: number): Promise<number> => {
  console.log('Calculating total expected amount for loan:', loanId);
  
  try {
    const { data: scheduleData, error } = await supabase
      .from('loans')
      .select(`
        principal,
        interest (
          interest_rate,
          interest_period,
          interest_model,
          repayment_installment
        ),
        loan_tenor (
          duration,
          duration_period
        )
      `)
      .eq('id', loanId)
      .single();

    if (error) {
      console.error('Error fetching loan data:', error);
      toast.error("Error calculating loan amount");
      throw error;
    }

    if (!scheduleData || !scheduleData.interest || !scheduleData.loan_tenor) {
      console.error('Missing loan data for ID:', loanId);
      toast.error("Incomplete loan data found");
      return 0;
    }

    // Type assertions to match our defined types
    const interestData = {
      interest_rate: scheduleData.interest.interest_rate,
      interest_period: scheduleData.interest.interest_period as Period,
      interest_model: scheduleData.interest.interest_model as InterestModel,
      repayment_installment: scheduleData.interest.repayment_installment as RepaymentSchedule
    };

    const tenorData = {
      duration: scheduleData.loan_tenor[0].duration,
      duration_period: scheduleData.loan_tenor[0].duration_period as Period
    };

    const totalInterest = await calculateInterest({
      principal: scheduleData.principal,
      interest: interestData,
      tenor: tenorData
    });

    const totalAmount = scheduleData.principal + totalInterest;
    console.log('Calculated total amount:', totalAmount);
    return totalAmount;
  } catch (error) {
    console.error('Error in calculateTotalExpectedAmount:', error);
    return 0;
  }
};

export const getTotalPaymentsMade = async (loanId: number): Promise<number> => {
  console.log('Getting total payments made for loan:', loanId);
  
  const { data: payments, error } = await supabase
    .from('payments_in')
    .select('amount')
    .eq('loan_id', loanId);

  if (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }

  const totalPayments = payments?.reduce((sum, payment) => sum + Number(payment.amount), 0) || 0;
  console.log('Total payments made:', totalPayments);
  return totalPayments;
};

export interface InstallmentStatus {
  status: 'paid' | 'unpaid' | 'partial';
  remainingAmount: number;
}

export const calculateInstallmentStatuses = async (
  loanId: number,
  schedule: RepaymentScheduleItem[]
): Promise<Map<number, InstallmentStatus>> => {
  console.log('Calculating installment statuses for loan:', loanId);
  
  const totalPaid = await getTotalPaymentsMade(loanId);
  let remainingPayment = totalPaid;
  const statuses = new Map<number, InstallmentStatus>();

  for (const installment of schedule) {
    if (remainingPayment >= installment.amount) {
      statuses.set(installment.installmentNumber, {
        status: 'paid',
        remainingAmount: 0
      });
      remainingPayment -= installment.amount;
    } else if (remainingPayment > 0) {
      statuses.set(installment.installmentNumber, {
        status: 'partial',
        remainingAmount: installment.amount - remainingPayment
      });
      remainingPayment = 0;
    } else {
      statuses.set(installment.installmentNumber, {
        status: 'unpaid',
        remainingAmount: installment.amount
      });
    }
  }

  return statuses;
};

export const generateRepaymentSchedule = async (loanId: number): Promise<RepaymentScheduleItem[]> => {
  try {
    const { data: loan, error } = await supabase
      .from('loans')
      .select(`
        principal,
        created_at,
        interest (
          interest_rate,
          interest_period,
          interest_model,
          repayment_installment
        ),
        loan_tenor (
          duration,
          duration_period
        )
      `)
      .eq('id', loanId)
      .single();

    if (error) {
      console.error('Error fetching loan data:', error);
      toast.error("Error generating repayment schedule");
      return [];
    }

    if (!loan || !loan.interest || !loan.loan_tenor) {
      console.error('Missing loan data for ID:', loanId);
      toast.error("Incomplete loan data found");
      return [];
    }

    // Type assertions for the loan data
    const interestData = {
      interest_rate: loan.interest.interest_rate,
      interest_period: loan.interest.interest_period as Period,
      interest_model: loan.interest.interest_model as InterestModel,
      repayment_installment: loan.interest.repayment_installment as RepaymentSchedule
    };

    const tenorData = {
      duration: loan.loan_tenor[0].duration,
      duration_period: loan.loan_tenor[0].duration_period as Period
    };

    const totalInterest = await calculateInterest({
      principal: loan.principal,
      interest: interestData,
      tenor: tenorData
    });

    const totalAmount = loan.principal + totalInterest;
    let numberOfInstallments = 0;
    
    // Determine number of installments based on repayment schedule
    switch (loan.interest.repayment_installment) {
      case "Weekly":
        numberOfInstallments = loan.loan_tenor[0].duration;
        break;
      case "Monthly":
        numberOfInstallments = loan.loan_tenor[0].duration * 4;
        break;
      case "Yearly":
        numberOfInstallments = loan.loan_tenor[0].duration * 52;
        break;
      case "One Whole Installment":
        numberOfInstallments = 1;
        break;
    }

    const installmentAmount = totalAmount / numberOfInstallments;
    const schedule: RepaymentScheduleItem[] = [];
    let currentDate = new Date(loan.created_at);

    for (let i = 1; i <= numberOfInstallments; i++) {
      schedule.push({
        installmentNumber: i,
        dueDate: currentDate.toISOString(),
        amount: installmentAmount,
      });

      // Calculate next due date
      switch (loan.interest.repayment_installment) {
        case "Weekly":
          currentDate = addWeeks(currentDate, 1);
          break;
        case "Monthly":
          currentDate = addMonths(currentDate, 1);
          break;
        case "Yearly":
          currentDate = addYears(currentDate, 1);
          break;
      }
    }

    return schedule;
  } catch (error) {
    console.error('Error generating repayment schedule:', error);
    toast.error("Error generating repayment schedule");
    return [];
  }
};
