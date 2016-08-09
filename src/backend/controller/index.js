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

  setCorsHeader(){
      this.header("Access-Control-Allow-Origin", this.header("origin") || "*");
      this.header("Access-Control-Allow-Headers", "x-requested-with");
      this.header("Access-Control-Request-Method", "GET,POST,PUT,DELETE");
      this.header("Access-Control-Allow-Credentials", "true");
  }
  /*
  *  设置允许请求的 header
  *  调试不同端口用
  */

  /* 下面是数据库操作 */

  /*
  * gallery 页面
  *    |
  *    |----album 路由(/gallery/album)
  *    |
  *    |----image 路由(/gallery/image)
  */
  async getpicAction(){
    this.setCorsHeader();

    let json = this.post();
    let data = await this.model('picture').page([json.currentPage, 5]).countSelect();
    //  分页的查询 .page([现页数， 总页数])
    console.log("获取图片列表 data");
    return this.success(data);
  }
  /* 获取图片的信息 */

  async postpicAction(){
    this.setCorsHeader();

    let json = this.post();
    let picture = this.model('picture');
    let album = this.model('album');
    let isAlbumExist = await album
        .where({id: json.album_id})
        .find();
    if (!think.isEmpty(isAlbumExist)) {
        let set_album_pages = parseInt(isAlbumExist.album_pages) + 1;
        let affactedRows = await album
            .where({id: json.album_id})
            .update({album_pages: set_album_pages});
        let retData = await picture.add(json);
        return this.success(retData);
    } else {
        console.log("查询了一个不存在的图片 ID ");
        return this.success("");
    }
    /*
    *   相册表 图片表 都需要操作
    *   上传图片的时候保证需要上传到的相册 id 是存在的
    *   上传成功 图库中的图片数量 + 1
    *   批量添加等会再说 = =
    * */
  }
  /* 上传图片信息 */

  async deletesingleimgAction () {
      this.setCorsHeader();

      let pic_id_obj = this.post();
      let picture = this.model('picture');
      let album = this.model('album');
      let album_id = (await picture.where(pic_id_obj).find()).album_id;
      let set_album_pages = (await album.where({id: album_id}).find()).album_pages - 1;
      let affectedRows = await album
          .where({id: album_id})
          .update({album_pages: set_album_pages});
      let retData = await picture.where({id: ["=", pic_id_obj.id]}).delete();
      return this.success(retData);
      /*
      *  单张删除图片
      *  不用判断 因为相册 id 肯定是存在的
      *  删除图片之后要将对应图库中的图片数量 - 1
      * */
  }
  /* 删除单张图片信息 */

  async updatesingleimgAction () {
      this.setCorsHeader();

      let data = this.post();
      let model = this.model('picture');
      let retData = await model.where({id: data.id}).update({
         album_id: data.album_id,
         pic_name: data.pic_name,
         pic_url: data.pic_url
      });
      return this.success(retData);
  }
  /* 更新单张图片信息 */

  async getalbumAction(){
    this.setCorsHeader();

    let json = this.post();
    let data = await this.model('album').page([json.currentPage, 5]).countSelect();
    return this.success(data);
  }
  /* 获取相册的信息 */

  async postalbumAction(){
    this.setCorsHeader();

    let json = this.post();
    let model = this.model('album');
    let retData = await model.add(json);
    return this.success(retData);
  }
  /* 上传相册信息 */

  async deletesinglealbumAction () {
      this.setCorsHeader();

      let album_id_obj = this.post();
      let album = this.model('album');
      let picture = this.model('picture');
      let affectedRows = await picture.where({album_id: ["=", album_id_obj.id]}).delete();
      let retData = await album.where({id: ["=", album_id_obj.id]}).delete();
      return this.success(retData);
      /*
      *  删除相册的时候 把相册中图片的对应关系也一并删除
      *  当然图片文件还是在里面的
      */
  }
  /* 删除相册 */

  async updatesinglealbumAction () {
      this.setCorsHeader();

      let data = this.post();
      let model = this.model('album');
      let retData = await model.where({id: data.id}).update({
         album_name: data.album_name,
         album_cover: data.album_cover
      });
      return this.success(retData);
  }
  /* 更新相册信息 */


}
