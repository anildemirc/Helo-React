import { useNavigate } from "react-router-dom";
import { GetWithAuth, refreshToken } from "../../services/HttpService";

export const Getmyfollowers = (userId) => {
    GetWithAuth("/follow/getmyfollowers/"+userId)
    .then((res) => {
        if(res.ok) {
          return res.json();
        }
        else {
          refreshToken()
          .then((res) => {
            if(res.ok) {
              return res.json();
            }
            else {
              localStorage.removeItem("tokenKey");
              localStorage.removeItem("currentUser");
              localStorage.removeItem("username");
              localStorage.removeItem("refreshKey");
              return;
            }
          })
          .then((result) => {
            if(result != undefined) {
              localStorage.setItem("tokenKey", result.accessToken);
              Getmyfollowers(userId);
            }
          })
          .catch((err) => {
            console.log("err", err);
          })
        }
      })
      .then((result) => {
        console.log("Getmyfollowers result", result);
        return result;
      })
      .catch(err => console.log(err))
}

export const Getmyfolloweds = (userId, setFunction) => {
    GetWithAuth("/follow/getmyfolloweds/"+userId)
    .then((res) => {
        if(res.ok) {
          return res.json();
        }
        else {
          refreshToken()
          .then((res) => {
            if(res.ok) {
              return res.json();
            }
            else {
              localStorage.removeItem("tokenKey");
              localStorage.removeItem("currentUser");
              localStorage.removeItem("username");
              localStorage.removeItem("refreshKey");
              return;
            }
          })
          .then((result) => {
            if(result != undefined) {
              localStorage.setItem("tokenKey", result.accessToken);
              Getmyfolloweds(userId);
            }
          })
          .catch((err) => {
            console.log("err", err);
          })
        }
      })
      .then((result) => {
        console.log("Getmyfolloweds result", result);
        setFunction(result);
      })
      .catch(err => console.log(err))
}