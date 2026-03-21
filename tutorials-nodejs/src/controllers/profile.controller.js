import { SuccessResponse } from "../core/success.response.js";

const dataProfiles = [
    {
        usr_id: 1,
        usr_name: 'CR7',
        usr_avt: 'image.com/user/1'
    },
    {
        usr_id: 3,
        usr_name: 'M10',
        usr_avt: 'image.com/user/2'
    },
    {
        usr_id: 3,
        usr_name: 'NDVK',
        usr_avt: 'image.com/user/3'
    }
]

class ProfileController {

    // admin
    profiles = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get profile success!',
            metadata: dataProfiles
        }).send(res);
    }

    profile = async (req, res, next) => {
        new SuccessResponse({
            message: 'view all profiles',
            metadata: {
                usr_id: 2,
                usr_name: 'M10',
                usr_avt: 'image.com/user/2'
            }
        }).send(res);
    }
}

export default new ProfileController();