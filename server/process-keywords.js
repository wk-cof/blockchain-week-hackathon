const sampleTransID = '2F27A1';
const processYes = (dbInstance, phoneNumber, twilioNumber, sendTwilioMessage) => {
    return dbInstance.read(phoneNumber)
        .then(actionObjList => {
            if (!actionObjList) {
                return incorrectUsage;
            }
            let actionObj = actionObjList[0];
            switch (actionObj.action) {
                case 'borrow':
                    return dbInstance.update(actionObj.phoneNumber,
                        { borrowerNumber: actionObj.phoneNumber, phoneNumber: actionObj.lenderNumber, action: 'lend' })
                        .then(() => {
                            return sendTwilioMessage(`A borrower with Karma rating of 5 would like to borrow ${actionObj.amount} at ` +
                                `${actionObj.interestRate}% interest for ${actionObj.daysUntilDue} days. Would you like to accept YES or NO`,
                                twilioNumber,
                                actionObj.lenderNumber)
                        })
                        .then(() => {
                            return 'Thank you, the lender is notified';
                        });
                case 'lend':
                    let commonMsg = `Congratulations, the transaction has been recorded, please exchange money. To repay both parties need to text ${sampleTransID} REPAY and AMOUNT. ` ;
                    let borrowerMsg = ` To receive positive Karma complete the transaction in ${actionObj.daysUntilDue} days.  Would you like a reminder? YES or NO`;
                    return registerInBlockchain()
                        .then(() => {
                            return dbInstance.update(actionObj.phoneNumber, { action: 'reminder', phoneNumber: actionObj.borrowerNumber });
                        })
                        .then(() => {
                            return sendTwilioMessage(commonMsg + borrowerMsg, twilioNumber, actionObj.borrowerNumber);
                        })
                        .then(() => {
                            return commonMsg;
                        });

                case 'reminder':
                    return dbInstance.remove(phoneNumber)
                        .then(() => {
                            return 'Thank you, we will send you a reminder 14, 7, 3 and 1 day before repayment is due. To repay both you and the lender need to text TRANS_ID REPAY and AMOUNT';
                        });
                default:
                    return incorrectUsage;
            }
        });
};

const processBorrow = (dbInstance, message, phoneNumber) => {
    let matches = message.match(/^borrow\s+(\d+),\s*(\d+)\s*,\s*(\d+)\s*,\s*(\+?\d+)/i);
    if (matches.length < 5) {
        return Promise.resolve('Enter the BORROW and AMOUNT, INTEREST RATE, DAYS UNTIL DUE, LENDER MOBILE NUMBER');
    }
    let borrowObj = {
        phoneNumber,
        action: 'borrow',
        amount: parseInt(matches[1]),
        interestRate: parseInt(matches[2]),
        daysUntilDue: parseInt(matches[3]),
        lenderNumber: matches[4]
    };
    return dbInstance.insert(borrowObj)
        .then(() => {
            const returnAmount = Math.floor(borrowObj.amount * (1 + borrowObj.interestRate / 100 * borrowObj.daysUntilDue / 365) * 100) / 100;

            return `You want to borrow ${borrowObj.amount} with ${borrowObj.interestRate}% interest due in ${borrowObj.daysUntilDue} days.` +
                `A total of ${returnAmount} will be due. Is that correct? YES or NO`;
        });
};

const processNo = (dbInstance, phoneNumber) => {
    return dbInstance.remove(phoneNumber)
        .then(() => {
            return 'Transaction canceled';
        });
};

module.exports = {
    processBorrow,
    processYes,
};
