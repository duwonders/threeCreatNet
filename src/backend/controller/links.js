'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction(){
    return this.display();
  }

  setCorsHeader(){
      this.header("Access-Control-Allow-Origin", this.header("origin") || "*");
      this.header("Access-Control-Allow-Headers", "x-requested-with");
      this.header("Access-Control-Request-Method", "GET,POST,PUT,DELETE");
      this.header("Access-Control-Allow-Credentials", "true");
  }
  /*
  *  设置允许请求的 header
  *  调试不同端口用
  */

  async getlinksAction(){
    this.setCorsHeader();

    let json = this.post();
    let links = this.model('links');
    let data = {
        about: await links.where({type: 'about'}).select(),
        part: await links.where({type: 'part'}).select(),
        contact: await links.where({type: 'contact'}).select(),
        link: await links.where({type: 'link'}).select()
    }

    return this.success(data);
  }

  async updatelinksAction(){
    this.setCorsHeader();

    let req_obj = this.post();
    let links = this.model('links');
    let data = {
        about: JSON.parse(req_obj.about),
        part: JSON.parse(req_obj.part),
        contact: JSON.parse(req_obj.contact),
        link: JSON.parse(req_obj.link)
    }

    let req_data = await links.execute(`Truncate links`);
        await links.addMany(data.about);
        await links.addMany(data.part);
        await links.addMany(data.contact);
        await links.addMany(data.link);

    return this.success();
  }
}
