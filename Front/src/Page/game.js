import React, { useState, useEffect } from "react";
import "../Css/game.css";
import LoadingScreen from "../Component/LoadingScreen";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserInfo } from "../Store/authSlice";
import {
  assignIcons,
  manageExitGame,
  sendMove,
  sendRematchRequest,
  startRematch,
  updateGameStatus,
} from "../Services/game-service";
import icons from "../emoji.json";
import parse from "html-react-parser";
let Allow = null;
export default function Game() {
  const location = useLocation();
  const navigate = useNavigate();
  const User = useSelector(UserInfo);
  const defaultDetailObj = {
    game_id: 0,
    player_one: 0,
    player_one_name: "",
    player_two_name: "",
    player_two: 0,
    icon_one: "",
    icon_two: "",
  };
  const arr = [
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
  ];
  const [move, setMove] = useState(null);
  const [detail, setDetail] = useState(defaultDetailObj);
  const [IsLoading, setIsLoading] = useState(true);
  const [board, setBoard] = useState(arr);
  const [block, setBlock] = useState(false);
  const [turn, setTurn] = useState(1);
  const [selectedTile, setSelectedTile] = useState(-1);
  const [showOptBtn, setShowOptBtn] = useState(false);
  const [timer, setTimer] = useState(0);
  const [IsRequestPending, setIsRequestPending] = useState(false);
  useEffect(() => {
    const state = location.state;
    const i1 = Math.floor(Math.random() * icons.length);
    let i2 = 0;
    while (i2 == 0 || i2 == i1) {
      i2 = Math.floor(Math.random() * icons.length);
    }

    setDetail((prev) => ({
      ...prev,
      game_id: state.game_id,
      player_one: state.player === 1 ? User.user_id : state.ref_id,
      player_one_name: state.player === 1 ? User.username : state.ref_name,
      player_two_name: state.player === 1 ? state.ref_name : User.username,
      player_two: state.player === 1 ? state.ref_id : User.user_id,
      icon_one: icons[i1],
      icon_two: icons[i2],
    }));
    if (state.player === 1) {
      setMove(User.user_id);
    }
  }, []);

  useEffect(() => {
    if (User.socketResponse) {
      let res = JSON.parse(User.socketResponse);
      console.warn(res);
      if (res.type === "ASSIGN_ICON") {
        console.log("At assing icon : ", res);
        const iconD = res.content.split("_");
        setDetail((prev) => ({
          ...prev,
          icon_one: iconD[0],
          icon_two: iconD[1],
        }));
        console.log("Icons received : ", res);
        setTimeout(() => {
          setIsLoading(false);
          Allow = false;
        }, 2000);
        setMove(detail.player_one);
      }
      if (res.type === "MOVE") {
        console.log("At make move : ", res);
        let arr = res.content.split("_");
        let r = parseInt(arr[0]);
        let c = parseInt(arr[1]);
        let tempBoard = JSON.parse(JSON.stringify(board));
        tempBoard[r][c] = parseInt(res.user_id);
        setSelectedTile(r * 6 + c);
        setBoard(tempBoard);
        let ver = verify(tempBoard, r, c, parseInt(res.user_id));
        if (ver === true) {
          const opp =
            detail.player_one === move
              ? detail.player_one_name
              : detail.player_two_name;
          console.log("Set loading true");
          setIsLoading(true);
          Allow = true;
          setShowOptBtn(true);
          setTimeout(() => {
            alert("Congratulations, " + opp + " have won the game!");
          }, 50);
        }
        setMove(User.user_id);
      }
      if (res.type === "REMATCH_REQUEST") {
        setIsRequestPending(true);
        setTimer(20);
        startTimer();
      }
      if (res.type === "START_REMATCH") {
        let ret = res.content.split("_");
        setDetail((prev) => ({
          ...prev,
          game_id: parseInt(ret[0]),
          player_one:
            detail.player_one === User.user_id
              ? detail.player_two
              : detail.player_one,
          player_one_name:
            detail.player_one === User.user_id
              ? detail.player_two_name
              : detail.player_one_name,
          player_two_name: User.username,
          player_two: User.user_id,
          icon_one: ret[1],
          icon_two: ret[2],
        }));
        setMove(
          detail.player_one === User.user_id
            ? detail.player_two
            : detail.player_one
        );
        console.log("Arr opp : ", arr);
        setBoard(arr);
        setIsRequestPending(false);
        setTimeout(() => {
          setIsLoading(false);
          Allow = false;
          setShowOptBtn(false);
        }, 2000);
      }
      if (res.type === "REMATCH_DECLINE") {
        alert("Your opponent has left the game!");
        onHome();
      }
    }
  }, [User.socketResponse]);

  useEffect(() => {
    if (detail.game_id !== 0 && location.state.player === 1) {
      let obj = {
        game_id: detail.game_id,
        player_one: detail.player_one,
        player_two: detail.player_two,
        icon_one: detail.icon_one,
        icon_two: detail.icon_two,
      };
      console.log("Icon assign object : ", obj);
      assignIcons(obj)
        .then((d) => {
          let res = d.data;
          if (res.Status === 200) {
            console.log("Icons assigned successfully");
            setTimeout(() => {
              setIsLoading(false);
              Allow = false;
            }, 2000);
          } else {
            console.log("Assign icon error:");
          }
        })
        .catch((err) => {
          console.log("Assign icon error ex : " + err);
        });
    }
  }, [detail.game_id]);

  const verify = (board, row, col, player) => {
    let cnt = 0;
    //left
    for (let i = col - 1; i >= 0; i--) {
      if (board[row][i] === player) {
        cnt++;
      } else {
        break;
      }
    }
    //right
    for (let i = col + 1; i <= 5; i++) {
      if (board[row][i] === player) {
        cnt++;
      } else {
        break;
      }
    }
    if (cnt + 1 >= 4) {
      return true;
    }
    cnt = 0;
    //down
    for (let i = row; i <= 6; i++) {
      if (board[i][col] === player) {
        cnt++;
        if (cnt === 4) {
          return true;
        }
      } else {
        break;
      }
    }
    cnt = 0;
    //top-left
    let r = row - 1;
    let c = col - 1;
    while (r >= 0 && c >= 0) {
      if (board[r][c] === player) {
        cnt++;
        if (row >= 1) r--;
        if (col >= 1) c--;
      } else {
        break;
      }
    }
    //bottom-right
    r = row + 1;
    c = col + 1;
    while (r <= 6 && c <= 5) {
      if (board[r][c] === player) {
        cnt++;
        r++;
        c++;
      } else {
        break;
      }
    }
    if (cnt + 1 >= 4) {
      return true;
    }
    //top-right
    r = row - 1;
    c = col + 1;
    cnt = 0;
    while (r >= 0 && c <= 5) {
      if (board[r][c] === player) {
        cnt++;
        r--;
        c++;
      } else {
        break;
      }
    }
    //bottom-left
    r = row + 1;
    c = col - 1;
    while (r <= 6 && c >= 0) {
      if (board[r][c] === player) {
        cnt++;
        r++;
        c--;
      } else {
        break;
      }
    }
    console.log("CNT ", cnt);
    if (cnt + 1 >= 4) {
      return true;
    }
    return false;
  };

  const validate = (row, col) => {
    try {
      if (move !== User.user_id) {
        alert("Oops! it is your opponent's move.");
        return false;
      } else if (board[row][col] !== 0) {
        // User.user_id == detail.player_one
        //   ? detail.player_one_name
        //   : detail.player_two_name +
        //     ", Oops! Can’t place your move there. Make sure the block you want to place your move is Empty.";
        let msg =
          User.username +
          ", Oops! Can’t place your move there. Make sure the block you want to place your move is Empty.";
        alert(msg);
        return false;
      } else if (row + 1 <= 6 && board[row + 1][col] === 0) {
        let msg =
          User.username +
          ", Oops! Can’t place your move there. Make sure the blocks beneath are selected first.";
        alert(msg);
        return false;
      }
    }
    catch (ex) {
      console.log("validate exception.", ex);
    }
    return true;
  };

  const onBoardPress = (i) => {

    let col = i % 6;
    let row = Math.floor(i / 6);

    let isValid = true;

    isValid = validate(row, col);

    if (isValid) {
      let tempData = JSON.parse(JSON.stringify(board));
      tempData[row][col] = move;
      let ver = verify(tempData, row, col, tempData[row][col]);
      setBoard(tempData);
      setTurn((prev) => prev + 1);
      let obj = {
        game_id: detail.game_id,
        colum_id: parseInt(col),
        row_id: parseInt(row),
        icon:
          User.user_id === detail.player_one
            ? detail.icon_one
            : detail.icon_two,
      };
      setBlock(true);
      setSelectedTile(i);
      sendMove(obj, move)
        .then((d) => {
          let res = d.data;
          if (res.Status === 200 && res.Message === "PLACED") {
            setMove(
              move === detail.player_one ? detail.player_two : detail.player_one
            );
            setBlock(false);
          } else {
            alert("Move error:");
          }
        })
        .catch((err) => {
          console.log("error : ", err);
        });

      if (ver === true) {
        updateGameStatus(detail.game_id, User.user_id)
          .then((d) => {
            let res = d.data;
            if (res.Status === 200) {
              console.log("Game status updated successfully");
              setIsLoading(true);
              Allow = true;
              setShowOptBtn(true);
            } else {
              console.log("Update game status error:");
            }
          })
          .catch((ex) => {
            console.log("Ex 299 : ", ex);
          });
        setTimeout(() => {
          alert(`Congratulations, ${User.username} have won the game.`);
        }, 50);
      }
    }
  };

  const onHome = () => {
    let opp = detail.player_one == User.user_id ? detail.player_two_name : detail.player_one_name;
    manageExitGame(User.username, opp)
      .then((d) => {
        let res = d.data;
        if (res.Status === 200) {
          console.log("Game status updated successfully");
          navigate("/home", {
            state: { username: User.username, user_id: User.user_id },
          });
        } else {
          console.log("Update game status error:");
        }
      })
      .catch((ex) => {
        console.log("Exception found : ", ex);
      });
  };
  const onRematch = () => {
    if (IsRequestPending) {
      const i1 = Math.floor(Math.random() * icons.length);
      let i2 = 0;
      while (i2 == 0 || i2 == i1) {
        i2 = Math.floor(Math.random() * icons.length);
      }
      let obj = {
        player_one: User.user_id,
        player_two:
          User.user_id === detail.player_one
            ? detail.player_two
            : detail.player_one,
        icon_one: icons[i1],
        icon_two: icons[i2],
      };
      startRematch(obj)
        .then((d) => {
          let res = d.data;
          if (res.Status === 200) {
            setDetail((prev) => ({
              ...prev,
              game_id: res.Data.game_id,
              player_one: User.user_id,
              player_one_name: User.username,
              player_two_name:
                detail.player_one === res.Data.player_two
                  ? detail.player_one_name
                  : detail.player_two_name,
              player_two: res.Data.player_two,
              icon_one: icons[i1],
              icon_two: icons[i2],
            }));
            setMove(User.user_id);
            console.log("At final arr : ", arr);
            setBoard(arr);
            setTimeout(() => {
              setIsLoading(false);
              Allow = false;
              setShowOptBtn(false);
              setIsRequestPending(false);
            }, 2000);
          }
        })
        .catch((ex) => {
          console.log("353 ex : ", ex);
        });
    } else if (timer === 0) {
      let opp =
        detail.player_one === User.user_id
          ? detail.player_two_name
          : detail.player_one_name;
      sendRematchRequest(User.username, opp)
        .then((d) => {
          let res = d.data;
          if (res.Status === 200) {
            alert("Rematch request has been sent!");
            setTimer(20);
            startTimer();
          } else {
            alert("Opponent has exited.");
            onHome();
            console.log("Error : ");
          }
        })
        .catch((ex) => {
          console.log("exception found : ", ex);
        });
    } else {
      alert(
        "Request has been sent already!, please wait for other side to confirm."
      );
    }
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    setTimeout(() => {
      console.log("Is loading : ", IsLoading);
      if (Allow === true) {
        onHome();
      }
      clearInterval(interval);
    }, 20000);
  };

  return (
    <div className="game-wrapper">
      <div className="loading-screen-abs">
        <LoadingScreen
          show={IsLoading}
          p1={{
            icon: detail.icon_one,
            name: detail.player_one_name,
          }}
          p2={{
            icon: detail.icon_two,
            name: detail.player_two_name,
          }}
          onHome={onHome}
          onRematch={onRematch}
          showBtn={showOptBtn}
          timer={timer}
        />
      </div>
      <div className="game-heading">
        <div className="game-heading-tile left-tile">
          <div>{parse(detail.icon_one)}</div>
          <p>{detail.player_one_name}</p>
        </div>
        <p className="game-heading-main">
          Turn : &nbsp;
          {parse(
            move === detail.player_one ? detail.icon_one : detail.icon_two
          )}
        </p>
        <div className="game-heading-tile right-tile">
          <p>{detail.player_two_name}</p>
          <div>{parse(detail.icon_two)}</div>
        </div>
      </div>
      {/* {!IsLoading ? (
        
      ) : null} */}
      <div className="game-list-wrapper">
        <ul className="game-list">
          {board.flat().map((item, index) => {
            return (
              <li
                key={index}
                className={`game-tile ${index === selectedTile ? " active" : ""
                  }`}
                onClick={() => {
                  if (!block) {
                    onBoardPress(index);
                  } else {
                    alert("Please wait for a while...");
                  }
                }}
              >
                {item === detail.player_one
                  ? parse(detail.icon_one)
                  : item === detail.player_two
                    ? parse(detail.icon_two)
                    : null}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
