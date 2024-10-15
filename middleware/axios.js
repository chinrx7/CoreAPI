const axios = require('axios');

module.exports.SendGet = async (url, timeout) => {
    let result;
    try {
        await axios.get(url, { timeout: timeout })
            .then((res) => {
                result = res.data
            })
            .catch((err) => {
                //console.log(err);
            });
    }
    catch (err) {
        // console.log(err);
    }
    return result
}

module.exports.sendPostReq = async (url, request) => {
    let result;
    await axios.post(url, request)
        .then((res) => {
            if(res){
                result = res.data;
            }
        })
        .catch((err) => {
            console.log(err)
        })

    return result;
}