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

  return (
    <div>
      <Row></Row>
    </div>
  );
}
