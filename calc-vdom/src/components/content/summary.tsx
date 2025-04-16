import { BackupInfo, calculateTotalCost } from "../engine";

export default function Summary({
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
  const { totalSize, totalMonths, increase, backupPlan } = state; // Destructure the state object

  // Helper function to format currency
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);

  // Calculate the total cost for the backup solution
  const totalCost = backupPlan.map((backup) => {
    const backupInfo = new BackupInfo(
      backup.scheduleId,
      backup.retention,
      backup.storageTier,
      totalSize // Pass the totalSize as the initial backup size
    );
    const resp = calculateTotalCost(backupInfo, totalMonths, increase / 100); // Convert percentage to decimal
    return resp;
  });

  const totalCostSum = totalCost
    .reduce((sum, cost) => sum + parseFloat(cost.totalCost), 0)
    .toFixed(2);

  const costPerYear = (parseFloat(totalCostSum) / (totalMonths / 12)).toFixed(2);

  return (
    <>
      <div class="oj-bg-body oj-sm-margin-2x oj-panel oj-typography-body-xs">
        <div class="oj-flex oj-sm-4 oj-flex-item oj-sm-padding-2x-horizontal">
          <h2>Summary</h2>
          <p>Total Size: {totalSize} GB</p>
          <p>Total Months: {totalMonths}</p>
          <p>Data Increase per Year: {increase}%</p>
          <h3>Backup Plan Summary:</h3>
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
              <h3>Total Cost: {formatCurrency(parseFloat(totalCostSum))}</h3>
              <h3>Cost Per Year: {formatCurrency(parseFloat(costPerYear))}</h3>
            </>
          ) : (
            <p>No backup plans added yet.</p>
          )}
        </div>
      </div>
    </>
  );
}
