import React, { useState, useEfect, useEffect } from "react";
import Modal from "antd/lib/modal/Modal";
import { useNavigate } from "react-router-dom";
import { AutoComplete } from "antd";
import { getUsernamesList } from "../../modules/storage";
const { Option } = AutoComplete;

function Search({ visible, close }) {
  const navigate = useNavigate();
  const [usernames, setUsernames] = useState([]);
  const [results, setResults] = useState([]);
  useEffect(async () => {
    const data = await getUsernamesList();
    setUsernames(data);
  }, []);
  function handleSearch(value) {
    let res = [];

    if (!value) {
      res = [];
    } else {
      res = usernames.filter((username) => username.startsWith(value));
      res = res.slice(0, 2);
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
        onSearch={handleSearch}
        onSelect={(input) => {
          close();
          navigate(`/profile/${input}`);
        }}
        placeholder="input here"
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
