import { Button, Card, DatePicker, Divider, Input, Progress, Slider, Spin, Switch, Row, Col, Typography } from "antd";
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
  const { Title } = Typography;

  const [eventName, setEventName] = useState("");
  const [eventContractAddress, setEventContractAddress] = useState(null);

  const onClickFunction = async () => {
    console.log("eventName:", eventName);
    console.log("eventContractAddress:", eventContractAddress);
    const result = tx(writeContracts.TokenGate.createEvent(eventName, eventContractAddress, { value: 1000 }));
    console.log("awaiting metamask/web3 confirm result...", result);
    console.log(await result);
  };

  /* example tx statement
  tx(
    writeContracts.YourContract.setPurpose("💵 Paying for this one!", { value: utils.parseEther("0.001") }),
  );
  */

  return (
    <>
      <Row justify="center" gutter={[24, 48]}>
        <Title level={2}>Create Your Event</Title>
      </Row>
      <Row gutter={[24, 48]}>
        <Col span={12}>
          <Title level={4}>Event Name</Title>
        </Col>
        <Col span={12}>
          <Input onChange={e => setEventName(e.target.value)}></Input>
        </Col>
      </Row>
      <Row justify="center" gutter={[24, 48]}>
        <Col span={18}>
          <Title level={4}>Token Address</Title>
          <Input onChange={e => setEventContractAddress(e.target.value)}></Input>
          <Button onClick={onClickFunction}>Create</Button>
        </Col>
      </Row>
    </>
  );
}
