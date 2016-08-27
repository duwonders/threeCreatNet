'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction(){
    let data = {
        getArticle: await this.get_article()
    };

    this.assign('data', data);

    return this.display();
  }

  async get_article () {
      let page = this.get('page') || 1;
      let type = this.get('type') || '最近';

      let article = this.model('article');
      let res = {};

      if (type == '最近') {
          res = await article.page(page, 10)
                            .order("id DESC")
                            .countSelect();
      } else {
          res = await article.where({atc_type: type})
                            .page(page, 3)
                            .order("id DESC")
                            .countSelect();
      }

      return res;
  }
}
