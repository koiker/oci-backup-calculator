// Export the BackupInfo class
export class BackupInfo {
  strategy: "Daily" | "Weekly" | "Monthly" | "Yearly";
  retention: number;
  storageTier: "Standard" | "InfrequentAccess" | "Archive";
  backupSize: number; // Add backup size as a property

  constructor(
    strategy: "Daily" | "Weekly" | "Monthly" | "Yearly",
    retention: number,
    storageTier: "Standard" | "InfrequentAccess" | "Archive",
    backupSize: number // Include backup size in the constructor
  ) {
    this.strategy = strategy;
    this.retention = retention;
    this.storageTier = storageTier;
    this.backupSize = backupSize; // Initialize backup size
  }
}

// Export the pricing data
export const pricing: {
  storageCost: {
    Standard: number;
    InfrequentAccess: number;
    Archive: number;
  };
  transferCost: number;
} = {
  storageCost: {
    Standard: 0.0255, // Cost per GB per month
    InfrequentAccess: 0.0100,
    Archive: 0.0026,
  },
  transferCost: 0.00, // Cost per GB for data transfer
};

// Export the function to calculate the number of backups per month
export function getBackupsPerMonth(strategy: "Daily" | "Weekly" | "Monthly" | "Yearly"): number {
  switch (strategy) {
    case "Daily":
      return 30;
    case "Weekly":
      return 4;
    case "Monthly":
      return 1;
    case "Yearly":
      return 1 / 12;
    default:
      throw new Error("Invalid backup strategy");
  }
}

// Export the function to calculate monthly cost
export function calculateMonthlyCost(backupInfo: BackupInfo): number {
  const backupsPerMonth = getBackupsPerMonth(backupInfo.strategy);

  // The total number of backups stored in the month is the minimum of the backups created in the month
  // and the retention value (maximum backups to retain).
  const totalBackups = Math.min(backupsPerMonth, backupInfo.retention);

  // Calculate the storage cost for the backups retained
  const storageCost =
    totalBackups *
    backupInfo.backupSize *
    pricing.storageCost[backupInfo.storageTier];

  // Calculate the transfer cost for the backups created this month
  const transferCost =
    backupsPerMonth * backupInfo.backupSize * pricing.transferCost;

  // Return the total monthly cost
  return storageCost + transferCost;
}

// Export the function to calculate total cost
export function calculateTotalCost(
  backupInfo: BackupInfo,
  totalMonths: number,
  yearlySizeIncrease: number
): {
  totalCost: string;
  monthlyCosts: string[]; // Add an array to store monthly costs
  monthlyStorageSizes: string[]; // Add an array to store monthly storage sizes
  averageYearlyCost: string;
} {
  let totalCost = 0;
  let currentBackupSize = backupInfo.backupSize; // Start with the initial backup size
  const monthlyCosts: number[] = []; // Array to store monthly costs
  const monthlyStorageSizes: number[] = []; // Array to store monthly storage sizes

  for (let month = 1; month <= totalMonths; month++) {
    // Update backup size only on the first month of each year
    if ((month - 1) % 12 === 0 && month > 1) {
      currentBackupSize *= 1 + yearlySizeIncrease;
    }

    // Store the current backup size for this month
    monthlyStorageSizes.push(currentBackupSize);

    // Calculate the monthly cost
    const monthlyCost = calculateMonthlyCost({
      ...backupInfo,
      backupSize: currentBackupSize, // Use the current backup size for this month
    });
    monthlyCosts.push(monthlyCost); // Store the monthly cost
    totalCost += monthlyCost; // Add it to the total cost
  }

  const totalYears = Math.ceil(totalMonths / 12);
  return {
    totalCost: totalCost.toFixed(2),
    monthlyCosts: monthlyCosts.map((cost) => cost.toFixed(2)), // Format monthly costs
    monthlyStorageSizes: monthlyStorageSizes.map((size) => size.toFixed(2)), // Format storage sizes
    averageYearlyCost: (totalCost / totalYears).toFixed(2),
  };
}

