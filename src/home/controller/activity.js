'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction(){
  	this.model('activity').get_hd_by_type('竞赛');
    return this.display();
  }

}