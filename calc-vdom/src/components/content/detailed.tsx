import { BackupInfo, calculateTotalCost } from "../engine";
import { DataGridElement } from "ojs/ojdatagrid";
import {DataGridProvider} from "ojs/ojdatagridprovider";
import "ojs/ojdatagrid";
import "ojs/ojarraydataprovider";
import "ojs/ojlistdataproviderview";
import ArrayDataProvider = require("ojs/ojarraydataprovider");
import { RowDataGridProvider } from "ojs/ojrowdatagridprovider";

export default function DetailedResults({
  state,
}: {
  state: {
    totalSize: number;
    totalMonths: number;
    increase: number;
    backupPlan: {
      scheduleId: "Daily" | "Weekly" | "Monthly" | "Yearly";
      retention: number;
      storageTier: "Standard" | "InfrequentAccess" | "Archive";
    }[];
  };
}) {
  const { totalSize, totalMonths, increase, backupPlan } = state;

  // Helper function to format currency
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  // Generate detailed results for each backup plan
  const detailedResults = backupPlan.map((backup) => {
    const backupInfo = new BackupInfo(
      backup.scheduleId,
      backup.retention,
      backup.storageTier,
      totalSize
    );
    const result = calculateTotalCost(backupInfo, totalMonths, increase / 100);
    return { ...result, backupInfo }; // Include backupInfo in the result
  });

  // Generate a month-by-month breakdown
  const monthByMonthData = [];
  for (let month = 1; month <= totalMonths; month++) {
    const monthlyCosts = detailedResults.map((result) => {
      return parseFloat(result.monthlyCosts[month - 1]); // Convert string to number
    });

    const totalMonthlyCost = monthlyCosts.reduce(
      (sum, cost) => sum + cost,
      0
    );

    const monthlyStorage = detailedResults.reduce((sum, result) => {
      return sum + parseFloat(result.monthlyStorageSizes[month - 1]); // Use the monthlyStorageSizes array
    }, 0);

    monthByMonthData.push({
      Month: month,
      "Total Monthly Cost": formatCurrency(totalMonthlyCost),
      "Monthly Storage": `${monthlyStorage.toFixed(2)} GB`,
    });
  }

  // Create a ListDataProviderView
  const arrayDataProvider = new ArrayDataProvider(monthByMonthData, {
    keyAttributes: "Month",
  });

  // Wrap the ListDataProviderView in a RowDataGridProvider
  const dataGridProvider = new RowDataGridProvider(arrayDataProvider, {
    columnHeaders: {
      column: ["Month", "Total Monthly Cost", "Monthly Storage"], // Define the column headers
    },
  });

  return (
    <>
      <div class="oj-bg-body oj-sm-margin-2x oj-panel oj-typography-body-xs">
        <div class="oj-flex oj-sm-4 oj-flex-item oj-sm-padding-2x-horizontal">
          <h2>Detailed Results</h2>
          <p>Total Size: {totalSize} GB</p>
          <p>Total Months: {totalMonths}</p>
          <p>Data Increase per Year: {increase}%</p>
          <h3>Backup Plan:</h3>
          {backupPlan.length > 0 ? (
            <>
              <ul>
                {backupPlan.map((backup, index) => (
                  <li key={index}>
                    Schedule: {backup.scheduleId}, Retention:{" "}
                    {backup.retention}, Tier: {backup.storageTier}
                  </li>
                ))}
              </ul>
              <h3>Month-by-Month Breakdown:</h3>
              <oj-data-grid
                data={dataGridProvider}
                style={{ height: "400px", width: "100%" }}
                class="oj-sm-margin-2x"
              >
              </oj-data-grid>
            </>
          ) : (
            <p>No backup plans added yet.</p>
          )}
        </div>
      </div>
    </>
  );
}
