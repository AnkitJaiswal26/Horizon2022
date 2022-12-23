import React, { useContext } from "react";
import { NFTTicketContext } from "./Context/NFTContext";

const UploadToIPFS = async(state, imageFile) => {

    const { currentAccount, ipfs_client } = state;
    console.log(currentAccount);

    // new
    console.log(imageFile)
    const rootCid = await ipfs_client.put(imageFile)
    console.log(rootCid)

    const info = await ipfs_client.status(rootCid)
    return rootCid;
}
export default UploadToIPFS;