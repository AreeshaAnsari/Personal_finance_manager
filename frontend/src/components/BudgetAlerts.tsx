import React from 'react';
import { BudgetAlerts } from '../services/budgetService';

interface BudgetAlertsProps {
  alerts: BudgetAlerts;
}

const BudgetAlertsComponent: React.FC<BudgetAlertsProps> = ({ alerts }) => {
  if (alerts.warnings.length === 0 && alerts.errors.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      {alerts.warnings.map((warning, index) => (
        <div key={index} className="bg-yellow-900 border-l-4 border-yellow-500 text-yellow-100 p-4 mb-2">
          <div className="flex">
            <div className="py-1">
              <svg className="fill-current h-6 w-6 text-yellow-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Budget Warning</p>
              <p>{warning}</p>
            </div>
          </div>
        </div>
      ))}

      {alerts.errors.map((error, index) => (
        <div key={index} className="bg-red-900 border-l-4 border-red-500 text-red-100 p-4 mb-2">
          <div className="flex">
            <div className="py-1">
              <svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm1.41-1.41A8 8 0 1 0 15.66 4.34 8 8 0 0 0 4.34 15.66zm9.9-8.49L11.41 10l2.83 2.83-1.41 1.41L10 11.41l-2.83 2.83-1.41-1.41L8.59 10 5.76 7.17l1.41-1.41L10 8.59l2.83-2.83 1.41 1.41z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Budget Alert</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BudgetAlertsComponent;