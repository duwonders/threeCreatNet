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