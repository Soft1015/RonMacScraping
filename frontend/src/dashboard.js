import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, DrawingManager } from "@react-google-maps/api";
import Marker from "./marker";
import {
  IconButton,
  Alert,
  Collapse,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LoopIcon from "@mui/icons-material/Loop";
import CloseIcon from "@mui/icons-material/Close";
import { Container, OutlinedInput } from "@mui/material";
import ScaleLoader from "react-spinners/ScaleLoader";
import DetailItem from "./detailItem";

const mapContainerStyle = {
  height: "80%",
  width: "100%",
};

const center = {
  lat: 55.7755801,
  lng: -4.8580114,
};

const options = {
  drawingControl: false,
  drawingControlOptions: {
    drawingModes: ["marker"],
  },
  polygonOptions: {
    fillColor: `#2196F3`,
    strokeColor: `#2196F3`,
    fillOpacity: 0.5,
    strokeWeight: 2,
    clickable: true,
    editable: true,
    draggable: true,
    zIndex: 1,
  },
};

const style = {
  display: "flex",
  height: "100vh",
};

const groupStyle = {
  display: "flex",
};

const formStyle = {
  backgroundColor: "white",
  position: "absolute",
  zIndex: "5",
  width: "340px",
  left: "10%",
  top: "20%",
  boxShadow: `0px 0px 8px 0px #999999`,
};

const formResultStyle = {
  backgroundColor: "white",
  position: "absolute",
  zIndex: "5",
  width: "340px",
  left: "10%",
  top: "20%",
  boxShadow: `0px 0px 8px 0px #999999`,
  maxHeight: "600px",
  overflowY: "auto",
  overflowX: "hidde",
};

const searchButtonStyle = {
  width: "40px",
  height: "40px",
  marginTop: "10px",
  marginLeft: "10px",
  backgroundColor: "#0f2761",
  border: "none",
  color: "white",
  cursor: "pointer",
};
const maxLength = 5;
const Dashboard = () => {
  const [showingResult, setShowState] = useState(0);
  const [open, setOpen] = useState(false);

  const [type, setType] = useState([]);
  const [currType, setCurrType] = useState("");
  const [brand, setBrand] = useState([]);
  const [currBrand, setCurrBrand] = useState("");

  const [MarkInfos, setMarkInfo] = useState([]);
  const [dealInfo, setDealInfo] = useState([]);
  const [isLoading, setLoadingState] = useState(false);
  const [postcode, setPostcode] = useState("");

  const onLoad = (drawingManager) => {
    // console.log(drawingManager);
  };

  const onSearch = () => {
    filter();
    setShowState(1);
  };

  const filter = async () => {
    let data = MarkInfos.filter(function (item) {
      if (item.type !== currType) return false;
      return true;
    });
    if(postcode != ""){
      data.sort(async function(a, b){
        const dis1 = await getDistance(postcode, a.postcode);
        const dis2 = await getDistance(postcode, b.postcode);
        return dis1 - dis2;
      });
      data.splice(maxLength);
    }
    setDealInfo( data );
  };

  const onMarkerComplete = (marker) => {
    marker.setMap(null);
    // console.log(marker);
  };

  const onPolygonComplete = (polygon) => {
    // console.log(polygon);
  };

  useEffect(() => {
    getBrand();
  }, []);

  useEffect(() => {}, [dealInfo]);

  const getBrand = async () => {
  };

  const sendSMS = (accountNo, phone) => {
  };
  return (
    <LoadScript
      id="script-loader"
      googleMapsApiKey="AIzaSyCctCn5BfzuPui4BHWF5IUbgvrPUnvfWKQ"
      libraries={["drawing"]}
    >
      {isLoading ? (
        <div style={{ top: "50%", position: "absolute", left: "50%" }}>
          <ScaleLoader color="#36d7b7" />
        </div>
      ) : (
        <>
          <h2 style={{ color: "white" }}>Google Map Dealer</h2>
          <Collapse in={open}>
            <Alert
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              sx={{ mb: 2 }}
            >
              The message was sent!
            </Alert>
          </Collapse>

          <div style={style}>
            <div>
              {!showingResult ? (
                <Container maxWidth="sm" style={formStyle}>
                  <h2>Store locator</h2>
                  <p style={{ fontSize: "14px" }}>
                    Find store details, facilities and opening hours
                  </p>
                  <div>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        Brand
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={currBrand}
                        style={{ width: "80%" }}
                        label="Brand"
                        size="small"
                        onChange={(e) => setCurrBrand(e.target.value)}
                      >
                        {brand.map((item, index) => {
                          return (
                            <MenuItem key={index} value={item}>
                              {item}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>

                    <FormControl fullWidth>
                      <InputLabel
                        id="demo-simple-select-label"
                        style={{ marginTop: "10px" }}
                      >
                        Type
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={currType}
                        style={{ width: "80%", marginTop: "10px" }}
                        label="Type"
                        size="small"
                        onChange={(e) => setCurrType(e.target.value)}
                      >
                        {type.map((item, index) => {
                          return (
                            <MenuItem key={index} value={item}>
                              {item}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                    <div style={groupStyle}>
                      <OutlinedInput
                        id="outlined-adornment-weight"
                        style={{
                          marginTop: "10px",
                          width: "80%",
                          marginBottom: "15px",
                        }}
                        aria-describedby="outlined-weight-helper-text"
                        size="small"
                        placeholder="Enter location"
                        onChange={(e) => setPostcode(e.target.value)}
                        value={postcode}
                      />
                      <button style={searchButtonStyle} onClick={onSearch}>
                        <SearchIcon />
                      </button>
                    </div>
                  </div>
                </Container>
              ) : (
                <Container maxWidth="sm" style={formResultStyle}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <h2>Dealer Results</h2>
                    <IconButton
                      aria-label="loop"
                      size="small"
                      onClick={() => setShowState(0)}
                    >
                      <LoopIcon />
                    </IconButton>
                  </div>
                  <p style={{ fontSize: "14px" }}>
                    Showing {dealInfo.length} your nearest store
                  </p>
                  {dealInfo.map(
                    (
                      { name, accountno, address, phone, email, website },
                      index
                    ) => {
                      return (
                        <DetailItem
                          key={index}
                          name={name}
                          accountno={accountno}
                          address={address}
                          phone={phone}
                          email={email}
                          website={website}
                          sendSMS={sendSMS}
                        />
                      );
                    }
                  )}
                </Container>
              )}
            </div>
            <div style={{ width: "100%" }}>
              <GoogleMap
                id="drawing-manager-example"
                mapContainerStyle={mapContainerStyle}
                zoom={5}
                center={center}
              >
                <DrawingManager
                  onLoad={onLoad}
                  options={options}
                  onMarkerComplete={onMarkerComplete}
                  onPolygonComplete={onPolygonComplete}
                />
                {dealInfo.map(
                  (
                    {
                      name,
                      accountno,
                      address,
                      latitude,
                      longitude,
                      phone,
                      email,
                      website,
                    },
                    index
                  ) => {
                    return (
                      <Marker
                        key={index}
                        position={{ lat: latitude, lng: longitude }}
                        name={name}
                        accountno={accountno}
                        address={address}
                        phone={phone}
                        email={email}
                        website={website}
                        sendSMS={sendSMS}
                      />
                    );
                  }
                )}
              </GoogleMap>
            </div>
          </div>
        </>
      )}
    </LoadScript>
  );
};

export default Dashboard;
