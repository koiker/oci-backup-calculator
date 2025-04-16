/**
 * @license
 * Copyright (c) 2014, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 * @ignore
 */
import { h } from "preact";
import { useState, useMemo } from "preact/hooks";
import "oj-c/tab-bar";
import InputData from "./inputData";
import DetailedResults from "./detailed";
import Summary from "./summary";

export function Content() {
  const [state, setState] = useState({
    totalSize: 0,
    totalMonths: 1,
    increase: 0,
    backupPlan: [],
  });

  const handleChange = (event: CustomEvent) => {
    const target = event?.srcElement as HTMLElement | null; // Safely cast the target
    const { detail } = event;
    const id = target?.id; // Get id from the target element
    if (id && detail?.value !== undefined) {
      setState((prevState) => ({
        ...prevState,
        [id]: detail.value,
      }));
    }
  };

  const drawTabler = (selectedTab: string) => {
    switch (selectedTab) {
      case "inputData":
        return <InputData state={state} onChange={handleChange} />;
      case "detailedResults":
        return <DetailedResults state={state} />;
      case "summary":
        return <Summary state={state} />;
      default:
        return null;
    }
  };
  const data = [
    {
      label: "Input Data",
      itemKey: "inputData",
    },
    {
      label: "Detailed Results",
      itemKey: "detailedResults",
    },
    {
      label: "Summary",
      itemKey: "summary",
    },
  ];
  let [selectedTab, setSelectedTab] = useState(data[0].itemKey);
  const handleTabSelection = (event: CustomEvent) => {
    setSelectedTab(event.detail.value);
  };
  return (
    <div id="container" class="oj-web-applayout-content">
      <div class="oj-flex">
        <div
          id="tab-bar-container"
          class="oj-flex-item oj-sm-padding-2x-horizontal"
        >
          <oj-c-tab-bar
            id="tabBar"
            layout="condense"
            display="standard"
            selection={selectedTab}
            data={data}
            onselectionChanged={(event) => handleTabSelection(event)}
          ></oj-c-tab-bar>
          {drawTabler(selectedTab)}
        </div>
      </div>
    </div>
  );
}
