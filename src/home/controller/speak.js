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

    console.log(data.getArticle.data);

    return this.display();
  }

  async get_article () {
      let page = this.get('page') || 1;
      let type = this.get('type') || '最近上传';

      let article = this.model('article');

      let res = await article.page(page, 15)
                        .order("id DESC")
                        .countSelect();
      return res;
  }
}
