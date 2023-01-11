import { Button, Card, DatePicker, Divider, Input, Progress, Row, Slider, Spin, Switch, Col } from "antd";
import React, { useState, useEffect } from "react";
import { utils } from "ethers";
import { SyncOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import { Address, Balance, Events } from "../components";
import QR from "qrcode.react";

export default function UserGate({
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
  const [newPurpose, setNewPurpose] = useState("loading...");
  const { event_name, event_contract } = useParams();
  console.log("event_name", event_name);
  console.log("event_contract", event_contract);
  const [tokenId, setTokenId] = useState(null);
  const [qrCodeValue, setQRCodeValue] = useState();
  const [yourTokens, setYourTokens] = useState();
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const updateYourQR = async () => {
      if (tokenId) {
        const qrValue = address + tokenId;
        setQRCodeValue(qrValue);
      } else {
        setQRCodeValue(null);
      }
    };
    updateYourQR();
  }, [address, tokenId]);

  //use the alchemy nftAPI  to get a list of your tokens that you can choose from

  const handleEnterClick = async () => {
    console.log(event_name, event_contract, tokenId);
    const result = tx(writeContracts.TokenGate.enterGate(event_name, event_contract, tokenId), update => {
      console.log("📡 Transaction Update:", update);
      if (update && (update.status === "confirmed" || update.status === 1)) {
        console.log(" 🍾 Transaction " + update.hash + " finished!");
        console.log(
          " ⛽️ " +
            update.gasUsed +
            "/" +
            (update.gasLimit || update.gas) +
            " @ " +
            parseFloat(update.gasPrice) / 1000000000 +
            " gwei",
        );
      }
    });
    console.log("awaiting metamask/web3 confirm result...", result);
    console.log(await result);
  };

  return (
    <div>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
        <Divider />
        Your Address:
        <Address address={address} ensProvider={mainnetProvider} fontSize={16} />
        <Divider orientation="left">Step 1</Divider>
        <Row>
          <Col span={24}>
            Enter Token ID
            <Input value={tokenId} onChange={e => setTokenId(e.target.value)}></Input>
          </Col>
        </Row>
        <Divider orientation="left">Display QR</Divider>
        <Row>
          <Col span={24}>
            <Row>
              <Button style={{ marginTop: 8 }} onClick={() => setShowQR(!showQR)}>
                Display your QR
              </Button>
            </Row>
            {showQR && (
              <div style={{ padding: 8, margin: "auto" }}>
                <QR value={qrCodeValue} renderAs="canvas" />
              </div>
            )}
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Button style={{ marginTop: 8 }} onClick={() => handleEnterClick()}>
              Enter Event
            </Button>
          </Col>
        </Row>
      </div>

      {/*
        📑 Maybe display a list of events?
          (uncomment the event and emit line in YourContract.sol! )
      */}
      <Events
        contracts={readContracts}
        contractName="YourContract"
        eventName="SetPurpose"
        localProvider={localProvider}
        mainnetProvider={mainnetProvider}
        startBlock={1}
      />

      <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 256 }}>
        <Card>
          Check out all the{" "}
          <a
            href="https://github.com/austintgriffith/scaffold-eth/tree/master/packages/react-app/src/components"
            target="_blank"
            rel="noopener noreferrer"
          >
            📦 components
          </a>
        </Card>

        <Card style={{ marginTop: 32 }}>
          <div>
            There are tons of generic components included from{" "}
            <a href="https://ant.design/components/overview/" target="_blank" rel="noopener noreferrer">
              🐜 ant.design
            </a>{" "}
            too!
          </div>

          <div style={{ marginTop: 8 }}>
            <Button type="primary">Buttons</Button>
          </div>

          <div style={{ marginTop: 8 }}>
            <SyncOutlined spin /> Icons
          </div>

          <div style={{ marginTop: 8 }}>
            Date Pickers?
            <div style={{ marginTop: 2 }}>
              <DatePicker onChange={() => {}} />
            </div>
          </div>

          <div style={{ marginTop: 32 }}>
            <Slider range defaultValue={[20, 50]} onChange={() => {}} />
          </div>

          <div style={{ marginTop: 32 }}>
            <Switch defaultChecked onChange={() => {}} />
          </div>

          <div style={{ marginTop: 32 }}>
            <Progress percent={50} status="active" />
          </div>

          <div style={{ marginTop: 32 }}>
            <Spin />
          </div>
        </Card>
      </div>
    </div>
  );
}
