'use strict';
/**
 * model
 */
export default class extends think.model.base {
	async get_links(){
        let links = this.model('links');
        let data = {
            about: await links.where({type: 'about'}).select(),
            part: await links.where({type: 'part'}).select(),
            contact: await links.where({type: 'contact'}).select(),
            link: await links.where({type: 'link'}).select()
        }

        return data;
	}
    // 用来获取底部链接
}
