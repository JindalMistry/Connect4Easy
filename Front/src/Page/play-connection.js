import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserInfo } from "../Store/authSlice";
import { getConnections } from "../Services/conn-service";
import data from '../colors.json';
import ConnDetail from "../Popup/conn-detail";
import ReceiveChallange from "../Popup/receive-challange";

export default function PlayConnection({ referesh, setRefreresh }) {
  const User = useSelector(UserInfo);
  const dispatch = useDispatch();
  const [connections, setConnections] = useState([]);
  const [showConnDetailModalPopup, setShowConnDetailModalPopup] = useState(false);
  const [selectedTile, setSelectedTile] = useState({});

  const loadConnections = () => {
    getConnections(User.username).then((res) => {
      if (res.status === 200) {
        console.log("Friends found : ", res.data);
        // for (let i = 0; i < 100; i++) {
        //   res.data.push(JSON.parse(JSON.stringify(res.data[0])));
        // }
        res.data.forEach(x => {
          let a = Math.floor(Math.random() * data.length);
          let b = Math.floor(Math.random() * data.length);
          x['gradient'] = `linear-gradient(130deg, ${data[a]} 0%, ${data[b]} 73%, ${data[a]} 100%)`;
          x['color'] = data[data.length - 1 - b];
          x.refname += "";
        });
        setConnections(res.data);
      }
    });
  };

  useEffect(() => {
    if (referesh === true) {
      loadConnections();
      setRefreresh();
    }
  }, [referesh]);

  useEffect(() => {
    if (User.socketResponse !== null) {
      let obj = JSON.parse(User.socketResponse);
      console.log("Socket response", obj);
      if (obj.type === "STATUS") {
        let temp = JSON.parse(JSON.stringify(connections));
        for (let i = 0; i < temp.length; i++) {
          if (temp[i].ref_id == obj.user_id) {
            if (obj.value == "ONLINE") {
              temp[i].active = true;
            } else if (obj.value == "OFFLINE") {
              temp[i].active = false;
            }
            break;
          }
        }
        console.log("Temp change : ", temp);
        setConnections(temp);
      }
      if (obj.type === "MESSAGE") {
        if (obj.content === "ACCEPT") {
          loadConnections();
        }
      }
    }
  }, [User.socketResponse]);

  useEffect(() => {
    loadConnections();
  }, []);
  return (
    <>
      {showConnDetailModalPopup ?
        <ConnDetail
          show={showConnDetailModalPopup}
          onClose={() => {
            setShowConnDetailModalPopup(false);
            setSelectedTile({});
          }}
          conn={selectedTile}
        />
        :
        null
      }
      <div className="home-main">
        {connections.map((item, index) => {
          return (
            <div key={index} className="friend-tile"
              onClick={() => {
                setShowConnDetailModalPopup(true);
                setSelectedTile(item);
              }}
            >
              <div className="friend-logo" style={{ backgroundImage: item.gradient, color: item.color }}>
                {item.refname.charAt(0).toUpperCase()}
              </div>
              <b>
                <div
                  className={`friend-status ${item.active ? "green" : "red"}`}
                ></div>{" "}
                {item.refname}
              </b>
              <b>
                {item.wins} - {item.total_games - item.wins}
              </b>
            </div>
          );
        })}
      </div>
    </>
  );
}
