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

  		hotAct: await this.get_hotAct(),

      slider: await this.get_slider(),
      links: await this.getLinks()

  	}

  	this.assign('data', data);

    return this.display();
  }

  async get_slider(){
    let data = await this.model('slider')
                         .select();

    return data;
  }

  async assigness(){
    let activityId = this.get('id');

    let detail = await this.model('hd')
                     .where({
                        id: activityId
                     })
                     .select();

    let related = await this.model('related')
                            .where({
                              activity_id: activityId
                            })
                            .select();

    let data = {

      hotAct: await this.get_hotAct(),

      detail: detail,

      related: related,
      links: await this.getLinks()

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
    let activityId = this.get('id'),
        page = this.get('page') || 1;

    let data = {};

    data.detail = await this.model('hd')
                     .where({
                        id: activityId
                     })
                     .select();

    data.hotAct = await this.get_hotAct();

    data.live = await this.model('direct')
                          .where({
                            hd_id: activityId
                          })
                          .page(page, 5)
                          .order('id DESC')
                          .select()

    data.page = await this.model('direct')
                          .where({
                            hd_id: activityId
                          })
                          .page(page, 5)
                          .order('id DESC')
                          .countSelect()

    console.log(data);
    data.links = await this.getLinks();
    this.assign('data', data);

    this.display();

  }

/**
   * [per_page description]
   * 参数：{
   *    'type': 竞赛类型
   *    'num' : 每页条数
   *    'page': 页数
   * }
   */
 	async per_page(num = 5){

 		let golePage = this.get('page') || 1;

 		let type = this.get('type') || '全部';

 		let state = this.get('state') || '最近';

 		let data = {};

 		if(type == '全部' && state == '最近'){

 			data.pageData = await this
                      .model('hd')
                      .page(golePage, num)
                      .order('id DESC')
                      .select();

 			data.pageCount = await this
                      .model('hd')
                      .page(golePage, num)
                      .order('id DESC')
                      .countSelect();

 		}else if(type != '全部' && state == '最近'){

 			data.pageData = await this
                      .model('hd')
                      .page(golePage, num)
                      .where({
 				                 hd_type: type
 			                })
                      .order('id DESC')
                      .select();

 			data.pageCount = await this
                      .model('hd')
                      .page(golePage, num)
                      .where({
 				                 hd_type: type
 			                })
                      .order('id DESC')
                      .countSelect();

 		}else if(type == '全部' && state != '最近'){

 			data.pageData = await this
                      .model('hd')
                      .page(golePage, num)
                      .where({
 				                 hd_state: state
 			                })
                      .order('id DESC')
                      .select();
 			data.pageCount = await this
                      .model('hd')
                      .page(golePage, num)
                      .where({
 				                 hd_state: state
 			                }).order('id DESC').countSelect();

    }else{

 			data.pageData = await this
                      .model('hd')
                      .page(golePage, num)
                      .where({
 				                 hd_state: state,
 				                 hd_type: type
 			                })
                      .order('id DESC')
                      .select();

 			data.pageCount = await this
                      .model('hd')
                      .page(golePage, num)
                      .where({
 				                 hd_state: state,
 				                 hd_type: type
 			                })
                      .order('id DESC')
                      .countSelect();
 		}
 		return data;
 	}
 	/**
 	 * return: 最热门的三条记录
 	 *
 	 */
 	async get_hotAct(){
 		let data = await this.model('hd').order('id DESC').limit(3).select();
 		return data;
 	}

    /**
    *  16-08-22
    *  加了几个页面的 display
    */
    async competitiondetailAction () {
        let data = {
            links: await this.getLinks()
        }
        this.assign('data', data);
        return this.display();
    }
    async speechdetailAction () {
        let data = {
            links: await this.getLinks()
        }
        this.assign('data', data);
        return this.display();
    }
    async speechlistAction () {
        let data = {
            links: await this.getLinks()
        }
        this.assign('data', data);
        return this.display();
    }
    async speechliveAction () {
        let data = {
            links: await this.getLinks()
        }
        this.assign('data', data);
        return this.display();
    }

    async searchAction () {

      let data = {}

      let partern = this.get('partern');

      if(!partern) return

      let likeTitle = '%' + partern + '%';

          data.like = await this.model('hd')
                           .where({
                             hd_title: ['like', likeTitle]
                           })
                           .select();

          data.hotAct = await this.get_hotAct();
          data.links = await this.getLinks();
      this.assign('data', data);
      console.log(data);

      return this.display();

    }
    async getLinks(){
      let data = await this.model('links').get_links();
      return data;
    }
}
