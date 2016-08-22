'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction(){
    return this.display();
  }

  /**
  *  16-08-22
  *  加了搜索页面的 display
  */
  async searchAction () {
      return this.display();
  }
}
