'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction(){
    let search = this.get('search'),
        data
    if(search){

      let partern = '%' + search + '%';

          data = await this.model('album')
                           .where({album_name: ['like', partern]})
                           .select()

    }else{

    	    data = await this.model('album')
    											 .select();

    }
    if(!data.length)
      return think.reject(new Error('没有找到对应数据'));

    this.assign('data', data);

    console.log(data);

    return this.display();
  }

  async imagefAction(){
    let data = {};

        data.pic = await this.model('picture')
                         .where({
                          album_id: this.get('id'),
                         })
                         .select();
        data.album = await this.model('album')
                               .where({
                                 id: this.get('id'),
                               })
                               .select(); 
    console.log(data);

    this.assign('data', data);                     

    return this.display();
  }

  async voteAction(){
    let picid = this.get('id'),

        obj = await this.model('picture')
                        .where({
                          id: picid
                        })
                        .select(),

        album_id = obj[0].album_id;

    this.model('picture')
        .where({
          id: picid
        })
        .increment('pic_likes');

    this.model('album')
        .where({
          id: album_id
        })
        .increment('album_likes')
        
    this.json({status: 'ok'});
  }
}