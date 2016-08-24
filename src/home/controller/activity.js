'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction(){

  	let data = {

  		typeAct: await this.per_page(),

  		hotAct: await this.get_hotAct()

  	}
  	// console.log(data.typeAct.pageCount.totalPages);
  	this.assign('data', data);

    return this.display();
  }

  async assigness(){
    let activityId = this.get('id');

    let detail = await this.model('hd')
                     .where({
                        id: activityId 
                     })
                     .select();

    let data = {

      hotAct: await this.get_hotAct(),

      detail: detail

    }
    console.log(data);
    this.assign('data', data);

    return this.display();
  }


  async speechDetailAction(){

    this.assigness();

  }
 	
  async competitionDetailAction(){

    this.assigness();

  }

  async speechLiveAction(){
    this.assigness();
  }

/**
   * [per_page description]
   * 参数：{
   *    'type': 竞赛类型
   *    'num' : 每页条数
   *    'page': 页数
   * }
   */
 	async per_page(num = 3){

 		let golePage = this.get('page') || 1;

 		let type = this.get('type') || '全部';

 		let state = this.get('state') || '最近';

 		let data = {};

 		if(type == '全部' && state == '最近'){

 			data.pageData = await this
                      .model('hd')
                      .page(golePage, num)
                      .order('hd_time')
                      .select();

 			data.pageCount = await this
                      .model('hd')
                      .page(golePage, num)
                      .order('hd_time')
                      .countSelect();

 		}else if(type != '全部' && state == '最近'){

 			data.pageData = await this
                      .model('hd')
                      .page(golePage, num)
                      .where({
 				                 hd_type: type
 			                })
                      .order('hd_time')
                      .select();

 			data.pageCount = await this
                      .model('hd')
                      .page(golePage, num)
                      .where({
 				                 hd_type: type
 			                })
                      .order('hd_time')
                      .countSelect();

 		}else if(type == '全部' && state != '最近'){

 			data.pageData = await this
                      .model('hd')
                      .page(golePage, num)
                      .where({
 				                 hd_state: state
 			                })
                      .order('hd_time')
                      .select();
 			data.pageCount = await this
                      .model('hd')
                      .page(golePage, num)
                      .where({
 				                 hd_state: state
 			                }).order('hd_time').countSelect();
 		
    }else{

 			data.pageData = await this
                      .model('hd')
                      .page(golePage, num)
                      .where({
 				                 hd_state: state,
 				                 hd_type: type
 			                })
                      .order('hd_time')
                      .select();

 			data.pageCount = await this
                      .model('hd')
                      .page(golePage, num)
                      .where({
 				                 hd_state: state,
 				                 hd_type: type
 			                })
                      .order('hd_time')
                      .countSelect();
 		}
 		return data;
 	}
 	/**
 	 * return: 最热门的三条记录
 	 *
 	 */
 	async get_hotAct(){
 		let data = await this.model('hd').order('hd_time').limit(3).select();
 		return data;
 	}

    /**
    *  16-08-22
    *  加了几个页面的 display
    */
    async competitiondetailAction () {
        return this.display();
    }
    async speechdetailAction () {
        return this.display();
    }
    async speechlistAction () {
        return this.display();
    }
    async speechliveAction () {
        return this.display();
    }
    async searchAction () {
        return this.display();
    }
}
