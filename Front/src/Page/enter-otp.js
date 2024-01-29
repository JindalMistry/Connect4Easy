import React, { useEffect, useRef, useState } from "react";
import TextBox from "../Component/TextBox";

export default function EnterOtp() {
  const defArr = ["", "", "", "", "", ""];
  const [otp, setOtp] = useState(defArr);

  const otpRef = useRef();

  const onChangeText = (e) => {
    if (e.target.value != "") {
      console.log(e.target.value, e.target.id);
      let tempArr = JSON.parse(JSON.stringify(otp));
      for (let i = 0; i < tempArr.length; i++) {
        let index = i;
        if (index == parseInt(e.target.id[0])) {
          console.log("Changed");
          if (e.target.value) {
            tempArr[i] = e.target.value[e.target.value.length - 1];
          }
          if (index !== otp.length) {
            var element = document.getElementById(index + 1 + "-otp");
            if (element) {
              element.focus();
            }
            // if(el.children[e.target.id]){
            //     el = el.children[e.target.id];
            //     if(el.children[0]){
            //         el = el.children[0];
            //         if(el.children[0]){
            //             el = el.children[0];
            //             if(el){
            //                 el.focus()
            //             }
            //         }
            //     }
            // }
          }
          if (index === otp.length - 1) {
            console.log("Otp entered : ", tempArr.join(""));
          }
        }
      }
      setOtp(tempArr);
      e.preventDefault();
    }
  };

  return (
    <div className="login-wrapper flex align-c justify-c">
      <div className="enter-otp-container">
        <p className="otp-label">Enter OTP</p>
        <div className="otp-box-container" ref={otpRef}>
          {otp.map((item, index) => {
            return (
              <div className="otp-box" key={index}>
                <TextBox
                  className={"otp-textbox"}
                  type={"number"}
                  onChange={onChangeText}
                  hideLabel={true}
                  value={item}
                  id={index + "-otp"}
                ></TextBox>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
