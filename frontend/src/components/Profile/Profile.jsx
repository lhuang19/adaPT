import React, { useState, useContext, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Col, Row, Avatar, Result, Button, Divider } from "antd";
import { AuthUserContext } from "../../context/Auth";
import Posts from "../Posts/Posts";
import { doAPIRequest } from "../../modules/api";
import "./Profile.css";

function Profile() {
  let { name } = useParams();
  const { credentials } = useContext(AuthUserContext);
  const { username } = credentials;
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const [userNotFound, setUserNotFound] = useState(false);
  const errorMessage = useRef("");
  const [status, setStatus] = useState(-1);

  async function updateStatus() {
    const { status } = await doAPIRequest(`/profile/${username}/${name}`, {
      method: "GET",
    });
    setStatus(status);
  }

  useEffect(() => {
    async function makeAPIRequest() {
      const { data, error } = await doAPIRequest(`/user/${name}`, {
        method: "GET",
      });
      if (data) {
        setUserData(data);
      } else {
        errorMessage.current = error;
        setUserNotFound(true);
      }
    }
    makeAPIRequest();
    updateStatus();
  }, [name]);

  

  return userNotFound ? (
    <Result
      status="404"
      title="Hmmmm"
      subTitle={errorMessage.current}
      extra={
        <Button type="primary" onClick={() => navigate("/")}>
          Back Home
        </Button>
      }
    />
  ) : (
    <Row style={{ width: "100%", height: "100%" }}>
      <Col
        span={10}
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <Avatar
            size={128}
            src={`https://joeschmoe.io/api/v1/${name}`}
            alt={name.concat("'s profile picture")}
          />
          <h1 style={{ marginBottom: "0px" }}>
            {userData.firstname} {userData.lastname}
          </h1>
          <p style={{ color: "grey" }}>({userData.username})</p>
          {name === username ? (
            <Button onClick={() => navigate(`/change_profile/${username}`)}>
              Edit Profile
            </Button>
          ) : status === -1 ? (
            <Button
              type="primary"
              onClick={async () => {
                await doAPIRequest(`/profile/friendRequest/${username}/${name}`, {
                  method: "POST",
                });
                updateStatus();
              }}
            >
              Request Friend
            </Button>
          ) : status === 1 ? (
            <Button type="primary">Requested Friend</Button>
          ) : status === 2 ? (
            <div className="buttons">
              <div className="action_btn">
                <Button
                  type="primary"
                  onClick={async () => {
                    await doAPIRequest(`/profile/friend/${name}/${username}`, {
                      method: "POST",
                    });
                    await doAPIRequest(`/profile/friendRequest/${name}/${username}`, {
                      method: "DELETE",
                    });
                    updateStatus();
                  }}
                >
                  Accept
                </Button>

                <Button
                  type="primary"
                  onClick={async () => {
                    await doAPIRequest(`/profile/friendRequest/${name}/${username}`, {
                      method: "DELETE",
                    });
                    updateStatus();
                  }}
                  danger
                >
                  Decline
                </Button>
              </div>
            </div>
          ) : (
            <Button
              type="primary"
              onClick={async () => {
                await doAPIRequest(`/profile/friend/${username}/${name}`, {
                  method: "DELETE",
                });
                updateStatus();
              }}
              danger
            >
              Remove Friend
            </Button>
          )}
        </div>
        <Divider type="vertical" />
      </Col>
      <Col span={14} style={{ height: "100%", overflow: "scroll" }}>
        <Posts profile name={name} />
      </Col>
    </Row>
  );
}

export default Profile;
