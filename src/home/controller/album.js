'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction(){
  	let data = await this.model('album')
  											 .select();
    
    this.assign('data', data);

    console.log(data);

    return this.display();
  }

}