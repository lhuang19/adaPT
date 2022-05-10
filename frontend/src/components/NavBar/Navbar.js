import React, { useState } from "react";
import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  UserOutlined,
  BellOutlined,
  HomeOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { IoBarbellSharp } from "react-icons/io5";
import { TiMessages } from "react-icons/ti";
import Search from "./Search";
import { logout } from "../../modules/storage";

function IconWrapper({ children }) {
  return <div>{children}</div>;
}

function NavBar(props) {
  const { credentials, setCredentials } = props;
  const { username, firstname } = credentials;

  const [showSearch, setShowSearch] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  return (
    <>
      <div className="logo" style={{ float: "left", marginRight: "20px" }}>
        <h1 style={{ color: "white" }}>
          ada<b>PT</b>
        </h1>
      </div>
      <Search visible={showSearch} close={() => setShowSearch(false)} />
      {username !== undefined && username.length !== 0 ? (
        <>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[`${location.pathname}_nav_bar`]}
            selectedKeys={[`${location.pathname}_nav_bar`]}
            style={{
              float: "left",
              display: "flex",
              width: "280px",
            }}
          >
            <Menu.Item
              key="/_nav_bar"
              data-testid="/_nav_bar"
              icon={
                <IconWrapper>
                  <HomeOutlined />
                </IconWrapper>
              }
              onClick={() => navigate("/")}
            />
            <Menu.Item
              key="/exercise_nav_bar"
              data-testid="exercise_nav_bar"
              icon={
                <IconWrapper>
                  <IoBarbellSharp />
                </IconWrapper>
              }
              onClick={() => navigate("/exercises")}
            />
            <Menu.Item
              id="chat_nav_bar"
              data-testid="chat_nav_bar"
              key="/chat_nav_bar"
              icon={
                <IconWrapper>
                  <TiMessages />
                </IconWrapper>
              }
              onClick={() => navigate("/chat")}
            />
            <Menu.Item
              id="search_nav_bar"
              data-testid="search_nav_bar"
              key="search_nav_bar"
              icon={
                <IconWrapper>
                  <SearchOutlined />
                </IconWrapper>
              }
              style={{ outline: "none" }}
              onClick={() => setShowSearch(true)}
            />
          </Menu>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={[`${location.pathname}_nav_bar`]}
            selectedKeys={[`${location.pathname}_nav_bar`]}
            style={{
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Menu.Item
              key={`/profile/${username}_nav_bar`}
              icon={<UserOutlined />}
              onClick={() => navigate(`/profile/${username}`)}
            >
              {firstname}
            </Menu.Item>
            <Menu.Item
              key="/alerts_nav_bar"
              icon={
                <IconWrapper>
                  <BellOutlined />
                </IconWrapper>
              }
              onClick={() => alert("implement alerts")}
            />
            <Menu.Item
              key="/logout_nav_bar"
              onClick={() => {
                setCredentials({ username: "" });
                logout();
                navigate("/login");
              }}
            >
              Logout
            </Menu.Item>
          </Menu>
        </>
      ) : (
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[`${location.pathname}_nav_bar`]}
          selectedKeys={[`${location.pathname}_nav_bar`]}
          style={{ display: "flex", justifyContent: "end" }}
        >
          <Menu.Item key="/login_nav_bar" onClick={() => navigate("/login")}>
            Login
          </Menu.Item>
          <Menu.Item key="/signup_nav_bar" onClick={() => navigate("/signup")}>
            Signup
          </Menu.Item>
        </Menu>
      )}
    </>
  );
}

export default NavBar;
