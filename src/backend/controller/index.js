'use strict';

import Base from './base.js';

import fs from 'fs';
import path from 'path'

export default class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  indexAction(){
    //auto render template file index_index.html
    return this.display();
  }
  uploadAction (){
    this.setCorsHeader();
    // 设置允许外部 请求

    //这里的 key 需要和 form 表单里的 name 值保持一致
    let file = think.extend({}, this.file('image'));

    let filepath = file.path;

    //文件上传后，需要将文件移动到项目其他地方，否则会在请求结束时删除掉该文件
    let uploadPath = think.RESOURCE_PATH + '/upload';
    think.mkdir(uploadPath);

    let basename = path.basename(filepath);
    fs.renameSync(filepath, uploadPath + '/' + basename);

    file.path = uploadPath + '/' + basename;

    if(think.isFile(file.path)){
      console.log(basename);
    }else{
      console.log("Failed");
    }

    this.assign('fileInfo', file);
    this.success(basename);
    //  this.suceess 用来返回值 vue 中 post().then 接收 返回链接
  }
  setCorsHeader(){ this.header("Access-Control-Allow-Origin", this.header("origin") || "*"); this.header("Access-Control-Allow-Headers", "x-requested-with"); this.header("Access-Control-Request-Method", "GET,POST,PUT,DELETE"); this.header("Access-Control-Allow-Credentials", "true");
    //  设置 header
  }


  /*
  * 数据库操作
  * gallery 页面
  */
  async getpicAction(){
    this.setCorsHeader();
    // 设置允许外部 请求

    // let data = await this.model('picture').select();

    let data = await this.model('picture').page([2, 4]).countSelect();
    //  分页的查询 .page([现页数， 总页数])
    console.log(data);

    return this.success(data);
  }
  /* 获取图片的信息 */

  async postpicAction(){
    this.setCorsHeader();
      // 设置允许外部 请求
    let json = this.post();
    // console.log(json);
    //  this.post 方法获取 post 请求的数据
    let model = this.model('picture');
    //  存到 picture 表中
    let retData = await model.add(json);
    //  等待 sql 执行然后返取得回值
    return this.success(retData);
    //  将操作的值返回
  }
  /* 上传图片信息 */

  async deletesingleimgAction () {
      this.setCorsHeader();
      //  设置允许外部 请求
      let pic_id = this.post();
      let model = this.model('picture');
      let retData = await model.where({id: ["=", pic_id.id]}).delete();
      return this.success(retData);
  }
  /* 删除单张图片信息 */

  async updatesingleimgAction () {
      this.setCorsHeader();
      //  设置允许外部 请求
      let data = this.post();
      let model = this.model('picture');

      console.log(data);

      let retData = await model.where({id: data.id}).update({
         album_id: data.album_id,
         pic_name: data.pic_name,
         pic_url: data.pic_url
      });

      return this.success(retData);
  }
  /* 删除单张图片信息 */

}
