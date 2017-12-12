const CHECK_LIST = {
    basic: [
        { code: 1, property: 'username', reg: /^(?=.*)[a-zA-Z0-9]{6,20}$/, message: '6~20자 이내의 대소문자 & 숫자 조합인 ID가 필요합니다.' },
        { code: 2, property: 'password', reg: /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,20}$/, message: '6~20글자의 대소문자, 숫자가 포함된 암호가 필요합니다.' }
    ]
};
module.exports = {

    checkAccount: (req, res, service, isStrict) => {
        let result = {};
        for (let item of CHECK_LIST[service]) {
            // 해당 property가 존재하지 않을 시 isStrict가 true 면 정규식 검사 후 !false
            // 해당 property가 존재하지 않을 시 isStrict가 false 면 pass
            if (req.body[item.property] && item.reg.exec(req.body[item.property])) {
                result[item.property] = req.body[item.property];
            } else {
                if (!isStrict && !req.body[item.property]) continue;
                res.status(200).json({
                    status: { success: false, message: `${item.property} : ${item.reg}` },
                    code: item.code
                }).end();
                return false;
            }
        }
        return result;
    },

    isLogin: (req, res) => {
        if (req.user) return true;
        res.status(200).json({
            status: { success: false, message: '로그인이 필요한 서비스입니다.' }
        }).end();
        return false;
    },

    isAdmin: (req, res) => {
        if (req.user.isAdmin === true) return true;
        res.status(200).json({
            status: { success: false, message: '권한이 부족합니다.' }
        }).end();
        return false;
    },

};