import React, { useState, useContext, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Col, Row, Avatar, Result, Button, Divider } from "antd";
import { AuthUserContext } from "../../context/Auth";
import Posts from "../Posts/Posts";
import { doAPIRequest } from "../../modules/api";
import "./Profile.css";

function Profile() {
  const { name } = useParams();
  const { credentials } = useContext(AuthUserContext);
  const { username } = credentials;
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const [userNotFound, setUserNotFound] = useState(false);
  const errorMessage = useRef("");
  const [status, setStatus] = useState(-1);

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

  useEffect(() => {
    console.log(userData);
    async function getStatus() {
      if (username === undefined || username.length === 0) {
        setStatus(-1);
        return;
      }
      const { data } = await doAPIRequest(`/profile/${username}/${name}`, {
        method: "GET",
      });
      setStatus(data);
    }
    getStatus();
    makeAPIRequest();
  }, [username, name]);

  if (userNotFound) {
    return (
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
    );
  }

  return (
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
          {(() => {
            if (name === username) {
              return (
                <Button
                  onClick={() => {
                    navigate(`/change_profile/${username}`);
                    makeAPIRequest();
                  }}
                >
                  Edit Profile
                </Button>
              );
            }
            if (status === -1) {
              return (
                <Button
                  type="primary"
                  onClick={async () => {
                    if (username.length === 0) {
                      return;
                    }
                    const { data } = await doAPIRequest(
                      `/profile/friendRequest/${username}/${name}`,
                      {
                        method: "POST",
                      }
                    );
                    setStatus(data);
                  }}
                >
                  Request Friend
                </Button>
              );
            }
            if (status === 1) {
              return (
                <Button
                  type="primary"
                  onClick={async () => {
                    if (username.length === 0) {
                      return;
                    }
                    const { data } = await doAPIRequest(
                      `/profile/${username}/${name}`,
                      {
                        method: "GET",
                      }
                    );
                    setStatus(data);
                  }}
                >
                  Requested Friend
                </Button>
              );
            }
            if (status === 2) {
              return (
                <div className="buttons">
                  <div className="action_btn">
                    <Button
                      type="primary"
                      onClick={async () => {
                        if (username.length === 0) {
                          return;
                        }
                        const { data } = await doAPIRequest(
                          `/profile/friendRequest/${name}/${username}`,
                          {
                            method: "DELETE",
                          }
                        );
                        if (data !== 100) {
                          setStatus(data);
                          return;
                        }
                        setStatus(0);
                        await doAPIRequest(
                          `/profile/friend/${name}/${username}`,
                          {
                            method: "POST",
                          }
                        );
                      }}
                    >
                      Accept
                    </Button>

                    <Button
                      type="primary"
                      onClick={async () => {
                        if (username.length === 0) {
                          return;
                        }
                        await doAPIRequest(
                          `/profile/friendRequest/${name}/${username}`,
                          {
                            method: "DELETE",
                          }
                        );
                        setStatus(-1);
                      }}
                      danger
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              );
            }
            return (
              <Button
                type="primary"
                onClick={async () => {
                  if (username.length === 0) {
                    return;
                  }
                  const { data } = await doAPIRequest(
                    `/profile/friend/${username}/${name}`,
                    {
                      method: "DELETE",
                    }
                  );
                  if (data !== 100) {
                    setStatus(data);
                    return;
                  }
                  setStatus(-1);
                }}
                danger
              >
                Remove Friend
              </Button>
            );
          })()}
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
