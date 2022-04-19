import React, { useState, useEffect } from "react";
import Modal from "antd/lib/modal/Modal";
import { useNavigate } from "react-router-dom";
import { AutoComplete } from "antd";
import { doAPIRequest } from "../../modules/api";

const { Option } = AutoComplete;

function Search({ visible, close }) {
  const navigate = useNavigate();
  const [usernames, setUsernames] = useState([]);
  const [results, setResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    async function makeAPIRequest() {
      const { data } = await doAPIRequest("/user", {
        method: "GET",
      });
      setUsernames(data);
    }
    makeAPIRequest();
  }, []);
  function handleSearch(value) {
    let res = [];

    if (!value) {
      res = [];
    } else {
      res = usernames.filter((username) => username.startsWith(value));
      res = res.slice(0, 5);
    }

    setResults(res);
  }
  return (
    <Modal
      visible={visible}
      onCancel={close}
      closable={false}
      footer={null}
      style={{
        display: "flex",
        justifyContent: "center",
      }}
      mask={false}
    >
      <AutoComplete
        style={{
          width: 400,
        }}
        value={searchTerm}
        onSearch={(input) => handleSearch(input)}
        onSelect={(input) => {
          close();
          setSearchTerm("");
          navigate(`/profile/${input}`);
        }}
        onChange={(input) => setSearchTerm(input)}
        placeholder="input username"
      >
        {results.map((username) => (
          <Option key={username} value={username}>
            {username}
          </Option>
        ))}
      </AutoComplete>
    </Modal>
  );
}

export default Search;
