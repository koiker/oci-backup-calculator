/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { h } from "preact";
import { useState } from "preact/hooks";
import { CSelectSingleElement } from "oj-c/select-single";
import "oj-c/input-number";
import "oj-c/select-single";
import "oj-c/button";
import "oj-c/table";
import "oj-c/form-layout"; // Add this import
import ArrayDataProvider = require("ojs/ojarraydataprovider");
import { Column } from "@oracle/oraclejet-core-pack/oj-c/types/table/table";

type BackupData = {
  scheduleId: string;
  retention: number; 
  storageTier: string;
};

export default function InputData({
  state,
  onChange,
}: {
  state: {
    totalSize: number;
    totalMonths: number;
    increase: number;
    backupPlan: BackupData[];
  };
  onChange: (event: CustomEvent) => void;
}) {
  const { totalSize, totalMonths, increase, backupPlan } = state;
  const [backupRetention, setBackupRetention] = useState(1);

  const tableColumns: Record<string, Column<any, BackupData>> = {
    scheduleId: { headerText: "Schedule", field: "scheduleId" },
    retention: { headerText: "Retention", field: "retention" },
    storageTier: { headerText: "Tier", field: "storageTier" },
    action: {
      headerText: "Action",
      template: "actionTemplate",
    },
  };

  const tiers = [
    { value: "Standard", label: "Standard" },
    { value: "InfrequentAccess", label: "Infrequent Access" },
    { value: "Archive", label: "Archive" },
  ];
  const backupSchedule = [
    { value: "Daily", label: "Daily" },
    { value: "Weekly", label: "Weekly" },
    { value: "Monthly", label: "Monthly" },
    { value: "Yearly", label: "Yearly" },
  ];
  const schedule = new ArrayDataProvider(backupSchedule, {
    keyAttributes: "value",
  });
  const storageTier = new ArrayDataProvider(tiers, { keyAttributes: "value" });

  const addBackup = () => {
    const scheduleElement = document.getElementById(
      "schedule"
    ) as CSelectSingleElement<string, { value: string; label: string }>;
    const storageTierElement = document.getElementById(
      "storageTier"
    ) as CSelectSingleElement<string, { value: string; label: string }>;

    const selectedSchedule = scheduleElement?.value as string;
    const selectedStorageTier = storageTierElement?.value as string;

    if (selectedSchedule && selectedStorageTier) {
      const newBackup: BackupData = {
        scheduleId: selectedSchedule,
        retention: backupRetention, // Updated to use retention
        storageTier: selectedStorageTier,
      };

      // Create a CustomEvent with a similar structure to onvalueChanged
      const event = new CustomEvent("valueChanged", {
        detail: { value: [...backupPlan, newBackup] },
      });
      Object.defineProperty(event, "srcElement", {
        value: { id: "backupPlan" },
      });
      onChange(event);
    } else {
      console.error(
        "Please select valid values for schedule and storage tier."
      );
    }
  };

  const removeBackup = (scheduleId: string) => {
    const updatedBackupPlan = backupPlan.filter(
      (item) => item.scheduleId !== scheduleId
    );

    // Create a CustomEvent with a similar structure to onvalueChanged
    const event = new CustomEvent("valueChanged", {
      detail: { value: updatedBackupPlan },
    });
    Object.defineProperty(event, "srcElement", {
      value: { id: "backupPlan" },
    });

    onChange(event);
  };

  return (
    <>
      <div class="oj-bg-body oj-sm-margin-2x oj-panel oj-typography-body-xs">
        <div class="oj-flex oj-sm-4 oj-flex-item oj-sm-padding-2x-horizontal">
          <oj-c-input-number
            class="oj-sm-margin-2x"
            id="totalSize"
            value={totalSize}
            onvalueChanged={(event: CustomEvent) => onChange(event)}
            input-suffix="GB"
            text-align="end"
            label-hint="Total size of data to backup"
          ></oj-c-input-number>
          <oj-c-input-number
            class="oj-sm-margin-2x"
            id="totalMonths"
            value={totalMonths}
            onvalueChanged={(event: CustomEvent) => onChange(event)}
            step={1}
            stepper-variant="directional"
            min={1}
            max={72}
            input-prefix="Months"
            text-align="end"
            label-hint="Number of months to backup"
          ></oj-c-input-number>
          <oj-c-input-number
            id="increase"
            class="oj-sm-margin-2x"
            value={increase}
            step={1}
            stepper-variant="directional"
            min={0}
            max={100}
            input-prefix="%"
            text-align="end"
            label-hint="Data increase per year"
            onvalueChanged={(event: CustomEvent) => onChange(event)}
          ></oj-c-input-number>
        </div>
        <h3>Total storage: {totalSize}GB</h3>
      </div>
      <div class="oj-bg-body oj-sm-margin-2x oj-panel oj-typography-body-xs">
        <oj-c-form-layout max-columns="3" direction="row">
          <oj-c-select-single
            class="oj-sm-margin-2x"
            id="schedule"
            label-hint="Backup Schedule"
            item-text="label"
            required={true}
            data={schedule}
          ></oj-c-select-single>
          <oj-c-input-number
            class="oj-sm-margin-2x"
            id="backupRetention"
            value={backupRetention}
            step={1}
            stepper-variant="directional"
            min={1}
            max={72}
            input-prefix="Retention"
            text-align="end"
            onvalueChanged={(event: CustomEvent) =>
              setBackupRetention(event.detail.value)
            }
            label-hint="Number of backups to retain"
          ></oj-c-input-number>
          <oj-c-select-single
            class="oj-sm-margin-2x"
            id="storageTier"
            label-hint="Storage Tier"
            item-text="label"
            required={true}
            data={storageTier}
          ></oj-c-select-single>
        </oj-c-form-layout>
        <oj-c-form-layout max-columns="3" direction="row">
          <oj-c-button
            id="addBackup"
            label="Add Backup schedule"
            onojAction={() => addBackup()}
            class="oj-sm-margin-2x oj-sm-align-self-flex-start oj-button-sm"
            data-oj-clickthrough="disabled"
          ></oj-c-button>
        </oj-c-form-layout>
        <div class="oj-flex oj-sm-flex-items-initial oj-sm-justify-content-center">
          <oj-c-table
            class="oj-flex-item oj-sm-flex-grow-1 oj-md-12"
            id="table"
            columns={tableColumns}
            data={
              new ArrayDataProvider(backupPlan, { keyAttributes: "scheduleId" })
            }
            horizontalGridVisible="enabled"
            verticalGridVisible="enabled"
            row={{ accessibleRowHeader: "scheduleId" }}
          >
            <template
              slot="actionTemplate"
              data-oj-as="cell"
              render={(cell: any) => (
                <oj-c-button
                  chroming="solid"
                  display="icons"
                  size="sm"
                  label="Remove"
                  data-oj-clickthrough="disabled"
                  onojAction={() => removeBackup(cell.item.data.scheduleId)}
                >
                  <span slot="startIcon" class="oj-ux-ico-delete-all"></span>
                </oj-c-button>
              )}
            />
          </oj-c-table>
        </div>
      </div>
    </>
  );
}
