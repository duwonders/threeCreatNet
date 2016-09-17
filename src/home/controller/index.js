'use strict';

import Base from './base.js';

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction(){
    let data = {

      newActivity: {

        topAll: await this.getActivity(),

        competitions: await this.getCompetition(),

        speech: await this.getSpeech()

      },

      album: await this.getAlbum(),

      download: await this.getDownload(),

    }

    console.log(data);

    this.assign('data', data);

    return this.display();
  }

  //根据活动上传时间排名
  async getCompetition(){
    let data = await this.model('hd')
                     .limit(3)
                     .where({
                       hd_type: '竞赛'
                     })
                     .order('hd_time')
                     .select();

    return data;
  }

  async getSpeech(){
    let data = await this.model('hd')
                     .limit(3)
                     .where({
                       hd_type: '讲座'
                     })
                     .order('hd_time')
                     .select();

    return data;
  }

  async getActivity(){
    let activity = this.controller('activity'),

        data = await this.model('hd')
                         .limit(7)
                         .order('hd_time')
                         .select();

        return data;
  }


  //根据相册热门度排名
  async getAlbum(){

    let data = await this.model('album')
                         .limit(6)
                         .order('album_likes')
                         .select();


        return data;
  }

  async getDownload(){
    let data = await this.model('download')
                         .limit(14)
                         .order('file_time')
                         .select();
    let res = [];
        for(let i = 0; i < data.length / 2; i++){

          res[i] = [ data[2 * i], data[2 * i + 1] || null ];
          
        }

    console.log(res);
    return res;
  }
  /**
  *  16-08-22
  *  加了搜索页面的 display
  */
  async searchAction () {
      return this.display();
  }
}
