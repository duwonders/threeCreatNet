'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction(){
    let data = {
        getArticle: await this.get_article(),
        links: await this.getLinks()
    };

    this.assign('data', data);

    return this.display();
  }

  async get_article () {
      let page = this.get('page') || 1;
      let type = this.get('type') || '最近';

      let article = this.model('article');
      let res = {};
      let per_page = 10;

      if (type == '最近') {
          res = await article.page(page, per_page)
                            .order("id DESC")
                            .countSelect();
      } else {
          res = await article.where({atc_type: type})
                            .page(page, per_page)
                            .order("id DESC")
                            .countSelect();
      }

      return res;
  }

  async updatedataAction () {
      let article = this.model('article');
      let req_data = this.post();

      let affectedRows = await article
                            .where({id: req_data.id})
                            .update(req_data);
      this.success(affectedRows);
  }

  async getLinks(){
    let data = await this.model('links').get_links();
    return data;
  }
}
