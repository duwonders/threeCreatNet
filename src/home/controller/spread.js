'use strict';

import Base from './base.js';

export default class extends Base {
    async indexAction () {

        return this.display();
    }
    async apartmentAction () {
        let data = {
            msg: await this.get_info()
        };

        this.assign('data', data);
        return this.display();
    }
    async get_info () {
        let type = this.get('type') || `综合部`;
        let spread = this.model('spread');

        let res = {};
        res = await spread.where({apartment: type}).find();
        return res;
    }
}
