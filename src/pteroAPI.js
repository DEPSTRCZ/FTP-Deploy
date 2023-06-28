import axios from "axios";
export async function DeleteRemote(PanelDomain,ServerID,APIKey,RemotePath) {
    const reponseList = await axios({
        method: "GET",
        url: `https://${PanelDomain}/api/client/servers/${ServerID}/files/list?directory=${RemotePath}`,
        headers: {
            "Content-Type": "application/json",
            "Accept ": "application/json",
            "Authorization": `Bearer ${APIKey}`
        },
    const reponseDelete = await axios({
        method: "POST",
        url: `https://${PanelDomain}/api/client/servers/${ServerID}/files/delete`,
        headers: {
            "Content-Type": "application/json",
            "Accept ": "application/json",
            "Authorization": `Bearer ${APIKey}`
        },
    })


}