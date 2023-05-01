import React, { useState, useEffect, useCallback } from "react";
import { Box, Fade, OutlinedInput, Button, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
const DetailItem = ({
  name,
  accountno,
  address,
  phone,
  email,
  website,
  sendSMS,
}) => {
  const buttonStype = {
    backgroundColor: "#1b4685",
    border: "none",
    height: "23px",
    borderRadius: "10px",
    fontSize: "12px",
    color: "white",
    minWidth: "80px",
    cursor: "pointer",
  };

  const smsButtonStyle = {
    height: "34px",
    marginTop: "12px",
    marginLeft: "10px",
    color: "#1b4685",
  };

  const [checked, setChecked] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleChange = () => {
    setChecked((prev) => !prev);
  };

  return (
    <>
      <hr />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop:'-4px' }}>
        <h5 style={{ color: "#08788e", fontSize: "18px", margin: "0" }}>
          {name}
        </h5>
        <button style={buttonStype} onClick={() => handleChange()}>
          SMS to me
        </button>
      </div>
      <p style={{ textAlign: "left" }}>{address}</p>
      <div style={{ color: "#08788e", fontSize: "16px", fontWeight: "bold", margin:'0',textAlign:'left'}}>
        <a style={{ color: "#08788e",textDecoration:'none' }} href={`tel:${phone}`}>
          {phone}
        </a>
      </div>
      <div style={{ color: "#08788e", fontSize: "16px", fontWeight: "bold", margin:'0',textAlign:'left'}}>
        <a style={{ color: "#08788e",textDecoration:'none' }} href={`https://${website}`} target="_blank">
          {website}
        </a>
      </div>
      <div>
        {checked ? (
          <div style={{outlineStyle:'solid', padding:'5px', outlineColor:'#1b4685', borderRadius:'10px'}}>
            <p style={{ textAlign: "left", fontWeight: "bold", margin:'0' }}>
              Send Dealer Details
            </p>
            <p style={{ color: "darkgray", fontSize:'12px', margin:'0', textAlign:'left'}}>
              Enter your mobile number to recieve the details of this dealer by
              SMS
            </p>
            <div style={{ display: "flex", marginBottom:'-10px' }}>
              <OutlinedInput
                id="outlined-adornment-weight"
                style={{
                  marginTop: "10px",
                  width: "80%",
                  marginBottom: "15px",
                }}
                aria-describedby="outlined-weight-helper-text"
                size="small"
                placeholder="Enter Mobile Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <IconButton
                aria-label="send"
                size="large"
                style={smsButtonStyle}
                onClick={() => {
                  if (phoneNumber !== "") {
                    sendSMS(accountno, phoneNumber);
                  }
                  setPhoneNumber("");
                }}
              >
                <SendIcon />
              </IconButton>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default DetailItem;
