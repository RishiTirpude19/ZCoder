import {atom ,selector} from "recoil"
import axios from "axios"

const userId = localStorage.getItem("userId")

export const userAtom = atom({

  key : "userAtom",
  default : selector({
    key: "userAtomSelector",
    get : async()=>{
      const respone = await axios.get(`https://z-coder.vercel.app/myprofile/${userId}`, {
        withCredentials: true,
      });
      return respone.data;
    }
  }),
})