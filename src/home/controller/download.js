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

  		data.pagedata = await this.model('download')
  									 	 .where({
  									     file_title: ['like', likeTitle]
  									   })
                       .order('file_time')
  									   .select()

      data.pageMessage = await this.model('download')
                       .where({
                         file_title: ['like', likeTitle]
                       })
                       .page(1, 16)
                       .order('file_time')
                       .countSelect()

		}else{

			let type = this.get('type') || '最近上传',

			    where = type == '最近上传' ? {} : {type : type},

          page = this.get('page') || 1

			data.pagedata = await this.model('download')
											 .where(where)
                       .page(page, 8)
											 .order('file_time')
											 .select()

      data.pageMessage = await this.model('download')
                       .where(where)
                       .page(page, 8)
                       .order('file_time')
                       .countSelect()

		}							

  	this.assign('data', data);

  	return this.display();
  }


}