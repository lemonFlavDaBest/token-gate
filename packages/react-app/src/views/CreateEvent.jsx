import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch, Row, Col } from "antd";
import React, { useState } from "react";
import { utils } from "ethers";
import { SyncOutlined } from "@ant-design/icons";

import { Address, Balance, Events } from "../components";

export default function CreateEvent({
  purpose,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) {
  const [eventName, setEventName] = useState("");
  const [eventContractAddress, setEventContractAddress] = useState(null);

  const onClickFunction = async () => {
    const result = tx(
      writeContracts.TokenGate.createEvent(eventName, eventContractAddress, { value: utils.parseEther("0.001") }),
    );
    console.log("awaiting metamask/web3 confirm result...", result);
    console.log(await result);
  };

  /* example tx statement
  tx(
    writeContracts.YourContract.setPurpose("💵 Paying for this one!", { value: utils.parseEther("0.001") }),
  );
  */

  return (
    <div>
      <Row>
        <h3>Enter Event Name</h3>
        <Input onChange={e => setEventName(e.target.value)}></Input>
        <h5>Enter Token Contract for Entry</h5>
        <Input onChange={e => setEventContractAddress(e.target.value)}></Input>
        <Button onClick={onClickFunction}></Button>
      </Row>
    </div>
  );
}
