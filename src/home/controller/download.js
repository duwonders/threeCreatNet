'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction(){
  	let data = {};

  	if(this.get('search')){

  		let likeTitle = '%' + this.get('search') + '%';

  		data = await this.model('download')
  									 	 .where({
  									     file_title: ['like', likeTitle]
  									   })
  									   .select()

		}else{

			let type = this.get('type') || '最近上传';

			let where = type == '最近上传' ? {} : {type : type}

			data = await this.model('download')
											 .where(where)
											 .order('file_time')
											 .select()

		}							
		console.log(data);
  	this.assign('data', data);

  	return this.display();
  }


}