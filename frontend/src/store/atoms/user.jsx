import {atom ,selector} from "recoil"
import axios from "axios"

const userId = sessionStorage.getItem("userId")

export const userAtom = atom({

  key : "userAtom",
  default : selector({
    key: "userAtomSelector",
    get : async()=>{
      const respone = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/myprofile/${userId}`, {
        withCredentials: true,
      });
      return respone.data;
    }
  }),
})